"use client";

import Navbar from "@/components/Navbar";
import CartSheet from "@/components/CartSheet";
import { products } from "@/data/products";
import { useRouter } from "next/navigation";

export default function CategoriesPage() {
  const router = useRouter();

  const categories = [...new Set(products.map((p) => p.category))].map(
    (cat) => ({
      name: cat,
      image: products.find((p) => p.category === cat)?.image,
      count: products.filter((p) => p.category === cat).length,
    })
  );

  return (
    <>
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Shop by Category</h1>
        <p className="text-gray-500 mb-8">
          Browse our collections curated just for you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() =>
                router.push(`/category/${encodeURIComponent(cat.name)}`)
              }
              className="relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-md group"
            >
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors z-10" />
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white">
                <h3 className="text-3xl font-bold">{cat.name}</h3>
                <span className="mt-2 bg-white/20 px-3 py-1 rounded-full text-sm">
                  {cat.count} items
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <CartSheet />
    </>
  );
}
