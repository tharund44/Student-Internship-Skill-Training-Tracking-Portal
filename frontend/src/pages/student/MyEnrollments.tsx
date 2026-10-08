import { useEffect, useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassButton } from '../../components/ui/GlassButton';
import { motion } from 'framer-motion';
import api from '../../utils/axios';

export const MyEnrollments = () => {
  const [enrollments, setEnrollments] = useState<any[]>([]);

  const fetchEnrollments = async () => {
    const res = await api.get('/student/trainings/enrollments');
    setEnrollments(res.data.data);
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleUnenroll = async (id: number) => {
    if (confirm('Drop this course?')) {
      await api.put(`/student/trainings/enrollments/${id}/unenroll`);
      fetchEnrollments();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <h1 className="text-3xl font-bold">My Training Programs</h1>
      {enrollments.length === 0 ? (
        <p className="text-gray-500">You are not enrolled in any programs.</p>
      ) : (
        <div className="grid gap-6">
          {enrollments.map((e, index) => (
            <motion.div key={e.id} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:index*0.1}}>
              <GlassCard className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold">{e.trainingTitle}</h3>
                  <p className="text-gray-600">{e.providerName}</p>
                  <p className="text-sm text-gray-500 mt-2">Enrolled on: {new Date(e.enrolledAt).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${e.status === 'DROPPED' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {e.status}
                  </span>
                  {(e.status === 'ENROLLED' || e.status === 'IN_PROGRESS') && (
                    <GlassButton variant="ghost" onClick={() => handleUnenroll(e.id)} className="text-red-500 text-xs">Drop Course</GlassButton>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
