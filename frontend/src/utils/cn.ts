import { twMerge } from "tailwind-merge";
import { clsx, ClassValue } from "clsx";

/**
 * A utility function to merge Tailwind CSS classes without conflict
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
