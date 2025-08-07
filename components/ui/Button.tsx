// components/ui/Button.tsx
import React, { forwardRef } from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  ActivityIndicator,
  View
} from 'react-native';
import { cn } from '@/lib/utils';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: 'default' | 'destructive' | 'primary' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}

const buttonVariants = {
  variant: {
    default: 'bg-primary',
    destructive: 'bg-destructive',
    primary: 'bg-primary',
    outline: 'border border-primary bg-background text-primary',
    secondary: 'bg-secondary',
    ghost: 'bg-transparent',
    link: 'bg-transparent',
  },
  size: {
    default: 'h-12 px-4 py-2',
    sm: 'h-9 px-3 py-1',
    lg: 'h-14 px-8 py-3',
    icon: 'h-12 w-12',
  },
  text: {
    variant: {
      default: 'text-primary-foreground',
      destructive: 'text-destructive-foreground',
      primary: 'text-primary-foreground',
      outline: 'text-primary',
      secondary: 'text-secondary-foreground',
      ghost: 'text-foreground',
      link: 'text-primary underline',
    },
    size: {
      default: 'text-base font-semibold',
      sm: 'text-sm font-medium',
      lg: 'text-lg font-semibold',
      icon: 'text-base',
    },
  },
};

const Button = forwardRef<React.ComponentRef<typeof TouchableOpacity>, ButtonProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'default', 
    loading = false,
    disabled,
    children,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;
    
    const buttonClasses = cn(
      // Base styles
      'flex-row items-center justify-center rounded-lg',
      // Variant styles
      buttonVariants.variant[variant],
      // Size styles
      buttonVariants.size[size],
      // Disabled styles
      isDisabled && 'opacity-50',
      // Custom className
      className
    );

    const textClasses = cn(
      buttonVariants.text.variant[variant],
      buttonVariants.text.size[size]
    );

    const renderContent = () => {
      if (loading) {
        return (
          <View className="flex-row items-center">
            <ActivityIndicator 
              size="small" 
              color={variant === 'outline' || variant === 'ghost' ? '#666' : '#fff'} 
              style={{ marginRight: 8 }} 
            />
            {typeof children === 'string' ? (
              <Text className={textClasses}>Loading...</Text>
            ) : (
              children
            )}
          </View>
        );
      }

      if (typeof children === 'string') {
        return <Text className={textClasses}>{children}</Text>;
      }

      return children;
    };

    return (
      <TouchableOpacity
        ref={ref}
        className={buttonClasses}
        disabled={isDisabled}
        activeOpacity={0.8}
        {...props}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export default Button;
