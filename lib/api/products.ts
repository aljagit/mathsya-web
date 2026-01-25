const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ApiProduct {
  product: string;
  productName: string;
  variant: string;
  variantName: string;
  price: number;
  image: string;
}

export interface ProductsResponse {
  items: ApiProduct[];
}

export async function getProducts(): Promise<ApiProduct[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/method/mathsya.mathsya.api.product.list`,
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

export function getProductImage(product: ApiProduct): string {
  if (product.image) {
    return product.image;
  }
  // Fallback to placeholder with product name
  const encodedName = encodeURIComponent(product.productName);
  return `https://placehold.co/400x400/d7e5f7/1a699d?text=${encodedName}`;
}
