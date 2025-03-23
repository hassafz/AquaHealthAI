import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useDarkMode } from "@/hooks/use-dark-mode";
import { motion } from "framer-motion";

export function NavBar() {
  const { theme, toggleTheme } = useDarkMode();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAlgaeMenuOpen, setIsAlgaeMenuOpen] = useState(false);
  const algaeMenuRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside of the algae menu to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (algaeMenuRef.current && !algaeMenuRef.current.contains(event.target as Node)) {
        setIsAlgaeMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    // Algae menu is handled separately
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <motion.nav 
      className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 mr-2 text-primary"
                >
                  <path d="M2 12h20M2 12c3.6-3.6 7.4-3.6 11 0 3.6 3.6 7.4 3.6 11 0M2 12c3.6 3.6 7.4 3.6 11 0 3.6-3.6 7.4-3.6 11 0" />
                </svg>
                <span className="font-bold text-xl text-primary dark:text-primary-light">
                  Aquarium Analyser
                </span>
              </a>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link key={item.name} href={item.path}>
                <a className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light transition-colors duration-200">
                  {item.name}
                </a>
              </Link>
            ))}

            {/* Dark mode toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                id="dark-mode"
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
              />
              <Label htmlFor="dark-mode" className="text-sm">
                {theme === "dark" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </Label>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {!isMobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <motion.div 
          className="md:hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link key={item.name} href={item.path}>
                <a
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              </Link>
            ))}
            
            {/* Dark mode toggle for mobile */}
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
              <Switch
                id="dark-mode-mobile"
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
              />
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
