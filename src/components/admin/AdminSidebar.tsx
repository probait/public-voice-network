
import { Link, useLocation } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  MessageSquare, 
  Building2, 
  Database,
  Settings,
  UserCheck,
  Presentation
} from 'lucide-react';
import PolicyNowLogo from '@/components/PolicyNowLogo';

const AdminSidebar = () => {
  const location = useLocation();
  const { isAdmin, isModerator, isContentManager } = useUserRole();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin',
      roles: ['content_manager']
    },
    {
      title: 'Contributors',
      icon: Users,
      path: '/admin/contributors',
      roles: ['content_manager']
    },
    {
      title: 'Articles',
      icon: FileText,
      path: '/admin/articles',
      roles: ['content_manager']
    },
    {
      title: 'Events & Meetups',
      icon: Calendar,
      path: '/admin/events',
      roles: ['content_manager']
    },
    {
      title: 'Roundtables',
      icon: Presentation,
      path: '/admin/roundtables',
      roles: ['content_manager']
    },
    {
      title: 'Prompts',
      icon: MessageSquare,
      path: '/admin/prompts',
      roles: ['content_manager']
    },
    {
      title: 'Partnerships',
      icon: Building2,
      path: '/admin/partnerships',
      roles: ['moderator']
    },
    {
      title: 'Datasets',
      icon: Database,
      path: '/admin/datasets',
      roles: ['content_manager']
    },
    {
      title: 'User Management',
      icon: UserCheck,
      path: '/admin/users',
      roles: ['moderator']
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/admin/settings',
      roles: ['admin']
    }
  ];

  const hasAccess = (requiredRoles: string[]) => {
    if (isAdmin()) return true;
    if (isModerator() && requiredRoles.includes('moderator')) return true;
    if (isContentManager() && requiredRoles.includes('content_manager')) return true;
    return false;
  };

  const filteredMenuItems = menuItems.filter(item => hasAccess(item.roles));

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <Link to="/" className="flex items-center">
          <PolicyNowLogo />
        </Link>
        <p className="text-sm text-gray-500 mt-2">Admin Portal</p>
      </div>
      
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
