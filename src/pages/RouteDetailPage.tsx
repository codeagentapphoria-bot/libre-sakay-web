import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Bus as BusIcon, Clock, Calendar, Navigation } from 'lucide-react';
import { useRoute, useBusLocations, scheduleData } from '../api/queries';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import BusMap from '../components/map/BusMap';
import BusDetailModal from '../components/ui/BusDetailModal';
import { useMapFocus } from '../contexts/MapContext';

type TabType = 'map' | 'schedule' | 'buses';

export default function RouteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: route, isLoading: routeLoading } = useRoute(id!);
  const { data: busLocations } = useBusLocations(0);
  const [activeTab, setActiveTab] = useState<TabType>('map');
  const { focus, setBusFocus, clearSelectedBus } = useMapFocus();
  const userLocation = focus.userLocation;
  const selectedBus = focus.selectedBus;

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
        <p className="text-heading-600">Route not found.</p>
        <Link to="/routes">
          <Button variant="secondary" className="mt-4">Back to Routes</Button>
        </Link>
      </div>
    );
  }

  const busesOnRoute = busLocations?.filter(
    b => {
      // Check if any of the bus's routes matches this route ID
      const busRouteIds = b.bus?.routes?.map(r => r.id) ?? [];
      return busRouteIds.includes(id!) && b.latitude != null && b.longitude != null;
    }
  ) ?? [];

  // Get schedule for this route - do partial matching since DB has test route names
  // DB may have "essu" but schedule has "Camada to Bugas"
  const getRouteSchedule = () => {
    const routeName = route.name.toLowerCase();
    
    // Direct match first
    if (scheduleData[route.name]) {
      return scheduleData[route.name];
    }
    
    // Partial match - check if any schedule key contains the route name
    for (const [scheduleKey, scheduleValue] of Object.entries(scheduleData)) {
      if (scheduleKey.toLowerCase().includes(routeName) || 
          routeName.includes(scheduleKey.toLowerCase().split(' ')[0].toLowerCase())) {
        return scheduleValue;
      }
    }
    
    return null;
  };
  
  const routeSchedule = getRouteSchedule();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Back Link */}
      <Link 
        to="/routes" 
        className="group inline-flex items-center gap-3 text-heading-500 hover:text-primary-600 mb-6 transition-colors font-semibold"
      >
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-primary-100 group-hover:text-primary-600 transition-all">
          <ArrowLeft className="w-4 h-4" />
        </div>
        Back to Routes
      </Link>

      {/* Route Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant={route.is_active ? 'success' : 'neutral'} className="font-semibold">
            {route.is_active ? 'Active' : 'Inactive'}
          </Badge>
          <span className="text-sm text-gray-400">Route</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-heading-900 mb-2">
          {route.name}
        </h1>
        {route.description && (
          <p className="text-heading-600 text-lg">{route.description}</p>
        )}
        
        {/* Quick Info */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center gap-2 text-heading-600">
            <BusIcon className="w-5 h-5 text-primary-600" />
            <span className="font-semibold">{busesOnRoute.length} Active Buses</span>
          </div>
          <Link 
            to="/schedule" 
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
          >
            <Calendar className="w-5 h-5" />
            <span>View Full Schedule</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-1 overflow-x-auto">
          <TabButton 
            active={activeTab === 'map'} 
            onClick={() => setActiveTab('map')}
            icon={<MapPin className="w-4 h-4" />}
            label="Map"
          />
          <TabButton 
            active={activeTab === 'schedule'} 
            onClick={() => setActiveTab('schedule')}
            icon={<Clock className="w-4 h-4" />}
            label="Schedule"
          />
          <TabButton 
            active={activeTab === 'buses'} 
            onClick={() => setActiveTab('buses')}
            icon={<BusIcon className="w-4 h-4" />}
            label={`Buses (${busesOnRoute.length})`}
          />
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'map' && (
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Map - 80% */}
            <div className="flex-1 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
              <div className="h-[400px] lg:h-[500px]">
                <BusMap />
              </div>
            </div>

            {/* Bus List - 20% */}
            <div className="w-full lg:w-1/5 space-y-3">
              <h3 className="text-sm font-semibold text-heading-500 uppercase tracking-wide px-1">
                Active Buses ({busesOnRoute.length})
              </h3>
              {busesOnRoute.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-heading-500">No buses on this route</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] lg:max-h-[500px] overflow-y-auto">
                  {busesOnRoute.map((bus) => (
                    <BusListItem 
                      key={bus.id} 
                      bus={bus}
                      onClick={() => setBusFocus(bus)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-heading-500 text-center">
            Showing real-time bus locations on this route
          </p>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="space-y-6">
          {routeSchedule ? (
            <Card className="p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-heading-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-600" />
                Schedule for {route.name}
              </h3>
              
              {routeSchedule.weekday.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-heading-500 uppercase tracking-wide mb-3">
                    Monday - Thursday
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {routeSchedule.weekday.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-heading-900">{entry.time}</span>
                        <Badge variant="neutral" className="text-xs">{entry.busId}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {routeSchedule.weekend.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-heading-500 uppercase tracking-wide mb-3">
                    Friday - Saturday
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {routeSchedule.weekend.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-heading-900">{entry.time}</span>
                        <Badge variant="neutral" className="text-xs">{entry.busId}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Link 
                to="/schedule" 
                className="inline-flex items-center gap-2 mt-4 text-primary-600 hover:text-primary-700 font-medium"
              >
                View all routes schedule
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </Card>
          ) : (
            <Card className="p-8 text-center border-gray-100">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-heading-900 mb-2">No Schedule Available</h3>
              <p className="text-heading-500 mb-4">This route doesn't have a fixed schedule yet.</p>
              <Link to="/schedule">
                <Button variant="outline">View All Schedules</Button>
              </Link>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'buses' && (
        <div className="space-y-4">
          {busesOnRoute.length === 0 ? (
            <Card className="p-8 text-center border-gray-100">
              <BusIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-heading-900 mb-2">No Active Buses</h3>
              <p className="text-heading-500">There are currently no buses on this route.</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {busesOnRoute.map((bus) => (
                <Card key={bus.id} className="p-5 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center">
                        <BusIcon className="w-7 h-7 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-bold text-lg text-heading-900">{bus.bus?.plate_number}</p>
                        <p className="text-sm text-heading-500">
                          {bus.bus?.routes?.[0]?.name || 'On Route'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={(bus.speed ?? 0) > 5 ? 'success' : 'secondary'} className="mb-1">
                        {(bus.speed ?? 0) > 5 ? 'In Transit' : 'At Stop'}
                      </Badge>
                      <p className="text-sm text-heading-500">
                        {(bus.speed ?? 0).toFixed(1)} km/h
                      </p>
                    </div>
                  </div>
                  
                  {/* Location info */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                      Last updated: {bus.recorded_at ? new Date(bus.recorded_at).toLocaleTimeString() : 'Unknown'}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Info Note */}
      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> Buses operate continuously on this route and will stop at designated 
          stops when passengers are waiting. Schedule times are approximate.
        </p>
      </div>

      {selectedBus && (
        <BusDetailModal
          bus={selectedBus}
          userLocation={userLocation}
          onClose={clearSelectedBus}
        />
      )}
    </div>
  );
}

function BusListItem({ bus, onClick }: { bus: any; onClick?: () => void }) {
  const isMoving = (bus.speed ?? 0) > 5;
  const barangayName = bus.barangay?.name;
  
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: isMoving ? '#16a34a' : '#e11d48' }}
          >
            {bus.bus?.plate_number ?? 'N/A'}
          </div>
          <div>
            <p className="font-semibold text-heading-900 text-sm">{bus.bus?.plate_number}</p>
            <p className="text-xs text-heading-500">
              {isMoving ? `${(bus.speed ?? 0).toFixed(1)} km/h` : 'Parked'}
              {barangayName && <span className="ml-1 text-primary-600">• {barangayName}</span>}
            </p>
          </div>
        </div>
        <Navigation className="w-4 h-4 text-gray-400" />
      </div>
    </button>
  );
}

function TabButton({ 
  active, 
  onClick, 
  icon, 
  label 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
        active 
          ? 'border-primary-600 text-primary-600' 
          : 'border-transparent text-heading-500 hover:text-gray-700'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

