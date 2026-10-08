import { useEffect, useState } from 'react';
import { Search, Eye, Filter } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassButton } from '../../components/ui/GlassButton';
import { GlassDrawer } from '../../components/ui/GlassDrawer';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter';
import api from '../../utils/axios';

export const ManageStudents = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  useEffect(() => {
    fetchStudents();
  }, [search, page]);

  const fetchStudents = async () => {
    const res = await api.get(`/admin/students?search=${search}&page=${page}&size=10`);
    setStudents(res.data.data.content);
    setTotal(res.data.data.totalElements);
  };

  const toggleStatus = async (id: number) => {
    await api.put(`/admin/students/${id}/toggle-status`);
    fetchStudents();
    if (selectedStudent?.id === id) {
      setSelectedStudent({ ...selectedStudent, active: !selectedStudent.active });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Student Directory</h2>
          <p className="text-gray-600 font-medium mt-1">Total Students: <AnimatedCounter value={total} /></p>
        </div>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-white/40 bg-white/20 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              className="w-full pl-10 pr-4 py-2 rounded-xl backdrop-blur-md bg-white/40 border border-white/50 focus:outline-none focus:border-primary"
              placeholder="Search by name, roll number, or college..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <GlassButton variant="ghost" className="flex items-center gap-2"><Filter size={18} /> Filter</GlassButton>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-lavender/30">
                <th className="p-4 font-semibold text-gray-700">Name</th>
                <th className="p-4 font-semibold text-gray-700">Roll No</th>
                <th className="p-4 font-semibold text-gray-700">College</th>
                <th className="p-4 font-semibold text-gray-700">CGPA</th>
                <th className="p-4 font-semibold text-gray-700">Status</th>
                <th className="p-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b border-white/20 hover:bg-white/30 transition-colors">
                  <td className="p-4 font-medium text-gray-800">{student.name}</td>
                  <td className="p-4 text-gray-600">{student.rollNumber}</td>
                  <td className="p-4 text-gray-600">{student.college || '-'}</td>
                  <td className="p-4 text-gray-600">{student.cgpa || '-'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${student.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {student.active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button onClick={() => { setSelectedStudent(student); setDrawerOpen(true); }} className="text-primary hover:text-primary-dark p-2 hover:bg-white/50 rounded-lg transition">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 && <div className="p-8 text-center text-gray-500">No students found.</div>}
        </div>
        
        <div className="p-4 bg-white/10 border-t border-white/40 flex justify-between items-center text-sm">
          <span className="text-gray-600">Showing page {page + 1}</span>
          <div className="flex gap-2">
            <GlassButton variant="ghost" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</GlassButton>
            <GlassButton variant="ghost" onClick={() => setPage(p => p + 1)}>Next</GlassButton>
          </div>
        </div>
      </GlassCard>

      <GlassDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Student Details">
        {selectedStudent && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-lavender flex justify-center items-center font-bold text-2xl text-primary">{selectedStudent.name.charAt(0)}</div>
              <div>
                <h4 className="text-xl font-bold">{selectedStudent.name}</h4>
                <p className="text-gray-500">{selectedStudent.email}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p><strong>Roll No:</strong> {selectedStudent.rollNumber}</p>
              <p><strong>College:</strong> {selectedStudent.college}</p>
              <p><strong>Department:</strong> {selectedStudent.department}</p>
              <p><strong>Graduation:</strong> {selectedStudent.graduationYear}</p>
              <p><strong>CGPA:</strong> {selectedStudent.cgpa}</p>
            </div>
            <div>
              <p className="font-bold mb-2">Skills</p>
              <div className="flex gap-2 flex-wrap">
                {selectedStudent.skills?.split(',').map((s:string) => (
                  <span key={s} className="px-2 py-1 bg-white border border-primary/20 text-xs rounded-full">{s.trim()}</span>
                ))}
              </div>
            </div>
            {selectedStudent.resumeLink && (
              <a href={selectedStudent.resumeLink} target="_blank" rel="noreferrer" className="text-primary underline">View Resume</a>
            )}
            <div className="pt-6 border-t border-white/40">
              <GlassButton 
                variant={selectedStudent.active ? 'ghost' : 'primary'} 
                className="w-full"
                onClick={() => toggleStatus(selectedStudent.id)}
              >
                {selectedStudent.active ? 'Deactivate Account' : 'Activate Account'}
              </GlassButton>
            </div>
          </div>
        )}
      </GlassDrawer>
    </div>
  );
};
