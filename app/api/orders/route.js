import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

// GET: Fetch all orders (Admin use)
export async function GET() {
  await connectDB();
  const orders = await Order.find().sort({ createdAt: -1 });
  return NextResponse.json(orders);
}

// POST: Create a new order
export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    // Create the order in the database
    // Note: You might want to update your Order model to store 'items' too!
    const newOrder = await Order.create({
      customer: data.name, // Mapping "Full Name" to "customer"
      total: data.total,
      status: "Processing",
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Order Creation Error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}