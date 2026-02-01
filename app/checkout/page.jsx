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

  // State to capture form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  const handleCheckout = async () => {
    if (!formData.name || !formData.email) {
      alert("Please fill in your details.");
      return;
    }

    setLoading(true);

    try {
      // 1. Send data to your API
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          cartItems: cart, // Sending cart items (even if your current model doesn't save them yet)
          total: total,
        }),
      });

      if (res.ok) {
        // 2. Clear cart and redirect on success
        clearCart();
        router.push("/");
        alert("Order placed successfully!");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold">Checkout</h1>

          <div className="space-y-4">
            <Input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <Input
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
            />
            <Input
              name="address"
              placeholder="Shipping Address"
              value={formData.address}
              onChange={handleInputChange}
            />
            <Input
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
            />
            <Input
              name="zip"
              placeholder="Zip Code"
              value={formData.zip}
              onChange={handleInputChange}
            />
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
                <span>${(item.price * item.qty).toFixed(2)}</span>
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