
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
import Data from "./pages/Data";
import DataCommons from "./pages/DataCommons";
import Contributors from "./pages/Contributors";
import ContributorProfile from "./pages/ContributorProfile";
import Fellows from "./pages/Fellows";
import Prompts from "./pages/Prompts";
import Roundtables from "./pages/Roundtables";
import JobDisplacement from "./pages/articles/JobDisplacement";
import PrivacyRights from "./pages/articles/PrivacyRights";
import HealthcareInnovation from "./pages/articles/HealthcareInnovation";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
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
            <Route path="/data" element={<DataCommons />} />
            <Route path="/contributors" element={<Contributors />} />
            <Route path="/contributors/:id" element={<ContributorProfile />} />
            <Route path="/fellows" element={<Fellows />} />
            <Route path="/prompts" element={<Prompts />} />
            <Route path="/roundtables" element={<Roundtables />} />
            <Route path="/articles/job-displacement" element={<JobDisplacement />} />
            <Route path="/articles/privacy-rights" element={<PrivacyRights />} />
            <Route path="/articles/healthcare-innovation" element={<HealthcareInnovation />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
