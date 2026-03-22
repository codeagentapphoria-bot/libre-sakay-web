import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Bus as BusIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { useRoute, useRouteStops, useBusLocations } from '../api/queries';
import RouteDetail from '../components/routes/RouteDetail';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import BusMap from '../components/map/BusMap';

export default function RouteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: route, isLoading: routeLoading } = useRoute(id!);
  const { data: stops, isLoading: stopsLoading } = useRouteStops(id!);
  const { data: busLocations } = useBusLocations(0);
  
  const [openSections, setOpenSections] = useState({
    map: true,
    stops: true,
    buses: true,
  });

  const toggleSection = (section: 'map' | 'stops' | 'buses') => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (routeLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!route) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Route not found.</p>
        <Link to="/routes">
          <Button variant="secondary" className="mt-4">Back to Routes</Button>
        </Link>
      </div>
    );
  }

  const busesOnRoute = busLocations?.filter(
    b => b.bus?.route_id === id && b.latitude && b.longitude
  ) ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Back Link */}
      <Link 
        to="/routes" 
        className="group inline-flex items-center gap-3 text-gray-500 hover:text-primary-600 mb-6 transition-colors font-semibold"
      >
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-primary-100 group-hover:text-primary-600 transition-all">
          <ArrowLeft className="w-4 h-4" />
        </div>
        Back to Routes
      </Link>

      {/* Route Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant={route.is_active ? 'success' : 'neutral'} className="font-semibold">
            {route.is_active ? 'Active' : 'Inactive'}
          </Badge>
          <span className="text-sm text-gray-400">Route</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          {route.name}
        </h1>
        {route.description && (
          <p className="text-gray-600 text-lg">{route.description}</p>
        )}
        
        {/* Quick Info */}
        <div className="flex flex-wrap gap-4 mt-6">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-5 h-5 text-primary-600" />
            <span className="font-semibold">{stops?.length || 0} Stops</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-5 h-5 text-secondary-600" />
            <span className="font-semibold">Mon-Fri, 6AM - 8PM</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <BusIcon className="w-5 h-5 text-primary-600" />
            <span className="font-semibold">{busesOnRoute.length} Active Buses</span>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Layout - Accordion Style */}
      <div className="lg:hidden space-y-4">
        {/* Map Section */}
        <AccordionSection 
          title="Live Map" 
          isOpen={openSections.map} 
          onToggle={() => toggleSection('map')}
          icon={<MapPin className="w-5 h-5" />}
        >
          <div className="h-[250px] rounded-xl overflow-hidden">
            <BusMap height="100%" showRefreshButton={false} />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Note: Not real-time. Tap refresh on the map to update.
          </p>
        </AccordionSection>

        {/* Stops Section */}
        <AccordionSection 
          title={`Stops (${stops?.length || 0})`} 
          isOpen={openSections.stops} 
          onToggle={() => toggleSection('stops')}
          icon={<MapPin className="w-5 h-5" />}
        >
          {stopsLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <RouteDetail stops={stops ?? []} />
          )}
        </AccordionSection>

        {/* Buses Section */}
        <AccordionSection 
          title={`Active Buses (${busesOnRoute.length})`} 
          isOpen={openSections.buses} 
          onToggle={() => toggleSection('buses')}
          icon={<BusIcon className="w-5 h-5" />}
        >
          {busesOnRoute.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No active buses on this route</p>
          ) : (
            <div className="space-y-3">
              {busesOnRoute.map((bus) => (
                <div key={bus.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white">
                      <BusIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{bus.bus?.plate_number}</p>
                      <p className="text-sm text-gray-500">
                        {bus.speed > 5 ? 'Moving' : 'At Stop'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={bus.speed > 5 ? 'success' : 'secondary'}>
                    {bus.speed.toFixed(1)} km/h
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </AccordionSection>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-8">
        {/* Stops List */}
        <div className="lg:col-span-2">
          <Card className="p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-600" />
              Route Stops
            </h2>
            {stopsLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : (
              <RouteDetail stops={stops ?? []} />
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Map Card */}
          <Card className="p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-600" />
                Live Map
              </h2>
              <span className="text-xs text-gray-500">Not real-time</span>
            </div>
            <div className="h-[250px] rounded-xl overflow-hidden">
              <BusMap height="100%" showRefreshButton={false} />
            </div>
          </Card>

          {/* Active Buses Card */}
          <Card className="p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BusIcon className="w-5 h-5 text-secondary-600" />
              Active Buses ({busesOnRoute.length})
            </h2>
            {busesOnRoute.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No active buses</p>
            ) : (
              <div className="space-y-3">
                {busesOnRoute.map((bus) => (
                  <div key={bus.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white">
                        <BusIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{bus.bus?.plate_number}</p>
                        <p className="text-sm text-gray-500">
                          {bus.speed > 5 ? 'Moving' : 'At Stop'}
                        </p>
                      </div>
                    </div>
                    <Badge variant={bus.speed > 5 ? 'success' : 'secondary'}>
                      {bus.speed.toFixed(1)} km/h
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function AccordionSection({ 
  title, 
  isOpen, 
  onToggle, 
  icon, 
  children 
}: { 
  title: string; 
  isOpen: boolean; 
  onToggle: () => void; 
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="border border-gray-100 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-primary-600">{icon}</span>
          <span className="font-semibold text-gray-900">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </Card>
  );
}
