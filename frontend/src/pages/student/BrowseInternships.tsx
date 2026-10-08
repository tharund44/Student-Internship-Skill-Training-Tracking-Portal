import { useEffect, useState, Suspense } from 'react';
import { Calendar, MapPin, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Glass3DCard } from '../../components/ui/Glass3DCard';
import { GlassInput } from '../../components/ui/GlassInput';
import { GlassButton } from '../../components/ui/GlassButton';
import { EmptyState3D } from '../../components/3d/EmptyState3D';
import api from '../../utils/axios';

export const BrowseInternships = () => {
  const [internships, setInternships] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternships = async () => {
      setLoading(true);
      try {
        const query = `?search=${search}${modeFilter ? `&mode=${modeFilter}` : ''}&size=20`;
        const res = await api.get(`/internships${query}`);
        setInternships(res.data.data.content);
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
  }, [search, modeFilter]);

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-gray-800 tracking-tight">Discover Opportunities</h1>
        <p className="text-gray-600 mt-2 font-medium">Find your next internship or training program.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-4xl mx-auto mb-10">
        <div className="w-full md:w-1/2">
          <GlassInput 
            placeholder="Search by role, company..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
        <div className="flex gap-2">
          {['', 'ONSITE', 'REMOTE', 'HYBRID'].map(mode => (
            <motion.button
              key={mode}
              whileTap={{ scale: 0.95 }}
              onClick={() => setModeFilter(mode)}
              className={`px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-md transition-colors ${
                modeFilter === mode ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white/40 text-gray-700 hover:bg-white/60'
              }`}
            >
              {mode || 'ALL'}
            </motion.button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
             <div key={i} className="h-64 rounded-2xl bg-white/20 animate-pulse" />
          ))}
        </div>
      ) : internships.length === 0 ? (
        <div className="text-center py-10">
          <Suspense fallback={null}><EmptyState3D /></Suspense>
          <h3 className="text-xl font-bold mt-4 text-gray-700">No internships found</h3>
          <p className="text-gray-500">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden" animate="show"
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        >
          {internships.map((item: any) => (
            <motion.div key={item.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <Glass3DCard className="h-full flex flex-col justify-between cursor-pointer">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-white/50 rounded-xl flex items-center justify-center font-bold text-xl text-primary shadow-sm">
                      {item.organization.companyName.charAt(0)}
                    </div>
                    <span className="px-2 py-1 bg-lavender/50 text-primary text-xs font-bold rounded-lg">{item.mode}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{item.title}</h3>
                  <p className="text-gray-600 font-medium mb-4">{item.organization.companyName}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600"><MapPin size={16}/> {item.location}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-600"><Briefcase size={16}/> {item.durationWeeks} Weeks</div>
                    <div className="flex items-center gap-2 text-sm text-gray-600"><Calendar size={16}/> Apply by {new Date(item.deadline).toLocaleDateString()}</div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/20 flex gap-2 overflow-x-auto pb-2">
                  {item.skills?.split(',').slice(0, 3).map((s:string) => (
                    <span key={s} className="px-2 py-1 bg-white/40 text-xs font-medium rounded-md whitespace-nowrap">{s.trim()}</span>
                  ))}
                  {(item.skills?.split(',').length > 3) && <span className="px-2 py-1 bg-white/40 text-xs font-medium rounded-md">+{item.skills.split(',').length - 3}</span>}
                </div>
                
                <Link to={`/student/internships/${item.id}`} className="mt-4 block">
                  <GlassButton className="w-full">View Details</GlassButton>
                </Link>
              </Glass3DCard>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};
