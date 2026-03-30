import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import RouteList from '../components/routes/RouteList';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useBusLocations, useRoutes } from '../api/queries';
import { MapPin, RefreshCw, Calendar, Navigation } from 'lucide-react';
import BusMap from '../components/map/BusMap';
import BusDetailModal from '../components/ui/BusDetailModal';
import { useMapFocus } from '../contexts/MapContext';

export default function Home() {
  const { data: buses, refetch, isFetching } = useBusLocations(0);
  const { data: routes } = useRoutes();
  const { focus, setBusFocus, clearSelectedBus } = useMapFocus();

  const activeBusesList = buses?.filter(b => b.latitude && b.longitude) ?? [];
  const activeBuses = activeBusesList.length;
  const totalRoutes = routes?.length ?? 0;
  const userLocation = focus.userLocation;
  const selectedBus = focus.selectedBus;

  return (
    <div className="pb-12">
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden">
        {/* Background Image */}
        <img
          src="/assets/City Hall of Borongan in midday sun.png"
          alt="City Hall of Borongan"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700/90 to-primary-900/80" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-semibold text-white">Live Tracking Available</span>
              </div>

              <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 leading-tight">
                Free Rides for{' '}
                <span className="text-green-300">Everyone</span>
              </h1>

              <p className="text-base sm:text-lg text-primary-100 mb-8 max-w-xl mx-auto lg:mx-0">
                Libre Sakay provides <strong className="text-white">FREE transportation</strong> for Senior Citizens,
                Persons with Disabilities, and Students in Borongan City.
              </p>

              {/* Eligibility Badges */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                <span className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold">
                  Senior Citizens
                </span>
                <span className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold">
                  PWDs
                </span>
                <span className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold">
                  Students
                </span>
              </div>

              <Link to="/routes">
                <Button className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-base px-8 py-4 shadow-xl">
                  View Routes <MapPin className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Bus Image - Hidden on Mobile */}
            <div className="flex-1 relative hidden lg:block">
              <div className="relative z-10">
                <img
                  src="/assets/libre-sakay.png"
                  alt="Libre Sakay Bus"
                  className="w-full max-w-md mx-auto drop-shadow-2xl"
                />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-white/20 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <StatCard
            value={activeBuses}
            label="Active Buses"
          />
          <StatCard
            value={totalRoutes}
            label="Routes"
          />
          <StatCard
            value="FREE"
            label="Always Free"
          />
        </div>
      </div>

      {/* Live Tracking Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-heading-700">
              Live Bus Tracking
            </h2>
            <p className="text-heading-500 mt-1">
              Tap refresh to see current bus locations
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/schedule">
              <Button className="bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Schedule
              </Button>
            </Link>
            <Button
              onClick={() => refetch()}
              disabled={isFetching}
              className="bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
            >
              <RefreshCw className={clsx("w-4 h-4", isFetching && "animate-spin")} />
              Refresh Location
            </Button>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Map - 80% */}
          <div className="flex-1 rounded-xl overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.15)] border border-gray-200/80 bg-gray-50 relative z-0">
            <div className="h-[300px] sm:h-[400px] lg:h-[450px]">
              <BusMap />
            </div>
          </div>

          {/* Bus List - 20% */}
          <div className="w-full lg:w-1/5 space-y-3">
            <h3 className="text-sm font-semibold text-heading-500 uppercase tracking-wide px-1">
              Active Buses ({activeBusesList.length})
            </h3>
            {activeBusesList.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-sm text-heading-500">No buses currently tracked</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] sm:max-h-[400px] lg:max-h-[450px] overflow-y-auto">
                {activeBusesList.map((bus) => (
                  <HomeBusListItem
                    key={bus.id}
                    bus={bus}
                    onClick={() => setBusFocus(bus)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <p className="text-sm text-heading-500 mt-3 text-center bg-primary-50 py-2 px-4 rounded-lg inline-block mx-auto">
          Note: This is not real-time. Tap the Refresh button to see updated bus locations.
        </p>
      </section>

      {/* Popular Routes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-heading-700">
              Our Routes
            </h2>
            <p className="text-heading-500 mt-1">
              Explore all available bus routes in Borongan City
            </p>
          </div>
          <Link
            to="/routes"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-100 text-primary-700 font-semibold rounded-lg hover:bg-primary-200 transition-colors"
          >
            View All <MapPin className="w-4 h-4" />
          </Link>
        </div>
        <RouteList />
      </section>

      {/* Info Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 mb-8">
        <Card className="p-6 sm:p-8 bg-white border border-gray-200/60 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2"></div>
          <div className="flex flex-col md:flex-row items-center gap-6 z-10">
            <div className="w-20 h-20 bg-white border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl flex items-center justify-center flex-shrink-0">
              <img
                src="/assets/Borongan City official seal design.png"
                alt="Borongan City"
                className="w-14 h-14 object-contain"
              />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-extrabold text-heading-900 tracking-tight mb-2">
                About Libre Sakay — Borongan City
              </h3>
              <p className="text-heading-700 font-medium leading-relaxed">
                Libre Sakay is a government program by the City Government of Borongan and the
                Department of Agriculture that provides free transportation services to qualified
                beneficiaries including Senior Citizens, Persons with Disabilities, and Students.
              </p>
            </div>
          </div>
        </Card>
      </section>

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

function StatCard({ value, label }: { value: string | number, label: string }) {
  return (
    <div className="bg-white rounded-xl p-5 sm:p-6 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300 text-center border border-gray-200/60">
      <p className="text-3xl sm:text-4xl font-black text-primary-600 tracking-tight mb-1">{value}</p>
      <p className="text-sm sm:text-base text-heading-700 font-semibold uppercase tracking-wider">{label}</p>
    </div>
  );
}

function HomeBusListItem({ bus, onClick }: { bus: any; onClick?: () => void }) {
  const isMoving = (bus.speed ?? 0) > 5;
  const barangayName = bus.barangay?.name;

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 bg-white rounded-lg border border-gray-200/60 hover:border-primary-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 hover:shadow-[0_4px_12px_rgb(0,0,0,0.05)] transition-all outline-none group"
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
            <p className="font-semibold text-heading-700 text-sm">{bus.bus?.plate_number}</p>
            <p className="text-xs text-heading-500">
              {isMoving ? `${(bus.speed ?? 0).toFixed(1)} km/h` : 'Parked'}
              {barangayName && <span className="ml-1 text-primary-600">• {barangayName}</span>}
            </p>
          </div>
        </div>
        <Navigation className="w-4 h-4 text-heading-400" />
      </div>
    </button>
  );
}
