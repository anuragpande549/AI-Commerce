import Link from "next/link";
import Navbar from "@/components/Navbar";
import CartSheet from "@/components/CartSheet";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

// Ensure this page is always rendered dynamically to show latest data
export const dynamic = "force-dynamic";

async function getCategories() {
  try {
    await connectDB();
    
    // Aggregation Pipeline:
    // 1. Group by category
    // 2. Count items in each group
    // 3. Grab the first image as the thumbnail
    const categories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          image: { $first: "$image" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id", // Rename '_id' to 'name' for easier use
          image: 1,
          count: 1,
        },
      },
      { $sort: { name: 1 } }, // Sort alphabetically
    ]);

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <>
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Shop by Category</h1>
        <p className="text-gray-500 mb-8">
          Browse our collections curated just for you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/category/${encodeURIComponent(cat.name)}`}
              className="relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-md group block"
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors z-10" />
              
              {/* Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              
              {/* Content */}
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white">
                <h3 className="text-3xl font-bold">{cat.name}</h3>
                <span className="mt-2 bg-white/20 px-3 py-1 rounded-full text-sm">
                  {cat.count} items
                </span>
              </div>
            </Link>
          ))}

          {categories.length === 0 && (
            <div className="col-span-full text-center text-gray-500 mt-12">
              No categories found.
            </div>
          )}
        </div>
      </main>

      <CartSheet />
    </>
  );
}