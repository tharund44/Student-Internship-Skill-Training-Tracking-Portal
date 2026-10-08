import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface GlassButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'ghost';
  children: React.ReactNode;
}

export const GlassButton: React.FC<GlassButtonProps> = ({ variant = 'primary', children, className = '', ...props }) => {
  const baseStyle = "px-4 py-2 rounded-xl font-medium transition-colors duration-200 outline-none";
  const variants = {
    primary: "bg-primary text-white shadow-md hover:bg-primary-dark focus:ring-2 focus:ring-primary/50",
    ghost: "bg-white/20 hover:bg-white/40 text-primary border border-white/40 backdrop-blur-md"
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
