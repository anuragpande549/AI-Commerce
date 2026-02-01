"use client";

import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import CartSheet from "@/components/CartSheet";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));
  const { addToCart } = useCart();

  if (!product) {
    return (
      <div className="p-20 text-center text-gray-500">
        Product not found
      </div>
    );
  }

  // Suggested products (exclude current one, pick first 4)
  const suggestedProducts = products
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <Navbar />

      <main className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="bg-gray-100 rounded-2xl overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div>
            <span className="text-sm font-bold text-indigo-600 uppercase">
              {product.category}
            </span>

            <h1 className="text-4xl font-bold mt-2 mb-4">
              {product.name}
            </h1>

            <p className="text-2xl font-bold mb-4">${product.price}</p>

            <p className="text-gray-600 mb-6">{product.description}</p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {product.features?.map((f, i) => (
                <div
                  key={i}
                  className="text-sm bg-gray-100 px-3 py-2 rounded"
                >
                  ✅ {f}
                </div>
              ))}
            </div>

            <Button
              className="py-6 text-lg w-full"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Suggested Products */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {suggestedProducts.map((p) => (
              <div
                key={p.id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  <p className="text-gray-600">${p.price}</p>
                  <Button
                    className="mt-3 w-full"
                    onClick={() => addToCart(p)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <CartSheet />
    </>
  );
}
