# Plan de Implementación Completo - Yamgurumi

## Resumen del Proyecto

**Yamgurumi** - E-commerce artesanal de amigurumis (muñecos tejidos a mano) en El Salvador.

**Stack Tecnológico:**
- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 + Design System custom (Comfortaa/Manrope)
- Three.js (R3F) para Hero 3D interactivo
- Zustand para estado global (carrito)
- **Prisma ORM + PostgreSQL** (base de datos)
- **Resend** (emails transaccionales)
- **Upstash Redis** (rate limiting) - opcional inicial
- **JWT + Cookies httpOnly** (autenticación)
- **Zod** (validación de esquemas)

---

## Decisiones Arquitecturales Clave

### 1. Base de Datos
- **PostgreSQL local** vía Docker (`postgres:16-alpine`)
- Esquema Prisma con 7 modelos + 3 enums
- Migraciones versionadas con `prisma migrate dev`

### 2. Autenticación
- JWT firmado con **jose** (HS256, 7 días expiración)
- Cookies **httpOnly, secure, sameSite: lax**
- Refresh automático vía Server Actions
- Roles: `CUSTOMER` | `ADMIN`

### 3. Email
- **Resend** con `onboarding@resend.dev` (testing gratis)
- Templates React Email con estilos inline
- 4 templates: Welcome, Verification, Reset Password, Order Confirmation

### 4. Carrito y Descuentos
- **Fase 1 (MVP)**: Carrito en localStorage + Server Actions reciben items como argumentos
- **Fase 2 (Post-MVP)**: Persistir carrito en DB con merge al login
- Códigos descuento únicos generados en welcome email (`WELCOME-{userId.slice(0,6)}`)

### 5. Checkout
- **Sin pasarela de pago**: Genera link WhatsApp con order details
- Order se guarda en DB (status PENDING) + email confirmación
- Descuento aplicado visible en mensaje WhatsApp

### 6. Admin Panel
- Rutas `/admin/*` protegidas por middleware (`requireAdmin`)
- Módulos: Dashboard, Pedidos, Usuarios, Suscriptores, Descuentos, Analíticas

---

## Flujo de Trabajo Git (Git Flow Simplificado)

### Estructura de Ramas

```
main ──────────────────────────────────────────────► (producción - tags de release)
  │
  └── dev ─────────────────────────────────────────► (integración continua)
        │
        ├── feat/prisma-setup
        ├── feat/env-config
        ├── feat/auth-deps
        ├── feat/initial-migration
        ├── feat/email-templates
        ├── feat/validation-schemas
        ├── feat/rate-limit
        ├── feat/auth-core
        ├── feat/newsletter-discount
        ├── feat/user-profile
        ├── feat/orders-whatsapp
        ├── feat/admin-panel
        └── feat/polish-production
```

### Reglas de Ramas y Commits

| Regla | Descripción |
|-------|-------------|
| **Naming** | `feat/<nombre-corto>` | `fix/<bug>` | `chore/<tarea>` |
| **Base** | Siempre desde `dev` (excepto hotfixes desde `main`) |
| **Commits** | Convencionales: `tipo(scope): mensaje` |
| **Tipos** | `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `style` |
| **Scopes** | `prisma`, `auth`, `email`, `db`, `validation`, `rate-limit`, `cart`, `orders`, `admin`, `ui` |
| **PR** | Push rama → PR a `dev` → revisión → **squash merge** a `dev` |
| **Release** | `dev` estable → PR `dev` → `main` (**merge commit**, no squash) |
| **Tags** | Hits en `main`: `db-foundation-v0.1.0`, `auth-core-v1.0.0`, etc. |

### Formato de Commits

```
feat(prisma): add user model with sessions and addresses
fix(auth): handle expired verification token gracefully
chore(deps): update prisma client to latest
refactor(email): extract common layout component
docs: add rate limiting configuration guide
```

---

## Fases de Implementación

---

### FASE 0: Database Foundation (`db-foundation-v0.1.0`)

**Objetivo**: Infraestructura de datos completa, email, validación, rate limiting.

#### Rama 1: `feat/prisma-setup`

| Commit | Tipo | Archivos | Descripción |
|--------|------|----------|-------------|
| 1 | `chore(deps)` | `package.json`, `pnpm-lock.yaml` | `pnpm add @prisma/client && pnpm add -D prisma` |
| 2 | `feat(prisma)` | `prisma/schema.prisma` | Esquema completo (7 modelos + 3 enums) |
| 3 | `chore(prisma)` | `prisma/client/` (generado) | `npx prisma generate` |

**Schema Prisma (`prisma/schema.prisma`):**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role { CUSTOMER ADMIN }
enum TokenType { EMAIL_VERIFICATION PASSWORD_RESET }
enum OrderStatus { PENDING CONFIRMED SHIPPED DELIVERED CANCELLED }

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  name          String?
  emailVerified DateTime?
  role          Role      @default(CUSTOMER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  sessions      Session[]
  addresses     Address[]
  orders        Order[]
  newsletter    NewsletterSubscriber?
  discountCodes DiscountCode[]
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  id        String     @id @default(cuid())
  email     String
  token     String     @unique
  type      TokenType
  expiresAt DateTime
  createdAt DateTime   @default(now())
  @@unique([email, type])
}

model NewsletterSubscriber {
  id        String   @id @default(cuid())
  email     String   @unique
  userId    String?  @unique
  user      User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  source    String   @default("home")
  verified  Boolean  @default(false)
  createdAt DateTime @default(now())
}

model DiscountCode {
  id         String   @id @default(cuid())
  code       String   @unique
  percent    Int
  userId     String?
  user       User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  usageLimit Int      @default(1)
  usedCount  Int      @default(0)
  expiresAt  DateTime?
  createdAt  DateTime @default(now())
}

model Address {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name      String
  phone     String
  zone      String
  notes     String?
  isDefault Boolean  @default(false)
  createdAt DateTime @default(now())
}

model Order {
  id           String       @id @default(cuid())
  userId       String?
  user         User?        @relation(fields: [userId], references: [id], onDelete: SetNull)
  email        String
  phone        String
  zone         String
  notes        String?
  subtotal     Decimal      @db.Decimal(10, 2)
  discount     Decimal      @db.Decimal(10, 2) @default(0)
  discountCode String?
  total        Decimal      @db.Decimal(10, 2)
  status       OrderStatus  @default(PENDING)
  whatsappUrl  String
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
}
```

