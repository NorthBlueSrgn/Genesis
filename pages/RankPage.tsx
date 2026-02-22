
import React, { useState } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import Loader from '../components/ui/Loader';
import Card from '../components/ui/Card';
import { RANKS, RANK_PERCENTILES } from '../constants';
import { Lock, CheckCircle, Clock, FileText, X } from 'lucide-react';
import DossierHeader from '../components/ui/DossierHeader';
import { calculateScores } from '../services/scoringService';
import { ClassifiedDossier } from '../components/ClassifiedDossier';

const getHatiColor = (score: number): { text: string; shadow: string } => {
    if (score >= 99.9) return { text: 'text-cyan-400', shadow: '0 0 25px #22d3ee' }; // SS+ (Transcendent) - Cyan Glow
    if (score >= 97) return { text: 'text-red-500', shadow: '0 0 20px #ef4444' }; // SS (Omega)
    if (score >= 94) return { text: 'text-orange-400', shadow: '0 0 15px #fb923c' }; // S+
    if (score >= 90) return { text: 'text-amber-300', shadow: '0 0 15px #facc15' }; // S
    if (score >= 75) return { text: 'text-indigo-400', shadow: '0 0 15px #818cf8' }; // A
    if (score >= 60) return { text: 'text-purple-300', shadow: '0 0 15px #c084fc' }; // B
    if (score >= 40) return { text: 'text-blue-400', shadow: '0 0 15px #60a5fa' }; // C
    if (score >= 20) return { text: 'text-green-400', shadow: '0 0 15px #4ade80' }; // D
    return { text: 'text-gray-400', shadow: '0 0 15px #9ca3af' }; // E
};

const RankPage: React.FC = () => {
    const { gameState, isLoading } = useGameState();
    const [isReportVisible, setIsReportVisible] = useState(false);

    if (isLoading || !gameState) {
        return <Loader text="Loading Grade & Threat Assessment..." />;
    }
    
    const { rank, stats } = gameState;
    const currentRankIndex = RANKS.findIndex(r => r.name === rank.name);
    const { apexThreatIndex } = calculateScores(stats);
    
    const nextRank = currentRankIndex < RANKS.length - 1 ? RANKS[currentRankIndex + 1] : null;
    const currentRankInfo = RANK_PERCENTILES[rank.name];
    const nextRankInfo = nextRank ? RANK_PERCENTILES[nextRank.name] : { min: 100 };

    let progress = 0;
    const range = nextRankInfo.min - currentRankInfo.min;
    if (range > 0) {
        const progressInRange = apexThreatIndex - currentRankInfo.min;
        progress = (progressInRange / range) * 100;
    } else {
        progress = 100; // At max rank
    }
    progress = Math.max(0, Math.min(100, progress));


    return (
        <div>
            {isReportVisible && gameState.calibrationAnalysis && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 p-4" onClick={() => setIsReportVisible(false)}>
                    <div className="w-full max-w-7xl h-[95vh] relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setIsReportVisible(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white z-50 bg-black/50 rounded-full p-2">
                            <X size={24} />
                        </button>
                        <ClassifiedDossier 
                            report={gameState.calibrationAnalysis} 
                            isModal={true}
                            userName={gameState.userName}
                        />
                    </div>
                 </div>
            )}
            <DossierHeader title="GRADE & THREAT ASSESSMENT" />
            
            <Card className="mb-6 text-center">
                 <p className="text-sm font-bold text-gray-400 tracking-widest uppercase">Human Apex Threat Index (HATI)</p>
                 <p className="text-8xl font-black font-orbitron my-2" style={{color: getHatiColor(apexThreatIndex).text.split(' ')[0] === 'text-cyan-400' ? '#22d3ee' : undefined, textShadow: `0 0 25px ${getHatiColor(apexThreatIndex).shadow.split(' ').pop()}`}}>{apexThreatIndex.toFixed(1)}%</p>
                 <p className="text-3xl font-orbitron font-bold text-purple-300">Grade {rank.name}</p>
                 <p className="text-lg text-gray-400">{rank.threatLevel}</p>

                {gameState.calibrationAnalysis && (
                    <div className="mt-4">
                        <button onClick={() => setIsReportVisible(true)} className="flex items-center justify-center gap-2 mx-auto text-sm font-bold text-purple-400 hover:text-purple-300 border border-purple-500/30 px-4 py-2 rounded-full hover:bg-purple-900/20 transition-all">
                            <FileText size={16}/> View Classified Dossier
                        </button>
                    </div>
                )}
            </Card>

            <h2 className="text-3xl font-bold font-orbitron text-center my-6">Grade Progression</h2>

            <div className="relative pt-8">
                 {/* Timeline */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-700"></div>

                {RANKS.map((r, index) => {
                    const isUnlocked = index <= currentRankIndex;
                    const isNext = index === currentRankIndex + 1;
                    const Icon = isUnlocked ? CheckCircle : isNext ? Clock : Lock;
                    const color = isUnlocked ? 'text-purple-400' : isNext ? 'text-amber-400' : 'text-gray-600';

                    return (
                        <div key={r.name} className="relative flex items-center mb-8">
                            <div className={`absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center border-4 ${isUnlocked ? 'bg-purple-900 border-purple-500' : 'bg-gray-800 border-gray-600'}`}>
                                <Icon className={`w-5 h-5 ${color}`} />
                            </div>
                            
                            <div className={`w-[calc(50%-2rem)] ${index % 2 === 0 ? 'pr-4 text-right' : 'pl-4 text-left ml-auto'}`}>
                                <Card className={`w-full ${isUnlocked ? '!border-purple-500/50' : ''} ${isNext ? '!border-amber-500/50' : ''}`}>
                                     <p className={`text-2xl font-orbitron font-black ${color}`}>Grade {r.name}</p>
                                     <p className={`font-bold ${isUnlocked ? 'text-gray-300' : 'text-gray-500'}`}>{r.threatLevel}</p>
                                     <p className="text-xs text-gray-500 mt-2">Required: {RANK_PERCENTILES[r.name].min}% HATI</p>
                                </Card>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RankPage;
