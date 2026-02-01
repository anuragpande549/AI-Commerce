"use client";

export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white shadow ${className}`}
    >
      {children}
    </div>
  );
}
