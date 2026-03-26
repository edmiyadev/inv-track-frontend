import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

//Este es un comentario
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
