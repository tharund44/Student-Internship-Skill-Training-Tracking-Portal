import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassButton } from '../../components/ui/GlassButton';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import api from '../../utils/axios';

const GlassTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/50 dark:border-white/10 p-3 rounded-xl shadow-xl">
        <p className="font-bold text-gray-800 dark:text-white mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AnimatedCube = () => (
  <motion.div animate={{ rotateX: [0, 360], rotateY: [0, 360] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="w-16 h-16 relative" style={{ transformStyle: 'preserve-3d' }}>
    <div className="absolute inset-0 bg-primary/20 dark:bg-primary/40 border border-primary/50 backdrop-blur-sm" style={{ transform: 'translateZ(32px)' }} />
    <div className="absolute inset-0 bg-purple-400/20 dark:bg-purple-400/40 border border-purple-400/50 backdrop-blur-sm" style={{ transform: 'rotateY(90deg) translateZ(32px)' }} />
    <div className="absolute inset-0 bg-blue-400/20 dark:bg-blue-400/40 border border-blue-400/50 backdrop-blur-sm" style={{ transform: 'rotateX(90deg) translateZ(32px)' }} />
  </motion.div>
);

export const StudentDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  
  useEffect(() => { 
    api.get('/dashboard/student')
      .then(res => setStats(res.data.data))
      .catch(err => setStats({ error: err.response?.data?.message || err.message }));
  }, []);
  if(!stats) return <div className="flex justify-center items-center h-full"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if(stats.error) return <div className="text-red-500 text-center p-10 font-bold bg-white/50 dark:bg-black/20 rounded-xl">Error Loading Dashboard: {stats.error}</div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between bg-white/40 dark:bg-dark-glass p-8 rounded-3xl border border-white/50 dark:border-dark-border">
        <div>
          <h1 className="text-4xl font-black text-gray-800 dark:text-white mb-2">Welcome back, {user?.name.split(' ')[0]}!</h1>
          <p className="text-gray-600 dark:text-gray-400">Here's your internship and training overview.</p>
        </div>
        <div className="hidden md:block" style={{ perspective: 1000 }}><AnimatedCube /></div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[ {label: 'Applications', val: stats.counters.applications, color: 'text-blue-500'}, 
           {label: 'Trainings', val: stats.counters.trainings, color: 'text-purple-500'}, 
           {label: 'Certificates', val: stats.counters.certificates, color: 'text-green-500'}, 
           {label: 'Progress %', val: stats.counters.overallProgress, color: 'text-primary'}
         ].map((s, i) => (
          <motion.div key={i} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:i*0.1}}>
            <GlassCard className="text-center p-6 dark:bg-dark-glass dark:border-dark-border">
              <AnimatedCounter value={s.val} className={`text-5xl font-black ${s.color}`} />
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-2">{s.label}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="h-80 p-6 dark:bg-dark-glass dark:border-dark-border">
          <h3 className="font-bold mb-6 dark:text-white">Application Activity</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.trends}>
              <defs>
                <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6D4AFF" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6D4AFF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip content={<GlassTooltip />} />
              <Area type="monotone" dataKey="applications" stroke="#6D4AFF" fillOpacity={1} fill="url(#colorApps)" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
        
        <GlassCard className="p-6 dark:bg-dark-glass dark:border-dark-border">
          <h3 className="font-bold mb-4 dark:text-white">Quick Actions</h3>
          <div className="flex flex-col gap-3">
            <Link to="/student/browse"><GlassButton className="w-full justify-start text-left">Explore Internships</GlassButton></Link>
            <Link to="/student/trainings"><GlassButton className="w-full justify-start text-left">Enroll in Training</GlassButton></Link>
            <Link to="/student/progress"><GlassButton variant="ghost" className="w-full justify-start text-left border-primary text-primary">View Progress</GlassButton></Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => { api.get('/dashboard/admin').then(res => setStats(res.data.data)); }, []);
  if(!stats) return <div className="text-center p-20 dark:text-white">Loading Dashboard...</div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between bg-white/40 dark:bg-dark-glass p-8 rounded-3xl border border-white/50 dark:border-dark-border">
        <div>
          <h1 className="text-4xl font-black text-gray-800 dark:text-white mb-2">System Console</h1>
          <p className="text-gray-600 dark:text-gray-400">Global overview and analytics.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[ {label: 'Students', val: stats.counters.totalStudents, color: 'text-blue-500'}, 
           {label: 'Organizations', val: stats.counters.totalOrganizations, color: 'text-purple-500'}, 
           {label: 'Active Internships', val: stats.counters.activeInternships, color: 'text-green-500'}, 
           {label: 'Training Programs', val: stats.counters.activeTrainings, color: 'text-orange-500'}
         ].map((s, i) => (
          <motion.div key={i} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:i*0.1}}>
            <GlassCard className="text-center p-6 dark:bg-dark-glass dark:border-dark-border">
              <AnimatedCounter value={s.val} className={`text-4xl font-black ${s.color}`} />
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-2">{s.label}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="col-span-2 h-80 p-6 dark:bg-dark-glass dark:border-dark-border">
          <h3 className="font-bold mb-6 dark:text-white">Platform Growth</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.trends}>
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip content={<GlassTooltip />} cursor={{fill: 'rgba(255,255,255,0.1)'}} />
              <Bar dataKey="students" fill="#6D4AFF" radius={[4,4,0,0]} />
              <Bar dataKey="internships" fill="#22c55e" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
        
        <GlassCard className="p-6 dark:bg-dark-glass dark:border-dark-border overflow-hidden flex flex-col">
          <h3 className="font-bold mb-4 dark:text-white">Recent Activity</h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {stats.recentActivities.map((a:any, i:number) => (
              <div key={i} className="text-sm border-b border-gray-100 dark:border-gray-700 pb-2">
                <span className="font-bold text-primary dark:text-purple-400 block">{a.action}</span>
                <span className="text-gray-500 dark:text-gray-400 text-xs">by {a.admin}</span>
              </div>
            ))}
          </div>
          <Link to="/admin/reports" className="mt-4"><GlassButton className="w-full">View Full Reports</GlassButton></Link>
        </GlassCard>
      </div>
    </div>
  );
};

