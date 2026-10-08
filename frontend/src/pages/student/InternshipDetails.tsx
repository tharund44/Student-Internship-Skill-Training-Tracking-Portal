import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, ArrowLeft, X } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassButton } from '../../components/ui/GlassButton';
import { GlassInput } from '../../components/ui/GlassInput';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import api from '../../utils/axios';

export const InternshipDetails = () => {
  const { id } = useParams();
  const [internship, setInternship] = useState<any>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [resumeLink, setResumeLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      const res = await api.get(`/internships/${id}`);
      setInternship(res.data.data);
    };
    fetchDetails();
  }, [id]);

  const handleApply = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post(`/student/applications/${id}`, { coverNote, resumeLink });
      setModalOpen(false);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6D4AFF', '#ffffff', '#8E74FF']
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error applying to internship');
    } finally {
      setLoading(false);
    }
  };

  if (!internship) return <div className="p-8 text-center animate-pulse">Loading details...</div>;

  return (
    <div className="max-w-6xl mx-auto pb-20 relative">
      <Link to="/student/browse" className="flex items-center gap-2 text-primary font-medium mb-6 hover:underline">
        <ArrowLeft size={20} /> Back to Browse
      </Link>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <GlassCard className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-black text-gray-900">{internship.title}</h1>
                <p className="text-xl text-primary font-bold mt-1">{internship.organization.companyName}</p>
              </div>
              <div className="w-16 h-16 bg-white/50 rounded-2xl flex items-center justify-center font-black text-3xl text-primary shadow-sm">
                {internship.organization.companyName.charAt(0)}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-8 border-b border-white/20 pb-8">
              <div className="flex items-center gap-2 bg-white/40 px-4 py-2 rounded-xl text-gray-700 font-medium"><MapPin size={20} className="text-primary"/> {internship.location} ({internship.mode})</div>
              <div className="flex items-center gap-2 bg-white/40 px-4 py-2 rounded-xl text-gray-700 font-medium"><Briefcase size={20} className="text-primary"/> {internship.durationWeeks} Weeks</div>
              <div className="flex items-center gap-2 bg-white/40 px-4 py-2 rounded-xl text-gray-700 font-medium"><DollarSign size={20} className="text-primary"/> {internship.stipend || 'Unpaid'}</div>
            </div>
            
            <div className="space-y-8">
              <section>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{internship.description}</p>
              </section>
              
              <section>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">Requirements</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{internship.requirements}</p>
              </section>
            </div>
          </GlassCard>
        </div>
        
        <div className="w-full lg:w-1/3">
          <div className="sticky top-24 space-y-6">
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold mb-4">Application Details</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Deadline</span>
                  <span className="font-bold text-gray-800">{new Date(internship.deadline).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Openings</span>
                  <span className="font-bold text-gray-800">{internship.openings}</span>
                </div>
              </div>
              <GlassButton onClick={() => setModalOpen(true)} className="w-full text-lg py-3 shadow-lg shadow-primary/30">Apply Now</GlassButton>
            </GlassCard>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => setModalOpen(false)} />
            <motion.div initial={{opacity:0, scale:0.95, y:20}} animate={{opacity:1, scale:1, y:0}} exit={{opacity:0, scale:0.95, y:20}} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50">
              <GlassCard className="p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Apply to {internship.organization.companyName}</h2>
                  <button onClick={() => setModalOpen(false)}><X className="text-gray-500 hover:text-gray-800"/></button>
                </div>
                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Cover Note</label>
                    <textarea rows={4} className="w-full rounded-xl bg-white/40 border border-white/50 p-3 focus:outline-none focus:ring-2 focus:ring-primary/50" value={coverNote} onChange={e => setCoverNote(e.target.value)} placeholder="Why are you a good fit?" />
                  </div>
                  <GlassInput label="Custom Resume Link (Optional)" value={resumeLink} onChange={e => setResumeLink(e.target.value)} placeholder="Overrides your profile resume" />
                  <GlassButton className="w-full mt-4" onClick={handleApply} disabled={loading}>{loading ? 'Applying...' : 'Submit Application'}</GlassButton>
                </div>
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
