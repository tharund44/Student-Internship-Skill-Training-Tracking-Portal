import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassButton } from '../../components/ui/GlassButton';
import api from '../../utils/axios';

const fetchAllApps = async () => {
  const res = await api.get('/admin/applications');
  return res.data.data;
};

export const ReviewApplications = () => {
  const queryClient = useQueryClient();
  const [remarks, setRemarks] = useState('');
  
  const { data: apps, isLoading } = useQuery({ queryKey: ['adminApps'], queryFn: fetchAllApps });

  const mutation = useMutation({
    mutationFn: ({ id, status, remarks }: any) => api.put(`/admin/applications/${id}/status`, { status, remarks }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['adminApps'] });
      const previousApps = queryClient.getQueryData(['adminApps']);
      queryClient.setQueryData(['adminApps'], (old: any) => 
        old.map((a: any) => a.id === id ? { ...a, status } : a)
      );
      return { previousApps };
    },
    onError: (_err, _variables, context: any) => {
      queryClient.setQueryData(['adminApps'], context.previousApps);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['adminApps'] });
    },
  });

  if (isLoading) return <div>Loading applications...</div>;

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-3xl font-bold">System Applications Queue</h1>
      
      <div className="grid gap-4">
        {apps?.map((app: any) => (
          <GlassCard key={app.id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-bold text-lg">{app.studentName} <span className="text-sm font-normal text-gray-500">applied to</span> {app.internshipTitle}</h3>
              <p className="text-gray-600 text-sm">Company: {app.companyName}</p>
              <span className={`inline-block mt-2 px-2 py-1 text-xs font-bold rounded ${app.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-primary/20 text-primary'}`}>
                {app.status}
              </span>
            </div>
            
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <input 
                type="text" 
                placeholder="Admin remarks..." 
                className="text-sm rounded-lg bg-white/50 border border-white p-2 outline-none focus:border-primary"
                onChange={(e) => setRemarks(e.target.value)}
              />
              <div className="flex gap-2">
                <GlassButton onClick={() => mutation.mutate({ id: app.id, status: 'REJECTED', remarks })} variant="ghost" className="text-red-500 hover:bg-red-500/10 text-xs py-1 px-3">Force Reject</GlassButton>
                <GlassButton onClick={() => mutation.mutate({ id: app.id, status: 'SELECTED', remarks })} className="text-xs py-1 px-3">Force Select</GlassButton>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
