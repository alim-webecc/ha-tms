"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type ThemeVariant = "minimal" | "comfort" | "compact"
type ColorMode = "light" | "dark"

type ThemeContextType = {
  variant: ThemeVariant
  colorMode: ColorMode
  setVariant: (variant: ThemeVariant) => void
  setColorMode: (mode: ColorMode) => void
  toggleColorMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [variant, setVariantState] = useState<ThemeVariant>("minimal")
  const [colorMode, setColorModeState] = useState<ColorMode>("light")

  useEffect(() => {
    // Load saved preferences
    const savedVariant = localStorage.getItem("hatoms-theme-variant") as ThemeVariant
    const savedColorMode = localStorage.getItem("hatoms-color-mode") as ColorMode

    if (savedVariant) {
      setVariantState(savedVariant)
    }
    if (savedColorMode) {
      setColorModeState(savedColorMode)
    } else {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setColorModeState(prefersDark ? "dark" : "light")
    }
  }, [])

  useEffect(() => {
    applyTheme(variant, colorMode)
  }, [variant, colorMode])

  const applyTheme = (themeVariant: ThemeVariant, mode: ColorMode) => {
    const root = document.documentElement

    // Set theme variant
    root.setAttribute("data-theme", themeVariant)

    // Set color mode
    if (mode === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }

  const setVariant = (newVariant: ThemeVariant) => {
    setVariantState(newVariant)
    localStorage.setItem("hatoms-theme-variant", newVariant)
  }

  const setColorMode = (mode: ColorMode) => {
    setColorModeState(mode)
    localStorage.setItem("hatoms-color-mode", mode)
  }

  const toggleColorMode = () => {
    setColorMode(colorMode === "light" ? "dark" : "light")
  }

  return (
    <ThemeContext.Provider value={{ variant, colorMode, setVariant, setColorMode, toggleColorMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
