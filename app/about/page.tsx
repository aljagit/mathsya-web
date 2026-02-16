import { Metadata } from "next";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Fish, Users, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Mathsya",
  description:
    "Learn about Mathsya Fish Trading and Marketing Pvt Ltd — fresh seafood delivered daily from Chavakkad, Thrissur, Kerala.",
};

const stats = [
  { icon: Fish, label: "Varieties", value: "50+" },
  { icon: Users, label: "Happy Customers", value: "5000+" },
  { icon: MapPin, label: "Delivery Locations", value: "20+" },
  { icon: Clock, label: "Years of Trust", value: "7+" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            About <span className="text-primary">Mathsya</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Your trusted source for the freshest seafood, delivered right to
            your doorstep from the shores of Chavakkad, Kerala.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <stat.icon className="h-6 w-6" />
                </div>
                <span className="text-2xl font-bold text-foreground">
                  {stat.value}
                </span>
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story & What We Do */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Our Story Card */}
            <div className="rounded-lg border border-border bg-muted/20 p-6 md:p-8">
              <h2 className="mb-4 text-xl font-bold text-foreground">
                Our Story
              </h2>
              <p className="text-muted-foreground">
                Born from a deep connection to Kerala&apos;s rich coastal
                heritage, Mathsya was founded with a simple mission — to bring
                the ocean&apos;s finest catch from the shores of Chavakkad to
                kitchens across the region. We work directly with local
                fishermen and suppliers to ensure every product meets our high
                standards of freshness and quality.
              </p>
            </div>

            {/* What We Do Card */}
            <div className="rounded-lg border border-border bg-muted/20 p-6 md:p-8">
              <h2 className="mb-4 text-xl font-bold text-foreground">
                What We Do
              </h2>
              <p className="text-muted-foreground">
                We source, process, and deliver a wide variety of fish and
                seafood including fresh catches, cleaned and cut-to-order
                options, and marinated ready-to-cook preparations. Whether
                you&apos;re looking for the catch of the day or a specific
                variety, Mathsya has you covered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <WhyChooseUs />
    </>
  );
}
