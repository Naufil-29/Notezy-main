// A helper for merging class names safely
import { ClassValue, clsx } from "clsx"
import { ClassType } from "react"
import { twMerge } from "tailwind-merge"

// cn() is used in Shadcn components for combining class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format a JS Date into something like "Sep 4, 2025"
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}
