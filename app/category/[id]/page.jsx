import Link from "next/link";
import Navbar from "@/components/Navbar";
import CartSheet from "@/components/CartSheet";
import ProductCard from "@/components/ProductCard";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

// Ensure the page is dynamic so it fetches the latest products on every request
export const dynamic = "force-dynamic";

async function getCategoryProducts(categoryName) {
  try {
    await connectDB();
    
    // Fetch products where the 'category' field matches the URL parameter
    const products = await Product.find({ category: categoryName }).lean();

    // Serialize MongoDB objects (convert _id and dates to strings)
    return products.map((product) => ({
      ...product,
      _id: product._id.toString(),
      id: product._id.toString(), // Ensure 'id' exists for the ProductCard
      price: Number(product.price),
      stock: Number(product.stock),
    }));
  } catch (error) {
    console.error("Error fetching category products:", error);
    return [];
  }
}

export default async function CategoryPage({ params }) {
  // Await params (Required in Next.js 15/16)
  const { id } = await params;
  
  // Decode the URL parameter (e.g., "Home%20Decor" -> "Home Decor")
  const decodedCategory = decodeURIComponent(id);
  
  // Fetch data
  const filteredProducts = await getCategoryProducts(decodedCategory);

  return (
    <>
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <Link
          href="/categories"
          className="text-sm text-gray-500 hover:underline mb-4 inline-block"
        >
          ← Back to Categories
        </Link>

        <h1 className="text-3xl font-bold mt-2">{decodedCategory}</h1>
        <p className="text-gray-500 mb-8">
          {filteredProducts.length} products found
        </p>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl">
            <p className="text-gray-500 text-lg">No products found in this category.</p>
            <Link href="/" className="text-indigo-600 hover:underline mt-2 inline-block">
              Browse all products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <CartSheet />
    </>
  );
}