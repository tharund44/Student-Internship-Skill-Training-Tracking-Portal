import { Suspense, lazy } from 'react';
import { useNavigate, Link, useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut, LayoutDashboard } from 'lucide-react';
// Lazy load the 3D scene
const BackgroundScene = lazy(() => import('../3d/BackgroundScene'));

export const MainLayout = () => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const outlet = useOutlet();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<div className="fixed inset-0 -z-10 bg-gradient-to-br from-lavender/30 to-primary/10 pointer-events-none" />}>
        <BackgroundScene />
      </Suspense>
      
      <header className="h-16 border-b border-white/20 backdrop-blur-xl bg-white/10 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-xl font-black text-primary hover:text-purple-700 transition-colors">InternTrack</Link>
          {user && (
            <nav className="hidden md:flex items-center gap-4 text-sm font-bold text-gray-600 dark:text-gray-300">
              <Link to="/dashboard" className="flex items-center gap-2 hover:text-primary transition-colors"><LayoutDashboard size={16}/> Dashboard</Link>
            </nav>
          )}
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-bold text-gray-800 dark:text-white leading-tight">{user.name}</span>
              <span className="text-xs font-bold text-primary">{user.role}</span>
            </div>
            <button onClick={handleLogout} className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm">
              <LogOut size={18} />
            </button>
          </div>
        )}
      </header>
      
      <main className="flex-1 p-6 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 w-full max-w-6xl mx-auto"
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
