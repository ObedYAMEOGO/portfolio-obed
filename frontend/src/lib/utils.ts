import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const noOfWords = content ? content.split(/\s+/).length : 0;
  const minutes = Math.ceil(noOfWords / wordsPerMinute);
  return `${minutes} min read`;
}