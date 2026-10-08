import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Users, Clock, ArrowLeft, CheckCircle } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassButton } from '../../components/ui/GlassButton';
import { Accordion } from '../../components/ui/Accordion';
import { motion } from 'framer-motion';
import api from '../../utils/axios';

export const TrainingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [training, setTraining] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    const res = await api.get(`/trainings/${id}`);
    setTraining(res.data.data);
  };

  const handleEnroll = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post(`/student/trainings/${id}/enroll`);
      setEnrolled(true);
      setTimeout(() => navigate('/student/enrollments'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error enrolling');
    } finally {
      setLoading(false);
    }
  };

  if (!training) return <div className="p-8 text-center animate-pulse">Loading details...</div>;

  let modules = [];
  try { 
    modules = training.modulesSyllabus ? JSON.parse(training.modulesSyllabus) : [];
    if (!Array.isArray(modules)) throw new Error("Not an array");
  } catch(e) { 
    modules = [{ title: "Overview", content: training.modulesSyllabus || "No syllabus provided." }]; 
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <Link to="/student/trainings" className="flex items-center gap-2 text-primary font-medium mb-6 hover:underline">
        <ArrowLeft size={20} /> Back to Catalog
      </Link>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <GlassCard className="p-8">
            <h1 className="text-4xl font-black text-gray-900">{training.title}</h1>
            <p className="text-xl text-primary font-bold mt-1 mb-6">{training.provider.companyName}</p>
            
            <div className="flex flex-wrap gap-4 mb-8 border-b border-white/20 pb-8">
              <div className="flex items-center gap-2 bg-white/40 px-4 py-2 rounded-xl font-medium"><Clock className="text-primary"/> {training.durationWeeks} Weeks</div>
              <div className="flex items-center gap-2 bg-white/40 px-4 py-2 rounded-xl font-medium">
                <Users className="text-primary"/> {training.seats ? `${training.seats - training.enrolledCount} Seats Remaining` : 'Unlimited Seats'}
              </div>
            </div>
            
            <h3 className="text-2xl font-bold mb-3">About This Program</h3>
            <p className="text-gray-700 leading-relaxed mb-8">{training.description}</p>
            
            <h3 className="text-2xl font-bold mb-3">Requirements</h3>
            <p className="text-gray-700 leading-relaxed mb-8">{training.requirements}</p>

            <h3 className="text-2xl font-bold mb-4">Syllabus</h3>
            {modules.map((m:any, i:number) => (
              <Accordion key={i} title={`Module ${i+1}: ${m.title || 'Section'}`} defaultOpen={i===0}>
                <p className="text-gray-700">{m.content || m}</p>
              </Accordion>
            ))}
          </GlassCard>
        </div>
        
        <div className="w-full lg:w-1/3">
          <div className="sticky top-24">
            <GlassCard className="p-6 text-center">
              {enrolled ? (
                <motion.div initial={{scale:0}} animate={{scale:1}} className="py-4">
                  <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-600">Successfully Enrolled!</h3>
                  <p className="text-sm text-gray-500 mt-2">Redirecting to your enrollments...</p>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-xl font-bold mb-6">Ready to upskill?</h3>
                  {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                  <GlassButton 
                    onClick={handleEnroll} 
                    disabled={loading || (training.seats && training.seats - training.enrolledCount <= 0)} 
                    className="w-full text-lg py-3"
                  >
                    {loading ? 'Processing...' : ((training.seats && training.seats - training.enrolledCount <= 0) ? 'Fully Booked' : 'Enroll Now')}
                  </GlassButton>
                </>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};
