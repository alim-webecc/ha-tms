"use client"

import { Palette, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/lib/theme-context"

export function ThemeSwitcher() {
  const { variant, colorMode, setVariant, setColorMode, toggleColorMode } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Palette className="h-5 w-5" />
          <span className="sr-only">Design wechseln</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Darstellung</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Palette className="mr-2 h-4 w-4" />
            <span>Theme-Variante</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={variant} onValueChange={(value) => setVariant(value as any)}>
              <DropdownMenuRadioItem value="minimal">
                <div className="flex flex-col">
                  <span className="font-medium">Elegant Minimal</span>
                  <span className="text-xs text-muted-foreground">Ruhig, großzügig</span>
                </div>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="comfort">
                <div className="flex flex-col">
                  <span className="font-medium">Comfort Card</span>
                  <span className="text-xs text-muted-foreground">Warm, kartenbasiert</span>
                </div>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="compact">
                <div className="flex flex-col">
                  <span className="font-medium">Compact Data Grid</span>
                  <span className="text-xs text-muted-foreground">Dicht, Power-User</span>
                </div>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuRadioGroup value={colorMode} onValueChange={(value) => setColorMode(value as any)}>
          <DropdownMenuRadioItem value="light">
            <Sun className="mr-2 h-4 w-4" />
            <span>Hell</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <Moon className="mr-2 h-4 w-4" />
            <span>Dunkel</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Kompakter Toggle für schnellen Wechsel
export function ColorModeToggle() {
  const { colorMode, toggleColorMode } = useTheme()

  return (
    <Button variant="ghost" size="icon" onClick={toggleColorMode}>
      {colorMode === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      <span className="sr-only">Farbmodus wechseln</span>
    </Button>
  )
}
