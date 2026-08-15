export type ProductSize = "Mini" | "Mediano" | "Grande";

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: ProductCategory;
  size: ProductSize;
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
  | "Infantil"
  | "Plantas & Flores"
  | "Anime & Fanart";

export const sizeOptions: { value: string; label: ProductSize }[] = [
  { value: "mini", label: "Mini" },
  { value: "mediano", label: "Mediano" },
  { value: "grande", label: "Grande" },
];

export const categories: { name: ProductCategory; count: number; icon: string }[] = [
  {
    "name": "Muñecos",
    "count": 20,
    "icon": "🧸"
  },
  {
    "name": "Decoración",
    "count": 15,
    "icon": "🏡"
  },
  {
    "name": "Accesorios",
    "count": 12,
    "icon": "✨"
  },
  {
    "name": "Llaveros",
    "count": 15,
    "icon": "🔑"
  },
  {
    "name": "Navideño",
    "count": 10,
    "icon": "🎄"
  },
  {
    "name": "Infantil",
    "count": 12,
    "icon": "👶"
  },
  {
    "name": "Plantas & Flores",
    "count": 10,
    "icon": "🌸"
  },
  {
    "name": "Anime & Fanart",
    "count": 10,
    "icon": "⚡"
  }
];

export const products: Product[] = [
  {
    "id": "dragon-celestino",
    "name": "Dragón Celestino",
    "slug": "dragon-celestino",
    "price": 35,
    "category": "Muñecos",
    "size": "Mediano",
    "description": "Adorable dragón tejido a mano con alas desplegables y cola curvada.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Best Seller"
    ],
    "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuAl3N2_Uphmn6Pqvfi0INnwVm8HPvyyhKhctRW_by89CkhN12bA06eRaB7oMKrv2ko0gBArMGLIxdWpktm7IfNu-J455T49N2f7sD8E1n4uTwHDDDPtRpTzo3DZzgKniYE_Fyep3trvq0hHqiUP3O82F--HFSPVl4fdrA5andRyGTlF_ChobNdCUDB15Pa0SO4ahCjSzOTb0eUhg3Eea80XC972DXDKaedGQdRNZRGL8l1OftmN8dQSVdiDRwF8I0kpwFdMHHM4SUw",
    "rating": 4.6,
    "reviews": 15,
    "searchKeywords": [
      "dragón celestino",
      "muñecos",
      "mediano",
      "best seller"
    ]
  },
  {
    "id": "zorro-otonal",
    "name": "Zorro Otoñal",
    "slug": "zorro-otonal",
    "price": 42,
    "category": "Muñecos",
    "size": "Mediano",
    "description": "Zorro naranja con bufanda tejida a mano y cola esponjosa.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Limitado"
    ],
    "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuAiE879aKAW4oJ10pJMbOcuc1p9gCtT8ohgnN-R71U1EDMnEkZu1pF16KQx4YppRKRmKNkOMm9_Ox31Zy4R6HY3z3Llpn6Btiizcn3YcZRs4nrqfvGYniB4pDqR-glpj8_6jpRvBK6xSdTitWd_6gEYXgFR9hRVgIzy5bwCBOh97UmHpEkXXVDEoeApLc3RWJcma_bKMvXJIWbt2sLTTN31Tx8IihPHBcBre2diF2tqzxPsQP9NqT2U-sFN_NG9OW6QWxmmEJ7l2-k",
    "rating": 4.7,
    "reviews": 22,
    "searchKeywords": [
      "zorro otoñal",
      "muñecos",
      "mediano",
      "limitado"
    ]
  },
  {
    "id": "gatito-naranja",
    "name": "Gatito Naranja",
    "slug": "gatito-naranja",
    "price": 30,
    "category": "Muñecos",
    "size": "Mediano",
    "description": "Gatito naranja con ojos grandes bordados y cola curvada.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Best Seller"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1686151573986-03b5a79f22a5?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.8,
    "reviews": 29,
    "searchKeywords": [
      "gatito naranja",
      "muñecos",
      "mediano",
      "best seller"
    ]
  },
  {
    "id": "oso-abrazable-miel",
    "name": "Oso Abrazable Miel",
    "slug": "oso-abrazable-miel",
    "price": 38,
    "category": "Muñecos",
    "size": "Grande",
    "description": "Oso artesanal súper afelpado en color miel con moño.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Popular"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.9,
    "reviews": 36,
    "searchKeywords": [
      "oso abrazable miel",
      "muñecos",
      "grande",
      "popular"
    ]
  },
  {
    "id": "conejo-dulce-sueno",
    "name": "Conejo Dulce Sueño",
    "slug": "conejo-dulce-sueno",
    "price": 28,
    "category": "Muñecos",
    "size": "Mediano",
    "description": "Conejito blanco con orejas largas y gorro de dormir.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Nuevo"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1558060370-d644479be6e7?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 5,
    "reviews": 43,
    "searchKeywords": [
      "conejo dulce sueño",
      "muñecos",
      "mediano",
      "nuevo"
    ]
  },
  {
    "id": "perezoso-dormilon",
    "name": "Perezoso Dormilón",
    "slug": "perezoso-dormilon",
    "price": 34,
    "category": "Muñecos",
    "size": "Mediano",
    "description": "Perezoso tierno tejido con brazos abrazadores.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Favorito"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1534447677768-be436bb09401?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.6,
    "reviews": 50,
    "searchKeywords": [
      "perezoso dormilón",
      "muñecos",
      "mediano",
      "favorito"
    ]
  },
  {
    "id": "llama-de-los-andes",
    "name": "Llama de los Andes",
    "slug": "llama-de-los-andes",
    "price": 36,
    "category": "Muñecos",
    "size": "Grande",
    "description": "Llama multicolor con arnés tradicional andino.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Best Seller"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.7,
    "reviews": 57,
    "searchKeywords": [
      "llama de los andes",
      "muñecos",
      "grande",
      "best seller"
    ]
  },
  {
    "id": "pangolin-curioso",
    "name": "Pangolín Curioso",
    "slug": "pangolin-curioso",
    "price": 40,
    "category": "Muñecos",
    "size": "Mediano",
    "description": "Pangolín tejido con escamas tridimensionales en lana merino.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Limitado"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1563170351-be82bc888aa4?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.8,
    "reviews": 64,
    "searchKeywords": [
      "pangolín curioso",
      "muñecos",
      "mediano",
      "limitado"
    ]
  },
  {
    "id": "koala-eucalipto",
    "name": "Koala Eucalipto",
    "slug": "koala-eucalipto",
    "price": 32,
    "category": "Muñecos",
    "size": "Mediano",
    "description": "Koala gris sujetando una hojita verde tejida.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Popular"
    ],
    "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuAl3N2_Uphmn6Pqvfi0INnwVm8HPvyyhKhctRW_by89CkhN12bA06eRaB7oMKrv2ko0gBArMGLIxdWpktm7IfNu-J455T49N2f7sD8E1n4uTwHDDDPtRpTzo3DZzgKniYE_Fyep3trvq0hHqiUP3O82F--HFSPVl4fdrA5andRyGTlF_ChobNdCUDB15Pa0SO4ahCjSzOTb0eUhg3Eea80XC972DXDKaedGQdRNZRGL8l1OftmN8dQSVdiDRwF8I0kpwFdMHHM4SUw",
    "rating": 4.9,
    "reviews": 71,
    "searchKeywords": [
      "koala eucalipto",
      "muñecos",
      "mediano",
      "popular"
    ]
  },
  {
    "id": "zarigueya-bebe",
    "name": "Zarigüeya Bebé",
    "slug": "zarigueya-bebe",
    "price": 26,
    "category": "Muñecos",
    "size": "Mini",
    "description": "Tierna zarigüeya con colita enroscable.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Nuevo"
    ],
    "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuAiE879aKAW4oJ10pJMbOcuc1p9gCtT8ohgnN-R71U1EDMnEkZu1pF16KQx4YppRKRmKNkOMm9_Ox31Zy4R6HY3z3Llpn6Btiizcn3YcZRs4nrqfvGYniB4pDqR-glpj8_6jpRvBK6xSdTitWd_6gEYXgFR9hRVgIzy5bwCBOh97UmHpEkXXVDEoeApLc3RWJcma_bKMvXJIWbt2sLTTN31Tx8IihPHBcBre2diF2tqzxPsQP9NqT2U-sFN_NG9OW6QWxmmEJ7l2-k",
    "rating": 5,
    "reviews": 78,
    "searchKeywords": [
      "zarigüeya bebé",
      "muñecos",
      "mini",
      "nuevo"
    ]
  },
  {
    "id": "buho-sabio-nocturno",
    "name": "Búho Sabio Nocturno",
    "slug": "buho-sabio-nocturno",
    "price": 29,
    "category": "Muñecos",
    "size": "Mediano",
    "description": "Búho en tonos café y dorado con anteojos bordados.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Popular"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1686151573986-03b5a79f22a5?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.6,
    "reviews": 85,
    "searchKeywords": [
      "búho sabio nocturno",
      "muñecos",
      "mediano",
      "popular"
    ]
  },
  {
    "id": "pinguino-bufanda",
    "name": "Pingüino Bufanda",
    "slug": "pinguino-bufanda",
    "price": 27,
    "category": "Muñecos",
    "size": "Mediano",
    "description": "Pingüino emperador con bufanda roja y gorrito.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Favorito"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.7,
    "reviews": 92,
    "searchKeywords": [
      "pingüino bufanda",
      "muñecos",
      "mediano",
      "favorito"
    ]
  },
  {
    "id": "elefantito-azul",
    "name": "Elefantito Azul",
    "slug": "elefantito-azul",
    "price": 33,
    "category": "Muñecos",
    "size": "Grande",
    "description": "Elefantito pastel con orejas gigantes y trompa hacia arriba.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Best Seller"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1558060370-d644479be6e7?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.8,
    "reviews": 99,
    "searchKeywords": [
      "elefantito azul",
      "muñecos",
      "grande",
      "best seller"
    ]
  },
  {
    "id": "rana-sonriente",
    "name": "Rana Sonriente",
    "slug": "rana-sonriente",
    "price": 24,
    "category": "Muñecos",
    "size": "Mediano",
    "description": "Rana verde brillante sentada con mejillas rosadas.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Nuevo"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1534447677768-be436bb09401?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.9,
    "reviews": 106,
    "searchKeywords": [
      "rana sonriente",
      "muñecos",
      "mediano",
      "nuevo"
    ]
  },
  {
    "id": "dinosaurio-rexi",
    "name": "Dinosaurio Rexi",
    "slug": "dinosaurio-rexi",
    "price": 37,
    "category": "Muñecos",
    "size": "Grande",
    "description": "T-Rex amistoso en verde menta con cresta dorsal.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Best Seller"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 5,
    "reviews": 113,
    "searchKeywords": [
      "dinosaurio rexi",
      "muñecos",
      "grande",
      "best seller"
    ]
  },
  {
    "id": "unicornio-magico",
    "name": "Unicornio Mágico",
    "slug": "unicornio-magico",
    "price": 45,
    "category": "Muñecos",
    "size": "Grande",
    "description": "Unicornio con cuerno dorado y melena arcoíris.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Limitado"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1563170351-be82bc888aa4?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.6,
    "reviews": 120,
    "searchKeywords": [
      "unicornio mágico",
      "muñecos",
      "grande",
      "limitado"
    ]
  },
  {
    "id": "mapache-astuto",
    "name": "Mapache Astuto",
    "slug": "mapache-astuto",
    "price": 31,
    "category": "Muñecos",
    "size": "Mediano",
    "description": "Mapache gris con antifaz negro y antifaz bordado.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Popular"
    ],
    "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuAl3N2_Uphmn6Pqvfi0INnwVm8HPvyyhKhctRW_by89CkhN12bA06eRaB7oMKrv2ko0gBArMGLIxdWpktm7IfNu-J455T49N2f7sD8E1n4uTwHDDDPtRpTzo3DZzgKniYE_Fyep3trvq0hHqiUP3O82F--HFSPVl4fdrA5andRyGTlF_ChobNdCUDB15Pa0SO4ahCjSzOTb0eUhg3Eea80XC972DXDKaedGQdRNZRGL8l1OftmN8dQSVdiDRwF8I0kpwFdMHHM4SUw",
    "rating": 4.7,
    "reviews": 127,
    "searchKeywords": [
      "mapache astuto",
      "muñecos",
      "mediano",
      "popular"
    ]
  },
  {
    "id": "carpincho-relax",
    "name": "Carpincho Relax",
    "slug": "carpincho-relax",
    "price": 39,
    "category": "Muñecos",
    "size": "Mediano",
    "description": "Carpincho (Capibara) relajado con una mandarina en la cabeza.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Best Seller"
    ],
    "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuAiE879aKAW4oJ10pJMbOcuc1p9gCtT8ohgnN-R71U1EDMnEkZu1pF16KQx4YppRKRmKNkOMm9_Ox31Zy4R6HY3z3Llpn6Btiizcn3YcZRs4nrqfvGYniB4pDqR-glpj8_6jpRvBK6xSdTitWd_6gEYXgFR9hRVgIzy5bwCBOh97UmHpEkXXVDEoeApLc3RWJcma_bKMvXJIWbt2sLTTN31Tx8IihPHBcBre2diF2tqzxPsQP9NqT2U-sFN_NG9OW6QWxmmEJ7l2-k",
    "rating": 4.8,
    "reviews": 134,
    "searchKeywords": [
      "carpincho relax",
      "muñecos",
      "mediano",
      "best seller"
    ]
  },
  {
    "id": "pulpo-reversible",
    "name": "Pulpo Reversible",
    "slug": "pulpo-reversible",
    "price": 22,
    "category": "Muñecos",
    "size": "Mini",
    "description": "Pulpo de dos emociones expresivas al voltearlo.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Popular"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1686151573986-03b5a79f22a5?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.9,
    "reviews": 141,
    "searchKeywords": [
      "pulpo reversible",
      "muñecos",
      "mini",
      "popular"
    ]
  },
  {
    "id": "erizo-espinoso",
    "name": "Erizo Espinoso",
    "slug": "erizo-espinoso",
    "price": 29,
    "category": "Muñecos",
    "size": "Mediano",
    "description": "Erizo tierno con lomo texturizado suave.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Nuevo"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 5,
    "reviews": 148,
    "searchKeywords": [
      "erizo espinoso",
      "muñecos",
      "mediano",
      "nuevo"
    ]
  },
  {
    "id": "girasol-en-maceta",
    "name": "Girasol en Maceta",
    "slug": "girasol-en-maceta",
    "price": 22,
    "category": "Decoración",
    "size": "Mediano",
    "description": "Girasol radiante tejido en macetita de terracota.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Best Seller"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1558060370-d644479be6e7?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.6,
    "reviews": 155,
    "searchKeywords": [
      "girasol en maceta",
      "decoración",
      "mediano",
      "best seller"
    ]
  },
  {
    "id": "cactus-florecido",
    "name": "Cactus Florecido",
    "slug": "cactus-florecido",
    "price": 18,
    "category": "Decoración",
    "size": "Mini",
    "description": "Cactus en espiral con flor rosada en la punta.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Popular"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1534447677768-be436bb09401?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.7,
    "reviews": 162,
    "searchKeywords": [
      "cactus florecido",
      "decoración",
      "mini",
      "popular"
    ]
  },
  {
    "id": "suculenta-jade",
    "name": "Suculenta Jade",
    "slug": "suculenta-jade",
    "price": 19,
    "category": "Decoración",
    "size": "Mini",
    "description": "Suculenta en tonos verde jade en maceta tejida.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Nuevo"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.8,
    "reviews": 169,
    "searchKeywords": [
      "suculenta jade",
      "decoración",
      "mini",
      "nuevo"
    ]
  },
  {
    "id": "movil-estelar-cuna",
    "name": "Móvil Estelar Cuna",
    "slug": "movil-estelar-cuna",
    "price": 48,
    "category": "Decoración",
    "size": "Grande",
    "description": "Móvil colgante con nubes, estrellas y luna sonrientes.",
    "materials": "100% Algodón Orgánico Hipoalergénico + Relleno Antialérgico",
    "tags": [
      "Bebé"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1563170351-be82bc888aa4?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.9,
    "reviews": 176,
    "searchKeywords": [
      "móvil estelar cuna",
      "decoración",
      "grande",
      "bebé"
    ]
  },
  {
    "id": "guirnalda-de-hojas",
    "name": "Guirnalda de Hojas",
    "slug": "guirnalda-de-hojas",
    "price": 25,
    "category": "Decoración",
    "size": "Grande",
    "description": "Guirnalda tejida con 12 hojas botánicas de otoño.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Nuevo"
    ],
    "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuAl3N2_Uphmn6Pqvfi0INnwVm8HPvyyhKhctRW_by89CkhN12bA06eRaB7oMKrv2ko0gBArMGLIxdWpktm7IfNu-J455T49N2f7sD8E1n4uTwHDDDPtRpTzo3DZzgKniYE_Fyep3trvq0hHqiUP3O82F--HFSPVl4fdrA5andRyGTlF_ChobNdCUDB15Pa0SO4ahCjSzOTb0eUhg3Eea80XC972DXDKaedGQdRNZRGL8l1OftmN8dQSVdiDRwF8I0kpwFdMHHM4SUw",
    "rating": 5,
    "reviews": 183,
    "searchKeywords": [
      "guirnalda de hojas",
      "decoración",
      "grande",
      "nuevo"
    ]
  },
  {
    "id": "monstera-en-maceta",
    "name": "Monstera en Maceta",
    "slug": "monstera-en-maceta",
    "price": 26,
    "category": "Decoración",
    "size": "Mediano",
    "description": "Planta monstera deliciosa tejida punto a punto.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Favorito"
    ],
    "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuAiE879aKAW4oJ10pJMbOcuc1p9gCtT8ohgnN-R71U1EDMnEkZu1pF16KQx4YppRKRmKNkOMm9_Ox31Zy4R6HY3z3Llpn6Btiizcn3YcZRs4nrqfvGYniB4pDqR-glpj8_6jpRvBK6xSdTitWd_6gEYXgFR9hRVgIzy5bwCBOh97UmHpEkXXVDEoeApLc3RWJcma_bKMvXJIWbt2sLTTN31Tx8IihPHBcBre2diF2tqzxPsQP9NqT2U-sFN_NG9OW6QWxmmEJ7l2-k",
    "rating": 4.6,
    "reviews": 190,
    "searchKeywords": [
      "monstera en maceta",
      "decoración",
      "mediano",
      "favorito"
    ]
  },
  {
    "id": "tulipan-eterno-rosa",
    "name": "Tulipán Eterno Rosa",
    "slug": "tulipan-eterno-rosa",
    "price": 16,
    "category": "Decoración",
    "size": "Mini",
    "description": "Tulipán tejido en vara con hoja verde.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Regalo"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1686151573986-03b5a79f22a5?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.7,
    "reviews": 17,
    "searchKeywords": [
      "tulipán eterno rosa",
      "decoración",
      "mini",
      "regalo"
    ]
  },
  {
    "id": "champinon-magico",
    "name": "Champiñón Mágico",
    "slug": "champinon-magico",
    "price": 21,
    "category": "Decoración",
    "size": "Mediano",
    "description": "Hongo amamanita rojo con lunares blancos.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Popular"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.8,
    "reviews": 24,
    "searchKeywords": [
      "champiñón mágico",
      "decoración",
      "mediano",
      "popular"
    ]
  },
  {
    "id": "cojin-carita-feliz",
    "name": "Cojín Carita Feliz",
    "slug": "cojin-carita-feliz",
    "price": 35,
    "category": "Decoración",
    "size": "Grande",
    "description": "Cojín redondo amarillo sonriente en punto grueso.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Nuevo"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1558060370-d644479be6e7?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.9,
    "reviews": 31,
    "searchKeywords": [
      "cojín carita feliz",
      "decoración",
      "grande",
      "nuevo"
    ]
  },
  {
    "id": "atrapasuenos-de-lana",
    "name": "Atrapasueños de Lana",
    "slug": "atrapasuenos-de-lana",
    "price": 30,
    "category": "Decoración",
    "size": "Grande",
    "description": "Atrapasueños tejido con plumas de hilo y cuentas.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Favorito"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1534447677768-be436bb09401?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 5,
    "reviews": 38,
    "searchKeywords": [
      "atrapasueños de lana",
      "decoración",
      "grande",
      "favorito"
    ]
  },
  {
    "id": "lavanda-en-ramillete",
    "name": "Lavanda en Ramillete",
    "slug": "lavanda-en-ramillete",
    "price": 23,
    "category": "Decoración",
    "size": "Mediano",
    "description": "Ramillete de lavanda mora con lazo de yute.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Regalo"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.6,
    "reviews": 45,
    "searchKeywords": [
      "lavanda en ramillete",
      "decoración",
      "mediano",
      "regalo"
    ]
  },
  {
    "id": "flor-de-loto-paz",
    "name": "Flor de Loto Paz",
    "slug": "flor-de-loto-paz",
    "price": 27,
    "category": "Decoración",
    "size": "Mediano",
    "description": "Loto blanco y rosado sobre base de agua tejida.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Limitado"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1563170351-be82bc888aa4?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.7,
    "reviews": 52,
    "searchKeywords": [
      "flor de loto paz",
      "decoración",
      "mediano",
      "limitado"
    ]
  },
  {
    "id": "calabaza-de-otono",
    "name": "Calabaza de Otoño",
    "slug": "calabaza-de-otono",
    "price": 20,
    "category": "Decoración",
    "size": "Mediano",
    "description": "Calabaza anaranjada con tallo de madera.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Popular"
    ],
    "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuAl3N2_Uphmn6Pqvfi0INnwVm8HPvyyhKhctRW_by89CkhN12bA06eRaB7oMKrv2ko0gBArMGLIxdWpktm7IfNu-J455T49N2f7sD8E1n4uTwHDDDPtRpTzo3DZzgKniYE_Fyep3trvq0hHqiUP3O82F--HFSPVl4fdrA5andRyGTlF_ChobNdCUDB15Pa0SO4ahCjSzOTb0eUhg3Eea80XC972DXDKaedGQdRNZRGL8l1OftmN8dQSVdiDRwF8I0kpwFdMHHM4SUw",
    "rating": 4.8,
    "reviews": 59,
    "searchKeywords": [
      "calabaza de otoño",
      "decoración",
      "mediano",
      "popular"
    ]
  },
  {
    "id": "cuadro-botanico-hilo",
    "name": "Cuadro Botánico Hilo",
    "slug": "cuadro-botanico-hilo",
    "price": 40,
    "category": "Decoración",
    "size": "Grande",
    "description": "Bastidor de bordado con flores amigurumi en relieve.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Limitado"
    ],
    "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuAiE879aKAW4oJ10pJMbOcuc1p9gCtT8ohgnN-R71U1EDMnEkZu1pF16KQx4YppRKRmKNkOMm9_Ox31Zy4R6HY3z3Llpn6Btiizcn3YcZRs4nrqfvGYniB4pDqR-glpj8_6jpRvBK6xSdTitWd_6gEYXgFR9hRVgIzy5bwCBOh97UmHpEkXXVDEoeApLc3RWJcma_bKMvXJIWbt2sLTTN31Tx8IihPHBcBre2diF2tqzxPsQP9NqT2U-sFN_NG9OW6QWxmmEJ7l2-k",
    "rating": 4.9,
    "reviews": 66,
    "searchKeywords": [
      "cuadro botánico hilo",
      "decoración",
      "grande",
      "limitado"
    ]
  },
  {
    "id": "lampara-nube-quilt",
    "name": "Lámpara Nube Quilt",
    "slug": "lampara-nube-quilt",
    "price": 52,
    "category": "Decoración",
    "size": "Grande",
    "description": "Nube afelpada con luces LED internas y gotas.",
    "materials": "100% Algodón Orgánico Hipoalergénico + Relleno Antialérgico",
    "tags": [
      "Bebé"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1686151573986-03b5a79f22a5?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 5,
    "reviews": 73,
    "searchKeywords": [
      "lámpara nube quilt",
      "decoración",
      "grande",
      "bebé"
    ]
  },
  {
    "id": "gorrito-oso-bebe",
    "name": "Gorrito Oso Bebé",
    "slug": "gorrito-oso-bebe",
    "price": 25,
    "category": "Accesorios",
    "size": "Mediano",
    "description": "Gorro afelpado con orejitas de oso para bebé.",
    "materials": "100% Algodón Orgánico Hipoalergénico + Relleno Antialérgico",
    "tags": [
      "Bebé"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.6,
    "reviews": 80,
    "searchKeywords": [
      "gorrito oso bebé",
      "accesorios",
      "mediano",
      "bebé"
    ]
  },
  {
    "id": "bolso-margarita",
    "name": "Bolso Margarita",
    "slug": "bolso-margarita",
    "price": 38,
    "category": "Accesorios",
    "size": "Grande",
    "description": "Bolso de mano estilo tote tejido con margaritas.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Best Seller"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1558060370-d644479be6e7?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.7,
    "reviews": 87,
    "searchKeywords": [
      "bolso margarita",
      "accesorios",
      "grande",
      "best seller"
    ]
  },
  {
    "id": "estuche-gatito-zipper",
    "name": "Estuche Gatito Zipper",
    "slug": "estuche-gatito-zipper",
    "price": 20,
    "category": "Accesorios",
    "size": "Mediano",
    "description": "Cartuchera tejida con carita de gato y cierre.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Popular"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1534447677768-be436bb09401?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.8,
    "reviews": 94,
    "searchKeywords": [
      "estuche gatito zipper",
      "accesorios",
      "mediano",
      "popular"
    ]
  },
  {
    "id": "bufanda-infinita-teja",
    "name": "Bufanda Infinita Teja",
    "slug": "bufanda-infinita-teja",
    "price": 32,
    "category": "Accesorios",
    "size": "Grande",
    "description": "Bufanda cuello cerrado en punto espiga.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Favorito"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.9,
    "reviews": 101,
    "searchKeywords": [
      "bufanda infinita teja",
      "accesorios",
      "grande",
      "favorito"
    ]
  },
  {
    "id": "diadema-orejas-de-gato",
    "name": "Diadema Orejas de Gato",
    "slug": "diadema-orejas-de-gato",
    "price": 15,
    "category": "Accesorios",
    "size": "Mini",
    "description": "Cinta para el cabello con orejitas tejidas.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Nuevo"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1563170351-be82bc888aa4?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 5,
    "reviews": 108,
    "searchKeywords": [
      "diadema orejas de gato",
      "accesorios",
      "mini",
      "nuevo"
    ]
  },
  {
    "id": "llavero-monedero-fresa",
    "name": "Llavero Monedero Fresa",
    "slug": "llavero-monedero-fresa",
    "price": 14,
    "category": "Accesorios",
    "size": "Mini",
    "description": "Pequeño monedero en forma de fresa jugosa.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Regalo"
    ],
    "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuAl3N2_Uphmn6Pqvfi0INnwVm8HPvyyhKhctRW_by89CkhN12bA06eRaB7oMKrv2ko0gBArMGLIxdWpktm7IfNu-J455T49N2f7sD8E1n4uTwHDDDPtRpTzo3DZzgKniYE_Fyep3trvq0hHqiUP3O82F--HFSPVl4fdrA5andRyGTlF_ChobNdCUDB15Pa0SO4ahCjSzOTb0eUhg3Eea80XC972DXDKaedGQdRNZRGL8l1OftmN8dQSVdiDRwF8I0kpwFdMHHM4SUw",
    "rating": 4.6,
    "reviews": 115,
    "searchKeywords": [
      "llavero monedero fresa",
      "accesorios",
      "mini",
      "regalo"
    ]
  },
  {
    "id": "manta-de-bebe-punto",
    "name": "Manta de Bebé Punto",
    "slug": "manta-de-bebe-punto",
    "price": 65,
    "category": "Accesorios",
    "size": "Grande",
    "description": "Manta suave en pasteles 100% algodón orgánico.",
    "materials": "100% Algodón Orgánico Hipoalergénico + Relleno Antialérgico",
    "tags": [
      "Bebé"
    ],
    "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuAiE879aKAW4oJ10pJMbOcuc1p9gCtT8ohgnN-R71U1EDMnEkZu1pF16KQx4YppRKRmKNkOMm9_Ox31Zy4R6HY3z3Llpn6Btiizcn3YcZRs4nrqfvGYniB4pDqR-glpj8_6jpRvBK6xSdTitWd_6gEYXgFR9hRVgIzy5bwCBOh97UmHpEkXXVDEoeApLc3RWJcma_bKMvXJIWbt2sLTTN31Tx8IihPHBcBre2diF2tqzxPsQP9NqT2U-sFN_NG9OW6QWxmmEJ7l2-k",
    "rating": 4.7,
    "reviews": 122,
    "searchKeywords": [
      "manta de bebé punto",
      "accesorios",
      "grande",
      "bebé"
    ]
  },
  {
    "id": "coletero-scrunchie-lana",
    "name": "Coletero Scrunchie Lana",
    "slug": "coletero-scrunchie-lana",
    "price": 8,
    "category": "Accesorios",
    "size": "Mini",
    "description": "Scrunchie abombado tejido para el cabello.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Popular"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1686151573986-03b5a79f22a5?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.8,
    "reviews": 129,
    "searchKeywords": [
      "coletero scrunchie lana",
      "accesorios",
      "mini",
      "popular"
    ]
  },
  {
    "id": "sujetador-de-lentes-flor",
    "name": "Sujetador de Lentes Flor",
    "slug": "sujetador-de-lentes-flor",
    "price": 12,
    "category": "Accesorios",
    "size": "Mini",
    "description": "Cordón para gafas con florecitas tejidas.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Nuevo"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.9,
    "reviews": 136,
    "searchKeywords": [
      "sujetador de lentes flor",
      "accesorios",
      "mini",
      "nuevo"
    ]
  },
  {
    "id": "funda-para-taza-te",
    "name": "Funda para Taza Té",
    "slug": "funda-para-taza-te",
    "price": 11,
    "category": "Accesorios",
    "size": "Mini",
    "description": "Abrazadera para pocillo con botón de madera.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Regalo"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1558060370-d644479be6e7?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 5,
    "reviews": 143,
    "searchKeywords": [
      "funda para taza té",
      "accesorios",
      "mini",
      "regalo"
    ]
  },
  {
    "id": "mitones-sin-dedos",
    "name": "Mitones Sin Dedos",
    "slug": "mitones-sin-dedos",
    "price": 24,
    "category": "Accesorios",
    "size": "Mediano",
    "description": "Guantes sin dedos con bordado de corazón.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Favorito"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1534447677768-be436bb09401?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.6,
    "reviews": 150,
    "searchKeywords": [
      "mitones sin dedos",
      "accesorios",
      "mediano",
      "favorito"
    ]
  },
  {
    "id": "pantuflas-conejito",
    "name": "Pantuflas Conejito",
    "slug": "pantuflas-conejito",
    "price": 34,
    "category": "Accesorios",
    "size": "Grande",
    "description": "Pantuflas abrigadoras para casa con orejas de conejo.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Limitado"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.7,
    "reviews": 157,
    "searchKeywords": [
      "pantuflas conejito",
      "accesorios",
      "grande",
      "limitado"
    ]
  },
  {
    "id": "llavero-palta-aguacate",
    "name": "Llavero Palta / Aguacate",
    "slug": "llavero-palta-aguacate",
    "price": 12,
    "category": "Llaveros",
    "size": "Mini",
    "description": "Mini aguacate sonriente con carozo en relieve.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Best Seller"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1563170351-be82bc888aa4?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.8,
    "reviews": 164,
    "searchKeywords": [
      "llavero palta / aguacate",
      "llaveros",
      "mini",
      "best seller"
    ]
  },
  {
    "id": "llavero-abejita",
    "name": "Llavero Abejita",
    "slug": "llavero-abejita",
    "price": 11,
    "category": "Llaveros",
    "size": "Mini",
    "description": "Abejita amarilla y negra con alitas blancas.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Best Seller"
    ],
    "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuAl3N2_Uphmn6Pqvfi0INnwVm8HPvyyhKhctRW_by89CkhN12bA06eRaB7oMKrv2ko0gBArMGLIxdWpktm7IfNu-J455T49N2f7sD8E1n4uTwHDDDPtRpTzo3DZzgKniYE_Fyep3trvq0hHqiUP3O82F--HFSPVl4fdrA5andRyGTlF_ChobNdCUDB15Pa0SO4ahCjSzOTb0eUhg3Eea80XC972DXDKaedGQdRNZRGL8l1OftmN8dQSVdiDRwF8I0kpwFdMHHM4SUw",
    "rating": 4.9,
    "reviews": 171,
    "searchKeywords": [
      "llavero abejita",
      "llaveros",
      "mini",
      "best seller"
    ]
  },
  {
    "id": "llavero-boba-tea",
    "name": "Llavero Boba Tea",
    "slug": "llavero-boba-tea",
    "price": 13,
    "category": "Llaveros",
    "size": "Mini",
    "description": "Vaso de té de boba con sorbete e hilitos de perlitas.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Popular"
    ],
    "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuAiE879aKAW4oJ10pJMbOcuc1p9gCtT8ohgnN-R71U1EDMnEkZu1pF16KQx4YppRKRmKNkOMm9_Ox31Zy4R6HY3z3Llpn6Btiizcn3YcZRs4nrqfvGYniB4pDqR-glpj8_6jpRvBK6xSdTitWd_6gEYXgFR9hRVgIzy5bwCBOh97UmHpEkXXVDEoeApLc3RWJcma_bKMvXJIWbt2sLTTN31Tx8IihPHBcBre2diF2tqzxPsQP9NqT2U-sFN_NG9OW6QWxmmEJ7l2-k",
    "rating": 5,
    "reviews": 178,
    "searchKeywords": [
      "llavero boba tea",
      "llaveros",
      "mini",
      "popular"
    ]
  },
  {
    "id": "llavero-fantasmita",
    "name": "Llavero Fantasmita",
    "slug": "llavero-fantasmita",
    "price": 10,
    "category": "Llaveros",
    "size": "Mini",
    "description": "Fantasma tierno y suave con sonrosado.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Nuevo"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1686151573986-03b5a79f22a5?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.6,
    "reviews": 185,
    "searchKeywords": [
      "llavero fantasmita",
      "llaveros",
      "mini",
      "nuevo"
    ]
  },
  {
    "id": "llavero-corazon-puro",
    "name": "Llavero Corazón Puro",
    "slug": "llavero-corazon-puro",
    "price": 9,
    "category": "Llaveros",
    "size": "Mini",
    "description": "Corazón pulposo en rojo pasión con aro metal.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Regalo"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.7,
    "reviews": 192,
    "searchKeywords": [
      "llavero corazón puro",
      "llaveros",
      "mini",
      "regalo"
    ]
  },
  {
    "id": "llavero-dinosaurio-bebe",
    "name": "Llavero Dinosaurio Bebé",
    "slug": "llavero-dinosaurio-bebe",
    "price": 14,
    "category": "Llaveros",
    "size": "Mini",
    "description": "Mini diplodocus verde con ojitos de seguridad.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Popular"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1558060370-d644479be6e7?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.8,
    "reviews": 19,
    "searchKeywords": [
      "llavero dinosaurio bebé",
      "llaveros",
      "mini",
      "popular"
    ]
  },
  {
    "id": "llavero-donut-glaseada",
    "name": "Llavero Donut Glaseada",
    "slug": "llavero-donut-glaseada",
    "price": 10,
    "category": "Llaveros",
    "size": "Mini",
    "description": "Rosquillita tejida con chispas de colores.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Nuevo"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1534447677768-be436bb09401?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.9,
    "reviews": 26,
    "searchKeywords": [
      "llavero donut glaseada",
      "llaveros",
      "mini",
      "nuevo"
    ]
  },
  {
    "id": "llavero-ballena-azul",
    "name": "Llavero Ballena Azul",
    "slug": "llavero-ballena-azul",
    "price": 12,
    "category": "Llaveros",
    "size": "Mini",
    "description": "Ballenita feliz con panza blanca.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Favorito"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 5,
    "reviews": 33,
    "searchKeywords": [
      "llavero ballena azul",
      "llaveros",
      "mini",
      "favorito"
    ]
  },
  {
    "id": "llavero-sol-radiante",
    "name": "Llavero Sol Radiante",
    "slug": "llavero-sol-radiante",
    "price": 11,
    "category": "Llaveros",
    "size": "Mini",
    "description": "Sol radiante amarillo con mejillas rosas.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Regalo"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1563170351-be82bc888aa4?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.6,
    "reviews": 40,
    "searchKeywords": [
      "llavero sol radiante",
      "llaveros",
      "mini",
      "regalo"
    ]
  },
  {
    "id": "llavero-caracolito",
    "name": "Llavero Caracolito",
    "slug": "llavero-caracolito",
    "price": 10,
    "category": "Llaveros",
    "size": "Mini",
    "description": "Caracol con caparazón en espiral multicolor.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Nuevo"
    ],
    "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuAl3N2_Uphmn6Pqvfi0INnwVm8HPvyyhKhctRW_by89CkhN12bA06eRaB7oMKrv2ko0gBArMGLIxdWpktm7IfNu-J455T49N2f7sD8E1n4uTwHDDDPtRpTzo3DZzgKniYE_Fyep3trvq0hHqiUP3O82F--HFSPVl4fdrA5andRyGTlF_ChobNdCUDB15Pa0SO4ahCjSzOTb0eUhg3Eea80XC972DXDKaedGQdRNZRGL8l1OftmN8dQSVdiDRwF8I0kpwFdMHHM4SUw",
    "rating": 4.7,
    "reviews": 47,
    "searchKeywords": [
      "llavero caracolito",
      "llaveros",
      "mini",
      "nuevo"
    ]
  },
  {
    "id": "llavero-hongo-amanita",
    "name": "Llavero Hongo Amanita",
    "slug": "llavero-hongo-amanita",
    "price": 11,
    "category": "Llaveros",
    "size": "Mini",
    "description": "Hongo rojo miniatura para llaves o mochila.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Popular"
    ],
    "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuAiE879aKAW4oJ10pJMbOcuc1p9gCtT8ohgnN-R71U1EDMnEkZu1pF16KQx4YppRKRmKNkOMm9_Ox31Zy4R6HY3z3Llpn6Btiizcn3YcZRs4nrqfvGYniB4pDqR-glpj8_6jpRvBK6xSdTitWd_6gEYXgFR9hRVgIzy5bwCBOh97UmHpEkXXVDEoeApLc3RWJcma_bKMvXJIWbt2sLTTN31Tx8IihPHBcBre2diF2tqzxPsQP9NqT2U-sFN_NG9OW6QWxmmEJ7l2-k",
    "rating": 4.8,
    "reviews": 54,
    "searchKeywords": [
      "llavero hongo amanita",
      "llaveros",
      "mini",
      "popular"
    ]
  },
  {
    "id": "llavero-panda-minifigura",
    "name": "Llavero Panda Minifigura",
    "slug": "llavero-panda-minifigura",
    "price": 13,
    "category": "Llaveros",
    "size": "Mini",
    "description": "Oso panda comiendo una hojita de bambú.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Best Seller"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1686151573986-03b5a79f22a5?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.9,
    "reviews": 61,
    "searchKeywords": [
      "llavero panda minifigura",
      "llaveros",
      "mini",
      "best seller"
    ]
  },
  {
    "id": "llavero-cereza-par",
    "name": "Llavero Cereza Par",
    "slug": "llavero-cereza-par",
    "price": 12,
    "category": "Llaveros",
    "size": "Mini",
    "description": "Par de cerezas rojas unidas por tallo verde.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Regalo"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 5,
    "reviews": 68,
    "searchKeywords": [
      "llavero cereza par",
      "llaveros",
      "mini",
      "regalo"
    ]
  },
  {
    "id": "llavero-galleta-choco",
    "name": "Llavero Galleta Choco",
    "slug": "llavero-galleta-choco",
    "price": 10,
    "category": "Llaveros",
    "size": "Mini",
    "description": "Galleta de chispas de chocolate amigurumi.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Nuevo"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1558060370-d644479be6e7?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.6,
    "reviews": 75,
    "searchKeywords": [
      "llavero galleta choco",
      "llaveros",
      "mini",
      "nuevo"
    ]
  },
  {
    "id": "llavero-estrella-fugaz",
    "name": "Llavero Estrella Fugaz",
    "slug": "llavero-estrella-fugaz",
    "price": 11,
    "category": "Llaveros",
    "size": "Mini",
    "description": "Estrella amarilla con cola de hilos de arcoíris.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Favorito"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1534447677768-be436bb09401?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.7,
    "reviews": 82,
    "searchKeywords": [
      "llavero estrella fugaz",
      "llaveros",
      "mini",
      "favorito"
    ]
  },
  {
    "id": "santa-claus-artesanal",
    "name": "Santa Claus Artesanal",
    "slug": "santa-claus-artesanal",
    "price": 36,
    "category": "Navideño",
    "size": "Mediano",
    "description": "Papá Noel tejido con barba blanca e hilo brillante.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Navideño"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.8,
    "reviews": 89,
    "searchKeywords": [
      "santa claus artesanal",
      "navideño",
      "mediano",
      "navideño"
    ]
  },
  {
    "id": "muneco-de-nieve-nieve",
    "name": "Muñeco de Nieve Nieve",
    "slug": "muneco-de-nieve-nieve",
    "price": 28,
    "category": "Navideño",
    "size": "Mediano",
    "description": "Muñeco de nieve con bufanda roja y nariz de zanahoria.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Navideño"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1563170351-be82bc888aa4?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.9,
    "reviews": 96,
    "searchKeywords": [
      "muñeco de nieve nieve",
      "navideño",
      "mediano",
      "navideño"
    ]
  },
  {
    "id": "reno-rodolfo",
    "name": "Reno Rodolfo",
    "slug": "reno-rodolfo",
    "price": 32,
    "category": "Navideño",
    "size": "Mediano",
    "description": "Reno café con nariz roja brillante y astas de felpa.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Navideño"
    ],
    "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuAl3N2_Uphmn6Pqvfi0INnwVm8HPvyyhKhctRW_by89CkhN12bA06eRaB7oMKrv2ko0gBArMGLIxdWpktm7IfNu-J455T49N2f7sD8E1n4uTwHDDDPtRpTzo3DZzgKniYE_Fyep3trvq0hHqiUP3O82F--HFSPVl4fdrA5andRyGTlF_ChobNdCUDB15Pa0SO4ahCjSzOTb0eUhg3Eea80XC972DXDKaedGQdRNZRGL8l1OftmN8dQSVdiDRwF8I0kpwFdMHHM4SUw",
    "rating": 5,
    "reviews": 103,
    "searchKeywords": [
      "reno rodolfo",
      "navideño",
      "mediano",
      "navideño"
    ]
  },
  {
    "id": "arbol-de-navidad-mini",
    "name": "Árbol de Navidad Mini",
    "slug": "arbol-de-navidad-mini",
    "price": 24,
    "category": "Navideño",
    "size": "Mediano",
    "description": "Pinito navideño con esferas tejidas y estrella.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Navideño"
    ],
    "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuAiE879aKAW4oJ10pJMbOcuc1p9gCtT8ohgnN-R71U1EDMnEkZu1pF16KQx4YppRKRmKNkOMm9_Ox31Zy4R6HY3z3Llpn6Btiizcn3YcZRs4nrqfvGYniB4pDqR-glpj8_6jpRvBK6xSdTitWd_6gEYXgFR9hRVgIzy5bwCBOh97UmHpEkXXVDEoeApLc3RWJcma_bKMvXJIWbt2sLTTN31Tx8IihPHBcBre2diF2tqzxPsQP9NqT2U-sFN_NG9OW6QWxmmEJ7l2-k",
    "rating": 4.6,
    "reviews": 110,
    "searchKeywords": [
      "árbol de navidad mini",
      "navideño",
      "mediano",
      "navideño"
    ]
  },
  {
    "id": "elfo-ayudante",
    "name": "Elfo Ayudante",
    "slug": "elfo-ayudante",
    "price": 30,
    "category": "Navideño",
    "size": "Mediano",
    "description": "Duende navideño con cascabel en el gorro.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Navideño"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1686151573986-03b5a79f22a5?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.7,
    "reviews": 117,
    "searchKeywords": [
      "elfo ayudante",
      "navideño",
      "mediano",
      "navideño"
    ]
  },
  {
    "id": "casita-de-jengibre",
    "name": "Casita de Jengibre",
    "slug": "casita-de-jengibre",
    "price": 34,
    "category": "Navideño",
    "size": "Mediano",
    "description": "Casita tejida con detalles de glaseado de hilo blanco.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Navideño"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.8,
    "reviews": 124,
    "searchKeywords": [
      "casita de jengibre",
      "navideño",
      "mediano",
      "navideño"
    ]
  },
  {
    "id": "estrella-de-belen",
    "name": "Estrella de Belén",
    "slug": "estrella-de-belen",
    "price": 18,
    "category": "Navideño",
    "size": "Mini",
    "description": "Estrella dorada acolchada para punta de árbol.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Navideño"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1558060370-d644479be6e7?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.9,
    "reviews": 131,
    "searchKeywords": [
      "estrella de belén",
      "navideño",
      "mini",
      "navideño"
    ]
  },
  {
    "id": "angelito-de-paz",
    "name": "Angelito de Paz",
    "slug": "angelito-de-paz",
    "price": 26,
    "category": "Navideño",
    "size": "Mediano",
    "description": "Ángel tejido con alas caladas y aureola dorada.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Navideño"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1534447677768-be436bb09401?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 5,
    "reviews": 138,
    "searchKeywords": [
      "angelito de paz",
      "navideño",
      "mediano",
      "navideño"
    ]
  },
  {
    "id": "bota-navidena-tejida",
    "name": "Bota Navideña Tejida",
    "slug": "bota-navidena-tejida",
    "price": 22,
    "category": "Navideño",
    "size": "Grande",
    "description": "Calcetín para chimenea con borde abombado.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Navideño"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.6,
    "reviews": 145,
    "searchKeywords": [
      "bota navideña tejida",
      "navideño",
      "grande",
      "navideño"
    ]
  },
  {
    "id": "grinch-sonriente",
    "name": "Grinch Sonriente",
    "slug": "grinch-sonriente",
    "price": 38,
    "category": "Navideño",
    "size": "Grande",
    "description": "Duende verde travieso con traje rojo de Navidad.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Navideño"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1563170351-be82bc888aa4?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.7,
    "reviews": 152,
    "searchKeywords": [
      "grinch sonriente",
      "navideño",
      "grande",
      "navideño"
    ]
  },
  {
    "id": "sonajero-jirafa-rafa",
    "name": "Sonajero Jirafa Rafa",
    "slug": "sonajero-jirafa-rafa",
    "price": 22,
    "category": "Infantil",
    "size": "Mediano",
    "description": "Sonajero de madera con cabeza de jirafa tejida.",
    "materials": "100% Algodón Orgánico Hipoalergénico + Relleno Antialérgico",
    "tags": [
      "Bebé"
    ],
    "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuAl3N2_Uphmn6Pqvfi0INnwVm8HPvyyhKhctRW_by89CkhN12bA06eRaB7oMKrv2ko0gBArMGLIxdWpktm7IfNu-J455T49N2f7sD8E1n4uTwHDDDPtRpTzo3DZzgKniYE_Fyep3trvq0hHqiUP3O82F--HFSPVl4fdrA5andRyGTlF_ChobNdCUDB15Pa0SO4ahCjSzOTb0eUhg3Eea80XC972DXDKaedGQdRNZRGL8l1OftmN8dQSVdiDRwF8I0kpwFdMHHM4SUw",
    "rating": 4.8,
    "reviews": 159,
    "searchKeywords": [
      "sonajero jirafa rafa",
      "infantil",
      "mediano",
      "bebé"
    ]
  },
  {
    "id": "doudou-mantita-oso",
    "name": "Doudou Mantita Oso",
    "slug": "doudou-mantita-oso",
    "price": 29,
    "category": "Infantil",
    "size": "Grande",
    "description": "Manta de apego suave con cabecita de oso.",
    "materials": "100% Algodón Orgánico Hipoalergénico + Relleno Antialérgico",
    "tags": [
      "Bebé"
    ],
    "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuAiE879aKAW4oJ10pJMbOcuc1p9gCtT8ohgnN-R71U1EDMnEkZu1pF16KQx4YppRKRmKNkOMm9_Ox31Zy4R6HY3z3Llpn6Btiizcn3YcZRs4nrqfvGYniB4pDqR-glpj8_6jpRvBK6xSdTitWd_6gEYXgFR9hRVgIzy5bwCBOh97UmHpEkXXVDEoeApLc3RWJcma_bKMvXJIWbt2sLTTN31Tx8IihPHBcBre2diF2tqzxPsQP9NqT2U-sFN_NG9OW6QWxmmEJ7l2-k",
    "rating": 4.9,
    "reviews": 166,
    "searchKeywords": [
      "doudou mantita oso",
      "infantil",
      "grande",
      "bebé"
    ]
  },
  {
    "id": "sonajero-conejito-aro",
    "name": "Sonajero Conejito Aro",
    "slug": "sonajero-conejito-aro",
    "price": 20,
    "category": "Infantil",
    "size": "Mini",
    "description": "Aro de madera natural con sonajero de conejo.",
    "materials": "100% Algodón Orgánico Hipoalergénico + Relleno Antialérgico",
    "tags": [
      "Bebé"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1686151573986-03b5a79f22a5?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 5,
    "reviews": 173,
    "searchKeywords": [
      "sonajero conejito aro",
      "infantil",
      "mini",
      "bebé"
    ]
  },
  {
    "id": "cilindro-sensorial",
    "name": "Cilindro Sensorial",
    "slug": "cilindro-sensorial",
    "price": 24,
    "category": "Infantil",
    "size": "Mediano",
    "description": "Rodillo tejido de colores con cascabeles seguros.",
    "materials": "100% Algodón Orgánico Hipoalergénico + Relleno Antialérgico",
    "tags": [
      "Bebé"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.6,
    "reviews": 180,
    "searchKeywords": [
      "cilindro sensorial",
      "infantil",
      "mediano",
      "bebé"
    ]
  },
  {
    "id": "gimnasio-colgante-mar",
    "name": "Gimnasio Colgante Mar",
    "slug": "gimnasio-colgante-mar",
    "price": 42,
    "category": "Infantil",
    "size": "Grande",
    "description": "Set de 3 figuras marinas tejidas para gimnasio de bebé.",
    "materials": "100% Algodón Orgánico Hipoalergénico + Relleno Antialérgico",
    "tags": [
      "Bebé"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1558060370-d644479be6e7?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.7,
    "reviews": 187,
    "searchKeywords": [
      "gimnasio colgante mar",
      "infantil",
      "grande",
      "bebé"
    ]
  },
  {
    "id": "conejito-de-apego",
    "name": "Conejito de Apego",
    "slug": "conejito-de-apego",
    "price": 26,
    "category": "Infantil",
    "size": "Mediano",
    "description": "Muñeco de apego ultra suave en algodón pastel.",
    "materials": "100% Algodón Orgánico Hipoalergénico + Relleno Antialérgico",
    "tags": [
      "Bebé"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1534447677768-be436bb09401?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.8,
    "reviews": 194,
    "searchKeywords": [
      "conejito de apego",
      "infantil",
      "mediano",
      "bebé"
    ]
  },
  {
    "id": "sonajero-leon-valiente",
    "name": "Sonajero León Valiente",
    "slug": "sonajero-leon-valiente",
    "price": 23,
    "category": "Infantil",
    "size": "Mediano",
    "description": "Sonajero con melena de hilo afelpado y aro de haya.",
    "materials": "100% Algodón Orgánico Hipoalergénico + Relleno Antialérgico",
    "tags": [
      "Bebé"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.9,
    "reviews": 21,
    "searchKeywords": [
      "sonajero león valiente",
      "infantil",
      "mediano",
      "bebé"
    ]
  },
  {
    "id": "chupetero-nombre-hilo",
    "name": "Chupetero Nombre Hilo",
    "slug": "chupetero-nombre-hilo",
    "price": 16,
    "category": "Infantil",
    "size": "Mini",
    "description": "Cadena para chupete con cuentas tejidas a mano.",
    "materials": "100% Algodón Orgánico Hipoalergénico + Relleno Antialérgico",
    "tags": [
      "Bebé"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1563170351-be82bc888aa4?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 5,
    "reviews": 28,
    "searchKeywords": [
      "chupetero nombre hilo",
      "infantil",
      "mini",
      "bebé"
    ]
  },
  {
    "id": "pelota-facetada-montessori",
    "name": "Pelota Facetada Montessori",
    "slug": "pelota-facetada-montessori",
    "price": 25,
    "category": "Infantil",
    "size": "Mediano",
    "description": "Pelota de gajos tejida fácil de agarrar por bebés.",
    "materials": "100% Algodón Orgánico Hipoalergénico + Relleno Antialérgico",
    "tags": [
      "Bebé"
    ],
    "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuAl3N2_Uphmn6Pqvfi0INnwVm8HPvyyhKhctRW_by89CkhN12bA06eRaB7oMKrv2ko0gBArMGLIxdWpktm7IfNu-J455T49N2f7sD8E1n4uTwHDDDPtRpTzo3DZzgKniYE_Fyep3trvq0hHqiUP3O82F--HFSPVl4fdrA5andRyGTlF_ChobNdCUDB15Pa0SO4ahCjSzOTb0eUhg3Eea80XC972DXDKaedGQdRNZRGL8l1OftmN8dQSVdiDRwF8I0kpwFdMHHM4SUw",
    "rating": 4.6,
    "reviews": 35,
    "searchKeywords": [
      "pelota facetada montessori",
      "infantil",
      "mediano",
      "bebé"
    ]
  },
  {
    "id": "cuna-espiral-animales",
    "name": "Cuna Espiral Animales",
    "slug": "cuna-espiral-animales",
    "price": 36,
    "category": "Infantil",
    "size": "Grande",
    "description": "Espiral para cochecito con osito, estrella y luna.",
    "materials": "100% Algodón Orgánico Hipoalergénico + Relleno Antialérgico",
    "tags": [
      "Bebé"
    ],
    "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuAiE879aKAW4oJ10pJMbOcuc1p9gCtT8ohgnN-R71U1EDMnEkZu1pF16KQx4YppRKRmKNkOMm9_Ox31Zy4R6HY3z3Llpn6Btiizcn3YcZRs4nrqfvGYniB4pDqR-glpj8_6jpRvBK6xSdTitWd_6gEYXgFR9hRVgIzy5bwCBOh97UmHpEkXXVDEoeApLc3RWJcma_bKMvXJIWbt2sLTTN31Tx8IihPHBcBre2diF2tqzxPsQP9NqT2U-sFN_NG9OW6QWxmmEJ7l2-k",
    "rating": 4.7,
    "reviews": 42,
    "searchKeywords": [
      "cuna espiral animales",
      "infantil",
      "grande",
      "bebé"
    ]
  },
  {
    "id": "libro-sensorial-hilo",
    "name": "Libro Sensorial Hilo",
    "slug": "libro-sensorial-hilo",
    "price": 45,
    "category": "Infantil",
    "size": "Grande",
    "description": "Libro de tela y ganchillo con texturas y solapas.",
    "materials": "100% Algodón Orgánico Hipoalergénico + Relleno Antialérgico",
    "tags": [
      "Bebé"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1686151573986-03b5a79f22a5?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.8,
    "reviews": 49,
    "searchKeywords": [
      "libro sensorial hilo",
      "infantil",
      "grande",
      "bebé"
    ]
  },
  {
    "id": "pajarito-cantarin",
    "name": "Pajarito Cantarín",
    "slug": "pajarito-cantarin",
    "price": 19,
    "category": "Infantil",
    "size": "Mini",
    "description": "Sonajero en forma de pajarito con silbato suave.",
    "materials": "100% Algodón Orgánico Hipoalergénico + Relleno Antialérgico",
    "tags": [
      "Bebé"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.9,
    "reviews": 56,
    "searchKeywords": [
      "pajarito cantarín",
      "infantil",
      "mini",
      "bebé"
    ]
  },
  {
    "id": "bouquet-de-rosas-eternas",
    "name": "Bouquet de Rosas Eternas",
    "slug": "bouquet-de-rosas-eternas",
    "price": 45,
    "category": "Plantas & Flores",
    "size": "Grande",
    "description": "Ramo de 6 rosas rojas y rosadas tejidas que nunca se marchitan.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Best Seller"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1558060370-d644479be6e7?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 5,
    "reviews": 63,
    "searchKeywords": [
      "bouquet de rosas eternas",
      "plantas & flores",
      "grande",
      "best seller"
    ]
  },
  {
    "id": "orquidea-morada-en-maceta",
    "name": "Orquídea Morada en Maceta",
    "slug": "orquidea-morada-en-maceta",
    "price": 39,
    "category": "Plantas & Flores",
    "size": "Grande",
    "description": "Elegante orquídea de crochet con capullos y hojas firmes.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Favorito"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1534447677768-be436bb09401?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.6,
    "reviews": 70,
    "searchKeywords": [
      "orquídea morada en maceta",
      "plantas & flores",
      "grande",
      "favorito"
    ]
  },
  {
    "id": "flor-de-girasol-gigante",
    "name": "Flor de Girasol Gigante",
    "slug": "flor-de-girasol-gigante",
    "price": 28,
    "category": "Plantas & Flores",
    "size": "Grande",
    "description": "Girasol individual de tallo largo para florero.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Popular"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.7,
    "reviews": 77,
    "searchKeywords": [
      "flor de girasol gigante",
      "plantas & flores",
      "grande",
      "popular"
    ]
  },
  {
    "id": "suculenta-echeveria",
    "name": "Suculenta Echeveria",
    "slug": "suculenta-echeveria",
    "price": 18,
    "category": "Plantas & Flores",
    "size": "Mini",
    "description": "Roseta de suculenta en degradado verde y morado.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Nuevo"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1563170351-be82bc888aa4?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.8,
    "reviews": 84,
    "searchKeywords": [
      "suculenta echeveria",
      "plantas & flores",
      "mini",
      "nuevo"
    ]
  },
  {
    "id": "margarita-en-macetita",
    "name": "Margarita en Macetita",
    "slug": "margarita-en-macetita",
    "price": 17,
    "category": "Plantas & Flores",
    "size": "Mini",
    "description": "Margarita blanca con centro amarillo sonriente.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Regalo"
    ],
    "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuAl3N2_Uphmn6Pqvfi0INnwVm8HPvyyhKhctRW_by89CkhN12bA06eRaB7oMKrv2ko0gBArMGLIxdWpktm7IfNu-J455T49N2f7sD8E1n4uTwHDDDPtRpTzo3DZzgKniYE_Fyep3trvq0hHqiUP3O82F--HFSPVl4fdrA5andRyGTlF_ChobNdCUDB15Pa0SO4ahCjSzOTb0eUhg3Eea80XC972DXDKaedGQdRNZRGL8l1OftmN8dQSVdiDRwF8I0kpwFdMHHM4SUw",
    "rating": 4.9,
    "reviews": 91,
    "searchKeywords": [
      "margarita en macetita",
      "plantas & flores",
      "mini",
      "regalo"
    ]
  },
  {
    "id": "flor-de-cerezo-sakura",
    "name": "Flor de Cerezo Sakura",
    "slug": "flor-de-cerezo-sakura",
    "price": 32,
    "category": "Plantas & Flores",
    "size": "Mediano",
    "description": "Rama de flor de cerezo japonés en tonos rosa pastel.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Limitado"
    ],
    "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuAiE879aKAW4oJ10pJMbOcuc1p9gCtT8ohgnN-R71U1EDMnEkZu1pF16KQx4YppRKRmKNkOMm9_Ox31Zy4R6HY3z3Llpn6Btiizcn3YcZRs4nrqfvGYniB4pDqR-glpj8_6jpRvBK6xSdTitWd_6gEYXgFR9hRVgIzy5bwCBOh97UmHpEkXXVDEoeApLc3RWJcma_bKMvXJIWbt2sLTTN31Tx8IihPHBcBre2diF2tqzxPsQP9NqT2U-sFN_NG9OW6QWxmmEJ7l2-k",
    "rating": 5,
    "reviews": 98,
    "searchKeywords": [
      "flor de cerezo sakura",
      "plantas & flores",
      "mediano",
      "limitado"
    ]
  },
  {
    "id": "bonsai-de-hilo-verde",
    "name": "Bonsái de Hilo Verde",
    "slug": "bonsai-de-hilo-verde",
    "price": 55,
    "category": "Plantas & Flores",
    "size": "Grande",
    "description": "Bonsái diminuto tejido con tronco esculpido y follaje.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Limitado"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1686151573986-03b5a79f22a5?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.6,
    "reviews": 105,
    "searchKeywords": [
      "bonsái de hilo verde",
      "plantas & flores",
      "grande",
      "limitado"
    ]
  },
  {
    "id": "flor-de-hortensia-azul",
    "name": "Flor de Hortensia Azul",
    "slug": "flor-de-hortensia-azul",
    "price": 30,
    "category": "Plantas & Flores",
    "size": "Mediano",
    "description": "Esfera de hortensia compuesta por docenas de petalos.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Nuevo"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.7,
    "reviews": 112,
    "searchKeywords": [
      "flor de hortensia azul",
      "plantas & flores",
      "mediano",
      "nuevo"
    ]
  },
  {
    "id": "lirio-blanco-elegante",
    "name": "Lirio Blanco Elegante",
    "slug": "lirio-blanco-elegante",
    "price": 26,
    "category": "Plantas & Flores",
    "size": "Mediano",
    "description": "Lirio tejido con pistilos amarillos en vara.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Regalo"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1558060370-d644479be6e7?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.8,
    "reviews": 119,
    "searchKeywords": [
      "lirio blanco elegante",
      "plantas & flores",
      "mediano",
      "regalo"
    ]
  },
  {
    "id": "carnivora-planta-amistosa",
    "name": "Carnívora Planta Amistosa",
    "slug": "carnivora-planta-amistosa",
    "price": 33,
    "category": "Plantas & Flores",
    "size": "Mediano",
    "description": "Planta carnívora divertida tipo videojuego.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Popular"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1534447677768-be436bb09401?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.9,
    "reviews": 126,
    "searchKeywords": [
      "carnívora planta amistosa",
      "plantas & flores",
      "mediano",
      "popular"
    ]
  },
  {
    "id": "kuro-neko-magico",
    "name": "Kuro Neko Mágico",
    "slug": "kuro-neko-magico",
    "price": 32,
    "category": "Anime & Fanart",
    "size": "Mediano",
    "description": "Gato negro inspirado en clásico de animación con ojos amarillos.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Best Seller"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 5,
    "reviews": 133,
    "searchKeywords": [
      "kuro neko mágico",
      "anime & fanart",
      "mediano",
      "best seller"
    ]
  },
  {
    "id": "espiritu-del-bosque-verde",
    "name": "Espíritu del Bosque Verde",
    "slug": "espiritu-del-bosque-verde",
    "price": 40,
    "category": "Anime & Fanart",
    "size": "Grande",
    "description": "Criatura boscosa pachoncita con paraguas de hoja.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Best Seller"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1563170351-be82bc888aa4?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.6,
    "reviews": 140,
    "searchKeywords": [
      "espíritu del bosque verde",
      "anime & fanart",
      "grande",
      "best seller"
    ]
  },
  {
    "id": "monstruo-de-bolsillo-amarillo",
    "name": "Monstruo de Bolsillo Amarillo",
    "slug": "monstruo-de-bolsillo-amarillo",
    "price": 34,
    "category": "Anime & Fanart",
    "size": "Mediano",
    "description": "Roedor eléctrico amarillo con mejillas rojas.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Popular"
    ],
    "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuAl3N2_Uphmn6Pqvfi0INnwVm8HPvyyhKhctRW_by89CkhN12bA06eRaB7oMKrv2ko0gBArMGLIxdWpktm7IfNu-J455T49N2f7sD8E1n4uTwHDDDPtRpTzo3DZzgKniYE_Fyep3trvq0hHqiUP3O82F--HFSPVl4fdrA5andRyGTlF_ChobNdCUDB15Pa0SO4ahCjSzOTb0eUhg3Eea80XC972DXDKaedGQdRNZRGL8l1OftmN8dQSVdiDRwF8I0kpwFdMHHM4SUw",
    "rating": 4.7,
    "reviews": 147,
    "searchKeywords": [
      "monstruo de bolsillo amarillo",
      "anime & fanart",
      "mediano",
      "popular"
    ]
  },
  {
    "id": "esferita-de-hollejo-sin-cara",
    "name": "Esferita de Hollejo Sin Cara",
    "slug": "esferita-de-hollejo-sin-cara",
    "price": 26,
    "category": "Anime & Fanart",
    "size": "Mediano",
    "description": "Sombra misteriosa tejida con máscara icónica.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Favorito"
    ],
    "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuAiE879aKAW4oJ10pJMbOcuc1p9gCtT8ohgnN-R71U1EDMnEkZu1pF16KQx4YppRKRmKNkOMm9_Ox31Zy4R6HY3z3Llpn6Btiizcn3YcZRs4nrqfvGYniB4pDqR-glpj8_6jpRvBK6xSdTitWd_6gEYXgFR9hRVgIzy5bwCBOh97UmHpEkXXVDEoeApLc3RWJcma_bKMvXJIWbt2sLTTN31Tx8IihPHBcBre2diF2tqzxPsQP9NqT2U-sFN_NG9OW6QWxmmEJ7l2-k",
    "rating": 4.8,
    "reviews": 154,
    "searchKeywords": [
      "esferita de hollejo sin cara",
      "anime & fanart",
      "mediano",
      "favorito"
    ]
  },
  {
    "id": "perrito-demonio-naranja",
    "name": "Perrito Demonio Naranja",
    "slug": "perrito-demonio-naranja",
    "price": 36,
    "category": "Anime & Fanart",
    "size": "Mediano",
    "description": "Perrito naranja con motosierra en la cabeza.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Nuevo"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1686151573986-03b5a79f22a5?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.9,
    "reviews": 161,
    "searchKeywords": [
      "perrito demonio naranja",
      "anime & fanart",
      "mediano",
      "nuevo"
    ]
  },
  {
    "id": "magica-nina-de-traje-marinero",
    "name": "Mágica Niña de Traje Marinero",
    "slug": "magica-nina-de-traje-marinero",
    "price": 44,
    "category": "Anime & Fanart",
    "size": "Grande",
    "description": "Muñeca coleccionable de heroína lunar con coletas.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Limitado"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 5,
    "reviews": 168,
    "searchKeywords": [
      "mágica niña de traje marinero",
      "anime & fanart",
      "grande",
      "limitado"
    ]
  },
  {
    "id": "ninja-de-cabello-rubio",
    "name": "Ninja de Cabello Rubio",
    "slug": "ninja-de-cabello-rubio",
    "price": 38,
    "category": "Anime & Fanart",
    "size": "Mediano",
    "description": "Ninja sonriente con banda frontal y traje naranja.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Popular"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1558060370-d644479be6e7?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.6,
    "reviews": 175,
    "searchKeywords": [
      "ninja de cabello rubio",
      "anime & fanart",
      "mediano",
      "popular"
    ]
  },
  {
    "id": "principe-saiyajin",
    "name": "Príncipe Saiyajin",
    "slug": "principe-saiyajin",
    "price": 42,
    "category": "Anime & Fanart",
    "size": "Mediano",
    "description": "Guerrero espacial con cabello erizado y armadura.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Popular"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1534447677768-be436bb09401?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.7,
    "reviews": 182,
    "searchKeywords": [
      "príncipe saiyajin",
      "anime & fanart",
      "mediano",
      "popular"
    ]
  },
  {
    "id": "esferita-de-carbon-con-dulce",
    "name": "Esferita de Carbón con Dulce",
    "slug": "esferita-de-carbon-con-dulce",
    "price": 15,
    "category": "Anime & Fanart",
    "size": "Mini",
    "description": "Soot sprite de hollín con dulce konpeito en sus manos.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Regalo"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.8,
    "reviews": 189,
    "searchKeywords": [
      "esferita de carbón con dulce",
      "anime & fanart",
      "mini",
      "regalo"
    ]
  },
  {
    "id": "gato-autobus-sonriente",
    "name": "Gato Autobús Sonriente",
    "slug": "gato-autobus-sonriente",
    "price": 58,
    "category": "Anime & Fanart",
    "size": "Grande",
    "description": "Autobús felino multi-patas con ventanas tejidas.",
    "materials": "100% Algodón Mercerizado + Relleno Hipoalergénico",
    "tags": [
      "Limitado"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1563170351-be82bc888aa4?fm=jpg&q=80&w=400&auto=format&fit=crop",
    "rating": 4.9,
    "reviews": 16,
    "searchKeywords": [
      "gato autobús sonriente",
      "anime & fanart",
      "grande",
      "limitado"
    ]
  }
];

export const popularSearches: string[] = [
  "Llavero aguacate",
  "Dragón celestino",
  "Gatito naranja",
  "Cactus",
  "Girasol",
  "Perezoso",
  "Boba Tea",
  "Móvil estelar",
];

export const RECENT_SEARCHES_KEY = "yamgurumi_recent_searches";
export const MAX_RECENT_SEARCHES = 5;

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return products;
  return products.filter((p) => {
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.materials.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.searchKeywords.some((k) => k.includes(q))
    );
  });
}

export function searchCategories(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return categories.filter((c) => c.name.toLowerCase().includes(q));
}
