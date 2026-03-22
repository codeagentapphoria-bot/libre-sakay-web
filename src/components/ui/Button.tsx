import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth = false, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
          {
            'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg': variant === 'primary',
            'bg-secondary-600 text-white hover:bg-secondary-700 shadow-md hover:shadow-lg': variant === 'secondary',
            'border-2 border-gray-200 text-gray-600 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50': variant === 'outline',
            'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900': variant === 'ghost',
          },
          {
            'px-3 py-1.5 text-sm min-h-[36px]': size === 'sm',
            'px-4 py-2.5 text-base min-h-touch': size === 'md',
            'px-6 py-3 text-lg min-h-[48px]': size === 'lg',
          },
          fullWidth && 'w-full',
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
export default Button;
