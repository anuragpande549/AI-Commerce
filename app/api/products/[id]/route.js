import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function DELETE(_, { params }) {
  await connectDB();
  await Product.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}

export async function PUT(req, { params }) {
  await connectDB();
  const data = await req.json();
  const updated = await Product.findByIdAndUpdate(params.id, data, {
    new: true,
  });
  return NextResponse.json(updated);
}
