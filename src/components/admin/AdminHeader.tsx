
import { Link } from "react-router-dom";
import PolicyNowLogo from "@/components/PolicyNowLogo";
import UserAvatarDropdown from "@/components/UserAvatarDropdown";

const AdminHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <PolicyNowLogo />
          </Link>
          <div className="text-sm text-gray-500 font-medium">
            Admin Portal
          </div>
        </div>
        
        <div className="flex items-center">
          <UserAvatarDropdown showAdminLink={false} />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
