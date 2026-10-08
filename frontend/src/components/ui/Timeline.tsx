import { motion } from 'framer-motion';

export interface TimelineItem {
  id: number;
  title: string;
  organizationName: string;
  status: string;
  date: string;
  type: string;
}

export const Timeline = ({ items }: { items: TimelineItem[] }) => {
  return (
    <div className="relative border-l border-primary/30 ml-3 space-y-6">
      {items.map((item, index) => (
        <motion.div 
          key={item.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative pl-6"
        >
          <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-primary ring-4 ring-lavender" />
          <div className="bg-white/40 backdrop-blur-md rounded-xl p-4 border border-white/50 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-gray-800">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.organizationName} • {new Date(item.date).toLocaleDateString()}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-md font-medium ${item.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                {item.status}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
      {items.length === 0 && <p className="text-sm text-gray-500 pl-6">No history available.</p>}
    </div>
  );
};
