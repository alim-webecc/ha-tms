"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type UserRole = "admin" | "disposition" | "fahrer" | "buchhaltung" | "gast"

interface Tenant {
  id: string
  name: string
  logo?: string
  primaryColor?: string
}

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  tenantId: string
}

interface AuthContextType {
  user: User | null
  tenant: Tenant | null
  login: (tenantId: string, userId: string, password: string) => boolean
  logout: () => void
  isAdmin: boolean
  hasRole: (roles: UserRole[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo-Tenants
const DEMO_TENANTS: Record<string, Tenant> = {
  "th-spedition": {
    id: "th-spedition",
    name: "TH Spedition",
    logo: "/placeholder-logo.svg",
    primaryColor: "oklch(0.491 0.115 192.901)",
  },
  hamut: {
    id: "hamut",
    name: "Hamut Transport",
    logo: "/placeholder-logo.svg",
    primaryColor: "oklch(0.55 0.18 35)",
  },
}

// Demo-Benutzer
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  "admin@th-spedition": {
    password: "admin",
    user: {
      id: "admin",
      name: "Admin User",
      email: "admin@th-spedition.de",
      role: "admin",
      tenantId: "th-spedition",
    },
  },
  "user@th-spedition": {
    password: "user",
    user: {
      id: "user",
      name: "Normal User",
      email: "user@th-spedition.de",
      role: "disposition",
      tenantId: "th-spedition",
    },
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [tenant, setTenant] = useState<Tenant | null>(null)

  useEffect(() => {
    // Load saved user and tenant
    const savedUser = localStorage.getItem("hatoms-user")
    const savedTenant = localStorage.getItem("hatoms-tenant")

    if (savedUser && savedTenant) {
      setUser(JSON.parse(savedUser))
      setTenant(JSON.parse(savedTenant))
      applyTenantBranding(JSON.parse(savedTenant))
    }
  }, [])

  const applyTenantBranding = (tenant: Tenant) => {
    if (tenant.primaryColor) {
      document.documentElement.style.setProperty("--tenant-primary", tenant.primaryColor)
      document.documentElement.setAttribute("data-tenant-color", "true")
    }
  }

  const login = (tenantId: string, userId: string, password: string): boolean => {
    const userKey = `${userId}@${tenantId}`
    const demoUser = DEMO_USERS[userKey]
    const demoTenant = DEMO_TENANTS[tenantId]

    if (demoUser && demoUser.password === password && demoTenant) {
      setUser(demoUser.user)
      setTenant(demoTenant)
      localStorage.setItem("hatoms-user", JSON.stringify(demoUser.user))
      localStorage.setItem("hatoms-tenant", JSON.stringify(demoTenant))
      applyTenantBranding(demoTenant)
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    setTenant(null)
    localStorage.removeItem("hatoms-user")
    localStorage.removeItem("hatoms-tenant")
    document.documentElement.removeAttribute("data-tenant-color")
  }

  const isAdmin = user?.role === "admin"

  const hasRole = (roles: UserRole[]) => {
    return user ? roles.includes(user.role) : false
  }

  return (
    <AuthContext.Provider value={{ user, tenant, login, logout, isAdmin, hasRole }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
