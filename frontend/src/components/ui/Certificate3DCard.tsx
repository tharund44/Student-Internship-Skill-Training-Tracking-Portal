import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Award } from 'lucide-react';
import type { ReactNode } from 'react';

export const Certificate3DCard = ({ children, onClick }: { children: ReactNode, onClick?: () => void }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <div style={{ perspective: 1000 }} className="w-full">
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        className="relative w-full aspect-[1.414/1] rounded-xl bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] border-[8px] border-double border-primary/20 shadow-2xl p-6 cursor-pointer overflow-hidden group"
      >
        {/* Shine Sweep on hover */}
        <div className="absolute inset-0 -translate-x-[150%] skew-x-12 bg-gradient-to-r from-transparent via-white/80 to-transparent group-hover:animate-sweep z-20 pointer-events-none" />
        
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10" />
        <div className="absolute bottom-4 right-4 text-primary/20" style={{ transform: "translateZ(20px)" }}><Award size={80} /></div>

        <div style={{ transform: "translateZ(30px)" }} className="relative z-10 h-full flex flex-col justify-between">
          {children}
        </div>
      </motion.div>
    </div>
  );
};
