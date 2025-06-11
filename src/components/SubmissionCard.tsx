
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
      employment: "bg-blue-100 text-blue-800",
      healthcare: "bg-green-100 text-green-800", 
      education: "bg-purple-100 text-purple-800",
      privacy: "bg-red-100 text-red-800",
      ethics: "bg-orange-100 text-orange-800",
      economy: "bg-yellow-100 text-yellow-800",
      regulation: "bg-gray-100 text-gray-800",
      other: "bg-pink-100 text-pink-800"
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  return (
    <Card className="min-w-80 max-w-80 bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {getInitials(name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <p className="font-semibold text-gray-900 truncate">{name}</p>
              <span className="text-gray-500 text-sm">•</span>
              <span className="text-gray-500 text-sm">{province}</span>
              <span className="text-gray-500 text-sm">•</span>
              <span className="text-gray-500 text-sm">{timeAgo}</span>
            </div>
            <div className="mb-2">
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">{subject}</h4>
            <p className="text-gray-600 text-sm line-clamp-3">{message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionCard;
