import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function DELETE(request, context) {
  const { id } = await context.params;

  await connectDB();
  await Product.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}

export async function PUT(request, context) {
  const { id } = await context.params;
  const body = await request.json();

  await connectDB();
  const updated = await Product.findByIdAndUpdate(id, body, {
    new: true,
  });

  return NextResponse.json(updated);
}
