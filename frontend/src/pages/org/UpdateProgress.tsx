import { useEffect, useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassButton } from '../../components/ui/GlassButton';
import { GlassInput } from '../../components/ui/GlassInput';
import { Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../../utils/axios';

export const UpdateProgress = () => {
  const [trackers, setTrackers] = useState<any[]>([]);
  const [selectedTracker, setSelectedTracker] = useState<any>(null);
  const [pct, setPct] = useState(0);
  const [stage, setStage] = useState('');
  const [remarks, setRemarks] = useState('');

  const fetchT = async () => {
    const res = await api.get('/org/progress');
    setTrackers(res.data.data);
  };

  useEffect(() => {
    fetchT();
  }, []);

  const handleSelect = (t: any) => {
    setSelectedTracker(t);
    setPct(t.percentage || 0);
    setStage(t.currentStage || '');
    setRemarks(t.remarks || '');
  };

  const handleUpdate = async () => {
    if(!selectedTracker) return;
    const url = `/progress/${selectedTracker.referenceType.toLowerCase()}/${selectedTracker.referenceId}`;
    await api.put(url, { percentage: pct, currentStage: stage, remarks });
    
    if (pct === 100) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
    
    setSelectedTracker(null);
    fetchT();
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 pb-20">
      <div className="w-full md:w-1/2 space-y-4">
        <h1 className="text-3xl font-bold mb-6">Active Progress</h1>
        {trackers.map(t => (
          <GlassCard key={t.id} className={`cursor-pointer transition-all ${selectedTracker?.id === t.id ? 'ring-2 ring-primary bg-white/40' : 'hover:bg-white/30'}`} onClick={() => handleSelect(t)}>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500">{t.referenceType}</span>
                <h4 className="font-bold">{t.studentName}</h4>
                <p className="text-xs text-gray-600">{t.title}</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-primary">{t.percentage}%</span>
                {t.certificateEligible && <Trophy size={14} className="text-green-500 inline ml-2" />}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="w-full md:w-1/2">
        {selectedTracker ? (
          <GlassCard className="sticky top-24 p-8">
            <h2 className="text-2xl font-bold mb-2">Update Progress</h2>
            <p className="text-sm text-gray-500 mb-6">{selectedTracker.studentName} - {selectedTracker.title}</p>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-bold text-gray-700">Completion Percentage</label>
                  <span className="font-black text-primary text-xl">{pct}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" step="5" 
                  value={pct} onChange={(e) => setPct(parseInt(e.target.value))}
                  className="w-full h-3 bg-white/50 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0%</span><span>50%</span><span>100% (Complete)</span>
                </div>
              </div>

              <GlassInput label="Current Stage / Module Name" value={stage} onChange={e=>setStage(e.target.value)} />
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Remarks (Optional)</label>
                <textarea rows={3} className="w-full rounded-xl bg-white/40 border border-white/50 p-3 focus:outline-none focus:ring-2 focus:ring-primary/50" value={remarks} onChange={e=>setRemarks(e.target.value)} />
              </div>
              
              <GlassButton onClick={handleUpdate} className="w-full text-lg py-3">
                {pct === 100 ? 'Mark Completed & Issue Certificate' : 'Save Progress'}
              </GlassButton>
            </div>
          </GlassCard>
        ) : (
          <div className="h-full flex items-center justify-center p-10 text-gray-400 font-medium border-2 border-dashed border-white/40 rounded-3xl">
            Select a student to update progress
          </div>
        )}
      </div>
    </div>
  );
};
