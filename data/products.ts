export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: ProductCategory;
  description: string;
  materials: string;
  tags: string[];
  imageUrl: string;
  rating: number;
  reviews: number;
  searchKeywords: string[];
}

export type ProductCategory =
  | "Muñecos"
  | "Decoración"
  | "Accesorios"
  | "Llaveros"
  | "Navideño"
  | "Infantil";

export const categories: { name: ProductCategory; count: number; icon: string }[] = [
  { name: "Muñecos", count: 34, icon: "🧸" },
  { name: "Decoración", count: 18, icon: "🏡" },
  { name: "Accesorios", count: 12, icon: "✨" },
  { name: "Llaveros", count: 8, icon: "🔑" },
  { name: "Navideño", count: 15, icon: "🎄" },
  { name: "Infantil", count: 10, icon: "👶" },
];

export const products: Product[] = [
  {
    id: "dragon-celestino",
    name: "Dragón Celestino",
    slug: "dragon-celestino",
    price: 35.0,
    category: "Muñecos",
    description: "Adorable dragón tejido a mano con alas desplegables y cola curvada.",
    materials: "100% Algodón Mercerizado",
    tags: ["Best Seller", "Muñecos"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAl3N2_Uphmn6Pqvfi0INnwVm8HPvyyhKhctRW_by89CkhN12bA06eRaB7oMKrv2ko0gBArMGLIxdWpktm7IfNu-J455T49N2f7sD8E1n4uTwHDDDPtRpTzo3DZzgKniYE_Fyep3trvq0hHqiUP3O82F--HFSPVl4fdrA5andRyGTlF_ChobNdCUDB15Pa0SO4ahCjSzOTb0eUhg3Eea80XC972DXDKaedGQdRNZRGL8l1OftmN8dQSVdiDRwF8I0kpwFdMHHM4SUw",
    rating: 4.9,
    reviews: 128,
    searchKeywords: [
      "dragon", "dragón", "celeste", "azul", "alas", "fuego",
      "fantasía", "mascota", "juguete", "niños", "cojín",
    ],
  },
  {
    id: "set-setas-magicas",
    name: "Set de Setas Mágicas",
    slug: "set-de-setas-magicas",
    price: 28.0,
    category: "Decoración",
    description: "Set de 3 setas decorativas en diferentes tamaños y colores otoñales.",
    materials: "100% Algodón Orgánico",
    tags: ["Nuevo", "Decoración"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAUl_VvuQ1NXPJWCNE2xQdkOrXdoauGndWgt8geixKAM_KVBtnBf5Fq27GhD6QQtk6rcqcG89iZIiYa5bxXamvEufILgjjk1j2_CTYPTmSYCPfOAy7extFWsL5F7kxC0oT8zEECQF-7rKqKfi0RqH6XsWxTBfm4iJVkmtBKaj7n_qlTGkpyz0gB7krRQHY8dlZWAkX4VfSlQL29bUbaomwJ9AlxkL_evxc9sewGrA_jOtr6sIFGRGXfIsZBUSZDfwP_Ovz9Zlqk5Cg",
    rating: 4.8,
    reviews: 86,
    searchKeywords: [
      "seta", "setas", "mágicas", "magicas", "hongos", "otoño",
      "otonal", "decoración", "hogar", "mesa", "estantería",
    ],
  },
  {
    id: "ballena-mini-llavero",
    name: "Ballena Mini Llavero",
    slug: "ballena-mini-llavero",
    price: 15.0,
    category: "Llaveros",
    description: "Llavero de ballenato en miniatura, perfecto para llaves o mochila.",
    materials: "Algodón + Relleno Hipoalergénico",
    tags: ["Popular", "Llaveros"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAFQnaosgz36lh7D6KBqukxcmD_tpVOif5DmgeltEy06mYI2_7WLnUyongEnFWl-KZuSu0TZ_Ocv0lFOgNbNU8KkdrziYrtWcA1e0zOm6R_eexYDhncldC_qx8xqaFusWHCBbFiKNRvXkM1PzXiyITuCoVdQZAn_WBJSK2r1JMMtHX2HaXO3WdZOO3gwFrEvn3vd6w9Xikb1A_STM1c44HsfVcxTULMMPzt5KmbH_tl5E8EmndSNN_T-q1ubpLWqQOVuM4tOtaPAJ8",
    rating: 5.0,
    reviews: 203,
    searchKeywords: [
      "ballena", "llavero", "llaves", "mochila", "mini", "accesorio",
      "azul", "mar", "oceano", "océano",
    ],
  },
  {
    id: "zorro-otonal",
    name: "Zorro Otoñal",
    slug: "zorro-otonal",
    price: 42.0,
    category: "Muñecos",
    description: "Zorro con bufanda tejida a mano, edición limitada de temporada.",
    materials: "100% Algodón Mercerizado",
    tags: ["Limitado", "Muñecos"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAiE879aKAW4oJ10pJMbOcuc1p9gCtT8ohgnN-R71U1EDMnEkZu1pF16KQx4YppRKRmKNkOMm9_Ox31Zy4R6HY3z3Llpn6Btiizcn3YcZRs4nrqfvGYniB4pDqR-glpj8_6jpRvBK6xSdTitWd_6gEYXgFR9hRVgIzy5bwCBOh97UmHpEkXXVDEoeApLc3RWJcma_bKMvXJIWbt2sLTTN31Tx8IihPHBcBre2diF2tqzxPsQP9NqT2U-sFN_NG9OW6QWxmmEJ7l2-k",
    rating: 4.7,
    reviews: 64,
    searchKeywords: [
      "zorro", "otoño", "otonal", "bufanda", "fieltro", "limitado",
      "animal", "naranja", "juguete",
    ],
  },
  {
    id: "gato-naranja",
    name: "Gatito Naranja",
    slug: "gatito-naranja",
    price: 30.0,
    category: "Muñecos",
    description: "Gatito naranja con ojos grandes y cola curvada, abrazable y tierno.",
    materials: "100% Algodón Orgánico",
    tags: ["Best Seller", "Muñecos"],
    imageUrl:
      "https://images.unsplash.com/photo-1686151573986-03b5a79f22a5?fm=jpg&q=80&w=400&auto=format&fit=crop",
    rating: 4.9,
    reviews: 156,
    searchKeywords: [
      "gato", "gatito", "naranja", "felino", "mascota", "peluche",
      "abrazable", "tierno", "ojos grandes",
    ],
  },
  {
    id: "cojin-corazon",
    name: "Cojín Corazón Tejido",
    slug: "cojin-corazon",
    price: 38.0,
    category: "Decoración",
    description: "Cojín en forma de corazón con textura de punto de ganchillo.",
    materials: "Algodón + Relleno Siliconado",
    tags: ["Decoración", "Hogar"],
    imageUrl:
      "https://images.unsplash.com/photo-1682456138620-6076ac071b51?fm=jpg&q=80&w=400&auto=format&fit=crop",
    rating: 4.6,
    reviews: 42,
    searchKeywords: [
      "cojín", "corazón", "corazon", "hogar", "decoración", "cama",
      "sofá", "sofa", "amor", "san valentín",
    ],
  },
  {
    id: "muneco-snow",
    name: "Muñeco de Nieve",
    slug: "muneco-de-nieve",
    price: 25.0,
    category: "Navideño",
    description: "Muñeco de nieve con cachemira roja y gorro de lana, temático de Navidad.",
    materials: "100% Algodón + Botones de Madera",
    tags: ["Navideño", "Temporada"],
    imageUrl:
      "https://images.unsplash.com/photo-1744371760034-fb60ebd2b198?fm=jpg&q=80&w=400&auto=format&fit=crop",
    rating: 4.8,
    reviews: 91,
    searchKeywords: [
      "nieve", "navidad", "navideño", "navideña", "fiestas", "diciembre",
      "regalo", "temporada", "invierno",
    ],
  },
  {
    id: "amigurumi-unicornio",
    name: "Unicornio Arcoíris",
    slug: "unicornio-arcoiris",
    price: 45.0,
    category: "Infantil",
    description: "Unicornio con crin arcoíris y cuerno dorado, seguro para niños.",
    materials: "Algodón Hipoalergénico + Ojos de Seguridad",
    tags: ["Infantil", "Seguro"],
    imageUrl:
      "https://images.unsplash.com/photo-1753370241739-1d53df4fe604?fm=jpg&q=80&w=400&auto=format&fit=crop",
    rating: 4.9,
    reviews: 178,
    searchKeywords: [
      "unicornio", "arcoíris", "arcoiris", "niños", "niñas", "infantil",
      "juguetes", "mágico", "cuerno", "dorado",
    ],
  },
  {
    id: "llavero-estrella",
    name: "Llavero Estrella",
    slug: "llavero-estrella",
    price: 12.0,
    category: "Llaveros",
    description: "Estrella tejida en tonos pastel con argolla de metal pulido.",
    materials: "Algodón Mercernizado + Argolla de Acero",
    tags: ["Llaveros", "Accesorios"],
    imageUrl:
      "https://images.unsplash.com/photo-1686151573986-03b5a79f22a5?fm=jpg&q=80&w=400&auto=format&fit=crop",
    rating: 4.7,
    reviews: 134,
    searchKeywords: [
      "estrella", "llavero", "llaves", "pastel", "accesorio", "regalo",
      "pequeño", "barato",
    ],
  },
  {
    id: "cactus-feliz",
    name: "Cactus Feliz con Maceta",
    slug: "cactus-feliz",
    price: 22.0,
    category: "Decoración",
    description: "Cactus tejido con maceta de terracota y carita sonriente.",
    materials: "100% Algodón + Maceta de Arcilla",
    tags: ["Decoración", "Hogar"],
    imageUrl:
      "https://images.unsplash.com/photo-1682456138620-6076ac071b51?fm=jpg&q=80&w=400&auto=format&fit=crop",
    rating: 4.8,
    reviews: 67,
    searchKeywords: [
      "cactus", "planta", "maceta", "hogar", "decoración", "escritorio",
      "oficina", "verde", "sonriente",
    ],
  },
  {
    id: "osito-panal",
    name: "Osito de Panal",
    slug: "osito-de-panal",
    price: 32.0,
    category: "Infantil",
    description: "Osito suave para bebé con mantita de panal integrada.",
    materials: "Algodón Orgánico + Relleno Hipoalergénico",
    tags: ["Infantil", "Bebé"],
    imageUrl:
      "https://images.unsplash.com/photo-1744371760034-fb60ebd2b198?fm=jpg&q=80&w=400&auto=format&fit=crop",
    rating: 5.0,
    reviews: 89,
    searchKeywords: [
      "oso", "osito", "bebé", "bebe", "panal", "mantita", "recién nacido",
      "infantil", "niños", "regalo",
    ],
  },
  {
    id: "arbol-navidad",
    name: "Árbol de Navidad Mini",
    slug: "arbol-navidad-mini",
    price: 20.0,
    category: "Navideño",
    description: "Árbol navideño en miniatura con estrella dorada y base estable.",
    materials: "Algodón + Brillo Seguro",
    tags: ["Navideño", "Decoración"],
    imageUrl:
      "https://images.unsplash.com/photo-1753370241739-1d53df4fe604?fm=jpg&q=80&w=400&auto=format&fit=crop",
    rating: 4.6,
    reviews: 53,
    searchKeywords: [
      "árbol", "arbol", "navidad", "navideño", "navideña", "fiestas",
      "diciembre", "estrella", "miniatura",
    ],
  },
];

/* ── Search helpers ──────────────────────────────────────── */

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export function searchProducts(query: string): Product[] {
  const q = normalize(query);
  if (!q) return [];

  const terms = q.split(/\s+/).filter(Boolean);

  return products
    .map((product) => {
      let score = 0;

      const nameNorm = normalize(product.name);
      const descNorm = normalize(product.description);
      const catNorm = normalize(product.category);
      const kwNorm = product.searchKeywords.map(normalize);

      for (const term of terms) {
        if (nameNorm.includes(term)) score += 10;
        if (catNorm.includes(term)) score += 6;
        if (descNorm.includes(term)) score += 4;
        if (kwNorm.some((k) => k.includes(term))) score += 5;
        if (product.tags.some((t) => normalize(t).includes(term))) score += 3;
      }

      return { product, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.product);
}

export function searchCategories(query: string): typeof categories {
  const q = normalize(query);
  if (!q) return [];

  return categories.filter((cat) => normalize(cat.name).includes(q));
}

export const popularSearches = [
  "Dragón",
  "Llavero",
  "Navidad",
  "Unicornio",
  "Decoración",
  "Gato",
];

export const RECENT_SEARCHES_KEY = "yamgurumi-recent-searches";
export const MAX_RECENT_SEARCHES = 6;
