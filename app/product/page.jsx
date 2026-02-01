"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import CartSheet from "@/components/CartSheet";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH PRODUCT ---------------- */
  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${id}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          setProduct(null);
          return;
        }

        const data = await res.json();
        setProduct(data);

        // Fetch related products
        const all = await fetch("/api/products", { cache: "no-store" });
        const allProducts = await all.json();

        const related = allProducts
          .filter(
            (p) => p.category === data.category && p._id !== data._id
          )
          .slice(0, 4);

        setSuggested(related);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  /* ---------------- STATES ---------------- */
  if (loading) {
    return <div className="p-20 text-center">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="p-20 text-center text-gray-500">
        Product not found
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <>
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        {/* PRODUCT INFO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 mb-20">
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

            <p className="text-2xl font-bold mb-6">
              ${product.price}
            </p>

            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description}
            </p>

            {product.features?.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-8">
                {product.features.map((f, i) => (
                  <div
                    key={i}
                    className="text-sm bg-gray-100 px-3 py-2 rounded"
                  >
                    ✅ {f}
                  </div>
                ))}
              </div>
            )}

            <Button
              className="py-6 text-lg w-full"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </Button>
          </div>
        </div>

        {/* ---------------- SUGGESTED PRODUCTS ---------------- */}
        {suggested.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">
              You may also like
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {suggested.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  onClick={() => router.push(`/product/${p._id}`)}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <CartSheet />
    </>
  );
}
