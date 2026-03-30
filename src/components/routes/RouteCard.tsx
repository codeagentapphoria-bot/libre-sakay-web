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
      <Card className="p-5 sm:p-6 transition-all duration-300 border-gray-200/60 group-hover:border-primary-400/50 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] group-hover:-translate-y-1">
        <div className="flex items-start justify-between gap-4 sm:gap-6">
          <div className="flex-1 min-w-0">
            {/* Route Name */}
            <h3 className="font-extrabold text-lg sm:text-xl text-heading-900 tracking-tight mb-2 sm:mb-3 group-hover:text-primary-600 transition-colors">
              {route.name}
            </h3>
            
            {/* Description */}
            {route.description && (
              <p className="text-sm font-medium text-heading-600 mb-4 line-clamp-2">
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
            <div className="w-10 h-10 rounded-xl bg-heading-100 flex items-center justify-center text-heading-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-200">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
