import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export interface Product {
  id: string;
  name: string;
  variantName?: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

const variantDisplayNames: Record<string, string> = {
  WHOLE: "Cleaned Fish",
  FRY: "Fry Cut",
  CURRY: "Curry Cut",
};

function getVariantDisplayName(variant?: string): string {
  if (!variant) return "";
  return variantDisplayNames[variant.toUpperCase()] || variant;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md">
      {/* Image */}
      <Link
        href="#"
        className="relative aspect-square overflow-hidden bg-muted"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3">
        {/* Name */}
        <Link href={`/products/${product.id}`} className="group/link">
          <h3 className="line-clamp-1 text-sm font-medium text-foreground transition-colors group-hover/link:text-primary">
            {product.name} ({getVariantDisplayName(product.variantName)})
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-1">
          <span className="font-bold text-foreground">₹{product.price}</span>
          <span className="text-xs text-muted-foreground">/kg</span>
        </div>

        {/* Add to Cart Button 
        <Button size="sm" className="mt-3 w-full">
          Add to Cart
        </Button>
        */}
      </div>
    </div>
  );
}
