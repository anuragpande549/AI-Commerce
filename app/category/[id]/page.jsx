"use client";

import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import CartSheet from "@/components/CartSheet";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export default function CategoryPage() {
  const { id } = useParams();
  const router = useRouter();

  const decodedCategory = decodeURIComponent(id);
  const filteredProducts = products.filter(
    (p) => p.category === decodedCategory
  );
  console.log({filteredProducts, products,decodedCategory,id})
  return (
    <>
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.push("/categories")}
          className="text-sm text-gray-500 hover:underline mb-4"
        >
          ← Back to Categories
        </button>

        <h1 className="text-3xl font-bold">{decodedCategory}</h1>
        <p className="text-gray-500 mb-8">
          {filteredProducts.length} products found
        </p>

        {filteredProducts.length === 0 ? (
          <p className="text-gray-500">No products in this category.</p>
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
