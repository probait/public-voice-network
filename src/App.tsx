import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  Outlet,
} from "react-router-dom";
import Auth from "@/pages/Auth";
import Home from "@/pages/Home";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminArticles from "@/pages/admin/AdminArticles";
import AdminContributors from "@/pages/admin/AdminContributors";
import AdminEvents from "@/pages/admin/AdminEvents";
import AdminThoughts from "@/pages/admin/AdminThoughts";
import AdminPartnerships from "@/pages/admin/AdminPartnerships";
import AdminNewsletter from "@/pages/admin/AdminNewsletter";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/hooks/use-toast";
import ResetPassword from "@/pages/ResetPassword";
import UpdatePassword from "@/pages/UpdatePassword";
import VerifyEmail from "@/pages/VerifyEmail";
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

const queryClient = new QueryClient();

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<ToastProvider><AppLayout /></ToastProvider>}>
        <Route index element={<Home />} />
        <Route path="auth" element={<Auth />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="update-password" element={<UpdatePassword />} />
        <Route path="verify-email" element={<VerifyEmail />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout>
                <Outlet />
              </AdminLayout>
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route
            path="articles"
            element={
              <ProtectedAdminRoute requiredSection="articles">
                <AdminArticles />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="contributors"
            element={
              <ProtectedAdminRoute requiredSection="contributors">
                <AdminContributors />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="events"
            element={
              <ProtectedAdminRoute requiredSection="events">
                <AdminEvents />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="thoughts"
            element={
              <ProtectedAdminRoute requiredSection="thoughts">
                <AdminThoughts />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="partnerships"
            element={
              <ProtectedAdminRoute requiredSection="partnerships">
                <AdminPartnerships />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="newsletter"
            element={
              <ProtectedAdminRoute requiredSection="newsletter">
                <AdminNewsletter />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="users"
            element={
              <ProtectedAdminRoute requiredSection="users">
                <AdminUsers />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedAdminRoute requiredSection="settings">
                <AdminSettings />
              </ProtectedAdminRoute>
            }
          />
        </Route>
      </Route>
    )
  );

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

const AppLayout = () => {
  return (
    
      <Outlet />
    
  );
};

export default App;
