import React, { useState, useMemo, useEffect } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import Loader from '../components/ui/Loader';
import Card from '../components/ui/Card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer, LineChart, XAxis, YAxis, CartesianGrid, Legend, Line, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { AttributeRankName, Stat, StatName, ResonanceSignature, Rank, StatSnapshot, ResonanceType, SubStat, ResonanceVector } from '../types';
import { Lock, Sparkles, Wand2, Map as MapIcon, Wind, Link as LinkIcon, Calendar, TrendingUp, Swords, Target, BookOpen, Gem, ChevronDown, Activity, Percent, ChevronsUp, BarChart2, Zap, Trophy, UserMinus, AlertTriangle, Scaling, Calculator } from 'lucide-react';
import { RANKS, ATTRIBUTE_RANKS, SUBSTAT_RANK_THRESHOLDS } from '../constants';
import { percentileMappings, interpolate, calculateScores, convertStatsToPercentiles } from '../services/scoringService';
import ResonanceWheel from '../components/ResonanceWheel';
import DossierHeader from '../components/ui/DossierHeader';

type TimePeriod = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';

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

const rankHexColorMap: Record<AttributeRankName, string> = {
    'E': '#9ca3af', 'D': '#4ade80', 'C': '#60a5fa', 'B': '#c084fc',
    'A': '#818cf8', 'S': '#facc15', 'SS': '#f87171', 
    [AttributeRankName.SS_PLUS]: '#fde047',
};

const statColorMap: Record<StatName, string> = {
    [StatName.Physical]: "#ef4444", // red-500
    [StatName.Vitality]: "#22c55e", // green-500
    [StatName.Intelligence]: "#3b82f6", // blue-500
    [StatName.Creativity]: "#eab308", // yellow-500
    [StatName.Spirit]: "#14b8a6", // teal-500
    [StatName.Psyche]: "#a855f7", // purple-500
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
            <Card className="md:col-span-2 text-center">
                <h2 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4">Resonance Signature</h2>
                <Sparkles className="w-16 h-16 mx-auto text-gray-600 my-4" />
                <p className="text-4xl font-orbitron font-black text-gray-700">Calibrating...</p>
                <p className="text-gray-500 mt-4 italic max-w-md mx-auto">Your resonance vector is currently unstable. Interactions over the next 6 weeks will determine your true profile.</p>
            </Card>
        );
    }
    
    const currentRankIndex = RANKS.findIndex(r => r.name === rank.name);
    const abilityUnlocked = currentRankIndex >= RANKS.findIndex(r => r.name === 'C');
    const domainUnlocked = currentRankIndex >= RANKS.findIndex(r => r.name === 'A');

    return (
        <Card className="!border-purple-600/50">
            <h2 className="text-sm font-bold text-purple-300 tracking-widest uppercase mb-4 text-center">Resonance Signature</h2>

            <div className="text-center mb-6">
                <p className="text-4xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400" style={{ textShadow: '0 0 12px rgba(168, 85, 247, 0.4)' }}>
                    {profile.type}
                </p>
                <p className="font-bold text-gray-400">Tier {profile.tier} &middot; Rank Band {profile.rankBand}</p>
            </div>
            
            <p className="text-center text-gray-300 italic mb-4">{profile.description}</p>
            
            <div className="text-left space-y-4 mb-6">
                <div className="bg-black/30 p-3 rounded-lg border border-gray-700">
                    <h3 className="font-orbitron font-bold hud-text-accent mb-2 flex items-center text-sm"><Wind size={16} className="mr-2"/> Aura Manifestation</h3>
                    <p className="text-gray-400 text-sm">{profile.auraManifestation}</p>
                </div>

                <div>
                    <h3 className="font-orbitron font-bold text-gray-300 mb-2 text-sm">Core Traits</h3>
                    <div className="flex flex-wrap gap-2">
                        {profile.traits.map(trait => <span key={trait} className="px-3 py-1 text-xs font-semibold text-purple-200 bg-purple-600/30 border border-purple-500/50 rounded-full">{trait}</span>)}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-6">
                {abilityUnlocked ? (
                    <AbilityDisplay title="Signature Ability" content={profile.signatureAbility} Icon={Wand2} />
                ) : (
                    <LockedDisplay requiredRank="C" />
                )}
                 {domainUnlocked ? (
                    <AbilityDisplay title="Domain" content={profile.domain} Icon={MapIcon} />
                ) : (
                    <LockedDisplay requiredRank="A" />
                )}
            </div>

            <div className="bg-black/30 p-3 rounded-lg text-left border border-gray-700">
                <h3 className="font-orbitron font-bold text-green-300 mb-2 flex items-center text-sm"><LinkIcon size={16} className="mr-2"/> Attribute Affinities</h3>
                 <div className="flex flex-wrap gap-2 mb-2">
                    {profile.statAffinities.map(stat => <span key={stat} className="px-3 py-1 text-xs font-semibold text-green-200 bg-green-600/30 border border-green-500/50 rounded-full">{stat}</span>)}
                </div>
                <p className="text-gray-400 text-xs italic">Tasks boosting these attributes receive a 10% bonus to their gains.</p>
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
        <div className="text-sm">
            <div className="flex justify-between items-center mb-1">
                 <div className="flex items-center gap-2">
                    <span className="text-gray-300">{subStat.name}</span>
                    <span className={`font-orbitron font-bold text-xs ${rankColorMap[subStat.rank]}`}>{subStat.rank}</span>
                </div>
                <span className="font-semibold text-white text-xs">{subStat.value.toLocaleString()}</span>
            </div>
            <div className="w-full bg-black/30 rounded-full h-1.5 border border-gray-800 p-px">
                <div
                    className="h-full rounded-full"
                    style={{
                        width: `${progress}%`,
                        backgroundColor: color,
                        opacity: 0.7,
                        transition: 'width 0.5s ease-in-out',
                    }}
                ></div>
            </div>
        </div>
    );
};

