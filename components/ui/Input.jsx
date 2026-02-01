"use client";

export function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black ${className}`}
    />
  );
}
