"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Handbag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { useCart } from "@/lib/cart-context";
import { getVariantDisplayName } from "@/lib/api/products";

interface Variant {
  variantId: string;
  variantName: string;
  price: number;
}

interface ProductDetailsProps {
  product: {
    id: string;
    name: string;
    image: string;
    variants: Variant[];
  };
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(product.variants.map((v) => [v.variantId, 0.5])),
  );
  const [addedVariant, setAddedVariant] = useState<string | null>(null);

  const handleAddToBag = (variant: Variant) => {
    addToCart(
      {
        productId: product.id,
        variantId: variant.variantId,
        name: product.name,
        variantName: variant.variantName,
        price: variant.price,
        image: product.image,
      },
      quantities[variant.variantId],
    );
    setAddedVariant(variant.variantId);
    setTimeout(() => setAddedVariant(null), 1500);
  };

  const updateQuantity = (variantId: string, qty: number) => {
    setQuantities((prev) => ({ ...prev, [variantId]: qty }));
  };

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Back link */}
        <Link
          href="/#products"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>

        <h1 className="mb-6 text-2xl font-bold text-foreground md:text-3xl">
          {product.name}
        </h1>

        {/* Variant Cards */}
        <div className="space-y-4">
          {product.variants.map((variant) => {
            const qty = quantities[variant.variantId];
            const total = variant.price * qty;

            return (
              <div
                key={variant.variantId}
                className="flex gap-3 rounded-lg border border-border p-3 sm:gap-4 sm:p-4"
              >
                {/* Info */}
                <div className="flex flex-1 flex-col">
                  <h3 className="text-sm font-medium text-foreground sm:text-base">
                    {product.name} /{" "}
                    {getVariantDisplayName(variant.variantName)}
                  </h3>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-xs text-muted-foreground">
                      ₹{variant.price}/kg
                    </span>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    <QuantitySelector
                      quantity={qty}
                      onChange={(q) => updateQuantity(variant.variantId, q)}
                    />
                  </div>
                  <div className="mt-4 text-sm font-bold text-foreground">
                    <span className="text-green-700">₹{total.toFixed(0)}</span>
                  </div>
                </div>
                {/* Image + Add button */}
                <div className="flex shrink-0 flex-col items-center gap-2">
                  <div className="relative h-24 w-24 overflow-hidden rounded-md bg-muted sm:h-28 sm:w-28">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  </div>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => handleAddToBag(variant)}
                  >
                    <Handbag className="h-3.5 w-3.5" />
                    {addedVariant === variant.variantId ? "Added" : "Add"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
