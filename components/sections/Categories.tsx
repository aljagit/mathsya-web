import Link from "next/link";

interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

const categories: Category[] = [
  {
    id: "pomfret",
    name: "Premium Pomfret",
    description: "White & Black Pomfret",
    href: "/products/pomfret",
    color: "bg-sky-100 text-sky-700",
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="currentColor">
        <ellipse cx="24" cy="24" rx="16" ry="12" />
        <polygon points="40,24 48,18 48,30" />
        <circle cx="14" cy="22" r="2" fill="white" />
        <ellipse cx="26" cy="16" rx="6" ry="4" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: "prawns",
    name: "Tiger Prawns",
    description: "Fresh & deveined",
    href: "/products/prawns",
    color: "bg-orange-100 text-orange-700",
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="currentColor">
        <path d="M10 28 Q8 20 14 14 Q22 10 30 14 Q38 20 36 28 Q34 34 26 36 Q18 38 10 28" />
        <path
          d="M36 28 Q40 32 44 36"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="16" cy="20" r="2" fill="white" />
      </svg>
    ),
  },
  {
    id: "mackerel",
    name: "Mackerel (Ayala)",
    description: "Kerala favourite",
    href: "/products/mackerel",
    color: "bg-blue-100 text-blue-700",
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="currentColor">
        <ellipse cx="22" cy="24" rx="14" ry="7" />
        <polygon points="36,24 46,18 46,30" />
        <circle cx="12" cy="23" r="2" fill="white" />
        <path d="M18 24 L30 24" stroke="white" strokeWidth="1" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: "crabs",
    name: "Fresh Crabs",
    description: "Live & cleaned",
    href: "/products/crabs",
    color: "bg-red-100 text-red-700",
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="currentColor">
        <ellipse cx="24" cy="28" rx="12" ry="8" />
        <circle cx="20" cy="24" r="2" fill="white" />
        <circle cx="28" cy="24" r="2" fill="white" />
        <path
          d="M12 28 Q6 24 4 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M36 28 Q42 24 44 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "kingfish",
    name: "King Fish (Neymeen)",
    description: "Premium steaks",
    href: "/products/kingfish",
    color: "bg-indigo-100 text-indigo-700",
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="currentColor">
        <ellipse cx="20" cy="24" rx="16" ry="9" />
        <polygon points="36,24 48,16 48,32" />
        <circle cx="10" cy="22" r="2.5" fill="white" />
        <ellipse cx="24" cy="17" rx="8" ry="5" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: "squid",
    name: "Squid (Koonthal)",
    description: "Cleaned & rings",
    href: "/products/squid",
    color: "bg-purple-100 text-purple-700",
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="currentColor">
        <ellipse cx="24" cy="18" rx="10" ry="12" />
        <path d="M18 30 Q16 40 14 46" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M22 30 Q22 40 22 46" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M26 30 Q26 40 26 46" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M30 30 Q32 40 34 46" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="20" cy="14" r="2" fill="white" />
        <circle cx="28" cy="14" r="2" fill="white" />
      </svg>
    ),
  },
  {
    id: "sardine",
    name: "Sardine (Mathi)",
    description: "Small & flavourful",
    href: "/products/sardine",
    color: "bg-cyan-100 text-cyan-700",
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="currentColor">
        <ellipse cx="22" cy="24" rx="12" ry="5" />
        <polygon points="34,24 42,20 42,28" />
        <circle cx="14" cy="23" r="1.5" fill="white" />
      </svg>
    ),
  },
  {
    id: "anchovy",
    name: "Anchovy (Netholi)",
    description: "Perfect for fry",
    href: "/products/anchovy",
    color: "bg-teal-100 text-teal-700",
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="currentColor">
        <ellipse cx="20" cy="24" rx="10" ry="4" />
        <polygon points="30,24 38,21 38,27" />
        <circle cx="14" cy="23" r="1" fill="white" />
      </svg>
    ),
  },
];

export function Categories() {
  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Shop by Category
          </h2>
          <p className="mt-2 text-muted-foreground">
            Fresh catch from the waters of Kerala
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group flex flex-col items-center rounded-xl border border-border bg-card p-4 text-center transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div
                className={`mb-3 flex h-14 w-14 items-center justify-center rounded-full ${category.color} transition-transform group-hover:scale-110`}
              >
                {category.icon}
              </div>
              <h3 className="mb-0.5 text-sm font-semibold text-foreground">
                {category.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
