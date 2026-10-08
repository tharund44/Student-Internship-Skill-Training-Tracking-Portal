import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Plus, X } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassInput } from '../../components/ui/GlassInput';
import { GlassButton } from '../../components/ui/GlassButton';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { Timeline } from '../../components/ui/Timeline';
import type { TimelineItem } from '../../components/ui/Timeline';
import api from '../../utils/axios';

export const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [history, setHistory] = useState<TimelineItem[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const fetchProfile = async () => {
    const res = await api.get('/student/profile');
    setProfile(res.data.data);
  };

  const fetchHistory = async () => {
    const [internships, trainings] = await Promise.all([
      api.get('/student/history/internships'),
      api.get('/student/history/trainings')
    ]);
    const combined = [...internships.data.data, ...trainings.data.data].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setHistory(combined);
  };

  useEffect(() => {
    fetchProfile();
    fetchHistory();
  }, []);

  const handleSave = async () => {
    await api.put('/student/profile', profile);
    setEditMode(false);
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      const skillsArr = profile.skills ? profile.skills.split(',').map((s:string) => s.trim()) : [];
      if (!skillsArr.includes(newSkill)) {
        setProfile({ ...profile, skills: [...skillsArr, newSkill].join(', ') });
      }
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    const skillsArr = profile.skills.split(',').map((s:string) => s.trim()).filter((s:string) => s !== skill);
    setProfile({ ...profile, skills: skillsArr.join(', ') });
  };

  if (!profile) return <div className="p-8 text-center">Loading profile...</div>;

  const calculateCompletion = () => {
    let score = 20; // base
    if (profile.college) score += 15;
    if (profile.department) score += 15;
    if (profile.cgpa) score += 10;
    if (profile.skills) score += 20;
    if (profile.resumeLink) score += 20;
    return score;
  };

  const skillsList = profile.skills ? profile.skills.split(',').filter(Boolean) : [];

  return (
    <div className="space-y-6 pb-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row gap-6 items-start">
        <GlassCard className="w-full md:w-1/3 flex flex-col items-center text-center">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-lavender/50 border-4 border-white overflow-hidden shadow-lg flex items-center justify-center">
              {profile.avatarUrl ? <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <span className="text-4xl text-primary font-bold">{profile.name.charAt(0)}</span>}
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={16} />
            </button>
          </div>
          <h2 className="text-2xl font-bold mt-4">{profile.name}</h2>
          <p className="text-gray-500">{profile.rollNumber}</p>
          <div className="mt-6">
            <ProgressRing progress={calculateCompletion()} />
            <p className="text-sm font-medium text-primary mt-2">Profile Completion</p>
          </div>
        </GlassCard>

        <GlassCard className="w-full md:w-2/3">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Academic Information</h3>
            <GlassButton variant="ghost" onClick={() => editMode ? handleSave() : setEditMode(true)}>
              {editMode ? 'Save Profile' : 'Edit Profile'}
            </GlassButton>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassInput label="College" value={profile.college || ''} disabled={!editMode} onChange={e => setProfile({...profile, college: e.target.value})} />
            <GlassInput label="Department" value={profile.department || ''} disabled={!editMode} onChange={e => setProfile({...profile, department: e.target.value})} />
            <GlassInput label="Graduation Year" type="number" value={profile.graduationYear || ''} disabled={!editMode} onChange={e => setProfile({...profile, graduationYear: parseInt(e.target.value)})} />
            <GlassInput label="CGPA" type="number" step="0.1" value={profile.cgpa || ''} disabled={!editMode} onChange={e => setProfile({...profile, cgpa: parseFloat(e.target.value)})} />
            <GlassInput label="Resume URL" value={profile.resumeLink || ''} disabled={!editMode} className="md:col-span-2" onChange={e => setProfile({...profile, resumeLink: e.target.value})} />
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {skillsList.map((skill:string) => (
                <motion.span layout key={skill} initial={{scale:0}} animate={{scale:1}} exit={{scale:0}} className="px-3 py-1 bg-white/50 border border-primary/20 text-primary rounded-full text-sm font-medium flex items-center gap-1">
                  {skill.trim()}
                  {editMode && <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => removeSkill(skill)} />}
                </motion.span>
              ))}
            </div>
            {editMode && (
              <div className="flex gap-2">
                <GlassInput placeholder="Add a skill" value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyPress={e => e.key === 'Enter' && addSkill()} />
                <GlassButton variant="ghost" onClick={addSkill}><Plus size={20}/></GlassButton>
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <GlassCard>
          <h3 className="text-xl font-bold mb-6">Activity Timeline</h3>
          <Timeline items={history} />
        </GlassCard>
      </motion.div>
    </div>
  );
};
