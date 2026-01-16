import React, { useState } from 'react';
import { Path, Task, TaskType, StatName, SubStatName } from '../types';
import { useGameState } from '../contexts/GameStateContext';
import { X, Save, Trash2, PlusCircle } from 'lucide-react';
import Card from './ui/Card';
import { STAT_SUBSTAT_MAP } from '../constants';

interface PathEditModalProps {
  path: Path;
  onClose: () => void;
}

const PathEditModal: React.FC<PathEditModalProps> = ({ path, onClose }) => {
  const { updateTasksForPath, updatePath, deletePath, addToast } = useGameState();
  
  const [pathName, setPathName] = useState(path.name);
  const [tasks, setTasks] = useState(path.tasks);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const handleNameSave = () => {
    if (pathName.trim() && pathName !== path.name) {
      updatePath(path.id, { name: pathName });
      addToast('Path renamed.', 'success');
    }
  };

  const handleTaskChange = (taskId: string, field: 'description', value: any) => {
    setTasks(currentTasks => currentTasks.map(t => t.id === taskId ? { ...t, [field]: value } : t));
  };
  
  const handleAddTask = () => {
    const newTask: Task = {
      id: `task-manual-${Date.now()}`,
      description: 'New Task',
      type: TaskType.Daily,
      xp: 95,
      statBoost: { stat: StatName.Physical, subStat: SubStatName.Strength, amount: 5 },
      isCompleted: false
    };
    setTasks(currentTasks => [...currentTasks, newTask]);
  };
  
  const handleDeleteTask = (taskId: string) => {
    setTasks(currentTasks => currentTasks.filter(t => t.id !== taskId));
  };
  
  const handleSaveChanges = () => {
    // This creates a new array of tasks that the reducer can use to fully replace the old one.
    // It strips out properties that shouldn't be part of the "base" definition.
    const taskDefinitions = tasks.map(({ id, isCompleted, lastCompleted, ...rest }) => ({
        ...rest,
        // Re-add a new ID to ensure it's treated as a "new" set by any downstream logic
        id: `task-manual-${Date.now()}-${Math.random()}`, 
        isCompleted: false,
    }));
    updateTasksForPath(path.id, taskDefinitions);
    addToast('Tasks updated.', 'success');
    onClose();
  };

  const handleDeletePath = () => {
    deletePath(path.id);
    onClose();
  };
  
  const inputStyles = "w-full bg-gray-800/50 border border-gray-700 rounded-md p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm";

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col relative !border-purple-500/50">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X />
        </button>
        
        <h2 className="text-3xl font-orbitron font-bold hud-text-accent mb-4 flex-shrink-0">Edit Protocol</h2>
        
        <div className="flex-grow overflow-y-auto pr-2 space-y-6">
            {/* Rename Path */}
            <div>
              <label className="block text-gray-400 mb-2 font-semibold">Protocol Name</label>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={pathName} 
                  onChange={(e) => setPathName(e.target.value)} 
                  onBlur={handleNameSave}
                  className={inputStyles}
                />
              </div>
            </div>
            
            {/* Task List */}
            <div>
                <h3 className="text-xl font-orbitron text-gray-300 mb-3">Tasks</h3>
                <div className="space-y-3">
                    {tasks.map(task => (
                        <div key={task.id} className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 space-y-2">
                            <div className="flex items-center gap-2">
                                <input type="text" value={task.description} onChange={(e) => handleTaskChange(task.id, 'description', e.target.value)} className={inputStyles} />
                                <button onClick={() => handleDeleteTask(task.id)} className="p-2 text-red-500 hover:text-red-400 bg-gray-700 rounded-md"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
                 <button onClick={handleAddTask} className="w-full flex items-center justify-center gap-2 p-2 mt-3 bg-gray-700/50 hover:bg-gray-700 rounded-md border border-gray-600 text-sm">
                    <PlusCircle size={16}/> Add New Task
                </button>
            </div>
        </div>

        <div className="flex-shrink-0 pt-4 mt-4 border-t border-gray-700 space-y-4">
            <button onClick={handleSaveChanges} className="w-full p-3 bg-purple-600 rounded-md hover:bg-purple-500 text-white font-bold text-lg flex items-center justify-center gap-2">
                <Save /> Save Changes
            </button>
            
            {/* Delete Path */}
            <div className="border-t border-red-500/30 pt-4">
                {showDeleteConfirm ? (
                    <div>
                        <p className="text-red-400 text-center mb-3">Are you sure? This action is irreversible.</p>
                        <div className="flex gap-4">
                            <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 bg-gray-600 p-2 rounded-md hover:bg-gray-500">Cancel</button>
                            <button onClick={handleDeletePath} className="flex-1 bg-red-600 p-2 rounded-md hover:bg-red-500">Confirm Delete</button>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => setShowDeleteConfirm(true)} className="w-full bg-red-600/20 text-red-400 p-2 rounded-md hover:bg-red-600/40">
                        Delete Protocol
                    </button>
                )}
            </div>
        </div>
      </Card>
    </div>
  );
};

export default PathEditModal;