**Cómo Probar:**
```bash
# 1. Levantar PostgreSQL
docker run -d --name yamgurumi-db \
  -e POSTGRES_USER=yamgurumi \
  -e POSTGRES_PASSWORD=yamiadmin3123 \
  -e POSTGRES_DB=yamgurumi \
  -p 5432:5432 \
  postgres:16-alpine

# 2. Validar y generar
npx prisma validate      # ✓ Schema válido
npx prisma generate      # ✓ Cliente generado
npx prisma db push       # ✓ Tablas creadas
npx prisma studio        # ✓ UI muestra 7 tablas + 3 enums
```

---

#### Rama 2: `feat/env-config`

| Commit | Tipo | Archivos | Descripción |
|--------|------|----------|-------------|
| 1 | `chore(env)` | `.env.example` | Plantilla de variables de entorno |
| 2 | `chore(env)` | `.env` (gitignored), `src/lib/prisma.ts` | Config local + cliente singleton |

**.env.example:**
```env
# Database
DATABASE_URL="postgresql://yamgurumi:yamiadmin3123@localhost:5432/yamgurumi?schema=public"

# Auth
JWT_SECRET="generate-with-openssl-rand-base64-32"
JWT_EXPIRES_IN="7d"

# Email (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxx"
EMAIL_FROM="Yamgurumi <onboarding@resend.dev>"

# Rate Limiting (Redis local - opcional)
UPSTASH_REDIS_REST_URL="http://localhost:8000"
UPSTASH_REDIS_REST_TOKEN=""

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**src/lib/prisma.ts:**
```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
```

**Cómo Probar:**
```bash
cat .env                              # ✓ Variables configuradas
npx prisma db push                    # ✓ Conexión exitosa
node -e "const {prisma}=require('./src/lib/prisma'); prisma.user.count().then(console.log)"  # ✓ 0
```

---

#### Rama 3: `feat/auth-deps`

| Commit | Tipo | Archivos | Descripción |
|--------|------|----------|-------------|
| 1 | `chore(deps)` | `package.json`, `pnpm-lock.yaml` | Instalar dependencias auth/email/validation/rate-limit |

**Dependencias:**
```bash
# Runtime
pnpm add bcryptjs jose zod @resend/resend @upstash/redis react-email @react-email/components @react-email/tailwind

