import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import RouteList from '../components/routes/RouteList';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useBusLocations, useRoutes } from '../api/queries';
import { MapPin, RefreshCw } from 'lucide-react';
import BusMap from '../components/map/BusMap';

export default function Home() {
  const { data: buses, refetch, isFetching } = useBusLocations(0);
  const { data: routes } = useRoutes();
  
  const activeBuses = buses?.filter(b => b.latitude && b.longitude).length ?? 0;
  const totalRoutes = routes?.length ?? 0;
  const totalStops = routes?.reduce((acc, route) => acc + (route.stops_count?.[0]?.count ?? 0), 0) ?? 0;

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
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700/90 via-primary-600/85 to-green-700/90" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-secondary-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-semibold text-white">Live Tracking Available</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 leading-tight">
                Free Rides for{' '}
                <span className="text-secondary-300">Everyone</span>
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
                <Button className="bg-secondary-600 hover:bg-secondary-700 text-white font-bold text-base px-8 py-4 shadow-xl">
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
        {/* Quick Stats Cards - Without Icons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard 
            value={activeBuses} 
            label="Active Buses" 
          />
          <StatCard 
            value={totalRoutes} 
            label="Routes" 
          />
          <StatCard 
            value={totalStops} 
            label="Bus Stops" 
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
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Live Bus Tracking
            </h2>
            <p className="text-gray-500 mt-1">
              Tap refresh to see current bus locations
            </p>
          </div>
          <Button 
            onClick={() => refetch()} 
            disabled={isFetching}
            className="bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
          >
            <RefreshCw className={clsx("w-4 h-4", isFetching && "animate-spin")} />
            Refresh Location
          </Button>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-white">
          <div className="h-[300px] sm:h-[400px] lg:h-[450px]">
            <BusMap />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-3 text-center bg-yellow-50 py-2 px-4 rounded-lg inline-block mx-auto">
          Note: This is not real-time. Tap the Refresh button to see updated bus locations.
        </p>
      </section>

      {/* Popular Routes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Our Routes
            </h2>
            <p className="text-gray-500 mt-1">
              Explore all available bus routes in Borongan City
            </p>
          </div>
          <Link 
            to="/routes" 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-100 text-primary-700 font-semibold rounded-full hover:bg-primary-200 transition-colors"
          >
            View All <MapPin className="w-4 h-4" />
          </Link>
        </div>
        <RouteList />
      </section>

      {/* Info Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 mb-8">
        <Card className="p-6 sm:p-8 bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <img 
                src="/assets/Borongan City official seal design.png" 
                alt="Borongan City" 
                className="w-14 h-14 rounded-xl object-contain"
              />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                About Libre Sakay - Borongan City
              </h3>
              <p className="text-gray-600">
                Libre Sakay is a government program by the City Government of Borongan and the 
                Department of Agriculture that provides free transportation services to qualified 
                beneficiaries including Senior Citizens, Persons with Disabilities, and Students.
              </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

function StatCard({ value, label }: { value: string | number, label: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-shadow text-center border border-gray-100">
      <p className="text-3xl sm:text-4xl font-black text-primary-600 mb-1">{value}</p>
      <p className="text-sm sm:text-base text-gray-600 font-medium">{label}</p>
    </div>
  );
}
