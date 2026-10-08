import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassInput } from '../../components/ui/GlassInput';
import { GlassButton } from '../../components/ui/GlassButton';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/axios';

export const CreateInternship = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '', description: '', requirements: '', skills: '', durationWeeks: 12,
    stipend: '', location: '', mode: 'ONSITE', deadline: '', openings: 1, status: 'OPEN'
  });

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);
  const handleSubmit = async () => {
    await api.post('/org/internships', formData);
    navigate('/dashboard'); // redirect to dashboard
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <h1 className="text-3xl font-bold">Create Internship</h1>
      
      {/* Progress Indicator */}
      <div className="flex gap-2">
        {[1,2,3].map(i => (
          <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-white/40'}`} />
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <GlassCard className="flex-1 relative overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="1" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Basic Details</h2>
                <GlassInput label="Title" value={formData.title} onChange={e=>setFormData({...formData, title:e.target.value})} required />
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea className="w-full rounded-xl bg-white/40 border border-white/50 p-3 focus:outline-none focus:ring-2 focus:ring-primary/50" rows={4} value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Requirements</label>
                  <textarea className="w-full rounded-xl bg-white/40 border border-white/50 p-3 focus:outline-none focus:ring-2 focus:ring-primary/50" rows={3} value={formData.requirements} onChange={e=>setFormData({...formData, requirements:e.target.value})} />
                </div>
              </motion.div>
            )}
            
            {step === 2 && (
              <motion.div key="2" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Logistics</h2>
                <div className="grid grid-cols-2 gap-4">
                  <GlassInput label="Duration (Weeks)" type="number" value={formData.durationWeeks} onChange={e=>setFormData({...formData, durationWeeks:parseInt(e.target.value)})} required />
                  <GlassInput label="Stipend (e.g. $1000/mo)" value={formData.stipend} onChange={e=>setFormData({...formData, stipend:e.target.value})} />
                  <GlassInput label="Location" value={formData.location} onChange={e=>setFormData({...formData, location:e.target.value})} required />
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Work Mode</label>
                    <select className="w-full rounded-xl bg-white/40 border border-white/50 p-3 focus:outline-none focus:ring-2 focus:ring-primary/50" value={formData.mode} onChange={e=>setFormData({...formData, mode:e.target.value})}>
                      <option value="ONSITE">Onsite</option>
                      <option value="REMOTE">Remote</option>
                      <option value="HYBRID">Hybrid</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="3" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Skills & Publishing</h2>
                <GlassInput label="Skills (comma separated)" value={formData.skills} onChange={e=>setFormData({...formData, skills:e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <GlassInput label="Deadline" type="date" value={formData.deadline} onChange={e=>setFormData({...formData, deadline:e.target.value})} required />
                  <GlassInput label="Openings" type="number" value={formData.openings} onChange={e=>setFormData({...formData, openings:parseInt(e.target.value)})} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                  <select className="w-full rounded-xl bg-white/40 border border-white/50 p-3 focus:outline-none focus:ring-2 focus:ring-primary/50" value={formData.status} onChange={e=>setFormData({...formData, status:e.target.value})}>
                    <option value="OPEN">Published (Open)</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-4 border-t border-white/20 flex justify-between">
            <GlassButton variant="ghost" onClick={handlePrev} disabled={step === 1}>Back</GlassButton>
            {step < 3 ? <GlassButton onClick={handleNext}>Next</GlassButton> : <GlassButton onClick={handleSubmit}>Publish</GlassButton>}
          </div>
        </GlassCard>
        
        {/* Live Preview */}
        <div className="w-full md:w-1/3">
          <p className="font-bold text-gray-500 mb-2 uppercase text-sm tracking-wider">Live Preview</p>
          <GlassCard className="pointer-events-none opacity-80 scale-95 origin-top">
             <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-lavender rounded flex items-center justify-center font-bold text-primary">C</div>
                <span className="px-2 py-1 bg-lavender/50 text-primary text-[10px] font-bold rounded-lg">{formData.mode}</span>
             </div>
             <h3 className="font-bold text-gray-800 line-clamp-2">{formData.title || 'Internship Title'}</h3>
             <p className="text-gray-600 font-medium text-sm mb-4">Your Company</p>
             <div className="space-y-1 mb-4 text-xs text-gray-600">
               <div>{formData.location || 'Location'}</div>
               <div>{formData.durationWeeks} Weeks • {formData.stipend || 'Unpaid'}</div>
             </div>
             <div className="flex gap-1 flex-wrap">
               {formData.skills.split(',').slice(0,3).map(s=>(<span key={s} className="px-1 bg-white/40 text-[10px] rounded">{s}</span>))}
             </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
