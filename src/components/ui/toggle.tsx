'use client';
import React from 'react';
import clsx from 'clsx';

type ToggleOption = {
  label: string;
  value: string;
  color?: 'success' | 'action'; // controle de cor ativa
};

type ToggleGroupProps = {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
};

export function ToggleGroup({ options, value, onChange }: ToggleGroupProps) {
  return (
    <div className="flex bg-blue-100 p-1 rounded-xl w-fit">
      {options.map((option) => {
        const isActive = option.value === value;
        const activeColor =
          option.color === 'action'
            ? 'bg-feedbackAction text-backgroundPrimary'
            : 'bg-feedbackSuccess text-backgroundPrimary';

        return (
          <button
            key={option.value}
            type="button" 
            onClick={() => onChange(option.value)}
            className={clsx(
              'text-sm px-4 py-2 rounded-md font-semibold transition-all',
              isActive ? activeColor : 'text-textSecondary'
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
