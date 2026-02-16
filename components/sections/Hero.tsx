import { Button } from "@/components/ui/button";
import { ShieldCheck, Truck, Leaf } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background bg-primary/10">
      <div className="container relative mx-auto px-4 py-20 md:py-28 lg:py-36">
        {/* Center-aligned content */}
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          {/* Main Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Fresh Seafood, Delivered Daily
          </h1>

          {/* Subheading */}
          <p className="mb-10 max-w-2xl text-sm text-muted-foreground md:text-lg">
            Fresh seafood, cleaned and ready to cook at your door step.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" className="px-8" asChild>
              <Link href="#products">
                Order Now
              </Link>
            </Button>
          </div>

          {/* Trust Indicator - Hidden on mobile */}
          <div className="mt-12 hidden flex-wrap items-center justify-center gap-8 md:flex">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                Freshness Guarantee
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                Reliable Delivery
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                Sustainably Sourced
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
