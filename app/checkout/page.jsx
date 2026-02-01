"use client";

import Navbar from "@/components/Navbar";
import CartSheet from "@/components/CartSheet";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="p-20 text-center">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <Button onClick={() => router.push("/")}>Go Shopping</Button>
        </div>
      </>
    );
  }

  const handleCheckout = () => {
    setLoading(true);
    setTimeout(() => {
      clearCart();
      router.push("/");
      alert("Order placed successfully!");
    }, 2000);
  };

  return (
    <>
      <Navbar />

      <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold">Checkout</h1>

          <div className="space-y-4">
            <Input placeholder="Full Name" />
            <Input placeholder="Email Address" />
            <Input placeholder="Shipping Address" />
            <Input placeholder="City" />
            <Input placeholder="Zip Code" />
          </div>
        </div>

        {/* Summary */}
        <div className="border rounded-xl p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          <div className="space-y-3 mb-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.name} × {item.qty}
                </span>
                <span>${item.price * item.qty}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <Button
            className="w-full mt-6 py-6 text-lg"
            loading={loading}
            onClick={handleCheckout}
          >
            {loading ? "Processing..." : "Place Order"}
          </Button>
        </div>
      </main>

      <CartSheet />
    </>
  );
}
