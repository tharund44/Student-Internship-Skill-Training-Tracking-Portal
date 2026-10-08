import { useEffect, useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter';
import api from '../../utils/axios';
import { motion } from 'framer-motion';

export const MonitorProgress = () => {
  const [trackers, setTrackers] = useState<any[]>([]);

  useEffect(() => {
    const fetchP = async () => {
      const res = await api.get('/admin/progress');
      setTrackers(res.data.data);
    };
    fetchP();
  }, []);

  const total = trackers.length;
  const completed = trackers.filter(t => t.percentage === 100).length;
  const ongoing = total - completed;

  return (
    <div className="space-y-8 pb-20">
      <h1 className="text-3xl font-bold">System Progress Monitoring</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="text-center p-6">
          <p className="text-gray-500 font-bold mb-2">Total Trackers</p>
          <AnimatedCounter value={total} className="text-5xl font-black text-gray-800" />
        </GlassCard>
        <GlassCard className="text-center p-6 border border-green-400/30">
          <p className="text-green-600 font-bold mb-2">Completed</p>
          <AnimatedCounter value={completed} className="text-5xl font-black text-green-600" />
        </GlassCard>
        <GlassCard className="text-center p-6 border border-blue-400/30">
          <p className="text-blue-600 font-bold mb-2">Ongoing</p>
          <AnimatedCounter value={ongoing} className="text-5xl font-black text-blue-600" />
        </GlassCard>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-lavender/30">
            <tr>
              <th className="p-4">Student</th>
              <th className="p-4">Program</th>
              <th className="p-4">Company</th>
              <th className="p-4 w-1/3">Progress</th>
            </tr>
          </thead>
          <tbody>
            {trackers.map(t => (
              <tr key={t.id} className="border-b border-white/20">
                <td className="p-4 font-bold">{t.studentName}</td>
                <td className="p-4">
                  <span className="text-[10px] bg-white/50 px-1 rounded mr-2">{t.referenceType}</span>
                  {t.title}
                </td>
                <td className="p-4">{t.companyName}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-white/30 h-2 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${t.percentage}%` }} className={`h-full ${t.percentage === 100 ? 'bg-green-500' : 'bg-primary'}`} />
                    </div>
                    <span className="text-xs font-bold w-8">{t.percentage}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
};
