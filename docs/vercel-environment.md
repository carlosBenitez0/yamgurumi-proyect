# Configuración de Entorno para Vercel — Yamgurumi

Este documento sirve como checklist y guía para configurar las **Variables de Entorno** en el panel de **Vercel** (`Project Settings > Environment Variables`).

---

## 📋 Variables de Entorno Requeridas

| Variable de Entorno | Ejemplo / Formato | Descripción |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://user:pass@ep-xyz.us-east-1.aws.neon.tech/yamgurumi?sslmode=require` | Cadena de conexión a PostgreSQL en la nube (Supabase, Neon, Railway, Render, etc.). |
| `JWT_SECRET` | `tu_secret_super_seguro_min_32_caracteres` | Clave secreta para firmar tokens JWT de autenticación. |
| `RESEND_API_KEY` | `re_123456789_abcdef...` | Clave de API de Resend para envío de correos electrónicos de verificación y restablecimiento de clave. |
| `NEXT_PUBLIC_APP_URL` | `https://tu-dominio.vercel.app` | URL pública base de la aplicación. |
| `UPSTASH_REDIS_REST_URL` | `https://xxxx.upstash.io` | URL REST de Redis en Upstash para el Rate Limiting. |
| `UPSTASH_REDIS_REST_TOKEN` | `AXXXX...` | Token REST de Upstash Redis. |

---

## 🛠️ Comandos de Build en Vercel

Vercel ejecutará automáticamente la compilación utilizando las siguientes configuraciones predeterminadas (definidas en `package.json`):

- **Build Command**: `next build`
- **Post-Install Script**: `prisma generate` (se ejecuta automáticamente tras `npm install`)
- **Node.js Version**: `20.x` o superior

---

## 🗄️ Migraciones de Base de Datos en Producción

Cuando agregues nuevos modelos o campos a la base de datos con Prisma:

1. Asegúrate de que `DATABASE_URL` en Vercel apunte a la base de datos de producción.
2. Ejecuta el comando de migración desde tu terminal local apuntando a la base de datos remota:
   ```bash
   npx prisma db push
   ```
3. Opcional: si deseas inicializar datos semilla en producción:
   ```bash
   npx prisma db seed
   ```

---

## 🚀 Despliegue Continuo (CI/CD)

1. Cada `git push` a la rama `main` despliega automáticamente a **Production**.
2. Cada `git push` a cualquier otra rama crea un **Preview Deployment** en Vercel.
