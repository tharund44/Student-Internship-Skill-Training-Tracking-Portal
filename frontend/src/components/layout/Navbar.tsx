import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Bell, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { user } = useAuthStore();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 dark:bg-dark-bg/70 border-b border-white/20 dark:border-dark-border shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center text-white font-black">I</div>
          <span className="font-black text-xl tracking-tight text-gray-800 dark:text-white">InternTrack</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-300">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          {user && (
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors relative text-gray-600 dark:text-gray-300">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-dark-bg animate-pulse"></span>
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-2 w-80 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-white/10 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 font-bold dark:text-white">Notifications</div>
                    <div className="p-4 text-sm text-gray-500 dark:text-gray-400">You have no new notifications.</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          
          {user && (
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-400 p-[2px]">
                <div className="w-full h-full bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-primary font-bold text-xs">{user.name.charAt(0)}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
