import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassButton } from '../../components/ui/GlassButton';
import api from '../../utils/axios';

export const ManageEnrollments = () => {
  const { id } = useParams();
  const [enrollments, setEnrollments] = useState<any[]>([]);

  useEffect(() => {
    const fetchE = async () => {
      const res = await api.get(`/org/trainings/${id}/enrollments`);
      setEnrollments(res.data.data);
    };
    fetchE();
  }, [id]);

  const updateStatus = async (eid: number, status: string) => {
    await api.put(`/org/trainings/enrollments/${eid}/status?status=${status}`);
    setEnrollments(enrollments.map(e => e.id === eid ? { ...e, status } : e));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <h1 className="text-3xl font-bold">Enrolled Students</h1>
      <GlassCard className="overflow-hidden p-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-lavender/30"><th className="p-4">Student</th><th className="p-4">College</th><th className="p-4">Status</th><th className="p-4">Action</th></tr>
          </thead>
          <tbody>
            {enrollments.map(e => (
              <tr key={e.id} className="border-b border-white/20">
                <td className="p-4 font-bold">{e.studentName}</td>
                <td className="p-4">{e.studentCollege}</td>
                <td className="p-4"><span className="px-2 py-1 bg-white/50 rounded-lg text-xs font-bold">{e.status}</span></td>
                <td className="p-4 flex gap-2">
                  <GlassButton onClick={() => updateStatus(e.id, 'IN_PROGRESS')} variant="ghost" className="text-xs py-1">Mark Progress</GlassButton>
                  <GlassButton onClick={() => updateStatus(e.id, 'COMPLETED')} className="text-xs py-1">Mark Completed</GlassButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
};
