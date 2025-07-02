import { AlertTriangle, Wrench } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const MaintenanceMode = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Wrench className="h-16 w-16 text-orange-500" />
              <AlertTriangle className="h-6 w-6 text-red-500 absolute -top-1 -right-1" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Under Maintenance
          </h1>
          
          <p className="text-gray-600 mb-6">
            We're currently performing scheduled maintenance to improve your experience. 
            We'll be back shortly!
          </p>
          
          <div className="text-sm text-gray-500">
            Please check back in a few minutes.
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-400">
              For urgent matters, please contact our support team.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceMode;