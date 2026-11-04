"use client";

import * as React from "react";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-9 rounded-lg hover:bg-muted"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="تبديل المظهر الداكن / الفاتح"
    >
      {mounted && resolvedTheme === "dark" ? (
        <IconSun className="size-4.5" />
      ) : (
        <IconMoon className="size-4.5" />
      )}
    </Button>
  );
}
