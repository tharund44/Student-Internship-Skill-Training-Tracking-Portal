import { GlassCard } from '../../components/ui/GlassCard';
import { GlassButton } from '../../components/ui/GlassButton';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';

export const Reports = () => {
  const handleExport = () => {
    window.open('http://localhost:8080/api/reports/export/users', '_blank');
  };

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-3xl font-bold dark:text-white">Advanced Reports</h1>
      <p className="text-gray-500 dark:text-gray-400">Generate and export system analytics.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}}>
          <GlassCard className="p-8 dark:bg-dark-glass dark:border-dark-border flex flex-col items-center text-center">
            <h3 className="font-bold text-xl mb-2 dark:text-white">User Demographic Report</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Exports all registered users, their roles, status, and registration dates in standard CSV format.</p>
            <GlassButton onClick={handleExport} className="w-full max-w-xs"><Download size={18} className="mr-2 inline"/> Export CSV</GlassButton>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};
