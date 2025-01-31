import { forwardRef } from 'react';
import { useAtom } from 'jotai';
import { cn } from '../../lib/utils';
import { themeAtom, getButtonVariants } from '../../lib/theme';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant = 'default',
  size = 'md',
  ...props
}, ref) => {
  const [theme] = useAtom(themeAtom);
  const variants = getButtonVariants(theme);

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        {
          'sm': 'h-8 px-3 text-sm',
          'md': 'h-10 px-4',
          'lg': 'h-12 px-6 text-lg'
        }[size],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = 'Button';

export { Button, type ButtonProps };