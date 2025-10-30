"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Building2, ChevronDown, Search, Bell, User, Plus } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, tenant, logout, isAdmin, hasRole } = useAuth()

  if (pathname === "/login") {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-6">
        {/* Tenant Logo & Name */}
        <Link href="/" className="flex items-center gap-3 mr-4">
          {tenant?.logo ? (
            <Image
              src={tenant.logo || "/placeholder.svg"}
              alt={tenant.name}
              width={32}
              height={32}
              className="rounded"
            />
          ) : (
            <Building2 className="h-7 w-7 text-primary" />
          )}
          <span className="text-lg font-semibold hidden sm:inline">{tenant?.name || "HATOMS"}</span>
        </Link>

        {/* Main Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-1">
                Aufträge
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/auftrage/offen" className="cursor-pointer">
                  Offene Aufträge
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/auftrage/in-bearbeitung" className="cursor-pointer">
                  Aufträge in Bearbeitung
                </Link>
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem asChild>
                  <Link href="/auftrage/geschlossen" className="cursor-pointer">
                    Geschlossene Aufträge
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1">
                  Verwaltung
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/verwaltung/kunden" className="cursor-pointer">
                    Kunden verwalten
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/verwaltung/benutzer" className="cursor-pointer">
                    Benutzer verwalten
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/verwaltung/mitarbeiter-historie" className="cursor-pointer">
                    Mitarbeiter Beschäftigungshistorie
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/statistik" className="cursor-pointer">
                    Benutzer-Statistiken
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Global Search */}
        <div className="hidden lg:flex items-center relative w-64">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Suchen... (Strg+K)" className="pl-9 h-9" />
        </div>

        {/* Quick Actions */}
        <Button size="sm" className="hidden md:flex gap-2">
          <Plus className="h-4 w-4" />
          Neuer Auftrag
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
        </Button>

        {/* Theme Switcher */}
        <ThemeSwitcher />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profil</DropdownMenuItem>
            <DropdownMenuItem>Einstellungen</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              Abmelden
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
