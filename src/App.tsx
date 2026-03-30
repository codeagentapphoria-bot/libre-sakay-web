import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import RoutesPage from './pages/Routes';
import RouteDetailPage from './pages/RouteDetailPage';
import SchedulePage from './pages/SchedulePage';
import NotFound from './pages/NotFound';
import OfflineIndicator from './components/ui/OfflineIndicator';

function App() {
  return (
    <>
      <OfflineIndicator />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/routes/:id" element={<RouteDetailPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
