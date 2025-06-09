
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-red-600">
              PolicyNow
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Home
              </Link>
              <Link to="/feed" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Browse Campaigns
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                About
              </Link>
              <Link to="/privacy" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Privacy & Terms
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-red-100 text-red-600">
                        {getInitials(user.user_metadata?.full_name || user.email || 'U')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem className="flex flex-col items-start">
                    <div className="font-medium">{user.user_metadata?.full_name || 'User'}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  Sign In
                </Button>
              </Link>
            )}
            
            <div className="md:hidden">
              <Button variant="outline" size="sm">
                Menu
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
