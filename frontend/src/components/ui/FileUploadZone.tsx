import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FileUploadZone = ({ onUpload }: { onUpload: (file: File) => Promise<void> }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setUploading(true);
    setProgress(0);
    
    // Simulate progress animation for UX
    const interval = setInterval(() => setProgress(p => (p >= 90 ? 90 : p + 10)), 200);
    
    try {
      await onUpload(acceptedFiles[0]);
      setProgress(100);
    } catch (e) {
      setProgress(0);
    } finally {
      clearInterval(interval);
      setTimeout(() => setUploading(false), 1000);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, maxFiles: 1, accept: { 'application/pdf': ['.pdf'], 'image/jpeg': ['.jpeg', '.jpg'], 'image/png': ['.png'] }
  });

  return (
    <div {...getRootProps()} className={`relative w-full p-10 rounded-3xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center overflow-hidden
      ${isDragActive ? 'border-primary bg-primary/10' : 'border-white/50 bg-white/20 hover:bg-white/30'}`}>
      <input {...getInputProps()} />
      
      <AnimatePresence mode="wait">
        {!uploading ? (
          <motion.div key="idle" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center">
            <UploadCloud size={48} className={`mb-4 ${isDragActive ? 'text-primary' : 'text-gray-400'}`} />
            <p className="text-lg font-bold text-gray-700">Drag & drop your document here</p>
            <p className="text-sm text-gray-500 mt-2">Supports PDF, JPG, PNG (Max 5MB)</p>
          </motion.div>
        ) : (
          <motion.div key="uploading" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center">
            <div className="relative w-24 h-24 mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="44" stroke="rgba(255,255,255,0.3)" strokeWidth="8" fill="transparent" />
                <motion.circle cx="48" cy="48" r="44" stroke={progress === 100 ? "#22c55e" : "#6D4AFF"} strokeWidth="8" fill="transparent"
                  strokeDasharray={276} animate={{ strokeDashoffset: 276 - (progress / 100) * 276 }} transition={{ ease: "easeOut" }} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                {progress === 100 ? <CheckCircle className="text-green-500" size={32} /> : <File className="text-primary animate-pulse" size={32} />}
              </div>
            </div>
            <p className="text-lg font-bold text-gray-700">{progress === 100 ? 'Uploaded!' : 'Uploading...'}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
