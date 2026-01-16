import React, { useState, useMemo } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import Loader from '../components/ui/Loader';
import Card from '../components/ui/Card';
import { Plus, Trash2, Check, Star, Send, Circle, ChevronDown, CheckCircle, Zap, Clock, MoreHorizontal, FileText } from 'lucide-react';
import { SideMission, SideMissionObjective, SideMissionStage } from '../types';

const tierStyles: Record<SideMission['tier'], { border: string; bg: string; text: string; shadow: string; }> = {
    'D': { border: 'border-gray-600', bg: 'bg-gray-800/50', text: 'text-gray-300', shadow: '' },
    'C': { border: 'border-green-600/80', bg: 'bg-green-900/40', text: 'text-green-300', shadow: 'shadow-green-500/10' },
    'B': { border: 'border-blue-600/80', bg: 'bg-blue-900/40', text: 'text-blue-300', shadow: 'shadow-blue-500/15' },
    'A': { border: 'border-purple-600/80', bg: 'bg-purple-900/40', text: 'text-purple-300', shadow: 'shadow-purple-500/20' },
    'S': { border: 'border-amber-500/80', bg: 'bg-amber-900/40', text: 'text-amber-300', shadow: 'shadow-amber-500/25' },
};

const Objective: React.FC<{
  mission: SideMission;
  stage: SideMissionStage;
  stageIndex: number;
  objective: SideMissionObjective;
  objectiveIndex: number;
}> = ({ mission, stage, stageIndex, objective, objectiveIndex }) => {
    const { updateSideMissionObjective, incrementSideMissionCounter, requestAdaptiveStage } = useGameState();
    const [counterAmount, setCounterAmount] = useState(1);

    const handleToggle = () => {
        if (objective.type !== 'action' || mission.status !== 'Active') return;
        updateSideMissionObjective(mission.id, stageIndex, objectiveIndex, !objective.isCompleted);
    };

    const handleIncrement = () => {
        if (objective.type !== 'counter' || mission.status !== 'Active' || objective.isCompleted) return;
        incrementSideMissionCounter(mission.id, stageIndex, objectiveIndex, counterAmount);
    };
    
    const handleRequestAdaptiveStage = () => {
        requestAdaptiveStage(mission.id, stageIndex, objectiveIndex);
    };

    const isActionable = mission.status === 'Active' && !stage.isCompleted && !objective.isCompleted;

    return (
        <div className={`pl-4 border-l-2 ${objective.isCompleted ? 'border-green-500/50' : 'border-gray-700/50'}`}>
            <div
                onClick={handleToggle}
                className={`flex items-start justify-between p-2 rounded-md transition-all duration-300 ${isActionable && objective.type === 'action' ? 'cursor-pointer hover:bg-purple-900/30' : ''} ${objective.isCompleted ? 'text-gray-500' : 'text-gray-200'}`}
            >
                <div className="flex items-start">
                    {objective.isCompleted ? <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" /> : <Circle className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0 mt-0.5" />}
                    <div>
                        <p className={`flex-grow ${objective.isCompleted ? 'line-through' : ''}`}>{objective.description}</p>
                        {objective.type === 'counter' && objective.target && (
                            <p className="text-xs text-gray-400 mt-1">Progress: {objective.current || 0} / {objective.target}</p>
                        )}
                    </div>
                </div>
            </div>

            {isActionable && (
                <div className="pl-10 pb-2">
                    {objective.type === 'counter' && (
                        <div className="flex items-center gap-2">
                            <input type="number" value={counterAmount} onChange={(e) => setCounterAmount(Number(e.target.value))} className="w-16 bg-gray-800 border border-gray-600 rounded-md p-1 text-sm" />
                            <button onClick={handleIncrement} className="text-xs font-bold bg-gray-700 hover:bg-gray-600 rounded-md px-3 py-1">Log Progress</button>
                        </div>
                    )}
                    {objective.type === 'outcome' && !objective.isCompleted && (
                        <button onClick={handleRequestAdaptiveStage} className="text-xs font-bold text-cyan-300 hover:text-cyan-200 flex items-center gap-1">
                            <Zap size={14} /> Report Impasse
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

const Stage: React.FC<{ mission: SideMission, stage: SideMissionStage, stageIndex: number }> = ({ mission, stage, stageIndex }) => {
    const [isOpen, setIsOpen] = useState(!stage.isCompleted);

    return (
        <div className={`p-3 rounded-lg border ${stage.isCompleted ? 'border-green-800 bg-green-900/20' : 'border-gray-700 bg-gray-800/50'}`}>
            <button className="w-full flex justify-between items-center text-left" onClick={() => setIsOpen(!isOpen)}>
                <div className="flex items-center">
                    {stage.isCompleted ? <CheckCircle className="w-5 h-5 text-green-400 mr-3" /> : <MoreHorizontal className="w-5 h-5 text-gray-500 mr-3" />}
                    <h4 className={`font-bold font-orbitron ${stage.isCompleted ? 'text-gray-400 line-through' : 'text-white'}`}>{stage.title}</h4>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="mt-3 pt-3 border-t border-gray-600/50 space-y-2">
                    <p className="text-sm text-gray-400 mb-3 italic">{stage.description}</p>
                    {stage.objectives.map((obj, index) => (
                        <Objective key={index} mission={mission} stage={stage} stageIndex={stageIndex} objective={obj} objectiveIndex={index} />
                    ))}
                </div>
            )}
        </div>
    );
};

const SideMissionCard: React.FC<{ mission: SideMission }> = ({ mission }) => {
    const { deleteSideMission, completeSideMission } = useGameState();
    const styles = tierStyles[mission.tier];
    const allStagesComplete = mission.stages.every(s => s.isCompleted);

    return (
        <Card className={`${styles.border} ${styles.bg} ${styles.shadow}`}>
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-xl font-orbitron font-bold text-white">{mission.title}</h3>
                    <p className="text-sm text-gray-400 mt-1 italic">"{mission.userDescription}"</p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                    <span className={`px-3 py-1 text-lg font-black font-orbitron rounded ${styles.bg} border-2 ${styles.border} ${styles.text}`}>{mission.tier}</span>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-1"><Clock size={14} /><span>Est. Time: {mission.estimatedCompletionTime}</span></div>
                <div className="flex items-center gap-1"><Star size={14} /><span>+{mission.xp} XP</span></div>
                <div className="flex items-center gap-1"><Zap size={14} /><span>+{mission.statBoost.amount} {mission.statBoost.subStat}</span></div>
            </div>
            
            <div className="space-y-3 mb-4">
                {mission.stages.map((stage, index) => (
                    <Stage key={index} mission={mission} stage={stage} stageIndex={index} />
                ))}
            </div>

            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-700/50">
                <button
                    onClick={() => completeSideMission(mission.id)}
                    disabled={!allStagesComplete}
                    className="flex-grow flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    <Check /> Complete
                </button>
                <button onClick={() => deleteSideMission(mission.id)} className="p-2 bg-red-900/50 text-red-400 hover:bg-red-800/50 rounded-md">
                    <Trash2 />
                </button>
            </div>
        </Card>
    );
};

const SideMissionsPage: React.FC = () => {
    const { gameState, isLoading, addSideMission } = useGameState();
    const [newMissionDesc, setNewMissionDesc] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [view, setView] = useState<'active' | 'completed'>('active');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMissionDesc.trim() || isSubmitting) return;
        setIsSubmitting(true);
        await addSideMission(newMissionDesc);
        setNewMissionDesc('');
        setIsSubmitting(false);
    };

    if (isLoading || !gameState) {
        return <Loader text="Loading Side Mission Roster..." />;
    }

    const activeMissions = gameState.sideMissions.filter(m => m.status === 'Active');
    const completedMissions = gameState.sideMissions.filter(m => m.status === 'Completed');

    return (
        <div>
            <h1 className="text-4xl font-bold font-orbitron text-center mb-6">Side Mission Campaigns</h1>
            <Card className="mb-6">
                <h2 className="text-2xl font-bold font-orbitron hud-text-accent mb-4">New Objective</h2>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
                    <input
                        type="text"
                        value={newMissionDesc}
                        onChange={(e) => setNewMissionDesc(e.target.value)}
                        placeholder="Define your short-term objective (e.g., 'prepare for my job interview', 'build a new habit for meal planning')..."
                        className="flex-grow bg-gray-800/50 border border-gray-700 rounded-md p-3 w-full text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        disabled={isSubmitting}
                    />
                    <button
                        type="submit"
                        disabled={!newMissionDesc.trim() || isSubmitting}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex-shrink-0"
                    >
                        <Send size={18} />
                        {isSubmitting ? 'Analyzing...' : 'Submit to Central'}
                    </button>
                </form>
            </Card>

            <div className="flex justify-center gap-2 mb-6">
                <button onClick={() => setView('active')} className={`px-4 py-2 font-bold rounded-md ${view === 'active' ? 'bg-purple-600 text-white' : 'bg-gray-800'}`}>Active ({activeMissions.length})</button>
                <button onClick={() => setView('completed')} className={`px-4 py-2 font-bold rounded-md ${view === 'completed' ? 'bg-purple-600 text-white' : 'bg-gray-800'}`}>Completed ({completedMissions.length})</button>
            </div>

            <div className="space-y-6">
                {view === 'active' && (
                    activeMissions.length > 0
                        ? activeMissions.map(m => <SideMissionCard key={m.id} mission={m} />)
                        : <p className="text-center text-gray-500">No active campaigns. Submit an objective to begin.</p>
                )}
                {view === 'completed' && (
                    completedMissions.length > 0
                        ? completedMissions.map(m => (
                            <Card key={m.id} className="opacity-60">
                                <h3 className="text-xl font-orbitron font-bold text-gray-400 line-through">{m.title}</h3>
                                <p className="text-sm text-gray-500 mt-1 italic">"{m.userDescription}"</p>
                                <div className="mt-2 flex items-center gap-4 text-xs text-green-400"><Check/> Completed</div>
                            </Card>
                        ))
                        : <p className="text-center text-gray-500">No completed campaigns yet.</p>
                )}
            </div>
        </div>
    );
};

export default SideMissionsPage;