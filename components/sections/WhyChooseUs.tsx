import { Truck, ShieldCheck, Leaf, Award } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Quality Control",
    description:
      "Meticulous inspection standards ensure only the freshest seafood reaches your kitchen.",
  },
  {
    icon: Truck,
    title: "Reliable Delivery",
    description:
      "Efficient logistics network with temperature-controlled packaging for guaranteed freshness.",
  },
  {
    icon: Leaf,
    title: "Sustainably Sourced",
    description:
      "Direct sourcing from trusted local fishermen following environmentally friendly practices.",
  },
  {
    icon: Award,
    title: "Modern Infrastructure",
    description:
      "State-of-the-art processing facilities ensuring hygiene and quality since 2017.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Why Choose Mathsya?
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            Quality and trust, delivered fresh every day from the waters of Kerala.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center md:items-start md:text-left"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
