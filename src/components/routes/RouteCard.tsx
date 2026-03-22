import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, MapPinned } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { useMapFocus } from '../../contexts/MapContext';
import type { Route } from '../../types';

interface RouteCardProps {
  route: Route;
}

export default function RouteCard({ route }: RouteCardProps) {
  const navigate = useNavigate();
  const { setRouteFocus } = useMapFocus();
  const stopsCount = route.stops_count?.[0]?.count ?? route.stops?.length ?? 0;

  const handleViewOnMap = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (route.stops && route.stops.length > 0) {
      setRouteFocus(route.stops);
      navigate('/');
    }
  };

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
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                <span>{stopsCount} stops</span>
              </div>
              
              <Badge variant={route.is_active ? 'success' : 'neutral'} className="font-semibold">
                {route.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleViewOnMap}
              disabled={!route.stops || route.stops.length === 0}
              className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 hover:bg-primary-600 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="View on Map"
            >
              <MapPinned className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-secondary-50 flex items-center justify-center text-secondary-600 group-hover:bg-secondary-600 group-hover:text-white transition-all duration-200">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
