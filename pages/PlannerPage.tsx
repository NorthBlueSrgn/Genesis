
import React, { useState, useMemo, useEffect } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import Loader from '../components/ui/Loader';
import Card from '../components/ui/Card';
import { Task, TaskType, IconName } from '../types';
import { GripVertical, Zap, Clock } from 'lucide-react';
import { ICON_MAP } from '../constants';

// A type for the structured tasks with path info
interface PlannerTask extends Task {
  pathId: string;
  pathName: string;
  pathIcon: IconName;
}

const START_HOUR = 4; // Shifted from 7 AM to 4 AM (The Wolf Hour)
const SLOT_COUNT = 21; // From 4 AM to Midnight

// Draggable Task Component for the "Available" list
const DraggableTask: React.FC<{ task: PlannerTask }> = ({ task }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ taskId: task.id, pathId: task.pathId }));
    e.dataTransfer.effectAllowed = 'move';
  };
  const PathIcon = ICON_MAP[task.pathIcon] || ICON_MAP['Swords'];

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex items-center p-3 bg-gray-900 border border-gray-800 rounded-sm cursor-grab active:cursor-grabbing hover:border-purple-500/50 transition-all group"
    >
      <GripVertical className="w-5 h-5 text-gray-700 mr-3 flex-shrink-0 group-hover:text-purple-500" />
      <div className="flex-grow min-w-0 pointer-events-none">
        <p className="truncate text-xs font-bold uppercase tracking-tight text-gray-300">{task.description}</p>
        <div className="flex items-center text-[9px] text-gray-500 mt-1 uppercase font-black tracking-widest">
          <PathIcon className="w-3 h-3 mr-1 text-purple-600" />
          <span className="truncate">{task.pathName}</span>
        </div>
      </div>
    </div>
  );
};

// Component for a task that has been scheduled in the planner
const ScheduledTask: React.FC<{ task: PlannerTask }> = ({ task }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ taskId: task.id, pathId: task.pathId }));
    e.dataTransfer.effectAllowed = 'move';
  };
  const PathIcon = ICON_MAP[task.pathIcon] || ICON_MAP['Swords'];

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="relative group flex items-center p-2 bg-purple-900/10 border border-purple-500/30 rounded-sm cursor-grab active:cursor-grabbing w-full hover:bg-purple-900/20 transition-all"
    >
      <GripVertical className="w-4 h-4 text-purple-600/50 mr-2 flex-shrink-0" />
      <div className="flex-grow min-w-0 pointer-events-none">
        <p className="truncate text-[11px] font-black uppercase text-purple-100">{task.description}</p>
        <div className="flex items-center text-[8px] text-purple-400/70 mt-0.5 uppercase font-bold tracking-tighter">
          <PathIcon className="w-2.5 h-2.5 mr-1" />
          <span className="truncate">{task.pathName}</span>
        </div>
      </div>
    </div>
  );
};