const AttributeCard: React.FC<{ stat: Stat }> = ({ stat }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const { attributePercentiles } = calculateScores([stat]);
    const percentile = attributePercentiles[stat.name] || 0;

    return (
        <Card className="flex flex-col">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-orbitron font-bold" style={{color: statColorMap[stat.name]}}>{stat.name}</h3>
                    <p className={`font-orbitron font-bold text-lg ${rankColorMap[stat.rank]}`}>{stat.rank}</p>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-orbitron font-black text-white">{stat.value.toLocaleString()}</p>
                    <p className="text-sm text-gray-400">Score</p>
                </div>
            </div>
            <div className="w-full bg-black/30 rounded-full h-2.5 my-3 border border-gray-700 p-0.5">
                <div 
                    className="h-full rounded-full" 
                    style={{ 
                        width: `${percentile}%`,
                        backgroundColor: statColorMap[stat.name],
                        boxShadow: `0 0 8px ${statColorMap[stat.name]}`,
                        transition: 'width 0.5s ease-in-out'
                    }}
                ></div>
            </div>

            {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-700/50 space-y-4">
                     {stat.subStats.map(subStat => (
                        <SubStatProgress key={subStat.name} subStat={subStat} color={statColorMap[stat.name]} />
                    ))}
                </div>
            )}
             <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-auto pt-2 text-sm text-gray-500 hover:text-white flex items-center justify-center gap-1 w-full"
            >
                {isExpanded ? 'Collapse' : 'Show Sub-Stats'}
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
        </Card>
    );
};


const AnalyticsMiniStat: React.FC<{ label: string; value: string | number; Icon: React.ElementType; colorClass: string; }> = ({ label, value, Icon, colorClass }) => (
    <div className="bg-black/30 p-3 rounded-lg border border-gray-700 text-center flex flex-col justify-between">
        <Icon className={`w-6 h-6 mx-auto mb-1 ${colorClass}`} />
        <div>
            <p className={`text-xl font-orbitron font-bold ${colorClass}`}>{value}</p>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{label}</p>
        </div>
    </div>
);

