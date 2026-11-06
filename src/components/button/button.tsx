import React from 'react';
import styles from './button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className,
  type = 'button',
  ...rest
}) => {
  const variantClass = styles[variant] || styles.primary;
  const combinedClassName = [styles.button, variantClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={combinedClassName} {...rest}>
      {children}
    </button>
  );
};

