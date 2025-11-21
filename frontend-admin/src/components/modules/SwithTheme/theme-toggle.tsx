"use client";

import { useEffect, useState } from "react";

import { useTheme } from "next-themes";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        size="sm"
        className="min-w-10 h-8 w-10"
        aria-label="Loading theme toggle"
        isDisabled
        isIconOnly
        variant="bordered"
      >
        <Icon
          icon="meteocons:clear-day-fill"
          className="h-6 w-6 transition-transform duration-200"
        />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      size="lg"
      onPress={() => setTheme(isDark ? "light" : "dark")}
      className="min-w-15 h-10 w-10"
      variant="bordered"
      isIconOnly
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      {isDark ? (
        <Icon
          icon="meteocons:clear-day-fill"
          className="h-6 w-6 transition-transform duration-200"
        />
      ) : (
        <Icon
          icon="meteocons:clear-night-fill"
          className="h-6 w-6 transition-transform duration-200"
        />
      )}
    </Button>
  );
}
