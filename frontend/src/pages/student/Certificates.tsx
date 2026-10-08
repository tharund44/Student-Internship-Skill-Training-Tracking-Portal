import { useEffect, useState } from 'react';
import { Certificate3DCard } from '../../components/ui/Certificate3DCard';
import { Download, ExternalLink } from 'lucide-react';
import { GlassButton } from '../../components/ui/GlassButton';
import api from '../../utils/axios';

export const Certificates = () => {
  const [certificates, setCertificates] = useState<any[]>([]);

  useEffect(() => {
    const fetchC = async () => {
      const res = await api.get('/certificates/my');
      setCertificates(res.data.data);
    };
    fetchC();
  }, []);

  const handleDownload = (id: number) => {
    window.open(`http://localhost:8080/api/certificates/${id}/download`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <h1 className="text-3xl font-bold">My Certificates</h1>
      
      {certificates.length === 0 ? (
        <p className="text-gray-500">You haven't earned any certificates yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {certificates.map(c => (
            <div key={c.id} className="flex flex-col gap-4">
              <Certificate3DCard>
                <div className="text-center mt-2">
                  <h3 className="text-sm font-bold text-gray-500 tracking-widest uppercase mb-4">Certificate of Completion</h3>
                  <h2 className="text-2xl font-black text-gray-900 font-serif">{c.studentName}</h2>
                </div>
                <div className="text-center text-sm text-gray-700">
                  <p>has successfully completed</p>
                  <p className="font-bold text-primary mt-1 text-lg leading-tight">{c.programTitle}</p>
                  <p className="mt-2 text-xs">at {c.companyName}</p>
                </div>
                <div className="flex justify-between items-end mt-4">
                  <div className="text-[10px] text-gray-400">
                    <p>Issue Date: {c.issueDate}</p>
                    <p>ID: {c.verificationCode}</p>
                  </div>
                  {c.status === 'REVOKED' && <div className="text-red-500 font-bold text-xs uppercase border border-red-500 px-2 py-1 rounded rotate-[-10deg]">REVOKED</div>}
                </div>
              </Certificate3DCard>
              
              <div className="flex gap-4 px-4">
                <GlassButton className="flex-1 text-sm py-2" onClick={() => handleDownload(c.id)} disabled={c.status === 'REVOKED'}><Download size={16} className="mr-2 inline"/> Download PDF</GlassButton>
                <GlassButton variant="ghost" className="flex-1 text-sm py-2" onClick={() => window.open(`/verify?code=${c.verificationCode}`, '_blank')}><ExternalLink size={16} className="mr-2 inline"/> View Public Link</GlassButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
