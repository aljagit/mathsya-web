import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getProducts, getProductImage } from "@/lib/api/products";

export async function FeaturedProducts() {
  const apiProducts = await getProducts();

  const products = (apiProducts || []).map((p) => ({
    id: p.variant,
    name: p.productName,
    variantName: p.variantName,
    price: p.price,
    image: getProductImage(p),
  }));

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8 w-full text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Today&apos;s Fresh Catch
          </h2>
          <p className="mt-2 text-muted-foreground">
            Premium quality seafood, cleaned and ready to cook
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <p className="text-center text-muted-foreground">
            No products available at the moment.
          </p>
        )}
      </div>
    </section>
  );
}
