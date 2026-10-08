import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, CheckCircle, XCircle } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassInput } from '../../components/ui/GlassInput';
import { GlassButton } from '../../components/ui/GlassButton';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/axios';

export const VerifyCertificate = () => {
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState(searchParams.get('code') || '');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!code) return;
    setLoading(true);
    try {
      const res = await api.get(`/public/certificates/verify/${code}`);
      setResult(res.data.data);
    } catch (e: any) {
      console.error(e);
      setResult({ valid: false, message: 'Server error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (code) handleVerify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount if code exists

  return (
    <div className="min-h-screen bg-[#F0EEFF] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-400/20 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-violet-400/20 blur-[100px]" />

      <div className="w-full max-w-lg z-10 flex flex-col items-center">
        <h1 className="text-3xl font-black text-gray-800 mb-2 tracking-tight">Verify Certificate</h1>
        <p className="text-gray-500 mb-8 font-medium">Enter the 18-character certificate ID</p>

        <div className="flex w-full gap-2 mb-8">
          <div className="flex-1">
            <GlassInput placeholder="e.g. CERT-A1B2C3D4E5..." value={code} onChange={e=>setCode(e.target.value.toUpperCase())} />
          </div>
          <GlassButton onClick={handleVerify} disabled={loading} className="px-6"><Search size={20}/></GlassButton>
        </div>

        <div className="w-full h-64 relative">
          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                key={result.valid ? 'valid' : 'invalid'}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={result.valid ? { opacity: 1, scale: 1, y: 0 } : { opacity: 1, scale: 1, y: 0, x: [-10, 10, -10, 10, 0] }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <GlassCard className={`h-full flex flex-col items-center justify-center text-center p-8 border-2 ${result.valid ? 'border-green-400/50 bg-green-50/50' : 'border-red-400/50 bg-red-50/50'}`}>
                  {result.valid ? (
                    <>
                      <CheckCircle size={64} className="text-green-500 mb-4" />
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">Valid Certificate</h3>
                      <p className="text-gray-700"><strong>{result.studentName}</strong> successfully completed <strong>{result.programTitle}</strong> at <strong>{result.companyName}</strong> on {result.issueDate}.</p>
                    </>
                  ) : (
                    <>
                      <XCircle size={64} className="text-red-500 mb-4" />
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">Invalid Certificate</h3>
                      <p className="text-gray-600">{result.message}</p>
                    </>
                  )}
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
