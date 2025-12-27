import React, { useState, useEffect } from 'react';
import { getTemplates, saveTemplates, generateId, deleteTemplate } from '../utils';
import { BCard, BButton, BInput } from '../components/ui/BrutalistComponents';
import { Settings, Trash2, Plus, Save, X, ArrowUp, ArrowDown } from 'lucide-react';
import { WorkoutTemplate, TemplateExercise } from '../types';

const WorkoutTemplates = () => {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTemplate, setEditTemplate] = useState<WorkoutTemplate | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      const data = await getTemplates();
      setTemplates(data);
      setLoading(false);
    };
    fetchTemplates();
  }, []);

  const handleEdit = (template: WorkoutTemplate) => {
    setEditTemplate(JSON.parse(JSON.stringify(template))); // Deep copy
    setIsEditing(true);
  };

  const handleCreate = () => {
    setEditTemplate({
      id: generateId(),
      name: 'Nieuw',
      description: 'Nieuw Schema',
      exercises: []
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Weet je zeker dat je dit template wilt verwijderen?')) {
      setLoading(true);
      await deleteTemplate(id);
      const newTemplates = templates.filter(t => t.id !== id);
      setTemplates(newTemplates);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editTemplate) return;

    if (!editTemplate.name.trim()) {
      alert('Naam is verplicht');
      return;
    }

    setLoading(true);
    await saveTemplates([editTemplate]);

    const data = await getTemplates();
    setTemplates(data);

    setIsEditing(false);
    setEditTemplate(null);
    setLoading(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTemplate(null);
  };

  // Editor Actions
  const addExercise = () => {
    if (!editTemplate) return;
    const newEx: TemplateExercise = {
      name: `ex_${generateId()}`,
      displayName: 'Nieuwe Oefening',
      targetReps: '10-12',
      sets: 3,
      restTime: 90
    };
    setEditTemplate({
      ...editTemplate,
      exercises: [...editTemplate.exercises, newEx]
    });
  };

  const updateExercise = (index: number, field: keyof TemplateExercise, value: any) => {
    if (!editTemplate) return;
    const newExercises = [...editTemplate.exercises];
    // @ts-ignore
    newExercises[index][field] = value;
    setEditTemplate({ ...editTemplate, exercises: newExercises });
  };

  const removeExercise = (index: number) => {
    if (!editTemplate) return;
    const newExercises = editTemplate.exercises.filter((_, i) => i !== index);
    setEditTemplate({ ...editTemplate, exercises: newExercises });
  };

  const moveExercise = (index: number, direction: 'up' | 'down') => {
    if (!editTemplate) return;
    const newExercises = [...editTemplate.exercises];
    if (direction === 'up' && index > 0) {
      [newExercises[index], newExercises[index - 1]] = [newExercises[index - 1], newExercises[index]];
    } else if (direction === 'down' && index < newExercises.length - 1) {
      [newExercises[index], newExercises[index + 1]] = [newExercises[index + 1], newExercises[index]];
    }
    setEditTemplate({ ...editTemplate, exercises: newExercises });
  };

  if (isEditing && editTemplate) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-black text-white p-4 border-4 border-black rounded-lg">
          <h2 className="text-xl font-black uppercase">BEWERKEN</h2>
          <button onClick={handleCancel}><X /></button>
        </div>

        <BCard color="white">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-black uppercase mb-1 block">Template Naam</label>
              <BInput
                value={editTemplate.name}
                onChange={(e) => setEditTemplate({ ...editTemplate, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase mb-1 block">Omschrijving</label>
              <BInput
                value={editTemplate.description}
                onChange={(e) => setEditTemplate({ ...editTemplate, description: e.target.value })}
              />
            </div>
          </div>
        </BCard>

        <div className="space-y-4">
          {editTemplate.exercises.map((ex, idx) => (
            <BCard key={idx} color="white" className="relative pr-12">
              <div className="absolute right-2 top-2 flex flex-col gap-1">
                <button onClick={() => removeExercise(idx)} className="bg-red-500 text-white p-1 border-2 border-black rounded hover:bg-red-600"><X size={16} /></button>
                {idx > 0 && <button onClick={() => moveExercise(idx, 'up')} className="bg-gray-200 p-1 border-2 border-black rounded hover:bg-gray-300"><ArrowUp size={16} /></button>}
                {idx < editTemplate.exercises.length - 1 && <button onClick={() => moveExercise(idx, 'down')} className="bg-gray-200 p-1 border-2 border-black rounded hover:bg-gray-300"><ArrowDown size={16} /></button>}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-500 block">Oefening</label>
                  <BInput
                    value={ex.displayName}
                    onChange={(e) => updateExercise(idx, 'displayName', e.target.value)}
                    className="border-2"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] font-black uppercase text-gray-500 block">Sets</label>
                    <BInput
                      type="number"
                      value={ex.sets}
                      onChange={(e) => updateExercise(idx, 'sets', parseInt(e.target.value) || 0)}
                      className="border-2"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-black uppercase text-gray-500 block">Reps</label>
                    <BInput
                      value={ex.targetReps}
                      onChange={(e) => updateExercise(idx, 'targetReps', e.target.value)}
                      className="border-2"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-black uppercase text-gray-500 block">Rust (s)</label>
                    <BInput
                      type="number"
                      value={ex.restTime}
                      onChange={(e) => updateExercise(idx, 'restTime', parseInt(e.target.value) || 0)}
                      className="border-2"
                    />
                  </div>
                </div>
              </div>
            </BCard>
          ))}
        </div>

        <BButton variant="secondary" onClick={addExercise} className="w-full border-dashed">
          <Plus /> Oefening Toevoegen
        </BButton>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t-4 border-black">
          <BButton variant="danger" onClick={handleCancel}>Annuleren</BButton>
          <BButton variant="success" onClick={handleSave}><Save size={18} /> Opslaan</BButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BCard color="white" className="bg-gray-300">
        <h2 className="text-3xl font-black uppercase mb-2">WORKOUT TEMPLATES</h2>
        <p className="font-bold">Beheer je persoonlijke trainingsschema's</p>
      </BCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <BCard key={template.id} color="white" className="h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-4xl font-black">{template.name}</h3>
                  <p className="font-bold text-gray-500">{template.description}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {template.exercises.map((ex, idx) => (
                  <div key={idx} className="border-2 border-black p-2 flex justify-between items-center bg-gray-50">
                    <div className="flex gap-2 items-center font-bold">
                      <span className="text-lg">{idx + 1}.</span>
                      <span>{ex.displayName}</span>
                    </div>
                    <div className="text-xs font-bold text-right">
                      <div>{ex.sets} sets</div>
                      <div className="text-gray-500">x {ex.targetReps} reps</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t-2 border-gray-100">
              <BButton variant="secondary" className="text-xs py-2 px-3 flex-1" onClick={() => handleEdit(template)}>
                <Settings size={14} /> Bewerken
              </BButton>
              <BButton variant="danger" className="text-xs py-2 px-3" onClick={() => handleDelete(template.id)}>
                <Trash2 size={14} />
              </BButton>
            </div>
          </BCard>
        ))}
      </div>

      <BButton variant="primary" className="w-full" onClick={handleCreate}>
        <Plus /> Nieuw Template Maken
      </BButton>
    </div>
  );
};

export default WorkoutTemplates;