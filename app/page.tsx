import { Hero } from "@/components/sections/Hero";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { PromoBanner } from "@/components/sections/PromoBanner";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <PromoBanner />
    </>
  );
}
