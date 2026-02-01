"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import CartSheet from "@/components/CartSheet";
import { products as INITIAL_PRODUCTS } from "@/data/products";

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(INITIAL_PRODUCTS.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = INITIAL_PRODUCTS.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Optional: Scroll to top of product list when changing pages
    window.scrollTo({ top: 500, behavior: "smooth" });
  };

  return (
    <>
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="bg-black text-white rounded-2xl p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md">
            <span className="text-indigo-400 font-bold text-sm uppercase">
              Summer Collection
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-6">
              Elevate Your Lifestyle Today.
            </h1>
            <a
              href="/categories"
              className="inline-block bg-white text-black px-8 py-4 rounded-md font-semibold hover:bg-gray-200 transition"
            >
              Shop Now
            </a>
          </div>

          <div className="hidden md:block w-1/3">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
              className="rounded-xl rotate-6 hover:rotate-0 transition-transform shadow-2xl"
              alt="Hero"
            />
          </div>
        </div>

        {/* Products Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">New Arrivals</h2>
          <p className="text-gray-500 mt-2">
            Showing {startIndex + 1}-
            {Math.min(startIndex + itemsPerPage, INITIAL_PRODUCTS.length)} of{" "}
            {INITIAL_PRODUCTS.length} products
          </p>
        </div>

        {/* Product Grid (Paginated) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* --- PAGINATION CONTROLS --- */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded border ${
                currentPage === 1
                  ? "text-gray-300 border-gray-200 cursor-not-allowed"
                  : "text-black border-gray-300 hover:bg-gray-100"
              }`}
            >
              Previous
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded border transition-colors ${
                  currentPage === page
                    ? "bg-black text-white border-black"
                    : "text-gray-600 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded border ${
                currentPage === totalPages
                  ? "text-gray-300 border-gray-200 cursor-not-allowed"
                  : "text-black border-gray-300 hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </main>

      <CartSheet />
    </>
  );
}