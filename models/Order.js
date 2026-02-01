import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    customer: String,
    total: Number,
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered"],
      default: "Processing",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);
