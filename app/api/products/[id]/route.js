import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  // Fix: Await the params object before accessing properties
  const { id } = await params;
  
  await connectDB();
  await Product.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}

export async function PUT(req, { params }) {
  // Fix: Await the params object
  const { id } = await params;
  
  await connectDB();
  const data = await req.json();
  const updated = await Product.findByIdAndUpdate(id, data, {
    new: true,
  });
  return NextResponse.json(updated);
}