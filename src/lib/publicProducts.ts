import prisma from '@/src/lib/prisma';
import { products as staticProducts, Product } from '@/data/products';

export async function getPublicProducts(): Promise<Product[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    const mappedDbProducts: Product[] = dbProducts.map((p) => {
      const dbImages = Array.isArray(p.imageUrls) ? p.imageUrls.filter(Boolean) : [];
      const primaryImage = dbImages[0] || 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80';
      const imageUrls = dbImages.length > 0 ? dbImages : [primaryImage];

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price),
        salePrice: p.salePrice ? Number(p.salePrice) : null,
        category: (p.category?.name || 'Muñecos') as any,
        size: p.size as any,
        description: p.description || '',
        materials: p.materials || '',
        tags: p.isFeatured ? ['Popular', 'Nuevo'] : ['Nuevo'],
        imageUrl: primaryImage,
        imageUrls,
        rating: 5.0,
        reviews: 1,
        stock: p.stock,
        craftingDays: p.craftingDays || '5-10 días hábiles',
        searchKeywords: [
          p.name.toLowerCase(),
          (p.category?.name || '').toLowerCase(),
          p.size.toLowerCase(),
          p.materials.toLowerCase(),
        ],
      };
    });

    if (mappedDbProducts.length === 0) {
      return staticProducts;
    }

    const dbSlugs = new Set(mappedDbProducts.map((p) => p.slug));
    const extraStatic = staticProducts.filter((p) => !dbSlugs.has(p.slug));

    return [...mappedDbProducts, ...extraStatic];
  } catch (err) {
    console.error('Error fetching public products from PostgreSQL:', err);
    return staticProducts;
  }
}

export async function getPublicProductBySlug(slug: string): Promise<Product | null> {
  const all = await getPublicProducts();
  return all.find((p) => p.slug === slug) || null;
}

export async function getPublicCategories() {
  try {
    const dbCategories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        products: {
          where: { isActive: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    return dbCategories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
      description: cat.description,
      imageUrl: cat.imageUrl,
      count: cat.products.length,
    }));
  } catch (err) {
    console.error('Error fetching public categories from PostgreSQL:', err);
    return [];
  }
}
