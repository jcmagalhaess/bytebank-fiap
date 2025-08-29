type Option = { label: string; value: string; bold?: boolean };

type SelectProps = {
  label?: string;
  options: Option[];
  error?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ label, options, error, ...props }: SelectProps) {
  return (
    <div className="relative">
      {label && <label className="font-semibold mb-1 block">{label}</label>}

      <div className="relative">
        <select
          {...props}
          className={`appearance-none w-full px-4 py-3 pr-10 border rounded-xl bg-white
          font-inter text-sm md:text-base text-ui-text-primary
          focus:outline-none focus:ring-2
          ${
            error
              ? "border-feedbackDanger ring-red-200"
              : "border-brandPrimary ring-blue-200"
          }`}
        >
          {options.map(({ label, value, bold }) => (
            <option
              key={value}
              value={value}
              className={`${bold ? "font-bold" : ""} text-sm md:text-base`}
            >
              {label}
            </option>
          ))}
        </select>

        {/* Ícone da seta */}
        <div className="pointer-events-none absolute right-3 top-[52%] transform -translate-y-1/2">
          <span className="material-symbols-outlined text-ui-text-secondary text-base">
            expand_more
          </span>
        </div>
      </div>
    </div>
  );
}
