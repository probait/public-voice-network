
import { Link, useLocation } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  MessageSquare, 
  Building2, 
  Settings,
  UserCheck,
  Presentation,
  Mail,
  Heart,
  GraduationCap
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  const { isAdmin } = useUserRole();
  const { hasPermission } = useUserPermissions();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin',
      section: 'dashboard'
    },
    {
      title: 'Contributors',
      icon: Users,
      path: '/admin/contributors',
      section: 'contributors'
    },
    {
      title: 'Articles',
      icon: FileText,
      path: '/admin/articles',
      section: 'articles'
    },
    {
      title: 'Events & Meetups',
      icon: Calendar,
      path: '/admin/events',
      section: 'events'
    },
    {
      title: 'Newsletter',
      icon: Mail,
      path: '/admin/newsletter',
      section: 'newsletter'
    },
    {
      title: 'Citizen Thoughts',
      icon: Heart,
      path: '/admin/thoughts',
      section: 'thoughts'
    },
    {
      title: 'Partnerships',
      icon: Building2,
      path: '/admin/partnerships',
      section: 'partnerships'
    },
    {
      title: 'User Management',
      icon: UserCheck,
      path: '/admin/users',
      section: 'users'
    },
  ];

  const hasAccess = (section: string) => {
    return isAdmin() || hasPermission(section as any);
  };

  const filteredMenuItems = menuItems.filter(item => hasAccess(item.section));

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-red-50 text-red-700 border-r-2 border-red-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <Link 
          to="/"
          className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50"
        >
          ← Back to Main Site
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
