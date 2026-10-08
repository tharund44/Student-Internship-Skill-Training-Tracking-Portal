import { motion } from 'framer-motion';

const steps = ['APPLIED', 'UNDER_REVIEW', 'SELECTED', 'ONGOING', 'COMPLETED'];

export const Stepper = ({ currentStatus }: { currentStatus: string }) => {
  let currentIndex = steps.indexOf(currentStatus);
  if (currentIndex === -1) {
    if (currentStatus === 'REJECTED' || currentStatus === 'WITHDRAWN') currentIndex = steps.indexOf('UNDER_REVIEW');
  }

  return (
    <div className="relative flex justify-between items-center w-full mt-8 mb-4 px-4">
      <div className="absolute left-0 right-0 top-1/2 h-1 bg-white/40 -z-10 -translate-y-1/2" />
      <motion.div 
        className="absolute left-0 top-1/2 h-1 bg-primary -z-10 -translate-y-1/2 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: currentIndex / (steps.length - 1) }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      
      {steps.map((step, index) => {
        const isActive = index <= currentIndex;
        const isCurrent = index === currentIndex;
        let color = isActive ? 'bg-primary border-primary text-white' : 'bg-white/60 border-white/80 text-gray-400';
        
        if (isCurrent && (currentStatus === 'REJECTED' || currentStatus === 'WITHDRAWN')) {
          color = 'bg-red-500 border-red-500 text-white';
        }

        return (
          <div key={step} className="flex flex-col items-center">
            <motion.div 
              initial={false}
              animate={{ scale: isCurrent ? 1.2 : 1 }}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${color}`}
            >
              {isActive ? '✓' : ''}
            </motion.div>
            <span className={`text-[10px] mt-2 font-bold ${isActive ? 'text-gray-800' : 'text-gray-400'}`}>
              {step.replace('_', ' ')}
            </span>
          </div>
        );
      })}
    </div>
  );
};
