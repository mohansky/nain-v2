import React from 'react'
import { TouchableOpacity, Text, View } from 'react-native'
import { useTheme } from '@/lib/ThemeContext'

const ThemeToggle = () => {
  const { theme, isDark, setTheme } = useTheme()

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    console.log('Theme changing from', theme, 'to', newTheme)
    setTheme(newTheme)
  }

  const themes = [
    { key: 'light', label: 'Light', icon: '☀️' },
    { key: 'dark', label: 'Dark', icon: '🌙' },
    { key: 'system', label: 'System', icon: '💻' },
  ] as const

  return (
    <View>
      {/* Debug info */}
      <Text className="text-xs text-muted-foreground mb-2 text-center">
        Current: {theme} | Dark: {isDark ? 'Yes' : 'No'}
      </Text>
      
      <View className="flex-row bg-card border border-border rounded-lg p-1">
        {themes.map((themeOption) => (
        <TouchableOpacity
          key={themeOption.key}
          onPress={() => handleThemeChange(themeOption.key)}
          className={`px-3 py-2 rounded-md flex-1 items-center ${
            theme === themeOption.key
              ? 'bg-primary'
              : 'bg-transparent'
          }`}
        >
          <Text className="text-xs mb-1">{themeOption.icon}</Text>
          <Text
            className={`text-xs font-medium ${
              theme === themeOption.key
                ? 'text-primary-foreground'
                : 'text-muted-foreground'
            }`}
          >
            {themeOption.label}
          </Text>
        </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

export default ThemeToggle