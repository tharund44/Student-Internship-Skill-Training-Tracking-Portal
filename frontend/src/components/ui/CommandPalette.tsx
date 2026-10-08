import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Briefcase, GraduationCap, FileText, Activity } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSearch('');
    }
  }, [open]);

  if (!user) return null;

  const routes = [
    { label: 'Dashboard', path: '/dashboard', icon: <Activity size={18}/>, roles: ['STUDENT','ADMIN','ORGANIZATION'] },
    
    // Student
    { label: 'My Profile', path: '/student/profile', icon: <User size={18}/>, roles: ['STUDENT'] },
    { label: 'Browse Internships', path: '/student/browse', icon: <Briefcase size={18}/>, roles: ['STUDENT'] },
    { label: 'Skill Trainings', path: '/student/trainings', icon: <GraduationCap size={18}/>, roles: ['STUDENT'] },
    { label: 'My Certificates', path: '/student/certificates', icon: <FileText size={18}/>, roles: ['STUDENT'] },
    
    // Admin
    { label: 'Manage Users', path: '/admin/users', icon: <User size={18}/>, roles: ['ADMIN'] },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: <Activity size={18}/>, roles: ['ADMIN'] },
    { label: 'Review Applications', path: '/admin/applications', icon: <FileText size={18}/>, roles: ['ADMIN'] },
  ];

  const filtered = routes.filter(r => r.roles.includes(user.role) && r.label.toLowerCase().includes(search.toLowerCase()));

  const handleSelect = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 text-xs font-medium text-gray-400 bg-white/50 backdrop-blur px-3 py-2 rounded-xl shadow border border-white">
        <kbd className="font-mono bg-gray-100 rounded px-1">⌘K</kbd> to search
      </div>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]" onClick={() => setOpen(false)}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-lg bg-white/70 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white overflow-hidden"
            >
              <div className="flex items-center px-4 py-3 border-b border-gray-200/50">
                <Search className="text-gray-400 mr-3" size={20} />
                <input
                  ref={inputRef}
                  type="text"
                  className="w-full bg-transparent text-lg focus:outline-none text-gray-800 placeholder-gray-400"
                  placeholder="Type a command or search..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <kbd className="text-[10px] font-mono text-gray-400 bg-gray-100 rounded px-1 ml-2">ESC</kbd>
              </div>

              <div className="max-h-64 overflow-y-auto p-2">
                {filtered.map((r, i) => (
                  <button
                    key={i}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/10 text-left transition-colors text-gray-700 hover:text-primary font-medium"
                    onClick={() => handleSelect(r.path)}
                  >
                    {r.icon}
                    {r.label}
                  </button>
                ))}
                {filtered.length === 0 && <div className="p-4 text-center text-gray-500">No results found.</div>}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
