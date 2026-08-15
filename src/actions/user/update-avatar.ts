'use server';

import prisma from '@/src/lib/prisma';
import { getAuthCookie, verifyToken } from '@/src/lib/auth/tokens';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';

export async function updateAvatarAction(formData: FormData): Promise<{
  success: boolean;
  image?: string;
  error?: string;
}> {
  try {
    const token = await getAuthCookie();
    if (!token) {
      return { success: false, error: 'Sesión no válida. Por favor inicia sesión.' };
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.sub) {
      return { success: false, error: 'Sesión no válida. Por favor inicia sesión.' };
    }

    const userId = payload.sub;
    const file = formData.get('avatar') as File | null;

    if (!file || !(file instanceof File) || file.size === 0) {
      return { success: false, error: 'Por favor selecciona un archivo de imagen válido.' };
    }

    // Validar tipo de archivo
    const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validMimeTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Formato no soportado. Usa formato PNG, JPG, WEBP o GIF.',
      };
    }

    // Validar tamaño máximo (5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return { success: false, error: 'La imagen es demasiado grande. El tamaño máximo es de 5MB.' };
    }

    // Obtener extensión del archivo
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
    const fileName = `avatar-${userId}-${Date.now()}.${ext}`;

    // Ruta de destino dentro de public/user-profile/
    const uploadDir = path.join(process.cwd(), 'public', 'user-profile');

    // Asegurar que exista la carpeta public/user-profile
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);

    // Convertir File a Buffer y guardar en disco
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/user-profile/${fileName}`;

    // Actualizar campo image en la base de datos
    await prisma.user.update({
      where: { id: userId },
      data: { image: publicUrl },
    });

    revalidatePath('/mi-taller');
    revalidatePath('/', 'layout');

    return { success: true, image: publicUrl };
  } catch (error) {
    console.error('Error al actualizar avatar de usuario:', error);
    return { success: false, error: 'Ocurrió un error al guardar la foto de perfil.' };
  }
}
