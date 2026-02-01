import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function getProductsFromDB() {
  try {
    // 1. Ensure the database is connected
    await connectDB();

    // 2. Fetch all products from the Product model
    // .lean() converts the Mongoose document into a plain JavaScript object
    const products = await Product.find({}).lean();

    // 3. Return the data
    return products;
  } catch (error) {
    console.error("Error fetching products from MongoDB:", error);
    return [];
  }
}