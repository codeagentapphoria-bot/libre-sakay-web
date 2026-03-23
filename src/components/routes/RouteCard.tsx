import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import type { Route } from '../../types';

interface RouteCardProps {
  route: Route;
}

export default function RouteCard({ route }: RouteCardProps) {
  return (
    <Link to={`/routes/${route.id}`} className="block group">
      <Card className="p-5 sm:p-6 transition-all duration-200 border border-gray-100 hover:border-primary-200 hover:shadow-md">
        <div className="flex items-start justify-between gap-4 sm:gap-6">
          <div className="flex-1 min-w-0">
            {/* Route Name */}
            <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 sm:mb-3 group-hover:text-primary-600 transition-colors">
              {route.name}
            </h3>
            
            {/* Description */}
            {route.description && (
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {route.description}
              </p>
            )}
            
            {/* Status Badge */}
            <Badge variant={route.is_active ? 'success' : 'neutral'} className="font-semibold">
              {route.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          
          {/* Arrow */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-secondary-50 flex items-center justify-center text-secondary-600 group-hover:bg-secondary-600 group-hover:text-white transition-all duration-200">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
