const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export interface ApiVariant {
  variant: string;
  variantName: string;
  price: number;
}

export interface ApiProduct {
  product: string;
  productName: string;
  alternateName?: string;
  localName?: string;
  variants: ApiVariant[];
  image: string;
}

export async function getProducts(): Promise<ApiProduct[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/mathsya.mathsya.api.product.list`,
      {
        next: { revalidate: 60 },
        cache: "no-store", // Disable cache during development
      }
    );

    if (!response.ok) {
      console.error(`API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    const items = data?.data?.items ?? [];
    return Array.isArray(items) ? items : [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function getProductBySlug(
  slug: string
): Promise<ApiProduct | null> {
  const products = await getProducts();
  return products.find((p) => slugify(p.productName) === slug) ?? null;
}

export function getProductImage(product: ApiProduct): string {
  if (product.image) {
    return `${process.env.NEXT_PUBLIC_BASE_URL}${product.image}`;
  }
  const encodedName = encodeURIComponent(product.productName);
  return `https://placehold.co/400x400/d7e5f7/1a699d?text=${encodedName}`;
}

const variantDisplayNames: Record<string, string> = {
  WHOLE: "Cleaned Fish",
  FRY: "Fry Cut",
  CURRY: "Curry Cut",
};

export function getVariantDisplayName(variant: string): string {
  return variantDisplayNames[variant.toUpperCase()] || variant;
}

export function getWholePrice(product: ApiProduct): number {
  const whole = product.variants.find(
    (v) => v.variantName.toUpperCase() === "WHOLE"
  );
  return whole?.price ?? product.variants[0]?.price ?? 0;
}
