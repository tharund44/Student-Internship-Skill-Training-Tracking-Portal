import { useEffect, useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassButton } from '../../components/ui/GlassButton';
import toast from 'react-hot-toast';
import api from '../../utils/axios';

export const ManageUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  const fetchU = async () => { const res = await api.get('/admin/console/users'); setUsers(res.data.data); };
  useEffect(() => { fetchU(); }, []);

  const handleToggle = async (id: number) => {
    try {
      await api.put(`/admin/console/users/${id}/toggle-status`);
      toast.success('Status updated');
      fetchU();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Error updating status');
    }
  };

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-end">
        <h1 className="text-3xl font-bold">User Management</h1>
        <input type="text" placeholder="Search users..." className="px-4 py-2 rounded-lg bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-primary" value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>
      
      <GlassCard className="p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-lavender/30">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Details</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-b border-white/20 hover:bg-white/10 transition-colors">
                <td className="p-4 font-bold">{u.name}</td>
                <td className="p-4 text-sm">{u.email}</td>
                <td className="p-4"><span className="text-[10px] bg-gray-200 text-gray-800 px-2 py-1 rounded font-bold">{u.role}</span></td>
                <td className="p-4 text-xs text-gray-500">{u.role === 'ORGANIZATION' ? u.orgName : u.collegeName}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {u.active ? 'ACTIVE' : 'SUSPENDED'}
                  </span>
                </td>
                <td className="p-4">
                  <GlassButton variant="ghost" className={`text-xs py-1 px-2 ${u.active ? 'text-red-500' : 'text-green-500'}`} onClick={() => handleToggle(u.id)}>
                    {u.active ? 'Suspend' : 'Activate'}
                  </GlassButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
};
