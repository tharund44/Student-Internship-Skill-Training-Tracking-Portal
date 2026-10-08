import { useEffect, useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import api from '../../utils/axios';

export const ManageTrainings = () => {
  const [trainings, setTrainings] = useState<any[]>([]);

  useEffect(() => {
    const fetchT = async () => {
      const res = await api.get('/admin/trainings');
      setTrainings(res.data.data.content);
    };
    fetchT();
  }, []);

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-3xl font-bold">System Trainings</h1>
      <div className="grid gap-4">
        {trainings.map(t => (
          <GlassCard key={t.id}>
            <h3 className="font-bold">{t.title}</h3>
            <p className="text-sm text-gray-600">Provider: {t.provider.companyName}</p>
            <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded mt-2 inline-block">{t.status}</span>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
