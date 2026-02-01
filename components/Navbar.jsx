"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button"; // shadcn/ui button

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return null;

  return (
    <nav className="flex justify-between items-center px-6 py-4 border-b bg-background">
      {/* Brand */}
      <span
        onClick={() => router.push("/")}
        className="text-lg font-semibold cursor-pointer hover:text-primary transition-colors"
      >
        Lumina Store
      </span>

      {/* Right side */}
      {session ? (
        <div className="flex gap-3 items-center">
          {session.user.role === "admin" && (
            <Button
              variant="outline"
              onClick={() => router.push("/admin")}
            >
              Admin
            </Button>
          )}
          <Button
            variant="destructive"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Logout
          </Button>
        </div>
      ) : (
        <Button
          variant="default"
          onClick={() => router.push("/login")}
        >
          Login
        </Button>
      )}
    </nav>
  );
}
