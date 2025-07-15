
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Events from "./pages/Events";
import GetInvolved from "./pages/GetInvolved";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Contributors from "./pages/Contributors";
import ContributorProfile from "./pages/ContributorProfile";
import Fellows from "./pages/Fellows";
import Prompts from "./pages/Prompts";
import Roundtables from "./pages/Roundtables";
import Article from "./pages/Article";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import AdminContributors from "./pages/admin/AdminContributors";
import AdminArticles from "./pages/admin/AdminArticles";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminRoundtables from "./pages/admin/AdminRoundtables";
import AdminPrompts from "./pages/admin/AdminPrompts";
import AdminPartnerships from "./pages/admin/AdminPartnerships";
import AdminThoughtsManagement from "./pages/admin/AdminThoughtsManagement";
import AdminNewsletter from "./pages/admin/AdminNewsletter";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/NotFound";
import MaintenanceMode from "./components/MaintenanceMode";

const queryClient = new QueryClient();

const App = () => {
  // Check for maintenance mode
  const isMaintenanceMode = localStorage.getItem('maintenance_mode') === 'true';
  
  if (isMaintenanceMode) {
    return <MaintenanceMode />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/events" element={<Events />} />
            <Route path="/get-involved" element={<GetInvolved />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            
            <Route path="/contributors" element={<Contributors />} />
            <Route path="/contributors/:id" element={<ContributorProfile />} />
            <Route path="/fellows" element={<Fellows />} />
            <Route path="/prompts" element={<Prompts />} />
            <Route path="/roundtables" element={<Roundtables />} />
            <Route path="/articles/:slug" element={<Article />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/contributors" element={<AdminContributors />} />
            <Route path="/admin/articles" element={<AdminArticles />} />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="/admin/newsletter" element={<AdminNewsletter />} />
            <Route path="/admin/roundtables" element={<AdminRoundtables />} />
            <Route path="/admin/prompts" element={<AdminPrompts />} />
            <Route path="/admin/partnerships" element={<AdminPartnerships />} />
            <Route path="/admin/thoughts" element={<AdminThoughtsManagement />} />
            
            <Route path="/admin/settings" element={<AdminSettings />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
