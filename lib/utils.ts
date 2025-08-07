import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Theme-aware class names helper
export function themeAwareClass(lightClass: string, darkClass: string, isDark: boolean) {
  return isDark ? darkClass : lightClass
}