export const OrgDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  useEffect(() => { api.get('/dashboard/org').then(res => setStats(res.data.data)); }, []);
  if(!stats) return <div className="text-center p-20 dark:text-white">Loading Dashboard...</div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between bg-white/40 dark:bg-dark-glass p-8 rounded-3xl border border-white/50 dark:border-dark-border">
        <div>
          <h1 className="text-4xl font-black text-gray-800 dark:text-white mb-2">{user?.name} Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your internships and trainings.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {[ {label: 'Active Opportunities', val: stats.counters.activeOpportunities, color: 'text-primary'}, 
           {label: 'New Applications', val: stats.counters.newApplications, color: 'text-blue-500'}, 
           {label: 'Enrolled Students', val: stats.counters.enrolledStudents, color: 'text-green-500'}
         ].map((s, i) => (
          <motion.div key={i} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:i*0.1}}>
            <GlassCard className="text-center p-6 dark:bg-dark-glass dark:border-dark-border">
              <AnimatedCounter value={s.val} className={`text-5xl font-black ${s.color}`} />
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-2">{s.label}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="h-80 p-6 dark:bg-dark-glass dark:border-dark-border">
          <h3 className="font-bold mb-6 dark:text-white">Engagement Trends</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.trends}>
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip content={<GlassTooltip />} />
              <Line type="monotone" dataKey="views" stroke="#6D4AFF" strokeWidth={3} dot={{r: 4}} />
              <Line type="monotone" dataKey="applicants" stroke="#22c55e" strokeWidth={3} dot={{r: 4}} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
        
        <GlassCard className="p-6 dark:bg-dark-glass dark:border-dark-border">
          <h3 className="font-bold mb-4 dark:text-white">Management</h3>
          <div className="flex flex-col gap-3">
            <Link to="/org/internships/create"><GlassButton className="w-full justify-start text-left">Post New Internship</GlassButton></Link>
            <Link to="/org/trainings/create"><GlassButton className="w-full justify-start text-left">Create Training Program</GlassButton></Link>
            <Link to="/org/progress"><GlassButton variant="ghost" className="w-full justify-start text-left border-primary text-primary">Update Student Progress</GlassButton></Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export const Unauthorized = () => (
  <div className="text-center p-20 dark:text-white">
    <h2 className="text-red-500 text-2xl font-bold">Unauthorized</h2>
    <p>You do not have access to this page.</p>
  </div>
);

export const DashboardRouter = () => {
  const { user, logout } = useAuthStore();
  if (user?.role === 'STUDENT') return <StudentDashboard />;
  if (user?.role === 'ADMIN') return <AdminDashboard />;
  if (user?.role === 'ORGANIZATION') return <OrgDashboard />;
  return (
    <div className="flex flex-col items-center justify-center p-20">
      <h2 className="text-xl font-bold text-red-500 mb-4">Invalid User State</h2>
      <p className="text-gray-500 mb-6">Your role ({user?.role || 'Unknown'}) is not recognized.</p>
      <GlassButton onClick={() => { logout(); window.location.href = '/login'; }}>Logout & Return to Login</GlassButton>
    </div>
  );
};
