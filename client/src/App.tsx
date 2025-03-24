import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import BlackBeardAlgae from "@/pages/BlackBeardAlgae";
import { useEffect } from "react";
import { useDarkMode } from "./hooks/use-dark-mode";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/algae/black-beard-algae" component={BlackBeardAlgae} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { theme } = useDarkMode();

  // Apply theme class to the document element on theme change
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
