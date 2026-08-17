'use server';

import prisma from '@/src/lib/prisma';
import { requireAdmin } from '@/src/lib/auth/adminGuard';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

const categorySchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  icon: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export async function getAdminCategoriesAction() {
  await requireAdmin();

  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { sortOrder: 'asc' },
  });

  return categories.map((cat) => ({
    ...cat,
    productsCount: cat._count.products,
  }));
}

export async function createCategoryAction(data: CategoryInput) {
  const admin = await requireAdmin();
  const validated = categorySchema.parse(data);

  let slug = slugify(validated.name);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const category = await prisma.category.create({
    data: {
      name: validated.name,
      slug,
      icon: validated.icon || '🧸',
      description: validated.description || `Colección de ${validated.name}`,
      imageUrl: validated.imageUrl ?? null,
      sortOrder: validated.sortOrder,
      isActive: validated.isActive,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.sub,
      userEmail: admin.email,
      action: 'CREATE_CATEGORY',
      entity: 'Category',
      entityId: category.id,
      details: `Creada categoría "${category.name}" (${category.icon})`,
    },
  });

  revalidatePath('/admin/categorias');
  revalidatePath('/admin/productos');
  revalidatePath('/catalog');

  return { success: true, category };
}

export async function updateCategoryAction(id: string, data: Partial<CategoryInput>) {
  const admin = await requireAdmin();

  const updated = await prisma.category.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.icon && { icon: data.icon }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
      ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.sub,
      userEmail: admin.email,
      action: 'UPDATE_CATEGORY',
      entity: 'Category',
      entityId: id,
      details: `Actualizada categoría "${updated.name}"`,
    },
  });

  revalidatePath('/admin/categorias');
  revalidatePath('/admin/productos');
  revalidatePath('/catalog');

  return { success: true, category: updated };
}

export async function deleteCategoryAction(id: string) {
  const admin = await requireAdmin();

  // Verificar que no tenga productos asociados
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    throw new Error(`No se puede eliminar la categoría porque tiene ${count} productos asociados`);
  }

  const deleted = await prisma.category.delete({
    where: { id },
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.sub,
      userEmail: admin.email,
      action: 'DELETE_CATEGORY',
      entity: 'Category',
      entityId: id,
      details: `Eliminada categoría "${deleted.name}"`,
    },
  });

  revalidatePath('/admin/categorias');
  revalidatePath('/admin/productos');
  revalidatePath('/catalog');

  return { success: true };
}
