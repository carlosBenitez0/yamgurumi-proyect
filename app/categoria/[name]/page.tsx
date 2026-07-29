import { notFound } from "next/navigation";
import { products, categories, type ProductCategory } from "@/data/products";
import CategoryClient from "./CategoryClient";

interface Props {
  params: Promise<{ name: string }>;
}

export function generateStaticParams() {
  return categories.map((c) => ({ name: c.name }));
}

export async function generateMetadata({ params }: Props) {
  const { name } = await params;
  const category = categories.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );
  if (!category) return { title: "Categoría no encontrada — Yamgurumi" };
  return {
    title: `${category.name} — Yamgurumi`,
    description: `Explora nuestra colección de ${category.name.toLowerCase()} tejidos a mano.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { name } = await params;
  const category = categories.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );
  if (!category) notFound();

  const filtered = products.filter(
    (p) => p.category.toLowerCase() === category.name.toLowerCase()
  );

  return (
    <CategoryClient
      category={category.name}
      icon={category.icon}
      products={filtered}
    />
  );
}
