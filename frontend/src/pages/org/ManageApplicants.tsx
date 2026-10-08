import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ArrowLeft, GripVertical } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import api from '../../utils/axios';

const COLUMNS = ['APPLIED', 'UNDER_REVIEW', 'SELECTED', 'REJECTED'];

export const ManageApplicants = () => {
  const { id } = useParams(); // internshipId
  const [columns, setColumns] = useState<Record<string, any[]>>({ APPLIED: [], UNDER_REVIEW: [], SELECTED: [], REJECTED: [] });
  const [internship, setInternship] = useState<any>(null);

  const fetchData = async () => {
    const res = await api.get(`/org/internships/${id}/applications`);
    const apps = res.data.data;
    
    const newCols: Record<string, any[]> = { APPLIED: [], UNDER_REVIEW: [], SELECTED: [], REJECTED: [] };
    apps.forEach((a:any) => {
      if (newCols[a.status]) newCols[a.status].push(a);
    });
    setColumns(newCols);
    
    const iRes = await api.get(`/internships/${id}`);
    setInternship(iRes.data.data);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onDragEnd = async (result: any) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    const sourceCol = [...columns[source.droppableId]];
    const destCol = [...columns[destination.droppableId]];
    const [movedApp] = sourceCol.splice(source.index, 1);
    
    // Optimistic UI update
    movedApp.status = destination.droppableId;
    destCol.splice(destination.index, 0, movedApp);
    
    setColumns({ ...columns, [source.droppableId]: sourceCol, [destination.droppableId]: destCol });

    try {
      await api.put(`/org/internships/${id}/applications/${draggableId}/status`, { status: destination.droppableId, remarks: 'Moved via Kanban' });
    } catch (e: any) {
      console.error(e);
      alert('Error updating status or invalid transition.');
      fetchData(); // Revert
    }
  };

  return (
    <div className="h-full flex flex-col pb-10">
      <Link to="/dashboard" className="flex items-center gap-2 text-primary font-medium mb-4 hover:underline">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>
      <h1 className="text-3xl font-bold mb-6">Manage Applicants: {internship?.title}</h1>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
          {COLUMNS.map(colId => (
            <div key={colId} className="flex flex-col min-w-[300px] w-[300px] bg-white/20 rounded-2xl border border-white/30 backdrop-blur-md p-4">
              <div className="font-bold text-gray-700 mb-4 flex justify-between">
                {colId.replace('_', ' ')}
                <span className="bg-white/50 px-2 rounded-lg text-sm">{columns[colId].length}</span>
              </div>
              
              <Droppable droppableId={colId}>
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className={`flex-1 transition-colors ${snapshot.isDraggingOver ? 'bg-white/10 rounded-xl' : ''}`}>
                    {columns[colId].map((app, index) => (
                      <Draggable key={app.id.toString()} draggableId={app.id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} className={`mb-3 outline-none ${snapshot.isDragging ? 'opacity-80 scale-105' : ''}`}>
                            <GlassCard className="p-4 cursor-default shadow-sm border border-white/50 flex gap-2 relative">
                              <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 absolute left-2 top-4">
                                <GripVertical size={16} />
                              </div>
                              <div className="pl-6 w-full">
                                <h4 className="font-bold text-gray-800">{app.studentName}</h4>
                                <p className="text-xs text-gray-600">{app.studentCollege}</p>
                                <div className="mt-2 text-xs font-bold text-primary">CGPA: {app.studentCgpa}</div>
                                <div className="mt-3 flex gap-2">
                                  {app.resumeLink && <a href={app.resumeLink} target="_blank" rel="noreferrer" className="text-xs underline text-blue-600">Resume</a>}
                                </div>
                              </div>
                            </GlassCard>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};
