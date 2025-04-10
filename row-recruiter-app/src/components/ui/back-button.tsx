"use client";

import { useRouter } from "next/navigation";
import { Button } from "./button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  className?: string;
  label?: string;
}

export function BackButton({ className = "", label = "Back" }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      className={`flex items-center gap-2 bg-transparent hover:bg-gray-100/10 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  );
} 