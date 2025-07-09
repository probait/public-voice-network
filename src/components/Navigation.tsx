
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AuthModal from "@/components/AuthModal";
import PolicyNowLogo from "@/components/PolicyNowLogo";
import { ChevronDown, Settings } from "lucide-react";

const Navigation = () => {
  const { user, signOut } = useAuth();
  const { isContentManager } = useUserRole();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSignOut = async () => {
    await signOut();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleMouseEnter = (dropdown: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpenDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150); // Small delay to allow moving to submenu
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="hover:opacity-80 transition-opacity">
                <PolicyNowLogo />
              </Link>
            </div>
            
            <div className="hidden md:block">
              <div className="flex items-center space-x-1">
                <Link to="/" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Home
                </Link>
                
                <div 
                  className="relative"
                  onMouseEnter={() => handleMouseEnter('community')}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                    Community
                    <ChevronDown className={`ml-1 h-3 w-3 transition-transform duration-200 ${openDropdown === 'community' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'community' && (
                    <div className="absolute top-full left-0 mt-0 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <div className="p-4 space-y-3">
                        <Link 
                          to="/contributors" 
                          className="block p-3 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <div className="font-medium text-sm text-gray-900">Contributors</div>
                          <p className="text-sm text-gray-600 mt-1">Meet our expert contributors and policy researchers</p>
                        </Link>
                        <Link 
                          to="/fellows" 
                          className="block p-3 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <div className="font-medium text-sm text-gray-900">PolicyNow Fellows</div>
                          <p className="text-sm text-gray-600 mt-1">Current and past fellows in our research program</p>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <Link to="/events" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Events
                </Link>


                <div 
                  className="relative"
                  onMouseEnter={() => handleMouseEnter('thought-leadership')}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                    Thought Leadership
                    <ChevronDown className={`ml-1 h-3 w-3 transition-transform duration-200 ${openDropdown === 'thought-leadership' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'thought-leadership' && (
                    <div className="absolute top-full left-0 mt-0 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <div className="p-4 space-y-3">
                        <Link 
                          to="/prompts" 
                          className="block p-3 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <div className="font-medium text-sm text-gray-900">Curated Prompts</div>
                          <p className="text-sm text-gray-600 mt-1">Current prompts seeking policy contributions</p>
                        </Link>
                        <Link 
                          to="/roundtables" 
                          className="block p-3 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <div className="font-medium text-sm text-gray-900">Roundtables</div>
                          <p className="text-sm text-gray-600 mt-1">Upcoming and past contributor roundtables</p>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <Link to="/get-involved" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Get Involved
                </Link>

                <Link to="/about" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  About
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
                    {isContentManager() && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="flex items-center">
                            <Settings className="mr-2 h-4 w-4" />
                            Admin Portal
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem onClick={handleSignOut}>
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Sign In
                </Button>
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

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};

export default Navigation;
