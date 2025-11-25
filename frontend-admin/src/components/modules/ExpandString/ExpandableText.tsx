"use client";
import React, { useId, useState } from "react";

type ExpandProps = {
  text?: string | null;
  maxLength?: number;
  className?: string;
};

export const ExpandableText: React.FC<ExpandProps> = ({
  text,
  maxLength = 20,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const id = useId();

  if (!text || text.trim().length === 0) {
    return <span className={`text-sm text-zinc-600 ${className}`}>N/A</span>;
  }

  if (text.length <= maxLength) {
    return <span className={`text-sm ${className}`}>{text}</span>;
  }

  // Không cắt giữa từ
  const rawTrunc = text.slice(0, maxLength);
  const lastSpace = rawTrunc.lastIndexOf(" ");
  const truncated =
    lastSpace > 0 && lastSpace > maxLength * 0.6
      ? rawTrunc.slice(0, lastSpace)
      : rawTrunc;

  return (
    <span
      className={`relative inline-block text-sm cursor-pointer select-none ${className}`}
      onClick={() => setIsExpanded(!isExpanded)}
      id={id}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsExpanded(!isExpanded);
        }
      }}
      aria-expanded={isExpanded}
      aria-controls={id}
    >
      <span className={isExpanded ? "" : "whitespace-pre-wrap"}>
        {isExpanded ? text : truncated}
      </span>
      {!isExpanded && (
        <span className="ml-1 text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors">
          ...
        </span>
      )}
    </span>
  );
};
