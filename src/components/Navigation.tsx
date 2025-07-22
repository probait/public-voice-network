
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/AuthModal";
import PolicyNowLogo from "@/components/PolicyNowLogo";
import UserAvatarDropdown from "@/components/UserAvatarDropdown";

const Navigation = () => {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
                
                <Link to="/contributors" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Contributors
                </Link>

                <Link to="/events" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Events
                </Link>

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
                <UserAvatarDropdown />
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
