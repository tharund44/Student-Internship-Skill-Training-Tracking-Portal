import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { HeroScene } from '../../components/3d/HeroScene';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const [role, setRole] = useState<'STUDENT' | 'ADMIN' | 'ORGANIZATION'>('STUDENT');

  const handleRoleSelect = (selectedRole: 'STUDENT' | 'ADMIN' | 'ORGANIZATION') => {
    setRole(selectedRole);
    // Optional: Auto-fill demo credentials for easier testing
    if (selectedRole === 'ADMIN') {
      setEmail('admin@interntrack.com');
      setPassword('password123');
    } else if (selectedRole === 'ORGANIZATION') {
      setEmail('hr@techcorp.com');
      setPassword('password123');
    } else {
      setEmail('john@student.edu');
      setPassword('password123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#F8F7FF] dark:bg-dark-bg">
      {/* Left: Hero Banner */}
      <div className="relative hidden lg:flex flex-col justify-center p-16 overflow-hidden border-r border-white/20 dark:border-dark-border">
        <HeroScene />
        <div className="relative z-10 max-w-lg">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center text-white font-black text-2xl mb-8">I</div>
          <h1 className="text-5xl font-black text-gray-900 dark:text-white leading-tight mb-6">
            Empower Your <br/> <span className="text-primary">Career Journey.</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            The ultimate ecosystem connecting students, universities, and top-tier tech companies.
          </p>
          <div className="flex gap-3">
            <span className="px-4 py-2 rounded-full bg-white/50 dark:bg-white/10 backdrop-blur-md border border-white/40 text-sm font-bold text-gray-700 dark:text-gray-200">For Students</span>
            <span className="px-4 py-2 rounded-full bg-white/50 dark:bg-white/10 backdrop-blur-md border border-white/40 text-sm font-bold text-gray-700 dark:text-gray-200">For Colleges</span>
            <span className="px-4 py-2 rounded-full bg-white/50 dark:bg-white/10 backdrop-blur-md border border-white/40 text-sm font-bold text-gray-700 dark:text-gray-200">For Companies</span>
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex items-center justify-center p-6 relative z-10">
        <motion.div 
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-[0_8px_40px_rgba(109,74,255,0.15)] rounded-3xl p-8"
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Welcome Back</h2>
            <p className="text-gray-500 dark:text-gray-400">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-3 mb-6">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Select Your Role</label>
              <div className="flex p-1 bg-gray-100/50 dark:bg-black/20 rounded-xl border border-white/40 dark:border-white/10">
                <button type="button" onClick={() => handleRoleSelect('STUDENT')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${role === 'STUDENT' ? 'bg-white dark:bg-slate-700 shadow text-primary' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>
                  Student
                </button>
                <button type="button" onClick={() => handleRoleSelect('ADMIN')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${role === 'ADMIN' ? 'bg-white dark:bg-slate-700 shadow text-primary' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>
                  Admin
                </button>
                <button type="button" onClick={() => handleRoleSelect('ORGANIZATION')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${role === 'ORGANIZATION' ? 'bg-white dark:bg-slate-700 shadow text-primary' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>
                  Company
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="p-3 rounded-lg bg-red-100 text-red-600 text-sm font-medium text-center">
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/20 border border-white/40 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type={showPassword ? "text" : "password"}
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-white/50 dark:bg-black/20 border border-white/40 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
              <a href="#" className="text-sm font-bold text-primary hover:text-purple-700 transition-colors">Forgot Password?</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
            </button>
            
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account? <Link to="/register" className="font-bold text-primary hover:underline">Register here</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
