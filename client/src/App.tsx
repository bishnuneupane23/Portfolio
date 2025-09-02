import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "@/pages/home";
import AOKCaseStudy from "@/pages/projects/a-ok";
import ConnectPersonaCaseStudy from "@/pages/projects/connect-persona";
import LahvPlusParkingCaseStudy from "@/pages/projects/lahv-plus-parking";
import Privacy from "@/pages/privacy";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/projects/a-ok" component={AOKCaseStudy} />
      <Route path="/projects/connect-persona" component={ConnectPersonaCaseStudy} />
      <Route path="/projects/lahv-plus-parking" component={LahvPlusParkingCaseStudy} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    // Set dark mode as default on initial load
    const root = document.documentElement;
    const savedTheme = localStorage.getItem("theme");
    
    if (!savedTheme) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
