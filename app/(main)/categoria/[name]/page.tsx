import { redirect } from "next/navigation";
import { categories } from "@/data/products";

interface Props {
  params: Promise<{ name: string }>;
}

export function generateStaticParams() {
  return categories.map((c) => ({ name: c.name }));
}

export default async function CategoryPage({ params }: Props) {
  const { name } = await params;
  const category = categories.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );

  // Redirigir al catálogo con el filtro de categoría pre-seleccionado
  if (category) {
    redirect(`/catalog?category=${encodeURIComponent(category.name)}`);
  }

  // Si la categoría no existe, redirigir al catálogo general
  redirect("/catalog");
}
