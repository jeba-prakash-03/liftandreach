import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'inverse';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  ...props
}) => {
  const base =
    'group inline-flex items-center justify-center font-body font-semibold transition-colors duration-200 rounded-[2px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  // 44px high for primary button (Part 3.1)
  const sizeClasses = {
    sm: 'text-[13px] h-[36px] px-4 gap-2',
    md: 'text-[14px] h-[44px] px-6 gap-2.5',
    lg: 'text-[15px] h-[48px] px-7 gap-3'
  };

  const variantClasses = {
    primary:
      'bg-[#1F4E96] text-[#F6F4F0] hover:bg-[#183E78] active:translate-y-px',
    secondary:
      'bg-transparent text-[#15191E] border-b border-[#15191E] hover:text-[#1F4E96] hover:border-[#1F4E96] px-0 h-auto rounded-none',
    ghost:
      'bg-transparent text-[#3A424C] hover:text-[#15191E] hover:bg-[#E8E4DD]',
    inverse:
      'bg-[#F6F4F0] text-[#15191E] hover:bg-white active:translate-y-px'
  };

  const isTextLink = variant === 'secondary';

  return (
    <button
      className={`${base} ${isTextLink ? '' : sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      <span>{children}</span>
      {icon ? (
        <span className="transition-transform duration-200 group-hover:translate-x-0.5">
          {icon}
        </span>
      ) : (
        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 stroke-[1.5]" />
      )}
    </button>
  );
};
