import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Dashboard from "./pages/Dashboard";
import ClaimsAudit from "./pages/ClaimsAudit";
import ClaimDetail from "./pages/ClaimDetail";
import CustomerDirectory from "./pages/CustomerDirectory";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/ThemeProvider";
import { ThemeToggle } from "./components/ThemeToggle";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <div className="min-h-screen flex w-full bg-background text-foreground transition-colors duration-200">
              <AppSidebar />
              <div className="flex-1 flex flex-col min-w-0">
                <header className="h-12 flex items-center justify-between border-b border-border bg-card px-4 shrink-0">
                  <div className="flex items-center">
                    <SidebarTrigger />
                    <span className="ml-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">InsureSafe AI</span>
                  </div>
                  <ThemeToggle />
                </header>
                <main className="flex-1 p-6 overflow-auto">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/customers" element={<CustomerDirectory />} />
                    <Route path="/claims" element={<ClaimsAudit />} />
                    <Route path="/claims/:id" element={<ClaimDetail />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