# Dev
pnpm add -D @types/bcryptjs
```

**Cómo Probar:**
```bash
pnpm install        # ✓ Sin errores
pnpm typecheck      # ✓ Tipos OK
```

---

#### Rama 4: `feat/initial-migration`

| Commit | Tipo | Archivos | Descripción |
|--------|------|----------|-------------|
| 1 | `feat(db)` | `prisma/migrations/.../migration.sql` | `npx prisma migrate dev --name init` |
| 2 | `feat(db)` | `prisma/seed.ts`, `package.json` | Seed script con admin user |
| 3 | `chore(db)` | - | `pnpm db:seed` y verificación |

**prisma/seed.ts:**
```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'cb2724136@gmail.com';
  const existing = await prisma.user.findUnique({ where: { email } });
  
  if (!existing) {
    const passwordHash = await bcrypt.hash('yamiadmin3123', 12);
    const admin = await prisma.user.create({
      data: {
        email,
        name: 'yami',
        passwordHash,
        role: 'ADMIN',
        emailVerified: new Date(),
      },
    });
    console.log('✅ Admin creado:', admin.email);
  } else {
    console.log('ℹ️ Admin ya existe:', existing.email);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
```

**package.json scripts:**
```json
"scripts": {
  "db:seed": "tsx prisma/seed.ts",
  "db:reset": "prisma migrate reset --force && pnpm db:seed",
  "db:up": "docker compose up -d",
  "db:down": "docker compose down",
  "db:logs": "docker compose logs -f"
}
```

**Cómo Probar:**
```bash
npx prisma migrate reset --force    # ✓ Limpia y reaplica
npx prisma migrate dev --name init  # ✓ Migración formal
pnpm db:seed                        # ✓ Admin creado
npx prisma studio                   # ✓ User table: 1 row, role=ADMIN
```

---

#### Rama 5: `feat/email-templates`

| Commit | Tipo | Archivos | Descripción |
|--------|------|----------|-------------|
| 1 | `feat(email)` | `src/lib/email/resend.ts`, `src/lib/email/send.ts` | Cliente Resend + helpers de envío |
| 2 | `feat(email)` | `src/lib/email/templates/welcome.tsx` | Template bienvenida con código descuento |
| 3 | `feat(email)` | `verify-email.tsx`, `reset-password.tsx`, `order-confirmation.tsx` | Templates restantes |
| 4 | `chore(email)` | `src/lib/email/send.ts` | Completar funciones render con ReactDOMServer |

**src/lib/email/resend.ts:**
```typescript
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);
export const emailFrom = process.env.EMAIL_FROM || 'Yamgurumi <onboarding@resend.dev>';
export const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
```

**src/lib/email/send.ts:**
```typescript
import { resend, emailFrom, appUrl } from './resend';
import { renderToStaticMarkup } from 'react-dom/server';
import WelcomeEmail from './templates/welcome';
import VerifyEmail from './templates/verify-email';
import ResetPasswordEmail from './templates/reset-password';
import OrderConfirmationEmail from './templates/order-confirmation';

export async function sendEmail({ to, subject, html, text }: { to: string; subject: string; html: string; text?: string }) {
  const { data, error } = await resend.emails.send({ from: emailFrom, to, subject, html, text });
  if (error) throw new Error(`Resend error: ${error.message}`);
  return data;
}

export async function sendWelcomeEmail(to: string, discountCode: string) {
  const html = renderToStaticMarkup(<WelcomeEmail discountCode={discountCode} />);
  return sendEmail({ to, subject: '¡Bienvenido a la Comunidad Yamgurumi! 🧶', html });
}

export async function sendVerificationEmail(to: string, token: string) {
  const url = `${appUrl}/auth/verify?token=${token}`;
  const html = renderToStaticMarkup(<VerifyEmail verificationUrl={url} />);
  return sendEmail({ to, subject: 'Verifica tu email en Yamgurumi', html });
}

export async function sendResetPasswordEmail(to: string, token: string) {
  const url = `${appUrl}/auth/reset-password?token=${token}`;
  const html = renderToStaticMarkup(<ResetPasswordEmail resetUrl={url} />);
  return sendEmail({ to, subject: 'Restablece tu contraseña en Yamgurumi', html });
}

export async function sendOrderConfirmationEmail(to: string, orderData: OrderEmailData) {
  const html = renderToStaticMarkup(<OrderConfirmationEmail data={orderData} />);
  return sendEmail({ to, subject: `Confirmación de pedido #${orderData.orderId.slice(0,8)} - Yamgurumi`, html });
}

