"use client";

import { X, ShoppingBag, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";

export default function CartSheet() {
  const router = useRouter();
  const { cart, isOpen, setIsOpen, removeFromCart, total } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="relative z-50 w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShoppingBag size={20} />
            Your Cart
          </h2>
          <button onClick={() => setIsOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center gap-4">
              <ShoppingBag size={48} className="opacity-20" />
              <p>Your cart is empty</p>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Start Shopping
              </Button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="h-20 w-20 rounded-md border bg-gray-50 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <h4 className="font-medium text-sm line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="font-bold text-sm">
                      ${item.price * item.qty}
                    </p>
                  </div>

                  <div className="flex justify-between items-end">
                    <p className="text-xs text-gray-500">
                      Qty: {item.qty}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 text-xs hover:underline flex items-center gap-1"
                    >
                      <Trash2 size={12} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-between mb-4 text-lg font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <Button
              className="w-full py-6 text-lg"
              onClick={() => {
                setIsOpen(false);
                router.push("/checkout");
              }}
            >
              Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
