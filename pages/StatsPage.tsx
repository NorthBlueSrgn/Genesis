
// pages/StatsPage.tsx
import React, { useState, useMemo } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import Loader from '../components/ui/Loader';
import Card from '../components/ui/Card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer, LineChart, XAxis, YAxis, CartesianGrid, Legend, Line, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { AttributeRankName, Stat, StatName, ResonanceSignature, Rank, StatSnapshot, ResonanceType, SubStat } from '../types';
import { Lock, Sparkles, Wand2, Map as MapIcon, Wind, Link as LinkIcon, TrendingUp, Target, ChevronDown, Activity, Percent, ChevronsUp, Trophy, UserMinus, AlertTriangle, Scaling, Calculator, Scale } from 'lucide-react';
import { RANKS, ATTRIBUTE_RANKS, SUBSTAT_RANK_THRESHOLDS } from '../constants';
import { percentileMappings, interpolate, calculateScores, convertStatsToPercentiles, getBiometricCoefficient } from '../services/scoringService';
import ResonanceWheel from '../components/ResonanceWheel';
import DossierHeader from '../components/ui/DossierHeader';

const rankColorMap: Record<AttributeRankName, string> = {
    'E': 'text-gray-400',
    'D': 'text-green-400',
    'C': 'text-blue-400',
    'B': 'text-purple-400',
    'A': 'text-indigo-400',
    'S': 'text-amber-400',
    'SS': 'text-red-500',
    [AttributeRankName.SS_PLUS]: 'text-yellow-300',
};

const statColorMap: Record<StatName, string> = {
    [StatName.Physical]: "#ef4444",
    [StatName.Vitality]: "#22c55e",
    [StatName.Intelligence]: "#3b82f6",
    [StatName.Creativity]: "#eab308",
    [StatName.Spirit]: "#14b8a6",
    [StatName.Psyche]: "#a855f7",
};

const LockedDisplay: React.FC<{ requiredRank: string }> = ({ requiredRank }) => (
    <div className="bg-black/30 p-4 rounded-lg text-center h-full flex flex-col justify-center border border-gray-700">
        <Lock className="w-8 h-8 mx-auto text-gray-500 mb-2" />
        <h3 className="font-orbitron font-bold text-gray-400">LOCKED</h3>
        <p className="text-gray-500 text-sm">Requires Rank {requiredRank}</p>
    </div>
);

const AbilityDisplay: React.FC<{ title: string, content: string, Icon: React.ElementType }> = ({ title, content, Icon }) => {
    const [name, ...descriptionParts] = content.split(':');
    const description = descriptionParts.join(':').trim();

    return (
        <div className="bg-black/30 p-4 rounded-lg h-full border border-gray-700">
            <h3 className="font-orbitron font-bold hud-text-accent mb-2 flex items-center">
                <Icon className="w-5 h-5 mr-2" /> {title}
            </h3>
            <p className="font-semibold text-white">{name}</p>
            <p className="text-gray-400 text-sm">{description}</p>
        </div>
    );
};

const ResonanceSignatureCard: React.FC<{ profile: ResonanceSignature; rank: Rank; }> = ({ profile, rank }) => {
    if (!profile.awakened) {
        return (
            <Card className="md:col-span-2 text-center !border-gray-800">
                <h2 className="text-xs font-black text-gray-500 tracking-widest uppercase mb-4">Resonance Signature</h2>
                <Sparkles className="w-16 h-16 mx-auto text-gray-800 my-4" />
                <p className="text-3xl font-orbitron font-black text-gray-800 uppercase tracking-widest">Vector_Calibrating...</p>
                <p className="text-[10px] text-gray-600 mt-4 italic max-w-sm mx-auto uppercase font-black tracking-tight">Systemic resonance vector is unstable. Current behavioral inputs are being mapped to nearest archetypes.</p>
            </Card>
        );
    }
    
    const currentRankIndex = RANKS.findIndex(r => r.name === rank.name);
    const abilityUnlocked = currentRankIndex >= RANKS.findIndex(r => r.name === 'C');
    const domainUnlocked = currentRankIndex >= RANKS.findIndex(r => r.name === 'A');

    return (
        <Card className="!border-purple-600/30">
            <h2 className="text-[10px] font-black text-purple-400 tracking-[0.4em] uppercase mb-4 text-center">Resonance Signature</h2>

            <div className="text-center mb-6">
                <p className="text-4xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400 uppercase tracking-tighter" style={{ textShadow: '0 0 15px rgba(168,85,247,0.3)' }}>
                    {profile.type}
                </p>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Tier {profile.tier} &middot; Band {profile.rankBand}</p>
            </div>
            
            <p className="text-center text-[11px] text-gray-400 italic mb-6 leading-relaxed">"{profile.description}"</p>
            
            <div className="text-left space-y-4 mb-6">
                <div className="bg-black/30 p-3 rounded-sm border border-purple-900/20">
                    <h3 className="font-orbitron font-black text-purple-400 mb-1 flex items-center text-[9px] uppercase tracking-widest"><Wind size={14} className="mr-2"/> Aura Manifestation</h3>
                    <p className="text-gray-400 text-xs font-mono uppercase tracking-tighter">{profile.auraManifestation}</p>
                </div>

                <div>
                    <h3 className="font-orbitron font-black text-gray-500 mb-2 text-[9px] uppercase tracking-widest">Core Traits</h3>
                    <div className="flex flex-wrap gap-2">
                        {profile.traits.map(trait => <span key={trait} className="px-2 py-1 text-[8px] font-black text-purple-200 bg-purple-600/10 border border-purple-500/20 rounded-sm uppercase tracking-widest">{trait}</span>)}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 text-left">
                {abilityUnlocked ? (
                    <AbilityDisplay title="Signature Ability" content={profile.signatureAbility} Icon={Wand2} />
                ) : (
                    <LockedDisplay requiredRank="C" />
                )}
            </div>
        </Card>
    );
};

