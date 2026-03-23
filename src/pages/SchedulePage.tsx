import { useState } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { scheduleData } from '../api/queries';

type ViewMode = 'weekday' | 'weekend' | 'all';

export default function SchedulePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [selectedRoute, setSelectedRoute] = useState<string>('all');

  const routes = Object.keys(scheduleData);

  const filteredData = selectedRoute === 'all' 
    ? scheduleData 
    : { [selectedRoute]: scheduleData[selectedRoute] };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Bus Schedule
            </h1>
            <p className="text-gray-500 text-sm sm:text-base">
              View departure times for all routes in Borongan City
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Route Filter */}
        <select
          value={selectedRoute}
          onChange={(e) => setSelectedRoute(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Routes</option>
          {routes.map(route => (
            <option key={route} value={route}>{route}</option>
          ))}
        </select>

        {/* View Mode Toggle */}
        <div className="flex rounded-xl border border-gray-200 overflow-hidden">
          <button
            onClick={() => setViewMode('weekday')}
            className={`px-4 py-2.5 font-semibold transition-colors ${
              viewMode === 'weekday' 
                ? 'bg-primary-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Mon-Thu
          </button>
          <button
            onClick={() => setViewMode('weekend')}
            className={`px-4 py-2.5 font-semibold transition-colors ${
              viewMode === 'weekend' 
                ? 'bg-primary-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Fri-Sat
          </button>
          <button
            onClick={() => setViewMode('all')}
            className={`px-4 py-2.5 font-semibold transition-colors ${
              viewMode === 'all' 
                ? 'bg-primary-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            All
          </button>
        </div>
      </div>

      {/* Schedule Cards */}
      <div className="space-y-6">
        {Object.entries(filteredData).map(([routeName, schedule]) => (
          <RouteScheduleCard 
            key={routeName}
            routeName={routeName}
            schedule={schedule}
            viewMode={viewMode}
          />
        ))}

        {Object.keys(filteredData).length === 0 && (
          <Card className="p-12 text-center border-gray-100 bg-gray-50/50">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Schedule Found</h3>
            <p className="text-gray-500">Select a different route to view its schedule.</p>
          </Card>
        )}
      </div>

      {/* Info Note */}
      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> Schedules are subject to change. Buses operate on a continuous 
          route and will stop at designated stops when passengers are waiting. For assistance, 
          contact the Libre Sakay office.
        </p>
      </div>
    </div>
  );
}

interface RouteScheduleCardProps {
  routeName: string;
  schedule: {
    weekday: { id: string; busId: string; time: string; route: string; direction: string }[];
    weekend: { id: string; busId: string; time: string; route: string; direction: string }[];
  };
  viewMode: ViewMode;
}

function RouteScheduleCard({ routeName, schedule, viewMode }: RouteScheduleCardProps) {
  const formatRouteName = (name: string) => {
    return name.replace(/\s+/g, ' ').trim();
  };

  // Get direction based on route
  const getDirectionInfo = (route: string) => {
    if (route.includes('to Backstage') || route.includes('Backstage to')) {
      return { icon: MapPin, label: 'City Center' };
    }
    if (route.includes('to Bugas') || route.includes('Bugas to')) {
      return { icon: MapPin, label: 'Bugas' };
    }
    if (route.includes('to Camada') || route.includes('Camada to')) {
      return { icon: MapPin, label: 'Camada' };
    }
    return { icon: MapPin, label: 'Route' };
  };

  const direction = getDirectionInfo(routeName);
  const showWeekday = viewMode === 'weekday' || viewMode === 'all';
  const showWeekend = viewMode === 'weekend' || viewMode === 'all';

  return (
    <Card className="p-5 sm:p-6 border border-gray-100">
      {/* Route Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
          <direction.icon className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{formatRouteName(routeName)}</h3>
          <p className="text-sm text-gray-500">Bus Route</p>
        </div>
      </div>

      {/* Schedule Sections */}
      <div className="grid gap-6">
        {/* Weekday Schedule */}
        {showWeekday && schedule.weekday.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Monday - Thursday
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {schedule.weekday.map((entry) => (
                <div 
                  key={entry.id}
                  className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-900">{entry.time}</span>
                  <Badge variant="neutral" className="text-xs">{entry.busId}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weekend Schedule */}
        {showWeekend && schedule.weekend.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Friday - Saturday
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {schedule.weekend.map((entry) => (
                <div 
                  key={entry.id}
                  className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-900">{entry.time}</span>
                  <Badge variant="neutral" className="text-xs">{entry.busId}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}