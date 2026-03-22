import RouteList from '../components/routes/RouteList';
import { MapPin } from 'lucide-react';

export default function Routes() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
            <MapPin className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Bus Routes
            </h1>
            <p className="text-gray-500 text-sm sm:text-base">
              All available routes in Borongan City
            </p>
          </div>
        </div>
      </div>
      
      {/* Routes List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <RouteList />
      </div>
    </div>
  );
}
