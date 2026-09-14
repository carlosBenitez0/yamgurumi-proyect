import { notFound } from "next/navigation";
import { getPublicProducts, getPublicProductBySlug } from "@/src/lib/publicProducts";
import { getWhatsAppTemplatesMap } from "@/src/lib/whatsappTemplatesServer";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 0;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado — Yamgurumi" };
  return {
    title: `${product.name} — Yamgurumi`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);
  if (!product) notFound();

  const allProducts = await getPublicProducts();
  const whatsappTemplates = await getWhatsAppTemplatesMap();

  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 10);

  if (related.length < 10) {
    const extra = allProducts
      .filter((p) => p.id !== product.id && !related.find((r) => r.id === p.id))
      .slice(0, 10 - related.length);
    related.push(...extra);
  }

  return <ProductDetailClient product={product} related={related} whatsappTemplates={whatsappTemplates} />;
}
