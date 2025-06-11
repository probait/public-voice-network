
import { Maple } from "lucide-react";

const PolicyNowLogo = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <Maple 
          className="w-8 h-8 text-red-600" 
          fill="currentColor"
        />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full opacity-80"></div>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-red-600 leading-tight">
          PolicyNow
        </span>
        <span className="text-xs text-gray-600 font-medium -mt-1">
          Canada
        </span>
      </div>
    </div>
  );
};

export default PolicyNowLogo;
