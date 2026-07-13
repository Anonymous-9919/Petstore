import { ProductCard } from "./product-card";

interface Product {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  categorySlug: string;
  variant?: string;
  variantAr?: string;
  price: number;
  photo: string;
}

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="flex flex-wrap">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}
