import { useEffect, useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import api from '../../utils/axios';

export const AuditLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => { fetchL(); }, []);
  const fetchL = async () => { const res = await api.get('/admin/console/audit-logs'); setLogs(res.data.data); };

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-3xl font-bold">System Audit Logs</h1>
      <GlassCard className="p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-lavender/30">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Admin</th>
              <th className="p-4">Action</th>
              <th className="p-4">Entity</th>
              <th className="p-4">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id} className="border-b border-white/20 hover:bg-white/10 text-sm">
                <td className="p-4 text-xs text-gray-500">{new Date(l.timestamp).toLocaleString()}</td>
                <td className="p-4 font-bold">{l.performedBy}</td>
                <td className="p-4"><span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold">{l.action}</span></td>
                <td className="p-4">{l.entityName} #{l.entityId}</td>
                <td className="p-4 text-gray-600">{l.details}</td>
              </tr>
            ))}
            {logs.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-gray-500">No logs found.</td></tr>}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
};
