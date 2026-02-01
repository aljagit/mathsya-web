import { getProductBySlug, getProductImage } from "@/lib/api/products";
import { notFound } from "next/navigation";
import { ProductDetails } from "./product-details";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const apiProduct = await getProductBySlug(id);

  if (!apiProduct) {
    notFound();
  }

  const product = {
    id: apiProduct.product,
    name: apiProduct.productName,
    image: getProductImage(apiProduct),
    variants: apiProduct.variants.map((v) => ({
      variantId: v.variant,
      variantName: v.variantName,
      price: v.price,
    })),
  };

  return <ProductDetails product={product} />;
}
