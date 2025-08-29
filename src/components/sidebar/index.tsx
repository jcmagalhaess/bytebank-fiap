'use client';
import React from 'react';
import clsx from 'clsx';

type SidebarItem = {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
};

type SidebarProps = {
  title?: string;
  variant?: 'default' | 'card';
  items?: SidebarItem[];
  centered?: boolean;
  showIcons?: boolean;
  titleActions?: React.ReactNode[];
   width?: string;
};

export function Sidebar({
  title,
  variant = 'default',
  items = [],
  centered = false,
  showIcons = true,
  titleActions = [],
  width,
}: SidebarProps) {
  return (
    <aside
      className={clsx(
        'flex flex-col p-4 rounded-md font-sans',
        variant === 'default' && 'bg-gray-100',
        variant === 'card' && 'bg-white border border-gray-200',
		 width ? width : variant === 'default' ? 'w-[220px]' : 'w-full', 
      )}
    >
      {title && (
        <div
          className={clsx(
            'flex items-center justify-between mb-4',
            centered && 'justify-center text-center'
          )}
        >
          <h2 className="text-base font-semibold">{title}</h2>
          {titleActions.length > 0 && (
            <div className="flex gap-2">
              {titleActions.map((action, index) => (
                <div key={index}>{action}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {items.map((item, index) => (
        <button
          key={index}
          onClick={item.onClick}
          className={clsx(
            'flex gap-2 px-2 py-2 text-sm font-medium transition-all',
            centered ? 'justify-center text-center' : 'items-center',
            item.active
              ? 'text-green-600 font-bold border-b-2 border-green-500'
              : 'text-gray-700 border-b-2 border-transparent hover:bg-gray-200'
          )}
        >
          {showIcons && item.icon && <span>{item.icon}</span>}
          <span>{item.label}</span>
        </button>
      ))}
    </aside>
  );
}
