"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [tenantId, setTenantId] = useState("")
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [tenantPreview, setTenantPreview] = useState<{ name: string; logo?: string } | null>(null)

  // Check for saved tenant
  useEffect(() => {
    const savedTenant = localStorage.getItem("hatoms-last-tenant")
    if (savedTenant) {
      setTenantId(savedTenant)
      checkTenant(savedTenant)
    }
  }, [])

  const checkTenant = (id: string) => {
    // Simulate tenant lookup
    if (id === "th-spedition") {
      setTenantPreview({ name: "TH Spedition", logo: "/placeholder-logo.svg" })
    } else if (id === "hamut") {
      setTenantPreview({ name: "Hamut Transport", logo: "/placeholder-logo.svg" })
    } else if (id) {
      setTenantPreview(null)
    }
  }

  const handleTenantChange = (value: string) => {
    setTenantId(value)
    checkTenant(value)
    setError("")
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!tenantId) {
      setError("Bitte geben Sie eine Firmenkennung ein")
      return
    }

    const success = login(tenantId, userId, password)
    if (success) {
      if (rememberMe) {
        localStorage.setItem("hatoms-last-tenant", tenantId)
      }
      router.push("/")
    } else {
      setError("Ungültige Anmeldedaten oder Firmenkennung")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            {tenantPreview ? (
              <div className="flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-lg">
                {tenantPreview.logo ? (
                  <Image
                    src={tenantPreview.logo || "/placeholder.svg"}
                    alt={tenantPreview.name}
                    width={24}
                    height={24}
                  />
                ) : (
                  <Building2 className="h-6 w-6 text-primary" />
                )}
                <span className="text-lg font-semibold">{tenantPreview.name}</span>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                <Building2 className="h-6 w-6 text-muted-foreground" />
                <span className="text-lg font-semibold text-muted-foreground">HATOMS</span>
              </div>
            )}
          </div>
          <div>
            <CardTitle className="text-2xl">Anmeldung</CardTitle>
            <CardDescription>
              {tenantPreview ? `Melden Sie sich bei ${tenantPreview.name} an` : "Geben Sie Ihre Firmenkennung ein"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Alert>
              <AlertDescription className="text-xs space-y-1">
                <p>
                  <strong>Demo-Firmenkennungen:</strong>
                </p>
                <p>• th-spedition (TH Spedition)</p>
                <p>• hamut (Hamut Transport)</p>
                <p className="mt-2">
                  <strong>Demo-Zugänge:</strong>
                </p>
                <p>Admin: "admin" / "admin"</p>
                <p>User: "user" / "user"</p>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="tenantId">Firmenkennung *</Label>
              <Input
                id="tenantId"
                type="text"
                placeholder="z.B. th-spedition"
                value={tenantId}
                onChange={(e) => handleTenantChange(e.target.value)}
                required
              />
            </div>

            {tenantPreview && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="userId">Benutzername *</Label>
                  <Input
                    id="userId"
                    type="text"
                    placeholder="Ihr Benutzername"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Passwort *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Ihr Passwort"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                      Angemeldet bleiben
                    </Label>
                  </div>
                  <Button variant="link" className="px-0 text-sm" type="button">
                    Passwort vergessen?
                  </Button>
                </div>

                <Button type="submit" className="w-full">
                  Anmelden
                </Button>
              </>
            )}
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p>
              <Button variant="link" className="px-1 h-auto text-xs" type="button">
                Impressum
              </Button>
              •
              <Button variant="link" className="px-1 h-auto text-xs" type="button">
                Datenschutz
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
