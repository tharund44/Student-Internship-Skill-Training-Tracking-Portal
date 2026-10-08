
export const GlassBadge: React.FC<{ children: React.ReactNode; status?: 'success' | 'warning' | 'error' | 'info' | 'default' }> = ({ children, status = 'default' }) => {
  const colors = {
    success: 'bg-green-100/50 text-green-700 border-green-200/50',
    warning: 'bg-yellow-100/50 text-yellow-700 border-yellow-200/50',
    error: 'bg-red-100/50 text-red-700 border-red-200/50',
    info: 'bg-blue-100/50 text-blue-700 border-blue-200/50',
    default: 'bg-gray-100/50 text-gray-700 border-gray-200/50'
  };
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-md ${colors[status]}`}>
      {children}
    </span>
  );
};
