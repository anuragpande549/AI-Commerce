import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order"; // Corrected import

export async function DELETE(request, { params }) {
  const { id } = await params; // Await params for Next.js 15+

  await connectDB();
  await Order.findByIdAndDelete(id); // Delete Order, not Product

  return NextResponse.json({ success: true });
}

export async function PUT(request, { params }) {
  const { id } = await params; // Await params for Next.js 15+
  const body = await request.json();
  console.log(id, body)
  await connectDB();
  // Update Order, not Product
  const updated = await Order.findByIdAndUpdate(id, body, {
    new: true,
  });

  return NextResponse.json(updated);
}