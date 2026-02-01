import Image from "next/image";
import Link from "next/link";

export interface Product {
  id: string;
  name: string;
  alternateName?: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md">
      {/* Image */}
      <Link
        href={`/products/${product.id}`}
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
            {product.name}
            {product.alternateName && ` / ${product.alternateName}`}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-1">
          <span className="font-bold text-green-700">₹{product.price}</span>
          <span className="text-xs text-muted-foreground">/kg</span>
        </div>
      </div>
    </div>
  );
}