const SubStatProgress: React.FC<{ subStat: SubStat; color: string }> = ({ subStat, color }) => {
    const thresholds = SUBSTAT_RANK_THRESHOLDS[subStat.name];
    const rankIndex = thresholds.findIndex(r => r.name === subStat.rank);
    const nextRank = thresholds[rankIndex + 1];

    let progress = 0;
    if (nextRank) {
        const currentThreshold = thresholds[rankIndex].threshold;
        const range = nextRank.threshold - currentThreshold;
        const valueInRange = subStat.value - currentThreshold;
        progress = range > 0 ? (valueInRange / range) * 100 : 100;
    } else {
        progress = 100;
    }
    progress = Math.max(0, Math.min(100, progress));

    return (
        <div className="text-[10px]">
            <div className="flex justify-between items-center mb-1">
                 <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-bold uppercase tracking-tight">{subStat.name}</span>
                    <span className={`font-orbitron font-black text-[9px] ${rankColorMap[subStat.rank]}`}>{subStat.rank}</span>
                </div>
                <span className="font-black text-white font-mono">{subStat.value.toLocaleString()}</span>
            </div>
            <div className="w-full bg-black/40 rounded-full h-1 border border-gray-800/40">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, backgroundColor: color }} />
            </div>
        </div>
    );
};

