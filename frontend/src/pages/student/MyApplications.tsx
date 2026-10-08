import { useEffect, useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassButton } from '../../components/ui/GlassButton';
import { Stepper } from '../../components/ui/Stepper';
import { Timeline } from '../../components/ui/Timeline';
import { motion } from 'framer-motion';
import api from '../../utils/axios';

export const MyApplications = () => {
  const [apps, setApps] = useState<any[]>([]);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    const res = await api.get('/student/applications');
    setApps(res.data.data);
  };

  const handleWithdraw = async (id: number) => {
    if (confirm('Are you sure you want to withdraw this application?')) {
      await api.put(`/student/applications/${id}/withdraw`);
      fetchApps();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <h1 className="text-3xl font-bold">My Applications</h1>
      {apps.length === 0 ? (
        <p className="text-gray-500">You haven't applied to any internships yet.</p>
      ) : (
        <div className="space-y-6">
          {apps.map((app, index) => (
            <motion.div key={app.id} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:index*0.1}}>
              <GlassCard className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold">{app.internshipTitle}</h3>
                    <p className="text-gray-600">{app.companyName}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${app.status === 'REJECTED' || app.status === 'WITHDRAWN' ? 'bg-red-100 text-red-700' : 'bg-primary/20 text-primary'}`}>
                    {app.status}
                  </span>
                </div>
                
                <Stepper currentStatus={app.status} />
                
                <div className="mt-6 pt-4 border-t border-white/20">
                  <details className="group">
                    <summary className="text-sm font-bold text-gray-500 cursor-pointer list-none flex items-center justify-between">
                      View History Log
                      <span className="group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="mt-4">
                      <Timeline items={app.history.map((h:any) => ({
                        id: h.id, title: `Status changed to ${h.newStatus}`, organizationName: `by ${h.changedBy}`,
                        status: h.newStatus, date: h.timestamp, type: 'HISTORY'
                      }))} />
                    </div>
                  </details>
                </div>
                
                {(app.status === 'APPLIED' || app.status === 'UNDER_REVIEW') && (
                  <div className="mt-4 flex justify-end">
                    <GlassButton variant="ghost" onClick={() => handleWithdraw(app.id)} className="text-red-500 hover:text-red-600">Withdraw</GlassButton>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
