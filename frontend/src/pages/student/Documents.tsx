import { useEffect, useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { FileUploadZone } from '../../components/ui/FileUploadZone';
import { FileText, Eye, CheckCircle, Clock, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/axios';

export const Documents = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [docType, setDocType] = useState('RESUME');
  const [preview, setPreview] = useState<any>(null);

  useEffect(() => { fetchDocs(); }, []);
  const fetchDocs = async () => { const res = await api.get('/documents/student'); setDocuments(res.data.data); };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', docType);
    
    try {
      await api.post('/documents/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Document uploaded successfully!');
      fetchDocs();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to upload document.');
      throw e;
    }
  };

  const getStatusIcon = (status: string) => {
    if(status==='VERIFIED') return <CheckCircle className="text-green-500" size={20}/>;
    if(status==='REJECTED') return <XCircle className="text-red-500" size={20}/>;
    return <Clock className="text-yellow-500" size={20}/>;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <h1 className="text-3xl font-bold">My Documents</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 space-y-6">
          <GlassCard>
            <h3 className="font-bold mb-4">Upload New Document</h3>
            <select className="w-full mb-4 rounded-xl bg-white/40 border border-white/50 p-3 focus:outline-none focus:ring-2 focus:ring-primary" value={docType} onChange={e=>setDocType(e.target.value)}>
              <option value="RESUME">Resume</option>
              <option value="ID_PROOF">ID Proof</option>
              <option value="OFFER_LETTER">Offer Letter</option>
              <option value="REPORT">Project Report</option>
              <option value="OTHER">Other</option>
            </select>
            <FileUploadZone onUpload={handleUpload} />
          </GlassCard>
        </div>

        <div className="w-full md:w-2/3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc, i) => (
              <motion.div key={doc.id} initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{delay: i*0.05}}>
                <GlassCard className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="p-3 bg-white/50 rounded-xl text-primary"><FileText size={24} /></div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold truncate text-sm">{doc.originalFilename}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] uppercase font-bold bg-white/50 px-2 rounded">{doc.documentType}</span>
                        <span className="text-xs text-gray-500">{(doc.fileSize/1024/1024).toFixed(2)} MB</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(doc.status)}
                    <button onClick={() => setPreview(doc)} className="p-2 hover:bg-white/40 rounded-lg transition-colors text-gray-600 hover:text-primary"><Eye size={20} /></button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
            {documents.length === 0 && <p className="text-gray-500 font-medium">No documents uploaded yet.</p>}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {preview && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <GlassCard className="w-full max-w-4xl h-[80vh] flex flex-col p-2 bg-white/10 border-white/20">
              <div className="flex justify-between items-center p-4 border-b border-white/10">
                <h3 className="font-bold text-white">{preview.originalFilename}</h3>
                <button onClick={() => setPreview(null)} className="text-white hover:text-red-400">Close</button>
              </div>
              <div className="flex-1 bg-white rounded-xl overflow-hidden mt-2">
                <iframe src={`http://localhost:8080/api/documents/${preview.id}/download`} className="w-full h-full" title="Preview" />
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
