import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PromoBanner() {
  return (
    <section className="bg-gradient-to-r from-primary to-primary/80 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <h2 className="mb-2 text-2xl font-bold text-primary-foreground md:text-3xl">
              New to Mathsya? Regiser Now
            </h2>
            <p className="text-primary-foreground/80">
              Register your mobile number and start ordering today!
             
            </p>
          </div>
          <Button size="lg" variant="secondary" className="shrink-0" asChild>
            <Link href="#products">Shop Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
