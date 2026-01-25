import { Hero } from "@/components/sections/Hero";
import { Categories } from "@/components/sections/Categories";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { PromoBanner } from "@/components/sections/PromoBanner";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <WhyChooseUs />
      <PromoBanner />
    </>
  );
}
/*<Categories />
<FeaturedProducts />*/
