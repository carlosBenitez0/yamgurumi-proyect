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
  { name: "Muñecos", count: 6, icon: "🧸" },
  { name: "Decoración", count: 5, icon: "🏡" },
  { name: "Accesorios", count: 3, icon: "✨" },
  { name: "Llaveros", count: 4, icon: "🔑" },
  { name: "Navideño", count: 3, icon: "🎄" },
  { name: "Infantil", count: 3, icon: "👶" },
];

export const products: Product[] = [
  /* ── Muñecos ─────────────────────────────────────────── */
  {
    id: "dragon-celestino",
    name: "Dragón Celestino",
    slug: "dragon-celestino",
    price: 35.0,
    category: "Muñecos",
    description: "Adorable dragón tejido a mano con alas desplegables y cola curvada en tonos celestes.",
    materials: "100% Algodón Mercerizado + Relleno Hipoalergénico",
    tags: ["Best Seller", "Muñecos"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAl3N2_Uphmn6Pqvfi0INnwVm8HPvyyhKhctRW_by89CkhN12bA06eRaB7oMKrv2ko0gBArMGLIxdWpktm7IfNu-J455T49N2f7sD8E1n4uTwHDDDPtRpTzo3DZzgKniYE_Fyep3trvq0hHqiUP3O82F--HFSPVl4fdrA5andRyGTlF_ChobNdCUDB15Pa0SO4ahCjSzOTb0eUhg3Eea80XC972DXDKaedGQdRNZRGL8l1OftmN8dQSVdiDRwF8I0kpwFdMHHM4SUw",
    rating: 4.9,
    reviews: 128,
    searchKeywords: [
      "dragón", "dragon", "celeste", "azul", "alas", "fuego",
      "fantasía", "mascota", "juguete", "niños", "cojín",
    ],
  },
  {
    id: "zorro-otonal",
    name: "Zorro Otoñal",
    slug: "zorro-otonal",
    price: 42.0,
    category: "Muñecos",
    description: "Zorro naranja con bufanda tejida a mano y cola esponjosa, edición limitada de temporada.",
    materials: "100% Algodón Mercerizado + Fieltro",
    tags: ["Limitado", "Muñecos"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAiE879aKAW4oJ10pJMbOcuc1p9gCtT8ohgnN-R71U1EDMnEkZu1pF16KQx4YppRKRmKNkOMm9_Ox31Zy4R6HY3z3Llpn6Btiizcn3YcZRs4nrqfvGYniB4pDqR-glpj8_6jpRvBK6xSdTitWd_6gEYXgFR9hRVgIzy5bwCBOh97UmHpEkXXVDEoeApLc3RWJcma_bKMvXJIWbt2sLTTN31Tx8IihPHBcBre2diF2tqzxPsQP9NqT2U-sFN_NG9OW6QWxmmEJ7l2-k",
    rating: 4.7,
    reviews: 64,
    searchKeywords: [
      "zorro", "otoño", "otoñal", "bufanda", "naranja", "limitado",
      "animal", "juguete", "temporada",
    ],
  },
  {
    id: "gato-naranja",
    name: "Gatito Naranja",
    slug: "gatito-naranja",
    price: 30.0,
    category: "Muñecos",
    description: "Gatito naranja con ojos grandes bordados y cola curvada, abrazable y tierno.",
    materials: "100% Algodón Orgánico + Relleno Hipoalergénico",
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
    id: "conejo-primavera",
    name: "Conejo de Primavera",
    slug: "conejo-primavera",
    price: 33.0,
    category: "Muñecos",
    description: "Conejo tejido con orejas largas y moño de flores, perfecto para la temporada de pascua.",
    materials: "100% Algodón Orgánico + Relleno Hipoalergénico",
    tags: ["Nuevo", "Muñecos"],
    imageUrl:
      "https://images.unsplash.com/photo-1744371760034-fb60ebd2b198?fm=jpg&q=80&w=400&auto=format&fit=crop",
    rating: 4.8,
    reviews: 45,
    searchKeywords: [
      "conejo", "primavera", "orejas", "flores", "moño", "pascua",
      "animal", "tierno", "rosa",
    ],
  },
  {
    id: "buho-sabio",
    name: "Búho Sabio",
    slug: "buho-sabio",
    price: 38.0,
    category: "Muñecos",
    description: "Búho tejido con ojos grandes redondos y bufanda de invierno, mirada intrigante.",
    materials: "Algodón Mercerizado + Ojos de Seguridad + Fieltro",
    tags: ["Muñecos", "Favorito"],
    imageUrl:
      "https://images.unsplash.com/photo-1627693685101-687bf0eb1222?fm=jpg&q=80&w=400&auto=format&fit=crop",
    rating: 4.9,
    reviews: 72,
    searchKeywords: [
      "búho", "buho", "sabio", "nocturno", "ave", "ojos grandes",
      "animal", "invierno", "bufanda",
    ],
  },
  {
    id: "tortuga-marina",
    name: "Tortuga Marina",
    slug: "tortuga-marina",
    price: 29.0,
    category: "Muñecos",
    description: "Tortuga marina con caparazón de colores tropicales y aletas flexibles tejidas.",
    materials: "100% Algodón + Relleno Reciclado",
    tags: ["Popular", "Muñecos"],
    imageUrl:
      "https://images.unsplash.com/photo-1686151573986-03b5a79f22a5?fm=jpg&q=80&w=400&auto=format&fit=crop",
    rating: 4.7,
    reviews: 58,
    searchKeywords: [
      "tortuga", "marina", "caparazón", "tropical", "mar", "océano",
      "playa", "verde", "animal",
    ],
  },

  /* ── Decoración ──────────────────────────────────────── */
  {
    id: "set-setas-magicas",
    name: "Set de Setas Mágicas",
    slug: "set-de-setas-magicas",
    price: 28.0,
    category: "Decoración",
    description: "Set de 3 setas decorativas tejidas en diferentes tamaños y colores otoñales.",
    materials: "100% Algodón Orgánico + Relleno Hipoalergénico",
    tags: ["Nuevo", "Decoración"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAUl_VvuQ1NXPJWCNE2xQdkOrXdoauGndWgt8geixKAM_KVBtnBf5Fq27GhD6QQtk6rcqcG89iZIiYa5bxXamvEufILgjjk1j2_CTYPTmSYCPfOAy7extFWsL5F7kxC0oT8zEECQF-7rKqKfi0RqH6XsWxTBfm4iJVkmtBKaj7n_qlTGkpyz0gB7krRQHY8dlZWAkX4VfSlQL29bUbaomwJ9AlxkL_evxc9sewGrA_jOtr6sIFGRGXfIsZBUSZDfwP_Ovz9Zlqk5Cg",
    rating: 4.8,
    reviews: 86,
    searchKeywords: [
      "seta", "setas", "mágicas", "magicas", "hongos", "otoño",
      "otoñal", "decoración", "hogar", "mesa", "estantería",
    ],
  },
  {
    id: "cojin-corazon",
    name: "Cojín Corazón Tejido",
    slug: "cojin-corazon",
    price: 38.0,
    category: "Decoración",
    description: "Cojín en forma de corazón con textura de punto de ganchillo, ideal para el sofá.",
    materials: "Algodón + Relleno Siliconado",
    tags: ["Decoración", "Hogar"],
    imageUrl:
      "https://images.unsplash.com/photo-1773747488377-fa1ab18d946a?fm=jpg&q=80&w=400&auto=format&fit=crop",
    rating: 4.6,
    reviews: 42,
    searchKeywords: [
      "cojín", "corazón", "corazon", "hogar", "decoración", "cama",
      "sofá", "sofa", "amor", "san valentín",
    ],
  },
  {
    id: "cactus-feliz",
    name: "Cactus Feliz con Maceta",
    slug: "cactus-feliz",
    price: 22.0,
    category: "Decoración",
    description: "Cactus tejido con maceta de terracota y carita sonriente, perfecto para el escritorio.",
    materials: "100% Algodón + Maceta de Arcilla",
    tags: ["Decoración", "Hogar"],
    imageUrl:
      "https://images.unsplash.com/photo-1671212684942-5c8a3dc3234e?fm=jpg&q=80&w=400&auto=format&fit=crop",
    rating: 4.8,
    reviews: 67,
    searchKeywords: [
      "cactus", "planta", "maceta", "hogar", "decoración", "escritorio",
      "oficina", "verde", "sonriente",
    ],
  },
  {
    id: "jarron-boho",
    name: "Jarrón Boho Tejido",
    slug: "jarron-boho",
    price: 42.0,
    category: "Decoración",
    description: "Jarrón tejido estilo bohemio con textura de macramé y base de madera estable.",
    materials: "Algodón Cord + Base de Madera",
    tags: ["Decoración", "Boho"],
    imageUrl:
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?fm=jpg&q=80&w=400&auto=format&fit=crop",
    rating: 4.5,
    reviews: 34,
    searchKeywords: [
      "jarrón", "jarron", "boho", "bohemio", "macramé", "macrame",
      "hogar", "decoración", "mesa", "flores",
    ],
  },
  {
    id: "guirnalda-feliz",
    name: "Guirnalda de Caritas Felices",
    slug: "guirnalda-caritas",
    price: 18.0,
    category: "Decoración",
    description: "Guirnalda de 8 caritas sonrientes tejidas en colores pastel para habitaciones.",
    materials: "Algodón + Hilo de Cáñamo",
    tags: ["Decoración", "Infantil"],
    imageUrl:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?fm=jpg&q=80&w=400&auto=format&fit=crop",
    rating: 4.8,
    reviews: 41,
    searchKeywords: [
      "guirnalda", "caritas", "feliz", "habitación", "niños", "pastel",
      "fiesta", "cumpleaños", "colores",
    ],
  },

  /* ── Accesorios ──────────────────────────────────────── */
  {
    id: "mono-reversible",
    name: "Mono Reversible Feliz/Triste",
    slug: "mono-reversible",
    price: 28.0,
    category: "Accesorios",
    description: "Mono tejido que se revierte de cara feliz a triste, ideal para expresar emociones.",
    materials: "Algodón + Cierre Magnético",
    tags: ["Accesorios", "Creativo"],
    imageUrl:
      "https://images.unsplash.com/photo-1615486363973-f79d875780cf?fm=jpg&q=80&w=400&auto=format&fit=crop",
    rating: 4.9,
    reviews: 112,
    searchKeywords: [
      "mono", "reversible", "feliz", "triste", "emociones", "bolsillo",
      "accesorio", "creativo", "divertido",
    ],
  },
  {
    id: "flor-alfiler",
    name: "Flor de Alfiler Decorativa",
    slug: "flor-alfiler",
    price: 8.0,
    category: "Accesorios",
    description: "Flor tejida para usar como alfiler de pecho o broche en chaquetas y sombreros.",
    materials: "Algodón Mercerizado + Base de Acero",
    tags: ["Accesorios", "Regalo"],
    imageUrl:
      "https://images.unsplash.com/photo-1700171518313-5dd219beaaa6?fm=jpg&q=80&w=400&auto=format&fit=crop",
    rating: 4.6,
    reviews: 89,
    searchKeywords: [
      "flor", "alfiler", "broche", "pecho", "chaqueta", "accesorio",
      "regalo", "barato", "pequeño",
    ],
  },
  {
    id: "bolsa-tejida",
    name: "Bolsa Tejida Boho",
    slug: "bolsa-tejida",
    price: 55.0,
    category: "Accesorios",
    description: "Bolsa tejida a mano estilo bohemio con tiradores largos y cierre magnético.",
    materials: "Algodón Cord + Herrajes de Bronce",
    tags: ["Accesorios", "Edición Especial"],
    imageUrl:
      "https://images.unsplash.com/photo-1524679813234-66a389fe1a42?fm=jpg&q=80&w=400&auto=format&fit=crop",
    rating: 4.8,
    reviews: 67,
    searchKeywords: [
      "bolsa", "boho", "bohemio", "tejida", "mochila", "accesorio",
      "moda", "artesanal", "mano",
    ],
  },

  /* ── Llaveros ────────────────────────────────────────── */
  {
    id: "ballena-mini-llavero",
    name: "Ballena Mini Llavero",
    slug: "ballena-mini-llavero",
    price: 15.0,
    category: "Llaveros",
    description: "Llavero de ballenato en miniatura tejido a mano, perfecto para llaves o mochila.",
    materials: "Algodón + Relleno Hipoalergénico + Argolla de Acero",
    tags: ["Popular", "Llaveros"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAFQnaosgz36lh7D6KBqukxcmD_tpVOif5DmgeltEy06mYI2_7WLnUyongEnFWl-KZuSu0TZ_Ocv0lFOgNbNU8KkdrziYrtWcA1e0zOm6R_eexYDhncldC_qx8xqaFusWHCBbFiKNRvXkM1PzXiyITuCoVdQZAn_WBJSK2r1JMMtHX2HaXO3WdZOO3gwFrEvn3vd6w9Xikb1A_STM1c44HsfVcxTULMMPzt5KmbH_tl5E8EmndSNN_T-q1ubpLWqQOVuM4tOtaPAJ8",
    rating: 5.0,
    reviews: 203,
    searchKeywords: [
      "ballena", "llavero", "llaves", "mochila", "mini", "accesorio",
      "azul", "mar", "océano",
    ],
  },
  {
    id: "llavero-estrella",
    name: "Llavero Estrella",
    slug: "llavero-estrella",
    price: 12.0,
    category: "Llaveros",
    description: "Estrella tejida en tonos pastel con argolla de metal pulido, regalo perfecto.",
    materials: "Algodón Mercerizado + Argolla de Acero",
    tags: ["Llaveros", "Regalo"],
    imageUrl:
      "https://images.unsplash.com/photo-1761206887052-9abec0c38f03?fm=jpg&q=80&w=400&auto=format&fit=crop",
    rating: 4.7,
    reviews: 134,
    searchKeywords: [
      "estrella", "llavero", "llaves", "pastel", "accesorio", "regalo",
      "pequeño", "barato",
    ],
  },
  {
    id: "llavero-corazon",
    name: "Llavero Corazón Rosa",
    slug: "llavero-corazon-rosa",
    price: 10.0,
    category: "Llaveros",
    description: "Corazón tejido en rosa pastel con detalle de lentejuelas y argolla de acero.",
    materials: "Algodón + Lentejuelas + Argolla de Acero",
    tags: ["Llaveros", "Favorito"],
    imageUrl:
      "https://images.unsplash.com/photo-1773747488377-fa1ab18d946a?fm=jpg&q=80&w=400&auto=format&fit=crop",
    rating: 4.9,
    reviews: 178,
    searchKeywords: [
      "corazón", "corazon", "rosa", "llavero", "llaves", "san valentín",
      "amor", "regalo", "barato",
    ],
  },
  {
    id: "llavero-gato",
    name: "Llavero Gato Negro",
    slug: "llavero-gato-negro",
    price: 12.0,
    category: "Llaveros",
    description: "Gato negro tejido con ojos brillantes y colita curvada, símbolo de buena suerte.",
    materials: "Algodón Negro + Ojos Brillantes + Argolla de Acero",
    tags: ["Llaveros", "Popular"],
    imageUrl:
      "https://images.unsplash.com/photo-1618808693255-6001b4082571?fm=jpg&q=80&w=400&auto=format&fit=crop",
    rating: 4.8,
    reviews: 95,
    searchKeywords: [
      "gato", "negro", "suerte", "llavero", "llaves", "felino",
      "mascota", "noche", "misterio",
    ],
  },

  /* ── Navideño ────────────────────────────────────────── */
  {
    id: "muneco-snow",
    name: "Muñeco de Nieve",
    slug: "muneco-de-nieve",
    price: 25.0,
    category: "Navideño",
    description: "Muñeco de nieve tejido con cachemira roja y gorro de lana, temático de Navidad.",
    materials: "100% Algodón + Botones de Madera",
    tags: ["Navideño", "Temporada"],
    imageUrl:
      "https://images.unsplash.com/photo-1611502154755-53ea92113126?fm=jpg&q=80&w=400&auto=format&fit=crop",
    rating: 4.8,
    reviews: 91,
    searchKeywords: [
      "nieve", "navidad", "navideño", "navideña", "fiestas", "diciembre",
      "regalo", "temporada", "invierno",
    ],
  },
  {
    id: "arbol-navidad",
    name: "Árbol de Navidad Mini",
    slug: "arbol-navidad-mini",
    price: 20.0,
    category: "Navideño",
    description: "Árbol navideño tejido en miniatura con estrella dorada y base estable.",
    materials: "Algodón + Brillo Seguro + Base de Madera",
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
  {
    id: "reno-navidad",
    name: "Reno Navideño",
    slug: "reno-navideno",
    price: 30.0,
    category: "Navideño",
    description: "Reno tejido con cuernos grandes y nariz roja brillante, compañero de Papá Noel.",
    materials: "Algodón + Nariz de Fieltro + Brillo Seguro",
    tags: ["Navideño", "Temporada"],
    imageUrl:
      "https://images.unsplash.com/photo-1543589077-47d918065767?fm=jpg&q=80&w=400&auto=format&fit=crop",
    rating: 4.7,
    reviews: 62,
    searchKeywords: [
      "reno", "navidad", "navideño", "cuernos", "nariz", "rojo",
      "papá noel", "fiestas", "diciembre",
    ],
  },

  /* ── Infantil ────────────────────────────────────────── */
  {
    id: "amigurumi-unicornio",
    name: "Unicornio Arcoíris",
    slug: "unicornio-arcoiris",
    price: 45.0,
    category: "Infantil",
    description: "Unicornio tejido con crin arcoíris y cuerno dorado, seguro para niños.",
    materials: "Algodón Hipoalergénico + Ojos de Seguridad",
    tags: ["Infantil", "Seguro"],
    imageUrl:
      "https://images.unsplash.com/photo-1562037283-072818fb6d8f?fm=jpg&q=80&w=400&auto=format&fit=crop",
    rating: 4.9,
    reviews: 178,
    searchKeywords: [
      "unicornio", "arcoíris", "arcoiris", "niños", "niñas", "infantil",
      "juguetes", "mágico", "cuerno", "dorado",
    ],
  },
  {
    id: "osito-panal",
    name: "Osito de Panal",
    slug: "osito-de-panal",
    price: 32.0,
    category: "Infantil",
    description: "Osito suave para bebé con mantita de panal integrada, ideal para recién nacidos.",
    materials: "Algodón Orgánico + Relleno Hipoalergénico",
    tags: ["Infantil", "Bebé"],
    imageUrl:
      "https://images.unsplash.com/photo-1615486364134-62a4c72c822d?fm=jpg&q=80&w=400&auto=format&fit=crop",
    rating: 5.0,
    reviews: 89,
    searchKeywords: [
      "oso", "osito", "bebé", "bebe", "panal", "mantita", "recién nacido",
      "infantil", "niños", "regalo",
    ],
  },
  {
    id: "elefante-bebe",
    name: "Elefante Bebé con Mantita",
    slug: "elefante-bebe",
    price: 36.0,
    category: "Infantil",
    description: "Elefante suave con mantita de seguridad integrada, perfecto para bebés.",
    materials: "Algodón Orgánico + Relleno Hipoalergénico + Mantita de Algodón",
    tags: ["Infantil", "Bebé"],
    imageUrl:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?fm=jpg&q=80&w=400&auto=format&fit=crop",
    rating: 5.0,
    reviews: 94,
    searchKeywords: [
      "elefante", "bebé", "bebe", "mantita", "seguridad", "infantil",
      "niños", "gris", "tierno",
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
