import { getProductsFromDB } from "@/lib/getProducts";
import ProductList from "@/components/ProductList";

export const dynamic = "force-dynamic"; // Ensures data is always fresh

export default async function HomePage() {
  // 1. Fetch data from MongoDB
  const products = await getProductsFromDB();

  // 2. Serialize data to ensure it works with Client Components
  // We map '_id' to 'id' so your ProductCard and Routes work correctly.
  const serializedProducts = products.map((product) => ({
    ...product,
    _id: product._id.toString(),
    id: product._id.toString(), // Fixes the "undefined" URL issue
    price: Number(product.price),
    stock: Number(product.stock),
  }));

  // 3. Pass data to the client component
  return <ProductList products={serializedProducts} />;
}