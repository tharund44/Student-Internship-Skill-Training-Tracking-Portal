import { useEffect, useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassButton } from '../../components/ui/GlassButton';
import toast from 'react-hot-toast';
import api from '../../utils/axios';

export const ManageCertificates = () => {
  const [certs, setCerts] = useState<any[]>([]);
  const [remarks, setRemarks] = useState('');

  const fetchC = async () => { const res = await api.get('/certificates'); setCerts(res.data.data); };
  useEffect(() => { fetchC(); }, []);

  const handleRevoke = async (id: number) => {
    if(!remarks) return toast.error('Remarks required to revoke');
    if(confirm('Are you sure you want to revoke this certificate?')) {
      await api.put(`/certificates/${id}/revoke`, { remarks });
      toast.success('Certificate revoked');
      setRemarks('');
      fetchC();
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-3xl font-bold">System Certificates</h1>
      <GlassCard className="p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-lavender/30">
            <tr>
              <th className="p-4">ID Code</th>
              <th className="p-4">Student</th>
              <th className="p-4">Program</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {certs.map(c => (
              <tr key={c.id} className="border-b border-white/20">
                <td className="p-4 text-xs font-mono">{c.verificationCode}</td>
                <td className="p-4 font-bold">{c.studentName}</td>
                <td className="p-4 text-sm">{c.programTitle} <span className="block text-gray-500 text-xs">{c.companyName}</span></td>
                <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${c.status === 'REVOKED' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{c.status}</span></td>
                <td className="p-4">
                  {c.status === 'ISSUED' && (
                    <div className="flex gap-2">
                      <input type="text" placeholder="Reason..." className="text-xs p-1 rounded border border-gray-300" onChange={e=>setRemarks(e.target.value)} />
                      <GlassButton variant="ghost" className="text-xs py-1 px-2 text-red-500" onClick={() => handleRevoke(c.id)}>Revoke</GlassButton>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
};
