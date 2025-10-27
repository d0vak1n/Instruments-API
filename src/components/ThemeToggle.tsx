import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant='outline' size='icon' className='w-10 h-10'>
        <Sun className='h-5 w-5' />
      </Button>
    );
  }

  return (
    <Button
      variant='outline'
      size='icon'
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className='w-10 h-10 transition-all hover:scale-105'
    >
      <Sun className='h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0' />
      <Moon className='absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100' />
      <span className='sr-only'>Cambiar tema</span>
    </Button>
  );
}
