import { notFound } from "next/navigation";
import { products, type Product } from "@/data/products";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return { title: "Producto no encontrado — Yamgurumi" };
  return {
    title: `${product.name} — Yamgurumi`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 10);

  if (related.length < 10) {
    const extra = products
      .filter((p) => p.id !== product.id && !related.find((r) => r.id === p.id))
      .slice(0, 10 - related.length);
    related.push(...extra);
  }

  return <ProductDetailClient product={product} related={related} />;
}
