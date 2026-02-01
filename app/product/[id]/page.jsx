import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductDetailClient from "@/components/ProductDetailClient";
import { notFound } from "next/navigation";

// Helper to serialize MongoDB docs to plain JS objects
const serializeProduct = (product) => {
  if (!product) return null;
  return {
    ...product,
    _id: product._id.toString(),
    id: product._id.toString(), // Ensure frontend compatibility
    price: Number(product.price),
    stock: Number(product.stock),
    createdAt: product.createdAt?.toString(),
    updatedAt: product.updatedAt?.toString(),
  };
};

export default async function ProductDetailPage({ params }) {
  // 1. Await params (Required in Next.js 15/16)
  const { id } = await params;

  // 2. Connect to Database
  await connectDB();

  // 3. Fetch specific product
  let productDoc = null;
  try {
    productDoc = await Product.findById(id).lean();
  } catch (error) {
    // If ID format is invalid (e.g. not an ObjectId), trigger 404
    console.error("Invalid Product ID:", error);
    notFound();
  }

  if (!productDoc) {
    notFound();
  }

  // 4. Fetch suggested products (exclude current product)
  const suggestedDocs = await Product.find({ _id: { $ne: id } })
    .limit(4)
    .lean();

  // 5. Serialize data
  const product = serializeProduct(productDoc);
  const suggestedProducts = suggestedDocs.map(serializeProduct);

  // 6. Pass data to Client Component
  return (
    <ProductDetailClient 
      product={product} 
      suggestedProducts={suggestedProducts} 
    />
  );
}