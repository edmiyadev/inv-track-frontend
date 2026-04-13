import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseApiDateToLocalDate(value: string): Date | null {
  const normalizedDate = value.includes("T") ? value.split("T")[0] : value.split(" ")[0]
  const [year, month, day] = normalizedDate.split("-").map(Number)

  if (!year || !month || !day) {
    return null
  }

  const parsed = new Date(year, month - 1, day)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}
