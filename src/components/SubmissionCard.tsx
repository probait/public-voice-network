
import { Card, CardContent } from "@/components/ui/card";

interface SubmissionCardProps {
  name: string;
  province: string;
  category: string;
  subject: string;
  message: string;
  timeAgo: string;
}

const SubmissionCard = ({ name, province, category, subject, message, timeAgo }: SubmissionCardProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      employment: "bg-blue-50 text-blue-700 border border-blue-200",
      healthcare: "bg-emerald-50 text-emerald-700 border border-emerald-200", 
      education: "bg-purple-50 text-purple-700 border border-purple-200",
      privacy: "bg-red-50 text-red-700 border border-red-200",
      ethics: "bg-orange-50 text-orange-700 border border-orange-200",
      economy: "bg-amber-50 text-amber-700 border border-amber-200",
      regulation: "bg-slate-50 text-slate-700 border border-slate-200",
      environment: "bg-green-50 text-green-700 border border-green-200",
      transportation: "bg-indigo-50 text-indigo-700 border border-indigo-200",
      other: "bg-pink-50 text-pink-700 border border-pink-200"
    };
    return colors[category.toLowerCase() as keyof typeof colors] || colors.other;
  };

  return (
    <Card className="w-full bg-white shadow-sm hover:shadow-md transition-shadow mb-2">
      <CardContent className="p-3">
        <div className="flex items-start space-x-2">
          <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
            {getInitials(name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1 mb-1">
              <p className="font-semibold text-gray-900 text-xs truncate">{name}</p>
              <span className="text-gray-400 text-xs">•</span>
              <span className="text-gray-500 text-xs">{province}</span>
              <span className="text-gray-400 text-xs">•</span>
              <span className="text-gray-500 text-xs">{timeAgo}</span>
            </div>
            <div className="mb-1">
              <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${getCategoryColor(category)}`}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
            </div>
            <h4 className="font-medium text-gray-900 mb-1 text-xs line-clamp-1">{subject}</h4>
            <p className="text-gray-600 text-xs line-clamp-2">{message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionCard;
