import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  Outlet,
} from "react-router-dom";
import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminArticles from "@/pages/admin/AdminArticles";
import AdminContributors from "@/pages/admin/AdminContributors";
import AdminEvents from "@/pages/admin/AdminEvents";
import AdminThoughts from "@/pages/admin/AdminThoughts";
import AdminPartnerships from "@/pages/admin/AdminPartnerships";
import AdminNewsletter from "@/pages/admin/AdminNewsletter";
import UserManagement from "@/pages/admin/UserManagement";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminLayout from "@/components/admin/AdminLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import ResetPassword from "@/pages/ResetPassword";
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

const queryClient = new QueryClient();

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Index />} />
        <Route path="auth" element={<Auth />} />
        <Route path="reset-password" element={<ResetPassword />} />
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
                <UserManagement />
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
    <>
      <Outlet />
      <Toaster />
    </>
  );
};

export default App;