const AttributeCard: React.FC<{ stat: Stat }> = ({ stat }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { attributePercentiles } = calculateScores([stat]);
    const percentile = attributePercentiles[stat.name] || 0;

    return (
        <Card className="flex flex-col !bg-black/20 hover:border-purple-500/20 transition-all group">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-black font-orbitron uppercase tracking-[0.2em]" style={{color: statColorMap[stat.name]}}>{stat.name}</h3>
                    <p className={`font-orbitron font-black text-sm ${rankColorMap[stat.rank]}`}>{stat.rank} GRADE</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-black font-mono text-white tracking-tighter">{stat.value.toLocaleString()}</p>
                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Points</p>
                </div>
            </div>
            <div className="w-full bg-black/40 rounded-full h-1.5 my-4 border border-gray-800/50">
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${percentile}%`, backgroundColor: statColorMap[stat.name] }} />
            </div>

            {isExpanded && (
                <div className="mt-2 space-y-3 animate-in slide-in-from-top-2">
                     {stat.subStats.map(subStat => (
                        <SubStatProgress key={subStat.name} subStat={subStat} color={statColorMap[stat.name]} />
                    ))}
                </div>
            )}
             <button onClick={() => setIsExpanded(!isExpanded)} className="mt-4 pt-2 text-[9px] font-black uppercase text-gray-700 hover:text-white flex items-center justify-center gap-1 w-full border-t border-gray-900">
                {isExpanded ? 'Hide Detailed Vectors' : 'Show Detailed Vectors'}
                <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
        </Card>
    );
};

const GrowthVelocityChart: React.FC<{ history: StatSnapshot[] }> = ({ history }) => {
    const data = history.map(h => ({
        date: new Date(h.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
        ATI: calculateScores(Object.entries(h.stats).map(([k, v]) => ({ name: k as StatName, value: v })) as any).apexThreatIndex
    }));

    if (data.length < 2) return null;

    return (
        <Card className="!bg-black/40 border-purple-900/20">
            <h3 className="text-sm font-black font-orbitron text-purple-400 mb-6 uppercase tracking-[0.4em] flex items-center gap-2">
                <Activity size={16} /> ATI_GROWTH_VELOCITY
            </h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                        <XAxis dataKey="date" stroke="#444" fontSize={10} fontStyle="bold" />
                        <YAxis stroke="#444" fontSize={10} domain={['auto', 'auto']} />
                        <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '10px' }} />
                        <Line type="monotone" dataKey="ATI" stroke="#a855f7" strokeWidth={3} dot={{ fill: '#a855f7', r: 4 }} activeDot={{ r: 6, stroke: '#fff' }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

const StatsPage: React.FC = () => {
    const { gameState, isLoading } = useGameState();
    const [activeTab, setActiveTab] = useState('overview');

    if (isLoading || !gameState) return <Loader text="Loading Biometric Data..." />;

    const { stats, resonanceSignature, rank, statHistory, forsaken, resonanceVector } = gameState;

    const chartData = useMemo(() => {
        const userPercentiles = convertStatsToPercentiles(stats);
        const forsakenPercentiles = convertStatsToPercentiles(forsaken.stats.map(s => ({...s, rank: AttributeRankName.E, subStats: [], lastIncreased: ''})));
        return Object.values(StatName).map(statName => ({ subject: statName, User: userPercentiles[statName] || 0, Forsaken: forsakenPercentiles[statName] || 0 }));
    }, [stats, forsaken.stats]);

    return (
        <div>
            <DossierHeader title="BIOMETRIC ANALYSIS" />
            
             <div className="flex justify-center border-b border-gray-800 mb-10 bg-black/10">
                <button onClick={() => setActiveTab('overview')} className={`px-8 py-4 font-orbitron font-black text-[10px] tracking-[0.3em] uppercase transition-colors ${activeTab === 'overview' ? 'text-white border-b-2 border-purple-500 bg-purple-900/5' : 'text-gray-600'}`}>OVERVIEW</button>
                <button onClick={() => setActiveTab('resonance')} className={`px-8 py-4 font-orbitron font-black text-[10px] tracking-[0.3em] uppercase transition-colors ${activeTab === 'resonance' ? 'text-white border-b-2 border-purple-500 bg-purple-900/5' : 'text-gray-600'}`}>RESONANCE</button>
                <button onClick={() => setActiveTab('analytics')} className={`px-8 py-4 font-orbitron font-black text-[10px] tracking-[0.3em] uppercase transition-colors ${activeTab === 'analytics' ? 'text-white border-b-2 border-purple-500 bg-purple-900/5' : 'text-gray-600'}`}>ANALYTICS</button>
            </div>

            {activeTab === 'overview' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <Card className="!bg-black/60 border-purple-900/30">
                        <h2 className="text-[10px] font-black text-gray-500 tracking-[0.4em] uppercase mb-8 text-center">Global Percentile Projection</h2>
                         <div style={{ width: '100%', height: 350 }}>
                            <ResponsiveContainer>
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                    <PolarGrid stroke="#30363d" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#444', fontSize: 10, fontWeight: 900 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#222' }} hide />
                                    <Radar name="Operative" dataKey="User" stroke="#a855f7" fill="#a855f7" fillOpacity={0.4} strokeWidth={3}/>
                                    <Radar name="Forsaken" dataKey="Forsaken" stroke="#f87171" fill="#f87171" fillOpacity={0.2} strokeWidth={1} strokeDasharray="5 5"/>
                                    <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }}/>
                                    <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '20px' }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stats.map(stat => <AttributeCard key={stat.name} stat={stat} />)}
                    </div>
                </div>
            )}

            {activeTab === 'resonance' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in-95">
                    <ResonanceSignatureCard profile={resonanceSignature} rank={rank} />
                    <Card className="!bg-black/40 border-purple-900/20">
                         <h2 className="text-[10px] font-black text-gray-500 tracking-[0.4em] uppercase mb-4 text-center">Resonance Wheel Projection</h2>
                         <div className="flex justify-center scale-90 md:scale-100">
                            <ResonanceWheel userResonance={resonanceSignature.type} resonanceVector={resonanceVector} />
                         </div>
                    </Card>
                </div>
            )}
            
            {activeTab === 'analytics' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4">
                    <GrowthVelocityChart history={statHistory} />
                    {/* Additional analytics would go here */}
                </div>
            )}
        </div>
    );
};

export default StatsPage;
