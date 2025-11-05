"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface UseFormSubmitOptions {
  successMessage?: string
  redirectTo?: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useFormSubmit(options: UseFormSubmitOptions = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async <T,>(data: T, submitFn: (data: T) => Promise<void>) => {
    setIsSubmitting(true)
    setError(null)

    try {
      await submitFn(data)

      if (options.successMessage) {
        // In a real app, show toast notification
        console.log("[v0] Success:", options.successMessage)
      }

      if (options.onSuccess) {
        options.onSuccess()
      }

      if (options.redirectTo) {
        router.push(options.redirectTo)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)

      if (options.onError && err instanceof Error) {
        options.onError(err)
      }

      console.error("[v0] Form submission error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    isSubmitting,
    error,
    handleSubmit,
    clearError: () => setError(null),
  }
}
