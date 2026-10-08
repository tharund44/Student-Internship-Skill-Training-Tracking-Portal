import { useEffect, useState, Suspense } from 'react';
import { BookOpen, Users, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Glass3DCard } from '../../components/ui/Glass3DCard';
import { GlassInput } from '../../components/ui/GlassInput';
import { GlassButton } from '../../components/ui/GlassButton';
import { EmptyState3D } from '../../components/3d/EmptyState3D';
import api from '../../utils/axios';

export const BrowseTrainings = () => {
  const [trainings, setTrainings] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainings = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/trainings?search=${search}&size=20`);
        setTrainings(res.data.data.content);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainings();
  }, [search]);

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-gray-800 tracking-tight">Skill Training Programs</h1>
        <p className="text-gray-600 mt-2 font-medium">Upskill yourself with top organizations.</p>
      </div>

      <div className="flex justify-center max-w-2xl mx-auto mb-10">
        <div className="w-full">
          <GlassInput 
            placeholder="Search programs..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-64 rounded-2xl bg-white/20 animate-pulse" />)}
        </div>
      ) : trainings.length === 0 ? (
        <div className="text-center py-10">
          <Suspense fallback={null}><EmptyState3D /></Suspense>
          <h3 className="text-xl font-bold mt-4 text-gray-700">No programs found</h3>
        </div>
      ) : (
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
          {trainings.map((item: any) => (
            <motion.div key={item.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <Glass3DCard className="h-full flex flex-col justify-between cursor-pointer">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-white/50 rounded-xl flex items-center justify-center font-bold text-xl text-primary shadow-sm">
                      <BookOpen size={24} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{item.title}</h3>
                  <p className="text-gray-600 font-medium mb-4">{item.provider.companyName}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600"><Clock size={16}/> {item.durationWeeks} Weeks</div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users size={16}/> {item.seats ? `${item.seats - item.enrolledCount} Seats Left` : 'Unlimited Seats'}
                    </div>
                    
                    {/* Animated Progress Bar */}
                    {item.seats && (
                      <div className="w-full bg-white/30 h-2 rounded-full overflow-hidden mt-3 relative">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${(item.enrolledCount / item.seats) * 100}%` }} 
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full bg-primary" 
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <Link to={`/student/trainings/${item.id}`} className="mt-4 block">
                  <GlassButton className="w-full">View Syllabus</GlassButton>
                </Link>
              </Glass3DCard>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};
