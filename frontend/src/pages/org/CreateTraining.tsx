import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassInput } from '../../components/ui/GlassInput';
import { GlassButton } from '../../components/ui/GlassButton';
import api from '../../utils/axios';

export const CreateTraining = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', description: '', requirements: '', modulesSyllabus: '[{"title":"Intro","content":"Overview"}]', 
    durationWeeks: 4, seats: 50, startDate: '', endDate: '', status: 'OPEN'
  });

  const handleSubmit = async () => {
    await api.post('/org/trainings', formData);
    navigate('/dashboard'); 
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <h1 className="text-3xl font-bold">Create Training Program</h1>
      <GlassCard className="space-y-4">
        <GlassInput label="Title" value={formData.title} onChange={e=>setFormData({...formData, title:e.target.value})} required />
        <GlassInput label="Description" value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})} required />
        <div className="grid grid-cols-2 gap-4">
          <GlassInput label="Duration (Weeks)" type="number" value={formData.durationWeeks} onChange={e=>setFormData({...formData, durationWeeks:parseInt(e.target.value)})} required />
          <GlassInput label="Seats Available" type="number" value={formData.seats} onChange={e=>setFormData({...formData, seats:parseInt(e.target.value)})} required />
          <GlassInput label="Start Date" type="date" value={formData.startDate} onChange={e=>setFormData({...formData, startDate:e.target.value})} />
          <GlassInput label="End Date" type="date" value={formData.endDate} onChange={e=>setFormData({...formData, endDate:e.target.value})} />
        </div>
        <GlassButton onClick={handleSubmit} className="w-full mt-4">Publish Program</GlassButton>
      </GlassCard>
    </div>
  );
};
