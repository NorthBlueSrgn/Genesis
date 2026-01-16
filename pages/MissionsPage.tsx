
import React, { useState, useMemo } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import Loader from '../components/ui/Loader';
import Card from '../components/ui/Card';
import { Mission, PromotionExam, StatName, Task } from '../types';
import { Target, Check, Circle, Award, Send, Filter, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { RANKS, RANK_PERCENTILES } from '../constants';
import DossierHeader from '../components/ui/DossierHeader';
import { calculateScores } from '../services/scoringService';
import TaskCompletionModal from '../components/TaskCompletionModal';

const MissionItem: React.FC<{ mission: Mission; onComplete: (id: string) => void, onTaskClick: (task: Task) => void }> = ({ mission, onComplete, onTaskClick }) => {
    const isExpired = mission.expiresAt && new Date(mission.expiresAt) < new Date();
    const isMilestone = !!mission.benchmarkTarget;

    // Adapt Mission to Task interface for the modal
    const asTask: Task = {
        id: mission.id,
        description: mission.title + ": " + mission.description,
        type: 'Daily' as any,
        xp: mission.xp,
        statBoost: mission.statBoost as any,
        isCompleted: mission.isCompleted
    };

    return (
        <div className={`p-4 rounded-lg border relative overflow-hidden ${
            mission.isCompleted ? 'bg-green-900/30 border-green-500/30 text-gray-500' : 
            isExpired ? 'bg-red-900/20 border-red-900/50 opacity-70' :
            isMilestone ? 'bg-indigo-900/20 border-indigo-500/50' : 
            'bg-gray-800/50 border-gray-700'
        }`}>
            {isMilestone && !mission.isCompleted && (
                <div className="absolute top-0 right-0 bg-indigo-500/20 text-indigo-300 text-[10px] px-2 py-1 rounded-bl-lg border-b border-l border-indigo-500/30 font-bold tracking-wider">
                    MILESTONE
                </div>
            )}

            <div className="flex justify-between items-start">
                <div className="flex-grow">
                    <h3 className={`text-xl font-orbitron font-bold ${mission.isCompleted ? 'line-through text-gray-400' : 'text-white'}`}>{mission.title}</h3>
                    <p className={`mt-1 ${mission.isCompleted ? 'line-through' : 'text-gray-300'}`}>{mission.description}</p>
                    
                    {/* Benchmark Display */}
                    {mission.benchmarkTarget && !mission.isCompleted && (
                        <div className="mt-3 bg-black/40 p-2 rounded border border-indigo-500/30 flex items-center gap-4 text-sm">
                            <div>
                                <span className="text-gray-500 text-xs block">CURRENT</span>
                                <span className="text-gray-300 font-mono">{mission.benchmarkTarget.currentBaseline}</span>
                            </div>
                            <div className="text-indigo-500 font-bold">→</div>
                            <div>
                                <span className="text-indigo-400 text-xs block font-bold">TARGET</span>
                                <span className="text-white font-mono font-bold">{mission.benchmarkTarget.targetValue}</span>
                            </div>
                            <div className="ml-auto text-xs text-gray-500">
                                Gap: {(mission.benchmarkTarget.targetPercentile - mission.benchmarkTarget.originalPercentile).toFixed(1)}%
                            </div>
                        </div>
                    )}

                    {mission.isCompleted && mission.completedAt && (
                        <p className="text-xs text-gray-500 mt-2 font-mono">Completed: {new Date(mission.completedAt).toLocaleDateString()}</p>
                    )}
                    
                    {!mission.isCompleted && mission.expiresAt && (
                        <p className={`text-xs mt-2 font-mono flex items-center gap-1 ${isExpired ? 'text-red-500' : 'text-amber-500'}`}>
                            <Clock size={12} /> {isExpired ? 'EXPIRED' : `Expires: ${new Date(mission.expiresAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                        </p>
                    )}
                </div>
                {!mission.isCompleted && !mission.isPromotionExam && !isExpired && (
                     <button onClick={() => onTaskClick(asTask)} className="bg-purple-600 hover:bg-purple-500 text-white font-bold p-2 rounded-md transition-all flex-shrink-0 ml-4 mt-1">
                        <Check size={20} />
                    </button>
                )}
            </div>
            {!mission.isPromotionExam && (
                <div className="mt-3 pt-3 border-t border-gray-700/50 flex items-center justify-end text-sm gap-4">
                    <span className="font-bold text-cyan-300">+{mission.xp} XP</span>
                    <span className="font-semibold hud-text-accent">+{mission.statBoost.amount} {mission.statBoost.stat}</span>
                </div>
            )}
        </div>
    );
};

const PromotionExamCard: React.FC<{ exam: PromotionExam; mission: Mission }> = ({ exam, mission }) => {
    // Fix: Added completePromotionExam to destructuring so it can be called below.
    const { updatePromotionExamObjective, completePromotionExam, gameState } = useGameState();
    
    if (!gameState) return null;
    
    const allObjectivesComplete = exam.objectives.every(obj => obj.isCompleted);

    const handleCompleteExam = async () => {
        if (window.confirm("Are you sure you want to complete the promotion exam? This action cannot be undone.")) {
            // Fix: Call completePromotionExam as a function now that the interface type is correct.
            await completePromotionExam();
        }
    }

    return (
        <Card className="!border-purple-500/50">
            <h2 className="text-2xl font-bold font-orbitron text-purple-300 mb-2 text-center">Promotion Exam: Rank {exam.targetRank}</h2>
            <p className="text-center text-gray-400 mb-4">{mission.description}</p>
            
            <div className="space-y-3 my-6">
                {exam.objectives.map((obj, index) => (
                     <div
                        key={index}
                        onClick={() => updatePromotionExamObjective(index, !obj.isCompleted)}
                        className={`flex items-center p-3 rounded-md transition-all duration-300 border cursor-pointer ${
                            obj.isCompleted
                            ? 'bg-green-500/10 border-green-500/20 text-gray-500'
                            : 'bg-gray-800/50 border-gray-700 hover:bg-purple-900/30 hover:border-purple-500/50'
                        }`}
                        >
                        {obj.isCompleted ? (
                            <Check className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" />
                        ) : (
                            <Circle className="w-6 h-6 text-gray-500 mr-3 flex-shrink-0" />
                        )}
                        <p className={`flex-grow text-lg ${obj.isCompleted ? 'line-through text-gray-400' : 'text-gray-200'}`}>{obj.description}</p>
                    </div>
                ))}
            </div>

            <button
                onClick={handleCompleteExam}
                disabled={!allObjectivesComplete}
                className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                <Award className="w-5 h-5 mr-2" />
                Complete Exam
            </button>
        </Card>
    );
};


const MissionsPage: React.FC = () => {
  const { gameState, isLoading, requestNewMission, completeMission, requestPromotionExam } = useGameState();
  const [isRequesting, setIsRequesting] = useState(false);
  const [userRequest, setUserRequest] = useState('');
  const [selectedTask, setSelectedTask] = useState<{task: Task, missionId: string} | null>(null);

  const completedMissionsByStat = useMemo(() => {
      if (!gameState) return {};
      const completed = gameState.missions.filter(m => m.isCompleted);
      const grouped: Partial<Record<StatName, Mission[]>> = {};
      
      completed.forEach(m => {
          const stat = m.statBoost.stat;
          if (!grouped[stat]) grouped[stat] = [];
          grouped[stat]!.push(m);
      });
      return grouped;
  }, [gameState?.missions]);

  if (isLoading || !gameState) {
    return <Loader text="Loading Directives..." />;
  }
  
  const handleRequestMission = async () => {
      setIsRequesting(true);
      await requestNewMission(userRequest);
      setUserRequest('');
      setIsRequesting(false);
  }
  
  const handleRequestExam = async () => {
      if(!gameState) return;
      const currentRankIndex = RANKS.findIndex(r => r.name === gameState.rank.name);
      const nextRank = RANKS[currentRankIndex + 1];
      if (!nextRank) return;

      if (window.confirm(`Your current threat assessment is sufficient to challenge for Rank ${nextRank.name}. Do you wish to initiate the promotion exam?`)) {
        setIsRequesting(true);
        await requestPromotionExam();
        setIsRequesting(false);
      }
  }

  const handleTaskClick = (task: Task) => {
      setSelectedTask({ task, missionId: task.id });
  }

  const activeMissions = gameState.missions.filter(m => !m.isCompleted);
  const promotionMission = gameState.promotionExam ? activeMissions.find(m => m.id === gameState.promotionExam?.missionId) : null;
  const standardMissions = activeMissions.filter(m => m.id !== promotionMission?.id);
  const canRequestMission = standardMissions.length < 3 && !promotionMission; // Limit concurrent active missions
  
  const currentRankIndex = RANKS.findIndex(r => r.name === gameState.rank.name);
  const nextRank = RANKS[currentRankIndex + 1];
  
  const { apexThreatIndex } = calculateScores(gameState.stats);
  const nextRankInfo = nextRank ? RANK_PERCENTILES[nextRank.name] : null;

  const canRequestExam = nextRankInfo && apexThreatIndex >= nextRankInfo.min && !gameState.promotionExam;


  return (
    <div>
      <DossierHeader title="DIRECTIVES" />

      {gameState.promotionExam && promotionMission ? (
          <div className="mb-6">
            <PromotionExamCard exam={gameState.promotionExam} mission={promotionMission} />
          </div>
      ) : (
          <Card className="mb-6">
            <h2 className="text-2xl font-bold font-orbitron hud-text-accent mb-2 text-center">Request from Central</h2>
            <p className="text-gray-400 mb-4 text-center">Request a new directive based on your current milestones.</p>
            
            <div className="mb-4">
                <textarea 
                    value={userRequest}
                    onChange={(e) => setUserRequest(e.target.value)}
                    placeholder="E.g., 'I want to improve my Bench Press' or 'Test my Python skills'. Central will access your current benchmarks to generate a target."
                    className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-sm text-white focus:outline-none focus:border-purple-500 mb-2"
                    rows={2}
                />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <button
                    onClick={handleRequestMission}
                    disabled={!canRequestMission || isRequesting}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    <Send className="w-5 h-5 mr-2" />
                    {isRequesting ? 'Calculating...' : 'Request New Directive'}
                </button>
                 <button
                    onClick={handleRequestExam}
                    disabled={!canRequestExam || isRequesting}
                    className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    <Award className="w-5 h-5 mr-2" />
                    {isRequesting ? 'Initiating...' : 'Request Rank Evaluation'}
                </button>
            </div>
            {!canRequestExam && !gameState.promotionExam && nextRankInfo && <p className="text-xs text-gray-500 mt-2 text-center">Rank evaluation available upon reaching {nextRankInfo.min} ATI.</p>}
          </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-3xl font-bold font-orbitron text-center mb-4 hud-text-primary">Active Directives</h2>
          <div className="space-y-4">
            {standardMissions.length > 0 ? (
                standardMissions.map(mission => <MissionItem key={mission.id} mission={mission} onComplete={completeMission} onTaskClick={handleTaskClick} />)
            ) : !promotionMission ? (
              <div className="text-center py-10 border-2 border-dashed border-gray-700 rounded-lg">
                <p className="text-gray-500">No active directives.</p>
                <p className="text-gray-500">Request a new directive from Central to push your limits.</p>
              </div>
            ) : (
                 <div className="text-center py-10 border-2 border-dashed border-gray-700 rounded-lg">
                    <p className="text-gray-500">Focus on your Rank Evaluation.</p>
                </div>
            )}
          </div>
        </div>
        
        <div>
          <h2 className="text-3xl font-bold font-orbitron text-center mb-4 text-gray-500">Milestone Log</h2>
          <div className="space-y-6">
            {Object.entries(completedMissionsByStat).length > 0 ? (
                Object.entries(completedMissionsByStat).map(([stat, missions]) => (
                    <div key={stat} className="bg-gray-900/30 rounded-lg p-3 border border-gray-800">
                        <h3 className="text-purple-400 font-bold font-orbitron mb-2 flex items-center gap-2 border-b border-gray-700 pb-1">
                            <Filter size={14}/> {stat}
                        </h3>
                        <div className="space-y-2">
                            {(missions as Mission[])?.sort((a,b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime()).map(mission => (
                                <MissionItem key={mission.id} mission={mission} onComplete={() => {}} onTaskClick={() => {}} />
                            ))}
                        </div>
                    </div>
                ))
            ) : (
              <div className="text-center py-10 border-2 border-dashed border-gray-700 rounded-lg">
                <p className="text-gray-500">No directives completed yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedTask && (
          <TaskCompletionModal 
              task={selectedTask.task}
              missionId={selectedTask.missionId}
              pathName="Directive"
              onClose={() => setSelectedTask(null)}
          />
      )}
    </div>
  );
};

export default MissionsPage;
