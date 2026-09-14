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

const productSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  categoryId: z.string().min(1, 'Selecciona una categoría'),
  price: z.number().positive('El precio debe ser un número positivo'),
  salePrice: z.number().positive().optional().nullable(),
  stock: z.number().int().min(0, 'El stock no puede ser negativo'),
  size: z.string().default('Mediano'),
  craftingDays: z.string().default('5-10 días hábiles'),
  description: z.string().min(5, 'Escribe una descripción completa del producto'),
  materials: z.string().min(3, 'Especifica los materiales del amigurumi'),
  imageUrls: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export type ProductInput = z.infer<typeof productSchema>;

export async function getAdminProductsAction(params?: {
  search?: string;
  categoryId?: string;
  isActive?: boolean;
}) {
  await requireAdmin();

  const where: any = {};

  if (params?.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { description: { contains: params.search, mode: 'insensitive' } },
      { materials: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  if (params?.categoryId) {
    where.categoryId = params.categoryId;
  }

  if (params?.isActive !== undefined) {
    where.isActive = params.isActive;
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      category: {
        select: {
          id: true,
          name: true,
          icon: true,
          slug: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return products.map((p) => ({
    ...p,
    price: Number(p.price),
    salePrice: p.salePrice ? Number(p.salePrice) : null,
  }));
}

export async function createProductAction(data: ProductInput) {
  const admin = await requireAdmin();
  const validated = productSchema.parse(data);

  let slug = slugify(validated.name);
  const existingProduct = await prisma.product.findUnique({ where: { slug } });
  if (existingProduct) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const newProduct = await prisma.product.create({
    data: {
      name: validated.name,
      slug,
      price: validated.price,
      salePrice: validated.salePrice ?? null,
      stock: validated.stock,
      categoryId: validated.categoryId,
      size: validated.size,
      craftingDays: validated.craftingDays,
      description: validated.description,
      materials: validated.materials,
      imageUrls: validated.imageUrls,
      tags: validated.tags,
      isFeatured: validated.isFeatured,
      isActive: validated.isActive,
    },
  });

  // Bitácora de auditoría
  await prisma.auditLog.create({
    data: {
      userId: admin.sub,
      userEmail: admin.email,
      action: 'CREATE_PRODUCT',
      entity: 'Product',
      entityId: newProduct.id,
      details: `Creado producto "${newProduct.name}" ($${newProduct.price})`,
    },
  });

  revalidatePath('/admin/productos');
  revalidatePath('/catalog');
  revalidatePath('/');

  const formattedProduct = {
    ...newProduct,
    price: Number(newProduct.price),
    salePrice: newProduct.salePrice ? Number(newProduct.salePrice) : null,
  };

  return { success: true, product: formattedProduct };
}

export async function updateProductAction(id: string, data: Partial<ProductInput>) {
  const admin = await requireAdmin();

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.salePrice !== undefined && { salePrice: data.salePrice }),
      ...(data.stock !== undefined && { stock: data.stock }),
      ...(data.categoryId && { categoryId: data.categoryId }),
      ...(data.size && { size: data.size }),
      ...(data.craftingDays && { craftingDays: data.craftingDays }),
      ...(data.description && { description: data.description }),
      ...(data.materials && { materials: data.materials }),
      ...(data.imageUrls && { imageUrls: data.imageUrls }),
      ...(data.tags && { tags: data.tags }),
      ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.sub,
      userEmail: admin.email,
      action: 'UPDATE_PRODUCT',
      entity: 'Product',
      entityId: id,
      details: `Actualizado producto "${updatedProduct.name}"`,
    },
  });

  revalidatePath('/admin/productos');
  revalidatePath('/catalog');
  revalidatePath('/');

  const formattedProduct = {
    ...updatedProduct,
    price: Number(updatedProduct.price),
    salePrice: updatedProduct.salePrice ? Number(updatedProduct.salePrice) : null,
  };

  return { success: true, product: formattedProduct };
}

export async function adjustProductStockAction(id: string, delta: number) {
  const admin = await requireAdmin();

  if (!Number.isInteger(delta) || delta === 0) {
    return { success: false, error: 'El ajuste de stock debe ser un número entero distinto de cero.' };
  }

  const current = await prisma.product.findUnique({
    where: { id },
    select: { name: true, stock: true },
  });

  if (!current) {
    return { success: false, error: 'Producto no encontrado.' };
  }

  const newStock = current.stock + delta;
  if (newStock < 0) {
    return {
      success: false,
      error: `"${current.name}" solo tiene ${current.stock} ${current.stock === 1 ? 'pieza' : 'piezas'}; no puedes quitar ${Math.abs(delta)}.`,
    };
  }

  const updated = await prisma.product.update({
    where: { id },
    data: { stock: newStock },
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.sub,
      userEmail: admin.email,
      action: 'ADJUST_PRODUCT_STOCK',
      entity: 'Product',
      entityId: id,
      details: `Stock de "${updated.name}" ajustado en ${delta > 0 ? '+' : ''}${delta} (${current.stock} → ${newStock})`,
    },
  });

  revalidatePath('/admin/productos');
  revalidatePath('/catalog');
  revalidatePath('/');

  return { success: true, stock: updated.stock };
}

export async function toggleProductActiveAction(id: string, isActive: boolean) {
  const admin = await requireAdmin();

  const updated = await prisma.product.update({
    where: { id },
    data: { isActive },
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.sub,
      userEmail: admin.email,
      action: 'TOGGLE_PRODUCT_ACTIVE',
      entity: 'Product',
      entityId: id,
      details: `Producto "${updated.name}" estado activo cambiado a ${isActive}`,
    },
  });

  revalidatePath('/admin/productos');
  revalidatePath('/catalog');

  return { success: true, isActive: updated.isActive };
}

export async function deleteProductAction(id: string) {
  const admin = await requireAdmin();

  const deleted = await prisma.product.delete({
    where: { id },
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.sub,
      userEmail: admin.email,
      action: 'DELETE_PRODUCT',
      entity: 'Product',
      entityId: id,
      details: `Eliminado producto "${deleted.name}"`,
    },
  });

  revalidatePath('/admin/productos');
  revalidatePath('/catalog');

  return { success: true };
}
