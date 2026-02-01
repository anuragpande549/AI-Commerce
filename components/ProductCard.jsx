"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function ProductCard({ product }) {
  const router = useRouter();
  const { addToCart } = useCart();

  return (
    <Card className="overflow-hidden group flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div
        className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer"
        onClick={() => router.push(`/product/${product.id}`)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />

        {product.stock < 5 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            Low Stock
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p
              className="text-sm text-gray-500 mb-1 hover:underline cursor-pointer"
              onClick={() => router.push(`/category/${product.category}`)}
            >
              {product.category}
            </p>

            <h3
              className="font-semibold text-lg leading-tight cursor-pointer hover:text-indigo-600"
              onClick={() => router.push(`/product/${product.id}`)}
            >
              {product.name}
            </h3>
          </div>

          <span className="font-bold text-lg">${product.price}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>

        <Button onClick={() => addToCart(product)} className="mt-auto">
          Add to Cart
        </Button>
      </div>
    </Card>
  );
}
