
import { Button } from "@/components/ui/button";
import { Moon, Sun, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export const Header = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDarkMode = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(isDarkMode);
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass transition-all duration-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 fade-in">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              AI Agent
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8 fade-in" style={{ animationDelay: '0.2s' }}>
            <a 
              href="#features" 
              className="text-muted-foreground hover:text-foreground transition-all duration-300 relative group"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="#integrations" 
              className="text-muted-foreground hover:text-foreground transition-all duration-300 relative group"
            >
              Integrations
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="#pricing" 
              className="text-muted-foreground hover:text-foreground transition-all duration-300 relative group"
            >
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          <div className="flex items-center gap-3 fade-in" style={{ animationDelay: '0.4s' }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 hover:bg-secondary/80"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button
              variant="outline"
              className="hidden sm:inline-flex glass-card border-border/50 hover:bg-secondary/80 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
