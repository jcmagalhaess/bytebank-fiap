type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success' | 'warning' | 'info' | 'action';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  variant = 'primary',
  disabled = false,
  ...props
}: ButtonProps) {
  const base =
    'px-5 py-2 rounded-lg font-semibold transition-all duration-200 font-inter text-sm leading-5';

  const variants = {
    primary: 'bg-brandPrimary text-backgroundPrimary hover:bg-brandPrimaryHover w-full',
    secondary: 'bg-brandSecondary text-backgroundPrimary hover:bg-brandSecondaryHoverr',
    tertiary: 'bg-brandTertiary text-textPrimary hover:bg-brandTertiaryHover',
    success: 'bg-feedbackSuccess text-backgroundPrimary',
    warning: 'bg-feedbackWarning text-backgroundPrimary',
    danger: 'bg-feedbackDanger text-backgroundPrimary',
    info: 'bg-feedbackInfo text-backgroundPrimary',
    action: 'bg-feedbackAction text-backgroundPrimary',
  };

  const disabledStyles = {
    primary: 'bg-gray-200 text-gray-500 cursor-not-allowed',
    secondary: 'bg-gray-200 text-gray-500 cursor-not-allowed',
    tertiary: 'bg-background-muted text-gray-400 cursor-not-allowed',
    success: 'bg-gray-200 text-gray-500 cursor-not-allowed',
    warning: 'bg-gray-200 text-gray-500 cursor-not-allowed',
    danger: 'bg-gray-200 text-gray-500 cursor-not-allowed',
    info: 'bg-gray-200 text-gray-500 cursor-not-allowed',
    action: 'bg-gray-200 text-gray-500 cursor-not-allowed',
  };

  return (
    <button
      className={`${base} ${disabled ? disabledStyles[variant] : variants[variant]}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
