"use client";

import { Loader2 } from "lucide-react";

export function Button({
  children,
  className = "",
  variant = "primary",
  loading = false,
  ...props
}) {
  const variants = {
    primary: "bg-black text-white hover:bg-black/90",
    outline: "border border-gray-300 hover:bg-gray-100",
    ghost: "hover:bg-gray-100",
    destructive: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition ${
        variants[variant]
      } ${className}`}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
