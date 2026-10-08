import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input 
        ref={ref}
        className={`w-full px-4 py-2 rounded-xl backdrop-blur-md bg-white/30 border ${error ? 'border-red-400' : 'border-white/50'} focus:outline-none focus:border-primary focus:bg-white/50 transition-all ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
});
GlassInput.displayName = 'GlassInput';
