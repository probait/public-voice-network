
import { Button } from '@/components/ui/button';
import { Trash2, Star, X } from 'lucide-react';

interface BulkActionsProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onBulkFeature?: () => void;
  onClearSelection?: () => void;
}

const BulkActions = ({ 
  selectedCount, 
  onBulkDelete, 
  onBulkFeature,
  onClearSelection 
}: BulkActionsProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-blue-900">
          {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
        </span>
        <div className="flex items-center gap-2">
          {onBulkFeature && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkFeature}
              className="text-blue-700 border-blue-300 hover:bg-blue-100"
            >
              <Star className="h-4 w-4 mr-2" />
              Toggle Featured
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkDelete}
            className="text-red-700 border-red-300 hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      </div>
      {onClearSelection && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="text-blue-700 hover:bg-blue-100"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default BulkActions;
