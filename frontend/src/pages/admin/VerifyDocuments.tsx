import { useEffect, useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassButton } from '../../components/ui/GlassButton';
import { CheckCircle, XCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';

export const VerifyDocuments = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [remarks, setRemarks] = useState('');

  const fetchDocs = async () => { 
    const res = await api.get('/documents/admin'); 
    setDocuments(res.data.data.filter((d:any) => d.status === 'PENDING')); 
  };

  useEffect(() => { fetchDocs(); }, []);

  const handleVerify = async (status: string) => {
    if(!selectedDoc) return;
    try {
      await api.put(`/documents/${selectedDoc.id}/status`, { status, remarks });
      toast.success(`Document marked as ${status}`);
      setSelectedDoc(null);
      setRemarks('');
      fetchDocs();
    } catch (e: any) {
      console.error(e);
      toast.error('Error updating document status');
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-140px)] pb-10">
      <div className="w-full md:w-1/3 flex flex-col h-full">
        <h1 className="text-2xl font-bold mb-4">Pending Verification</h1>
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {documents.map(doc => (
            <GlassCard key={doc.id} className={`p-4 cursor-pointer transition-colors ${selectedDoc?.id === doc.id ? 'ring-2 ring-primary bg-white/50' : 'hover:bg-white/40'}`} onClick={() => setSelectedDoc(doc)}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-sm truncate max-w-[200px]">{doc.originalFilename}</h4>
                  <p className="text-xs text-gray-500 mt-1">{doc.ownerName}</p>
                </div>
                <span className="text-[10px] font-bold bg-white/50 px-2 rounded-full">{doc.documentType}</span>
              </div>
            </GlassCard>
          ))}
          {documents.length === 0 && <p className="text-gray-500">No pending documents.</p>}
        </div>
      </div>

      <div className="w-full md:w-2/3 h-full">
        {selectedDoc ? (
          <GlassCard className="h-full flex flex-col p-4 bg-white/30">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-lg">{selectedDoc.originalFilename}</h3>
                <p className="text-sm text-gray-600">Uploaded by {selectedDoc.ownerName} • {(selectedDoc.fileSize/1024/1024).toFixed(2)} MB</p>
              </div>
              <div className="flex gap-2">
                <GlassButton variant="ghost" className="text-red-500 bg-red-100 hover:bg-red-200" onClick={() => handleVerify('REJECTED')}><XCircle size={18} className="mr-1"/> Reject</GlassButton>
                <GlassButton className="bg-green-500 hover:bg-green-600 text-white" onClick={() => handleVerify('VERIFIED')}><CheckCircle size={18} className="mr-1"/> Verify</GlassButton>
              </div>
            </div>
            
            <input type="text" placeholder="Remarks (optional)..." className="w-full mb-4 rounded-xl bg-white/60 border border-white/80 p-3 focus:outline-none focus:ring-2 focus:ring-primary" value={remarks} onChange={e=>setRemarks(e.target.value)} />
            
            <div className="flex-1 bg-white/50 rounded-2xl overflow-hidden border border-white/40">
              <iframe src={`http://localhost:8080/api/documents/${selectedDoc.id}/download`} className="w-full h-full" title="Document Preview" />
            </div>
          </GlassCard>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-white/50 rounded-3xl">
            <FileText size={64} className="mb-4 opacity-50" />
            <p className="text-xl font-medium">Select a document to verify</p>
          </div>
        )}
      </div>
    </div>
  );
};
