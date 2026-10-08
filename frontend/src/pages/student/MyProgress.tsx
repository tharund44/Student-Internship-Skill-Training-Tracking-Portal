import { useEffect, useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { DonutChart } from '../../components/ui/DonutChart';
import { Timeline } from '../../components/ui/Timeline';
import { CheckCircle, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../utils/axios';

export const MyProgress = () => {
  const [trackers, setTrackers] = useState<any[]>([]);

  useEffect(() => {
    const fetchP = async () => {
      const res = await api.get('/student/progress');
      setTrackers(res.data.data);
    };
    fetchP();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <h1 className="text-3xl font-bold">My Progress Trackers</h1>
      {trackers.length === 0 ? (
        <p className="text-gray-500">No active progress tracking yet.</p>
      ) : (
        <div className="space-y-6">
          {trackers.map((t, index) => (
            <motion.div key={t.id} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:index*0.1}}>
              <GlassCard className="p-8">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                  <div className="flex-shrink-0">
                    <DonutChart percentage={t.percentage} size={140} strokeWidth={14} color={t.percentage === 100 ? "#22c55e" : "#6D4AFF"} />
                  </div>
                  
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-xs font-bold text-primary tracking-wider uppercase">{t.referenceType}</span>
                        <h3 className="text-2xl font-bold">{t.title}</h3>
                        <p className="text-gray-600">{t.companyName}</p>
                      </div>
                      {t.certificateEligible && (
                        <div className="flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1 rounded-full text-xs font-bold">
                          <Trophy size={14} /> Certificate Ready
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 p-4 bg-white/30 rounded-xl border border-white/50">
                      <h4 className="font-bold text-sm text-gray-700 mb-1">Current Stage / Module:</h4>
                      <div className="flex items-center gap-2">
                        {t.percentage === 100 ? <CheckCircle className="text-green-500" size={18}/> : <div className="w-2 h-2 bg-primary rounded-full animate-pulse"/>}
                        <span className="text-gray-800 font-medium">{t.currentStage || (t.percentage === 100 ? 'Completed' : 'In Progress')}</span>
                      </div>
                      {t.remarks && <p className="text-xs text-gray-500 mt-2 italic">Remarks: {t.remarks}</p>}
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-white/20 pt-6">
                  <h4 className="font-bold mb-4">Milestone Timeline</h4>
                  <Timeline items={t.history.map((h:any, i:number) => ({
                    id: i, title: `Advanced to ${h.newPercentage}%`, organizationName: h.stage || 'Update',
                    status: h.newPercentage === 100 ? 'COMPLETED' : 'IN_PROGRESS', date: h.timestamp, type: 'HISTORY'
                  }))} />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