interface OrderEmailData {
  orderId: string;
  items: { name: string; qty: number; price: number }[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  total: number;
  delivery: { name: string; phone: string; zone: string; notes?: string };
}
```

**Templates React Email** (ubicados en `src/lib/email/templates/`):
- `welcome.tsx` - Bienvenida + código descuento 10%
- `verify-email.tsx` - Link verificación cuenta
- `reset-password.tsx` - Link reset password (1h expiración)
- `order-confirmation.tsx` - Resumen pedido + enlace a `/cuenta/pedidos/[id]`

Todos usan: Comfortaa (headings), Manrope (body), paleta Yamgurumi, stitch-tags, badge-pills.

**Cómo Probar:**
```bash
# Configurar RESEND_API_KEY en .env
node -e "
const { sendWelcomeEmail } = require('./src/lib/email/send');
sendWelcomeEmail('cb2724136@gmail.com', 'WELCOME-ABC123')
  .then(console.log).catch(console.error);
"
# ✓ Email recibido en cb2724136@gmail.com con código WELCOME-ABC123
```

---

#### Rama 6: `feat/validation-schemas`

| Commit | Tipo | Archivos | Descripción |
|--------|------|----------|-------------|
| 1 | `feat(validation)` | `src/lib/validation/auth.schemas.ts` | Zod schemas: register, login, verify, reset-request, reset-password, change-password |
| 2 | `feat(validation)` | `src/lib/validation/newsletter.schemas.ts` | Zod schema: subscribe (email + honeypot) |

**src/lib/validation/auth.schemas.ts:**
```typescript
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email inválido').toLowerCase(),
  password: z.string().min(8, 'Mínimo 8 caracteres').max(128),
  name: z.string().min(2).max(100).optional(),
});

export const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token requerido'),
});

export const resetRequestSchema = z.object({
  email: z.string().email().toLowerCase(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(128),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});
```

**src/lib/validation/newsletter.schemas.ts:**
```typescript
import { z } from 'zod';

export const subscribeSchema = z.object({
  email: z.string().email('Email inválido').toLowerCase(),
  website: z.string().optional().refine((v) => !v || v === '', 'Spam detectado'),
});
```

**Cómo Probar:**
```bash
node -e "
const { registerSchema } = require('./src/lib/validation/auth.schemas');
console.log(registerSchema.safeParse({ email: 'test@test.com', password: '12345678', name: 'Test' })); // ✓ success
console.log(registerSchema.safeParse({ email: 'invalid', password: '123' })); // ✓ error
"
```

---

#### Rama 7: `feat/rate-limit` (Opcional - Activable Post-MVP)

| Commit | Tipo | Archivos | Descripción |
|--------|------|----------|-------------|
| 1 | `feat(rate-limit)` | `src/lib/rate-limit.ts` | Wrapper Upstash Redis + límites predefinidos |
| 2 | `chore(rate-limit)` | `docker-compose.yml`, `package.json` | Docker Compose local + scripts |

**src/lib/rate-limit.ts:**
```typescript
import { Redis } from '@upstash/redis';

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
  : null;

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
  limit: number;
}

export async function rateLimit(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
  if (!redis) return { success: true, remaining: limit, reset: Date.now() + windowMs, limit };
  
  const now = Date.now();
  const windowSec = Math.ceil(windowMs / 1000);
  const redisKey = `rl:${key}:${Math.floor(now / windowMs)}`;
  
  const current = await redis.incr(redisKey);
  if (current === 1) await redis.expire(redisKey, windowSec);
  
  return {
    success: current <= limit,
    remaining: Math.max(0, limit - current),
    reset: (Math.floor(now / windowMs) + 1) * windowMs,
    limit,
  };
}

export function withRateLimit<T extends (...args: any[]) => Promise<any>>(
  action: T, getKey: (...args: Parameters<T>) => string, limit: number, windowMs: number
): T {
  return (async (...args) => {
    const key = getKey(...args);
    const result = await rateLimit(key, limit, windowMs);
    if (!result.success) throw new Error(`RATE_LIMIT_EXCEEDED:${result.reset}`);
    return action(...args);
  }) as T;
}