const AdvancedAnalyticsCard: React.FC<{ stats: Stat[], history: StatSnapshot[], forsakenStats: { name: StatName, value: number }[] }> = ({ stats, history, forsakenStats }) => {
    if (history.length < 2) {
        return (
            <Card>
                 <h2 className="text-2xl font-bold font-orbitron hud-text-accent mb-4">Advanced Analytics</h2>
                 <p className="text-center text-gray-500">Insufficient data. Complete more days to unlock advanced analytics.</p>
            </Card>
        );
    }
    
    // --- CALCULATIONS ---
    const totalDays = history.length;
    const firstDayStats = history[0].stats;
    const lastDayStats = history[totalDays - 1].stats;
    
    // Cast StatName values to ensure type safety in iterations
    const statNames = Object.values(StatName) as StatName[];

    const totalGain = statNames.reduce<number>((sum, stat) => sum + ((lastDayStats[stat] || 0) - (firstDayStats[stat] || 0)), 0);
    const statVelocity = totalGain > 0 && totalDays > 0 ? (totalGain / totalDays) : 0;

    const last7DaysHistory = history.slice(-8);
    let recentGain = 0;
    if (last7DaysHistory.length > 1) {
        const recentStartStats = last7DaysHistory[0].stats;
        const recentEndStats = last7DaysHistory[last7DaysHistory.length - 1].stats;
        recentGain = statNames.reduce<number>((sum, stat) => sum + ((recentEndStats[stat] || 0) - (recentStartStats[stat] || 0)), 0);
    }
    const recentVelocity = recentGain > 0 && last7DaysHistory.length > 1 ? recentGain / (last7DaysHistory.length - 1) : 0;
    const momentum = statVelocity > 0 ? ((recentVelocity - statVelocity) / statVelocity) * 100 : 0;
    
    const statGains = statNames.map(stat => ({
        name: stat,
        value: (lastDayStats[stat] || 0) - (firstDayStats[stat] || 0)
    }));
    const mostTrainedStat = [...statGains].sort((a,b) => b.value - a.value)[0];
    const mostNeglectedStat = [...statGains].sort((a,b) => a.value - b.value)[0];
    
    const primaryStatDetails = stats.find(s => s.name === mostTrainedStat.name);
    const specializationData = primaryStatDetails?.subStats.map(ss => ({ name: ss.name, value: ss.value })) || [];

    const totalUserPoints = stats.reduce((sum, s) => sum + s.value, 0);
    const totalForsakenPoints = forsakenStats.reduce((sum, s) => sum + s.value, 0);
    const forsakenGap = Math.round(totalForsakenPoints - totalUserPoints);

    const values: number[] = stats.map(s => s.value);
    const mean = values.reduce((a, b) => a + b, 0) / (values.length || 1);
    const stdDev = Math.sqrt(values.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / (values.length || 1));
    const specializationIndex = mean > 0 ? (stdDev / mean) * 100 : 0;

    const peakStat = [...stats].sort((a,b) => b.value - a.value)[0];
    const daysActive = new Set(history.map(h => h.date.split('T')[0])).size || 1;
    const growthEfficiency = totalGain / daysActive;
    const statValues = stats.map(s => s.value).filter(v => v > 0);
    const balanceRatio = statValues.length > 1 && Math.min(...statValues) > 0 ? Math.max(...statValues) / Math.min(...statValues) : Infinity;

    return (
        <Card>
            <h2 className="text-2xl font-bold font-orbitron hud-text-accent mb-4">Advanced Analytics</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
                <AnalyticsMiniStat label="Stat Velocity" value={statVelocity.toFixed(1)} Icon={Activity} colorClass="text-purple-400" />
                <AnalyticsMiniStat label="Growth Momentum" value={`${momentum >= 0 ? '+' : ''}${momentum.toFixed(0)}%`} Icon={Zap} colorClass={momentum >= 0 ? 'text-green-400' : 'text-red-400'} />
                <AnalyticsMiniStat label="Growth Efficiency" value={growthEfficiency.toFixed(1)} Icon={ChevronsUp} colorClass="text-purple-400" />
                <AnalyticsMiniStat label="Primary Focus" value={mostTrainedStat.name} Icon={TrendingUp} colorClass="text-cyan-400" />
                <AnalyticsMiniStat label="Most Neglected" value={mostNeglectedStat.name} Icon={AlertTriangle} colorClass="text-orange-400" />
                <AnalyticsMiniStat label="Peak Stat" value={peakStat.name} Icon={Trophy} colorClass="text-yellow-400" />
                <AnalyticsMiniStat label="Forsaken Gap" value={forsakenGap.toLocaleString()} Icon={UserMinus} colorClass="text-red-400" />
                <AnalyticsMiniStat label="Specialization" value={`${specializationIndex.toFixed(0)}%`} Icon={Percent} colorClass="text-cyan-400" />
                <AnalyticsMiniStat label="Balance Ratio" value={isFinite(balanceRatio) ? `${balanceRatio.toFixed(2)}:1` : 'N/A'} Icon={Scaling} colorClass="text-white" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-bold font-orbitron text-gray-300 mb-2 flex items-center gap-2"><TrendingUp /> Growth by Attribute</h3>
                    <div style={{width: '100%', height: 200}}>
                         <ResponsiveContainer>
                            <BarChart data={statGains} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" width={80} stroke="#a0aec0" fontSize={12}/>
                                <Tooltip contentStyle={{ backgroundColor: '#010409', borderColor: '#30363d' }}/>
                                <Bar dataKey="value" fill="#8884d8">
                                     {statGains.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={statColorMap[entry.name as StatName]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div>
                     <h3 className="text-lg font-bold font-orbitron text-gray-300 mb-2 flex items-center gap-2"><Target /> Primary Focus Breakdown</h3>
                     <div style={{width: '100%', height: 200}}>
                         <ResponsiveContainer>
                            <PieChart>
                                <Pie data={specializationData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                     {specializationData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={statColorMap[primaryStatDetails!.name]} opacity={1 - (index * 0.1)} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#010409', borderColor: '#30363d' }}/>
                            </PieChart>
                        </ResponsiveContainer>
                     </div>
                </div>
            </div>
        </Card>
    );
};

const PerformanceCalculator: React.FC = () => {
    const [category, setCategory] = useState(Object.keys(percentileMappings)[0]);
    const [metric, setMetric] = useState(Object.keys(percentileMappings[Object.keys(percentileMappings)[0]])[0]);
    const [value, setValue] = useState('');
    const [result, setResult] = useState<number | null>(null);

    const metricsForCategory = useMemo(() => {
        return Object.keys(percentileMappings[category]);
    }, [category]);

    useEffect(() => {
        setMetric(metricsForCategory[0]);
        setValue('');
        setResult(null);
    }, [category, metricsForCategory]);
    
    useEffect(() => {
        if (value === '') {
            setResult(null);
            return;
        }
        const numericValue = parseFloat(value);
        if (isNaN(numericValue)) {
            setResult(null);
            return;
        }
        
        const mapping = percentileMappings[category][metric];
        if (Array.isArray(mapping)) {
            const percentile = interpolate(numericValue, mapping);
            setResult(percentile);
        }

    }, [value, metric, category]);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(e.target.value);
    };
    
    const handleMetricChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMetric(e.target.value);
        setValue('');
        setResult(null);
    };

    return (
        <Card>
            <h2 className="text-2xl font-bold font-orbitron hud-text-accent mb-4 flex items-center gap-2"><Calculator /> Performance Calculator</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-1">Category</label>
                    <select value={category} onChange={handleCategoryChange} className="w-full bg-gray-800/50 border border-gray-700 rounded-md p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500">
                        {Object.keys(percentileMappings).map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-1">Metric</label>
                    <select value={metric} onChange={handleMetricChange} className="w-full bg-gray-800/50 border border-gray-700 rounded-md p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500">
                         {metricsForCategory.map(met => <option key={met} value={met}>{met}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-400 mb-1">Value</label>
                    <input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="Enter value..." className="w-full bg-gray-800/50 border border-gray-700 rounded-md p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
            </div>
            {result !== null && (
                <div className="mt-4 text-center bg-gray-900/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Calculated Percentile</p>
                    <p className="text-4xl font-black font-orbitron text-purple-300">{result.toFixed(1)}%</p>
                </div>
            )}
        </Card>
    );
};


const StatsPage: React.FC = () => {
    const { gameState, isLoading } = useGameState();
    const [activeTab, setActiveTab] = useState('overview');

    if (isLoading || !gameState) {
        return <Loader text="Loading Biometric Data..." />;
    }

    const { stats, resonanceSignature, rank, statHistory, forsaken, resonanceVector } = gameState;

    const chartData = useMemo(() => {
        const userPercentiles = convertStatsToPercentiles(stats);
        const forsakenPercentiles = convertStatsToPercentiles(forsaken.stats.map(s => ({...s, rank: AttributeRankName.E, subStats: [], lastIncreased: ''})));

        return Object.values(StatName).map(statName => ({
            subject: statName,
            User: userPercentiles[statName] || 0,
            Forsaken: forsakenPercentiles[statName] || 0,
        }));
    }, [stats, forsaken.stats]);

    return (
        <div>
            <DossierHeader title="BIOMETRIC ANALYSIS" />
            
             <div className="flex justify-center border-b-2 border-gray-800 mb-6">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-6 py-3 font-orbitron font-bold text-lg transition-colors ${activeTab === 'overview' ? 'text-white border-b-2 border-purple-500' : 'text-gray-500 hover:text-white'}`}
                >
                    Overview
                </button>
                 <button
                    onClick={() => setActiveTab('resonance')}
                    className={`px-6 py-3 font-orbitron font-bold text-lg transition-colors ${activeTab === 'resonance' ? 'text-white border-b-2 border-purple-500' : 'text-gray-500 hover:text-white'}`}
                >
                    Resonance
                </button>
                 <button
                    onClick={() => setActiveTab('analytics')}
                    className={`px-6 py-3 font-orbitron font-bold text-lg transition-colors ${activeTab === 'analytics' ? 'text-white border-b-2 border-purple-500' : 'text-gray-500 hover:text-white'}`}
                >
                    Analytics
                </button>
            </div>

            {activeTab === 'overview' && (
                <div className="space-y-6">
                    <Card>
                        <h2 className="text-2xl font-bold font-orbitron hud-text-accent mb-4">Attribute Snapshot vs. Forsaken (Percentile)</h2>
                         <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                    <PolarGrid stroke="#30363d" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#a0aec0', fontSize: 12 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#7d8590' }} />
                                    <Radar name="Operative" dataKey="User" stroke="#a855f7" fill="#a855f7" fillOpacity={0.6} strokeWidth={2}/>
                                    <Radar name="Forsaken" dataKey="Forsaken" stroke="#f87171" fill="#f87171" fillOpacity={0.4} strokeWidth={2}/>
                                    <Tooltip contentStyle={{ backgroundColor: '#010409', borderColor: '#30363d' }}/>
                                    <Legend wrapperStyle={{fontSize: "14px"}}/>
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stats.map(stat => (
                            <AttributeCard key={stat.name} stat={stat} />
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'resonance' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ResonanceSignatureCard profile={resonanceSignature} rank={rank} />
                    <Card>
                         <h2 className="text-2xl font-bold font-orbitron hud-text-accent mb-4 text-center">Resonance Wheel</h2>
                         <div className="flex justify-center">
                            <ResonanceWheel userResonance={resonanceSignature.type} resonanceVector={resonanceVector} />
                         </div>
                    </Card>
                </div>
            )}
            
            {activeTab === 'analytics' && (
                <div className="space-y-6">
                    <AdvancedAnalyticsCard stats={stats} history={statHistory} forsakenStats={forsaken.stats} />
                    <PerformanceCalculator />
                </div>
            )}

        </div>
    );
};

export default StatsPage;