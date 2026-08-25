import { ProductCard } from "@/components/ui/product-card";
import { getProducts, getProductImage, getWholePrice, slugify } from "@/lib/api/products";

export async function FeaturedProducts() {
  const apiProducts = await getProducts();

  const products = (apiProducts || [])
    .filter((p) => p.image)
    .map((p) => ({
      id: slugify(p.productName),
      name: p.productName,
      alternateName: p.alternateName,
      price: getWholePrice(p),
      image: getProductImage(p),
    }));

  return (
    <section id="products" className="py-12 md:py-16">
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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              No products available at the moment.
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
