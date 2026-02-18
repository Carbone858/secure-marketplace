"use client"

import * as React from "react"
import { Moon, Sun, Leaf, Check } from "lucide-react"
import { useTheme } from "@/components/providers/ThemeProvider"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setMode, resolvedTheme, brandTheme, setBrandTheme } = useTheme()
  const [open, setOpen] = React.useState(false)

  // Close on scroll
  React.useEffect(() => {
    if (!open) return;
    const handleScroll = () => setOpen(false);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [open]);

  const handleSelectTheme = (theme: 'light' | 'dark' | 'emerald') => {
    setOpen(false)
    if (theme === 'emerald') {
      setMode('light')
      setBrandTheme('emerald')
    } else {
      setMode(theme)
      setBrandTheme(null)
    }
  }

  // Determine active state for UI
  const isEmerald = brandTheme?.name === 'emerald'
  const isLight = resolvedTheme === 'light' && !brandTheme
  const isDark = resolvedTheme === 'dark' && !brandTheme

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group">
          <Sun
            className={`h-[1.2rem] w-[1.2rem] transition-all absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 dark:scale-0 text-orange-500 ${isEmerald ? 'opacity-0 scale-0 rotate-90' : 'scale-100 rotate-0'}`}
          />
          <Moon
            className={`h-[1.2rem] w-[1.2rem] transition-all absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 dark:scale-100 dark:rotate-0 scale-0 rotate-90 text-blue-400 ${isEmerald ? 'opacity-0 scale-0 rotate-90' : ''}`}
          />
          <Leaf
            className={`h-[1.2rem] w-[1.2rem] transition-all absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-600 ${isEmerald ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0'}`}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Select Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => handleSelectTheme('light')} className="gap-2 cursor-pointer">
          <Sun className="h-4 w-4 text-orange-500" />
          <span>Light Luxury</span>
          {isLight && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleSelectTheme('dark')} className="gap-2 cursor-pointer">
          <Moon className="h-4 w-4 text-blue-500" />
          <span>Dark Luxury</span>
          {isDark && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => handleSelectTheme('emerald')} className="gap-2 cursor-pointer bg-emerald-50 dark:bg-emerald-950/20">
          <Leaf className="h-4 w-4 text-emerald-600" />
          <span>Emerald Professional</span>
          {isEmerald && <Check className="ml-auto h-4 w-4 text-emerald-600" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