// Planner Page
const PlannerPage: React.FC = () => {
  const { gameState, isLoading, planTask, unplanTask, automateSchedule } = useGameState();
  const [selectedDay, setSelectedDay] = useState(new Date().getDay()); // 0:Sun, 1:Mon, ...
  const [dragOverHour, setDragOverHour] = useState<number | null>(null);
  const [isOverUnplan, setIsOverUnplan] = useState(false);
  const [isAutomating, setIsAutomating] = useState(false);

  // Memoize task collections based on selected day
  const { plannedTasksMap, availableTasks } = useMemo(() => {
    if (!gameState) return { plannedTasksMap: new Map(), availableTasks: [] };

    const allTasks: PlannerTask[] = gameState.paths.flatMap(path =>
      path.tasks
        .filter(task => task.type === TaskType.Daily || (task.type === TaskType.Weekly && !task.isCompleted))
        .map(task => ({
          ...task,
          pathId: path.id,
          pathName: path.name,
          pathIcon: path.icon,
        }))
    );
    
    const planForSelectedDay = gameState.weeklyPlan?.[selectedDay] || [];
    const plannedTaskIds = new Set(planForSelectedDay.map(p => p.taskId));
    
    const availableTasks = allTasks.filter(task => !plannedTaskIds.has(task.id));
    const allTasksMap = new Map(allTasks.map(t => [t.id, t]));
    const plannedTasksMap = new Map<number, PlannerTask[]>();

    planForSelectedDay.forEach(p => {
        const taskDetails = allTasksMap.get(p.taskId);
        if (taskDetails) {
            if (!plannedTasksMap.has(p.hour)) {
                plannedTasksMap.set(p.hour, []);
            }
            // Prevent visual duplicates if multiple entries somehow exist for same hour
            if (!plannedTasksMap.get(p.hour)!.some(t => t.id === taskDetails.id)) {
                plannedTasksMap.get(p.hour)!.push(taskDetails);
            }
        }
    });

    return { plannedTasksMap, availableTasks };
  }, [gameState, selectedDay]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, hour?: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (hour !== undefined && dragOverHour !== hour) {
      setDragOverHour(hour);
    }
  };

  const handleDragLeave = () => {
    setDragOverHour(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, hour: number) => {
    e.preventDefault();
    setDragOverHour(null);
    try {
      const data = e.dataTransfer.getData('application/json');
      if (data) {
        const { taskId, pathId } = JSON.parse(data);
        planTask(selectedDay, hour, taskId, pathId);
      }
    } catch (err) {
      console.error("Task drop failed:", err);
    }
  };
  
  const handleUnplanDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOverUnplan(false);
    try {
      const data = e.dataTransfer.getData('application/json');
      if (data) {
        const { taskId } = JSON.parse(data);
        unplanTask(selectedDay, taskId);
      }
    } catch (err) {
      console.error("Unplan drop failed:", err);
    }
  };

  const handleAutomateSchedule = async () => {
      setIsAutomating(true);
      await automateSchedule();
      setIsAutomating(false);
  };

  if (isLoading || !gameState) {
    return <Loader text="Loading Tactical Planner..." />;
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-5rem)] md:h-[calc(100vh-3rem)] gap-6 p-2 md:p-6">
      {/* Available Tasks Sidebar */}
      <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col min-h-0">
        <Card className="flex-grow flex flex-col h-full !bg-black/60 border-purple-900/30">
          <div className="mb-4">
            <h2 className="text-xl font-black font-orbitron text-purple-400 tracking-widest uppercase">Directives</h2>
            <p className="text-[10px] text-gray-600 font-mono mt-1">AVAILABLE_FOR_PLANNING</p>
          </div>
          
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsOverUnplan(true); }}
            onDragLeave={() => setIsOverUnplan(false)}
            onDrop={handleUnplanDrop}
            className={`p-3 mb-4 rounded-sm border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-1 ${isOverUnplan ? 'border-red-500 bg-red-900/20 shadow-[inset_0_0_20px_rgba(239,68,68,0.2)]' : 'border-gray-800 bg-gray-900/30 opacity-50'}`}
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Unschedule Zone</p>
            <span className="text-[8px] text-gray-700 italic">DRAG_HERE_TO_WIPE</span>
          </div>

          <div className="flex-grow overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {availableTasks.length > 0 ? (
              availableTasks.map(task => <DraggableTask key={`${task.id}-${task.pathId}`} task={task} />)
            ) : (
              <div className="text-center py-10 opacity-30">
                <Clock size={32} className="mx-auto mb-2" />
                <p className="text-[10px] font-bold uppercase tracking-widest">All tasks deployed</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Planner Main Area */}
      <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col min-h-0">
        <Card className="flex-shrink-0 mb-4 !bg-black/40 border-cyan-900/20">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black font-orbitron text-white tracking-tighter">TACTICAL_PLANNER</h1>
                    <p className="text-[10px] text-cyan-500 font-mono tracking-widest uppercase mt-1">Operational Window: 04:00 - 00:00</p>
                </div>
                <button
                    onClick={handleAutomateSchedule}
                    disabled={isAutomating}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-black font-black py-3 px-6 rounded-sm transition-all duration-300 disabled:bg-gray-800 disabled:text-gray-600 uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                >
                    <Zap size={14} />
                    {isAutomating ? 'SYCHRONIZING...' : 'AUTOMATE_DEPLOYMENT'}
                </button>
            </div>
        </Card>

        <div className="flex-grow overflow-y-auto custom-scrollbar bg-black/20 border border-gray-800/50 rounded-sm">
          <div className="p-4 md:p-6 min-h-full">
            <div className="flex justify-between items-center mb-8 bg-gray-900/40 p-2 border border-gray-800 rounded-sm">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(i)}
                  className={`flex-1 py-3 font-black font-orbitron text-[10px] uppercase tracking-[0.2em] transition-all border-b-2 ${selectedDay === i ? 'text-purple-400 border-purple-500 bg-purple-900/10' : 'text-gray-600 border-transparent hover:text-gray-400'}`}
                >
                  {day}
                </button>
              ))}
            </div>

            <div className="space-y-1">
              {[...Array(SLOT_COUNT)].map((_, i) => {
                const hour = (i + START_HOUR) % 24; 
                const tasksInSlot = plannedTasksMap.get(hour) || [];
                const isActiveSlot = dragOverHour === hour;
                
                return (
                  <div
                    key={hour}
                    onDragOver={(e) => handleDragOver(e, hour)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, hour)}
                    className={`flex items-stretch gap-4 p-1.5 min-h-[60px] rounded-sm transition-all duration-300 border-l-2 ${isActiveSlot ? 'bg-purple-900/20 border-purple-500 shadow-[inset_10px_0_20px_rgba(168,85,247,0.1)]' : 'bg-transparent border-transparent hover:bg-gray-900/20'}`}
                  >
                    <div className="w-16 flex flex-col justify-center text-right font-mono text-[10px] font-black text-gray-700 pr-2 border-r border-gray-800/30">
                        {hour.toString().padStart(2, '0')}:00
                        <span className="text-[8px] text-gray-800 mt-0.5">{hour < 12 ? 'AM' : 'PM'}</span>
                    </div>
                    
                    <div className="flex-grow flex flex-col gap-2 py-1">
                      {tasksInSlot.length > 0 ? (
                        tasksInSlot.map(task => <ScheduledTask key={task.id} task={task} />)
                      ) : (
                        <div className={`flex-grow w-full border border-dashed rounded-sm flex items-center justify-center transition-opacity duration-500 ${isActiveSlot ? 'border-purple-500/50 opacity-100' : 'border-gray-800/20 opacity-10'}`}>
                           <span className="text-[9px] font-black font-mono tracking-[0.5em] text-gray-500 uppercase">_OPEN_WINDOW</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlannerPage;
