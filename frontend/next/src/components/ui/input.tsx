type InputProps = {
  label?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1 text-base font-inter text-ui-text-primary">
      {label && <label className="font-semibold">{label}</label>}
      <input
        {...props}
        className={`px-4 py-3 border rounded-xl font-inter text-sm md:text-base text-ui-text-primary placeholder-ui-text-secondary
        focus:outline-none focus:ring-2
        ${
          error
            ? "border-feedbackDanger ring-red-200"
            : "border-brandPrimary ring-blue-200"
        }`}
      />
      {error && <span className="text-sm text-feedbackDanger">{error}</span>}
    </div>
  );
}
