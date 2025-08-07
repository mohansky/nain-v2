import React, { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useColorScheme } from 'react-native'
import { useColorScheme as useNativeWindColorScheme } from 'nativewind'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  isDark: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_STORAGE_KEY = '@app_theme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme()
  const { setColorScheme } = useNativeWindColorScheme()
  const [theme, setThemeState] = useState<Theme>('system')
  const [isLoaded, setIsLoaded] = useState(false)

  // Determine if dark mode is active
  const isDark = theme === 'dark' || (theme === 'system' && systemColorScheme === 'dark')

  // Load theme from storage on mount
  useEffect(() => {
    loadTheme()
  }, [])

  // Update theme when system color scheme changes and theme is set to 'system'
  useEffect(() => {
    if (isLoaded && theme === 'system') {
      const colorScheme = systemColorScheme === 'dark' ? 'dark' : 'light'
      console.log('System theme changed to:', systemColorScheme, 'applying:', colorScheme)
      setColorScheme(colorScheme)
    }
  }, [systemColorScheme, isLoaded, theme])

  // Save theme to storage and apply to NativeWind whenever it changes  
  useEffect(() => {
    if (isLoaded) {
      saveTheme(theme)
      // Apply theme to NativeWind
      const colorScheme = isDark ? 'dark' : 'light'
      console.log('Applying color scheme:', colorScheme, 'for theme:', theme, 'isDark:', isDark)
      setColorScheme(colorScheme)
    }
  }, [theme, isLoaded, isDark])

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY)
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeState(savedTheme as Theme)
      }
      // Set initial color scheme  
      const effectiveTheme = savedTheme || 'system'
      const currentIsDark = effectiveTheme === 'dark' || (effectiveTheme === 'system' && systemColorScheme === 'dark')
      console.log('Initial theme setup - savedTheme:', savedTheme, 'effectiveTheme:', effectiveTheme, 'systemColorScheme:', systemColorScheme, 'currentIsDark:', currentIsDark)
      setColorScheme(currentIsDark ? 'dark' : 'light')
    } catch (error) {
      console.error('Error loading theme:', error)
    } finally {
      setIsLoaded(true)
    }
  }

  const saveTheme = async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme)
    } catch (error) {
      console.error('Error saving theme:', error)
    }
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const value: ThemeContextType = {
    theme,
    isDark,
    setTheme,
    toggleTheme,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export default ThemeContext