export const RATE_LIMITS = {
  register: { limit: 3, windowMs: 60 * 60 * 1000 },
  login: { limit: 5, windowMs: 15 * 60 * 1000 },
  resetRequest: { limit: 2, windowMs: 60 * 60 * 1000 },
  verifyEmail: { limit: 10, windowMs: 60 * 60 * 1000 },
  newsletterSubscribe: { limit: 3, windowMs: 60 * 60 * 1000 },
  applyDiscount: { limit: 10, windowMs: 60 * 1000 },
  createOrder: { limit: 5, windowMs: 60 * 1000 },
} as const;
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: yamgurumi
      POSTGRES_PASSWORD: yamiadmin3123
      POSTGRES_DB: yamgurumi
    ports: ["5432:5432"]
    volumes: [postgres_data:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U yamgurumi"]
      interval: 5s; timeout: 5s; retries: 5

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
    volumes: [redis_data:/data]
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s; timeout: 3s; retries: 5

volumes:
  postgres_data:
  redis_data:
```

**Cómo Probar:**
```bash
pnpm db:up                          # ✓ Postgres + Redis corriendo
docker exec -it yamgurumi-redis redis-cli ping  # ✓ PONG
node -e "
const { rateLimit } = require('./src/lib/rate-limit');
for(let i=0;i<5;i++) rateLimit('test:key', 3, 60000).then(console.log);
" 
# ✓ Primeros 3 success=true, 4to y 5to success=false
```

---

**🏷️ Tag Final Fase 0:** `db-foundation-v0.1.0` (merge todas las ramas a `dev`, luego `dev` → `main`)

---

### FASE 1: Auth Core (`auth-core-v1.0.0`)

**Objetivo**: Registro, login, verificación email, reset password, logout, middleware protección.

#### Ramas y Commits

| Rama | Commits Principales |
|------|---------------------|
| `feat/auth-tokens` | `feat(auth): password hashing + jwt tokens` (`password.ts`, `tokens.ts`), `feat(auth): session management` (`session.ts`, `permissions.ts`) |
| `feat/auth-register` | `feat(auth): register server action` (`register.ts`), `feat(auth): verify email page + action` (`verify/page.tsx`, `verify-email.ts`) |
| `feat/auth-login` | `feat(auth): login server action` (`login.ts`), `feat(auth): logout server action` (`logout.ts`) |
| `feat/auth-reset` | `feat(auth): reset request page + action` (`reset-request/page.tsx`, `request-reset.ts`), `feat(auth): reset password page + action` (`reset-password/page.tsx`, `reset-password.ts`) |
| `feat/auth-ui` | `feat(auth): login/register UI pages` (`login/page.tsx`, `register/page.tsx`) |
| `feat/middleware` | `feat(middleware): protect /cuenta/* + /admin/*` (`middleware.ts`) |

**Archivos Clave a Crear:**

```
src/lib/auth/
├── password.ts      # hashPassword, verifyPassword (bcrypt 12 rounds)
├── tokens.ts        # signToken, verifyToken (jose HS256), setAuthCookie, clearAuthCookie
├── session.ts       # getSession(), requireAuth(), requireAdmin(), destroySession()
└── permissions.ts   # role guards

src/actions/auth/
├── register.ts
├── login.ts
├── logout.ts
├── verify-email.ts
├── request-reset.ts
├── reset-password.ts
└── change-password.ts

src/app/auth/
├── login/page.tsx
├── register/page.tsx
├── verify/page.tsx
├── reset-request/page.tsx
└── reset-password/page.tsx

middleware.ts        # Protege /cuenta/*, /admin/*
```

**JWT Payload:**
```typescript
interface JWTPayload {
  sub: string;        // user.id
  email: string;
  role: Role;
  iat: number;
  exp: number;        // 7 días
  jti: string;        // session.id (revocación)
}
```

**Cookies:** `httpOnly`, `secure`, `sameSite: 'lax'`, `path: '/'`, `maxAge: 60*60*24*7`

**Cómo Probar Cada Rama:**
```bash
# Auth tokens
node -e "const { hashPassword, verifyPassword } = require('./src/lib/auth/password'); ..."

# Register flow
curl -X POST http://localhost:3000/api/auth/register -d '{"email":"test@test.com","password":"12345678"}'  # ✓ Email verification enviado

# Verify flow
# Click link email → /auth/verify?token=xxx → redirect /cuenta con cookie session

# Login flow
curl -X POST .../api/auth/login -d '{"email":"test@test.com","password":"12345678"}'  # ✓ Cookie httpOnly seteada

# Middleware
# Acceso /cuenta sin login → redirect /auth/login?redirect=/cuenta
# Acceso /cuenta con login → pasa, headers x-user-id, x-user-role
```

---

### FASE 2: Newsletter + Welcome Discount (`newsletter-discount-v1.1.0`)

**Objetivo**: Suscripción newsletter, email bienvenida con código único, aplicar descuento en carrito.

#### Ramas y Commits

| Rama | Commits Principales |
|------|---------------------|
| `feat/newsletter-subscribe` | `feat(newsletter): subscribe server action` (`subscribe.ts` - upsert + sendWelcome + genera DiscountCode `WELCOME-{userId.slice(0,6)}`) |
| `feat/newsletter-ui` | `feat(newsletter): replace NewsletterSection` (`NewsletterSection.tsx`, `page.tsx` - form client → action → toast con código) |
| `feat/discounts-logic` | `feat(discounts): validation + apply logic` (`discounts.ts`, `apply-discount.ts` - validateCode, applyDiscount) |
| `feat/cart-discount` | `feat(cart): discount input field` (`DiscountField.tsx`, `CartClient.tsx` - input código → muestra descuento → persiste en WhatsApp) |

**Flujo Newsletter:**
```
1. Usuario ingresa email en Home → NewsletterSection
2. POST subscribe action → upsert NewsletterSubscriber
3. Si NUEVO: sendWelcomeEmail + genera DiscountCode único (10%, 1 uso, 30d)
4. Retorna { success, discountCode } → UI muestra toast con código
5. Usuario va a /bag → ingresa código → apply-discount action → valida → muestra descuento
6. Checkout → WhatsApp link incluye línea "Descuento (CODE): -$X.XX (Y%)"
```

**Cómo Probar:**
```bash
# Newsletter
# Home: ingresa email → toast éxito con código WELCOME-ABC123
# Email recibido con mismo código

# Descuento
# /bag: ingresa WELCOME-ABC123 → subtotal actualizado con 10% off
# Checkout WhatsApp: mensaje incluye "Descuento (WELCOME-ABC123): -$3.50 (10%)"
```

---

### FASE 3: Perfil Usuario (`profile-v1.2.0`)

**Objetivo**: Dashboard `/cuenta` con pedidos, direcciones, newsletter, seguridad.

#### Ramas y Commits

| Rama | Commits Principales |
|------|---------------------|
| `feat/profile-layout` | `feat(profile): layout + dashboard` (`cuenta/layout.tsx`, `cuenta/page.tsx` - sidebar nav + stats) |
| `feat/profile-orders` | `feat(profile): orders list + detail` (`cuenta/pedidos/page.tsx`, `cuenta/pedidos/[id]/page.tsx` - lista + detalle con WhatsApp link) |
| `feat/profile-addresses` | `feat(profile): addresses CRUD` (`cuenta/direcciones/page.tsx`, `actions/addresses/*.ts` - add/edit/delete/setDefault + validación teléfono SV) |
| `feat/profile-checkout` | `feat(profile): checkout auto-fill` (`CartClient.tsx` - selector dirección guardada → auto-llena form) |
| `feat/profile-newsletter` | `feat(profile): newsletter preferences` (`cuenta/newsletter/page.tsx` - toggle suscrito, ver código, reenviar) |
| `feat/profile-security` | `feat(profile): security page` (`cuenta/seguridad/page.tsx`, `change-password.ts` - cambio pwd + revocar sesiones) |

**Estructura `/cuenta`:**
```
/cuenta                    → Dashboard (resumen)
/cuenta/pedidos            → Lista paginada pedidos
/cuenta/pedidos/[id]       → Detalle pedido
/cuenta/direcciones        → CRUD direcciones
/cuenta/newsletter         → Preferencias suscripción
/cuenta/seguridad          → Cambio contraseña + sesiones activas
```

**Cómo Probar:**
```bash
# Login → /cuenta → sidebar navega a todas las secciones
# Pedidos: ver historial, click ver detalle → items + WhatsApp link
# Direcciones: crear/editar/borrar, setDefault → checkout auto-selecciona default
# Newsletter: toggle on/off, ver código activo, botón reenviar
# Seguridad: cambiar pwd (actual + nueva x2) → invalida otras sessions
```

---

### FASE 4: Orders + WhatsApp + Email (`orders-v1.3.0`)

**Objetivo**: Checkout crea Order en DB, genera WhatsApp link con descuento, envía email confirmación.

#### Ramas y Commits

| Rama | Commits Principales |
|------|---------------------|
| `feat/orders-create` | `feat(orders): create order action` (`create.ts` - valida descuento, calcula totales, crea Order PENDING, incrementa usedCount, genera WhatsApp URL, sendOrderConfirmationEmail) |
| `feat/orders-whatsapp` | `feat(orders): whatsapp message with discount` (`cart-whatsapp.ts` update - buildWhatsAppLink incluye descuento) |
| `feat/orders-email` | `feat(orders): order confirmation email` (`order-confirmation.tsx` template completo) |

**Flujo Checkout:**
```
1. Usuario en /bag → llena form entrega + código descuento opcional
2. Click "Enviar pedido por WhatsApp" → createOrder action
3. Action: valida código → calcula subtotal/discount/total → crea Order (PENDING)
4. Incrementa DiscountCode.usedCount
5. Genera WhatsApp URL con mensaje formateado (incluye descuento)
6. Envía email confirmación (template order-confirmation)
7. Retorna { whatsappUrl, orderId } → window.open(whatsappUrl)
```

**Mensaje WhatsApp con Descuento:**
```
*Pedido para Yamgurumi*

• 1× Dragón Celestino — $35.00

Subtotal: $35.00
Descuento (WELCOME-ABC123): -$3.50 (10%)
Total: $31.50
Envío: Se coordina en el chat

*Nombre:* Juan Pérez
*Teléfono:* 7000-0000
*Zona:* San Salvador

—Enviado desde el sitio web de Yamgurumi
```

**Cómo Probar:**
```bash
# Checkout completo
# /bag: agregar items → código descuento → enviar pedido
# ✓ Order en DB (status PENDING)
# ✓ Email confirmación recibido
# ✓ WhatsApp abre con mensaje formateado + descuento visible
# ✓ DiscountCode.usedCount incrementado
```

---

### FASE 5: Admin Panel (`admin-v1.4.0`)

**Objetivo**: Panel administrativo completo protegido por rol ADMIN.

#### Ramas y Commits

| Rama | Commits Principales |
|------|---------------------|
| `feat/admin-layout` | `feat(admin): layout + auth guard` (`admin/layout.tsx`, `admin/page.tsx` - sidebar + KPIs: ventas mes, pedidos pendientes, suscriptores, conversión) |
| `feat/admin-orders` | `feat(admin): orders management` (`admin/pedidos/page.tsx`, `admin/pedidos/[id]/page.tsx`, `actions/admin/orders.ts` - tabla filtrable, cambiar estado, ver detalle, reenviar email, exportar CSV) |
| `feat/admin-users` | `feat(admin): users management` (`admin/usuarios/page.tsx`, `actions/admin/users.ts` - tabla usuarios, toggle activo, cambiar rol, ver pedidos) |
| `feat/admin-subscribers` | `feat(admin): subscribers + discount codes` (`admin/suscriptores/page.tsx`, `admin/descuentos/page.tsx`, `actions/admin/discounts.ts` - CRUD suscriptores + exportar CSV, CRUD descuentos completo) |
| `feat/admin-analytics` | `feat(admin): analytics basics` (`admin/analiticas/page.tsx`, `actions/admin/analytics.ts` - gráficos: ventas/día 30d, top 5 productos, funnel checkout) |

**Módulos Admin:**
```
/admin                     → Dashboard KPIs
/admin/pedidos             → Lista + filtros + acciones
/admin/pedidos/[id]        → Detalle + cambio estado
/admin/usuarios            → Lista + toggle activo + rol
/admin/suscriptores        → Lista + exportar CSV
/admin/descuentos          → CRUD códigos (% fijo, uso único/múltiple, expiración, user vinculado)
/admin/analiticas          → Gráficos (Recharts o CSS simple)
```

**Cómo Probar:**
```bash
# Login admin (yami / yamiadmin3123) → /admin → dashboard KPIs
# Pedidos: filtar por estado/fecha → cambiar estado → DB actualizado
# Usuarios: toggle activo → login bloqueado para ese usuario
# Descuentos: crear "ADMIN-20" (20%, 5 usos) → válido en checkout
# Analíticas: datos coherentes con orders reales
```

---

### FASE 6: Polish + Production Ready (`v1.5.0-production-ready`)

**Objetivo**: UX pulida, error handling, seeds, docker, docs.

#### Ramas y Commits

| Rama | Commits Principales |
|------|---------------------|
| `feat/toasts` | `feat: toast notifications system` (`Toast.tsx`, provider en layout - success/error global) |
| `feat/loading` | `feat: loading states + skeletons` (`Button` loading, `Skeleton` cards, forms) |
| `feat/errors` | `feat: error boundaries + logging` (`error.tsx`, `global-error.tsx`, `logger.ts`) |
| `chore/seed` | `chore: seed script + admin user` (`prisma/seed.ts` mejorado, `db:seed` script) |
| `chore/docker` | `chore: docker-compose for local dev` (`docker-compose.yml` con healthchecks) |
| `docs/readme` | `docs: README + ENV docs` (`README.md`, `ENV_SETUP.md` onboarding) |

---

## Resumen de Tags (Hits en `main`)

| Tag | Contenido | Fase |
|-----|-----------|------|
| `db-foundation-v0.1.0` | Prisma, migración, Resend, Rate limit, Zod | 0 |
| `auth-core-v1.0.0` | Register, login, verify, reset, logout, middleware | 1 |
| `newsletter-discount-v1.1.0` | Subscribe, welcome email + código, aplicar descuento | 2 |
| `profile-v1.2.0` | `/cuenta`: pedidos, direcciones, newsletter, seguridad | 3 |
| `orders-v1.3.0` | Checkout → Order + WhatsApp + email confirmación | 4 |
| `admin-v1.4.0` | Panel admin: pedidos, usuarios, suscriptores, descuentos, analíticas | 5 |
| `v1.5.0-production-ready` | Polish, seeds, docker, docs | 6 |

---

## Configuración de Desarrollo

### Variables de Entorno Requeridas (`.env`)

```env
# Database
DATABASE_URL="postgresql://yamgurumi:yamiadmin3123@localhost:5432/yamgurumi?schema=public"

# Auth
JWT_SECRET="[generar: openssl rand -base64 32]"
JWT_EXPIRES_IN="7d"

# Email (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxx"
EMAIL_FROM="Yamgurumi <onboarding@resend.dev>"

# Rate Limiting (Redis local - opcional)
UPSTASH_REDIS_REST_URL="http://localhost:8000"
UPSTASH_REDIS_REST_TOKEN=""

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Comandos Útiles

```bash
# Base de datos
pnpm db:up              # Levantar Postgres + Redis (Docker)
pnpm db:down            # Bajar contenedores
pnpm db:logs            # Ver logs
pnpm db:seed            # Ejecutar seed (crea admin)
pnpm db:reset           # Reset migraciones + seed

# Prisma
npx prisma generate     # Regenerar client
npx prisma migrate dev --name <nombre>  # Nueva migración
npx prisma migrate reset --force        # Reset completo (dev only)
npx prisma studio       # GUI inspección DB

# Desarrollo
pnpm dev                # Next.js dev server
pnpm build              # Build producción
pnpm lint               # ESLint
pnpm typecheck          # TypeScript check

# Testing manual
node -e "const {prisma}=require('./src/lib/prisma'); prisma.user.findMany().then(console.log)"
```

---

## Checklist de Definition of Done por Fase

### Fase 0 ✓
- [ ] `prisma/schema.prisma` coincide con diseño
- [ ] `npx prisma migrate dev --name init` ejecuta sin errores
- [ ] `prisma/client` generado y tipado
- [ ] `src/lib/prisma.ts` singleton funciona dev/prod
- [ ] Resend envía email prueba a `cb2724136@gmail.com`
- [ ] Rate limiting responde `success: true/false`
- [ ] Zod schemas validan/fallan casos prueba
- [ ] `.env.example` documenta todas las variables
- [ ] `npx prisma studio` muestra 7 tablas + 3 enums
- [ ] Seed crea admin `yami` / `yamiadmin3123` / `cb2724136@gmail.com`

### Fase 1 ✓
- [ ] Registro → email verificación → click link → logueado en `/cuenta`
- [ ] Login → cookie httpOnly → acceso `/cuenta`
- [ ] Email no verificado → login reenvía verificación
- [ ] Reset password → email → link → nueva pwd → login auto
- [ ] Logout → borra session DB + limpia cookie
- [ ] Middleware protege `/cuenta/*` y `/admin/*`
- [ ] Headers `x-user-id`, `x-user-role` en rutas protegidas

### Fase 2 ✓
- [ ] Newsletter home: email → toast con código `WELCOME-XXXXXX`
- [ ] Email bienvenida recibido con mismo código
- [ ] Código en DB: 10%, 1 uso, 30d expiración
- [ ] Carrito: input código → subtotal con descuento
- [ ] Checkout WhatsApp: mensaje incluye línea descuento

### Fase 3 ✓
- [ ] `/cuenta` dashboard con sidebar navega a todas secciones
- [ ] Pedidos: lista + detalle con WhatsApp link
- [ ] Direcciones: CRUD completo + setDefault
- [ ] Checkout auto-selecciona dirección default
- [ ] Newsletter: toggle + ver código + reenviar
- [ ] Seguridad: cambio pwd invalida otras sessions

### Fase 4 ✓
- [ ] Checkout crea Order PENDING en DB
- [ ] Email confirmación recibido (template completo)
- [ ] WhatsApp abre con mensaje formateado + descuento
- [ ] DiscountCode.usedCount incrementado

### Fase 5 ✓
- [ ] Login admin → `/admin` dashboard KPIs
- [ ] Pedidos: filtros + cambio estado + exportar CSV
- [ ] Usuarios: toggle activo + cambiar rol
- [ ] Suscriptores: exportar CSV
- [ ] Descuentos: CRUD completo
- [ ] Analíticas: gráficos con datos reales

### Fase 6 ✓
- [ ] Toasts globales success/error
- [ ] Loading states en buttons/forms
- [ ] Error boundaries capturan errores
- [ ] `pnpm db:seed` crea admin reproducible
- [ ] `docker compose up -d` levanta todo
- [ ] README + ENV_SETUP.md completos

---

## Contacto y Referencias

- **Email testing**: `cb2724136@gmail.com`
- **Admin credenciales**: `yami` / `yamiadmin3123`
- **Resend testing**: `onboarding@resend.dev` (100 emails/día a email verificado)
- **PostgreSQL local**: `localhost:5432` (Docker)
- **Redis local**: `localhost:6379` (Docker, opcional)

---

*Documento generado automáticamente - Actualizar conforme avance la implementación*