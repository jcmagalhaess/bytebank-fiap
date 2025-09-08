"use client";
import React from "react";
import { IconProps } from "./IconProps";

export function ArrowRightIcon({
  className = "",
  bgColor = "transparent",
  size,
}: IconProps) {
  return (
    <div
      className={`w-10 h-10 flex items-center justify-center rounded-full ${bgColor}`}
    >
      <span
        className={`material-symbols-outlined text-xl ${className}`}
      >
        chevron_right
      </span>
    </div>
  );
}
