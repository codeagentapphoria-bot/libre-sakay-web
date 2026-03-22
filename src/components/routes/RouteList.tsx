import { Bus as BusIcon } from 'lucide-react';
import { useRoutes } from '../../api/queries';
import RouteCard from './RouteCard';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function RouteList() {
  const { data: routes, isLoading, error } = useRoutes();

  if (error) {
    return (
      <Card className="p-12 text-center border-red-100 bg-red-50/50">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BusIcon className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-black text-red-900 mb-2">Service Unavailable</h3>
        <p className="text-red-600 font-medium">Failed to load bus routes. Please try again later.</p>
        <Button variant="outline" className="mt-6 mx-auto border-red-200 text-red-700 hover:bg-red-100" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-slate-100 rounded-[2rem]"></div>
        ))}
      </div>
    );
  }

  if (!routes || routes.length === 0) {
    return (
      <Card className="p-12 text-center border-slate-100 bg-slate-50/50">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BusIcon className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">No Routes Found</h3>
        <p className="text-slate-500 font-medium">We couldn't find any available routes at the moment.</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
      {routes.map((route) => (
        <RouteCard key={route.id} route={route} />
      ))}
    </div>
  );
}
