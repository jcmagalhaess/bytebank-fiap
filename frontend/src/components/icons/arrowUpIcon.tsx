"use client";
import React from "react";
import { IconProps } from "./IconProps";

export function ArrowUpIcon({
  className = "",
  bgColor = "bg-feedbackSuccess",
  size,
}: IconProps) {
  return (
    <div
      className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${bgColor}`}
    >
      <span
        className={`material-symbols-outlined text-xl ${className}`}
      >
        arrow_upward
      </span>
    </div>
  );
}
