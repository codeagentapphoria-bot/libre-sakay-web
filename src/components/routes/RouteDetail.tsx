import { CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';
import Badge from '../ui/Badge';
import type { Stop } from '../../types';

interface RouteDetailProps {
  stops: Stop[];
  currentStopId?: string;
}

export default function RouteDetail({ stops, currentStopId }: RouteDetailProps) {
  if (!stops || stops.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No stops available for this route.
      </div>
    );
  }

  return (
    <div className="relative space-y-3">
      {stops.map((stop, index) => {
        const isCurrentStop = stop.id === currentStopId;
        const isFirst = index === 0;
        const isLast = index === stops.length - 1;
        
        return (
          <div
            key={stop.id}
            className={clsx(
              "flex items-start gap-4 p-3 rounded-xl transition-all duration-200 min-h-touch",
              isCurrentStop 
                ? "bg-primary-50 border border-primary-200" 
                : "hover:bg-gray-50"
            )}
          >
            {/* Stop Number */}
            <div className={clsx(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold",
              isCurrentStop 
                ? "bg-primary-600 text-white" 
                : isFirst 
                  ? "bg-green-500 text-white"
                  : isLast 
                    ? "bg-gray-800 text-white"
                    : "bg-gray-200 text-gray-600"
            )}>
              {index + 1}
            </div>

            {/* Stop Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {isFirst && <Badge variant="success" className="text-[10px]">START</Badge>}
                {isLast && <Badge variant="neutral" className="text-[10px]">END</Badge>}
              </div>
              <p className={clsx(
                "font-semibold text-base",
                isCurrentStop ? "text-primary-700" : "text-gray-900"
              )}>
                {stop.name}
              </p>
            </div>
            
            {isCurrentStop && (
              <div className="flex items-center gap-1 text-primary-600">
                <CheckCircle className="w-5 h-5" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
