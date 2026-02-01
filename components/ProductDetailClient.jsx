"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import Navbar from "@/components/Navbar";
import CartSheet from "@/components/CartSheet";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { Sparkles, Check, X, ThumbsUp, Loader2 } from "lucide-react";

export default function ProductDetailClient({ product, suggestedProducts }) {
  const router = useRouter(); // Initialize router
  const { addToCart } = useCart();
  
  // AI State
  const [aiData, setAiData] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // Fetch AI Data
  const fetchAIInsights = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch("/api/gemini/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: product.name,
          description: product.description,
          features: product.features,
          price: product.price,
        }),
      });
      const data = await res.json();
      if (res.ok) setAiData(data);
    } catch (error) {
      console.error("AI Error", error);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Main Product Image */}
          <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-sm h-fit">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Main Product Details */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">
                {product.category}
              </span>
              <h1 className="text-4xl font-extrabold text-gray-900 mt-2">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                ${product.price}
              </p>
            </div>

            <p className="text-gray-600 leading-relaxed text-lg">
              {product.description}
            </p>

            {/* AI Summary Section */}
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-6 transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                  <Sparkles className="text-indigo-600" size={20} />
                  AI Expert Review
                </h3>
                {!aiData && !loadingAI && (
                  <button
                    onClick={fetchAIInsights}
                    className="text-xs font-semibold bg-indigo-600 text-white px-3 py-1.5 rounded-full hover:bg-indigo-700 transition"
                  >
                    Generate Analysis
                  </button>
                )}
              </div>

              {loadingAI && (
                <div className="flex items-center gap-2 text-indigo-600 text-sm animate-pulse">
                  <Loader2 className="animate-spin" size={16} />
                  Analyzing product details...
                </div>
              )}

              {aiData && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  <p className="text-gray-700 italic border-l-4 border-indigo-300 pl-3">
                    "{aiData.summary}"
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-lg border border-green-100 shadow-sm">
                      <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-1 text-sm">
                        <Check size={14} /> Pros
                      </h4>
                      <ul className="space-y-1">
                        {aiData.pros?.map((pro, i) => (
                          <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                            • {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-red-100 shadow-sm">
                      <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-1 text-sm">
                        <X size={14} /> Cons
                      </h4>
                      <ul className="space-y-1">
                        {aiData.cons?.map((con, i) => (
                          <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                            • {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm mt-2">
                    <h4 className="font-semibold text-indigo-900 text-sm mb-1 flex items-center gap-1">
                       <ThumbsUp size={14} /> Why buy this?
                    </h4>
                    <p className="text-sm text-gray-600">{aiData.whyBuy}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Features List */}
            <div className="grid grid-cols-2 gap-3">
              {product.features?.map((f, i) => (
                <div
                  key={i}
                  className="text-sm font-medium bg-gray-50 text-gray-700 px-3 py-2 rounded-lg border border-gray-100"
                >
                  ✅ {f}
                </div>
              ))}
            </div>

            <Button
              className="py-6 text-lg w-full shadow-lg shadow-indigo-200 mt-4"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Suggested Products */}
        <section className="mt-20 border-t pt-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {suggestedProducts.map((p) => (
              <div
                key={p.id}
                className="group border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all bg-white cursor-pointer"
                onClick={() => router.push(`/product/${p.id}`)}
              >
                <div className="h-48 overflow-hidden bg-gray-100 relative">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-indigo-600 font-semibold mb-3">${p.price}</p>
                  <Button
                    className="w-full bg-gray-900 hover:bg-gray-800"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigating when clicking "Add to Cart"
                      addToCart(p);
                    }}
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