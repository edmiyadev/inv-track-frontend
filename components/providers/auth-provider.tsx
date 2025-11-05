"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  username: string
  role: "admin" | "manager" | "staff" | "viewer"
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check authentication on mount and when page becomes visible
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("auth_token")
      const username = localStorage.getItem("username")
      const role = localStorage.getItem("user_role")

      if (token && username && role) {
        setUser({
          username,
          role: role as "admin" | "manager" | "staff" | "viewer",
        })
      }
      setIsLoading(false)
    }

    checkAuth()

    // Recheck auth when page becomes visible (tab switch, etc)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkAuth()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [])

  const logout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("username")
    localStorage.removeItem("user_role")
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
