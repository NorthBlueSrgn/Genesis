import React, { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import { Lock, FileText, Shield, Zap, Activity } from 'lucide-react';
import { marked } from 'marked';
import { useGameState } from '../contexts/GameStateContext';
import { RANKS } from '../constants';
import { CodexEntry } from '../types';
import Loader from '../components/ui/Loader';


const LogEntry: React.FC<{ entry: CodexEntry }> = ({ entry }) => {
    return (
        <div className="codex-log-entry">
            <div className="codex-log-header">
                <span>&gt; AUTHOR: {entry.author || 'UNKNOWN'}</span>
                <span>&gt; DATE: {entry.date || 'CLASSIFIED'}</span>
                <span>&gt; TYPE: {entry.type || 'STANDARD'}</span>
            </div>
            <div 
                className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-purple-300 prose-strong:text-white prose-blockquote:border-l-purple-500 font-sans"
                dangerouslySetInnerHTML={{ __html: marked.parse(entry.content) as string }} 
            />
        </div>
    );
}

const GuidePage: React.FC = () => {
  const { gameState, isLoading } = useGameState();
  const [activeCategoryId, setActiveCategoryId] = useState(gameState?.codex[0]?.id || 'core-protocols');

  const activeCategory = useMemo(() => {
    return gameState?.codex.find(c => c.id === activeCategoryId);
  }, [activeCategoryId, gameState?.codex]);

  if (isLoading || !gameState) {
    return <Loader text="Accessing Codex Archives..." />;
  }
  
  const userRankIndex = RANKS.findIndex(r => r.name === gameState.rank.name);

  // Derived Genesis Protocol overview stats
  const allTasks = gameState.paths.flatMap(p => p.tasks.map(t => ({ ...t, pathName: p.name })));
  const bedrock = allTasks.filter(t => t.isNonNegotiable);
  const bedrockSecured = bedrock.filter(t => t.isCompleted).length;
  const bedrockTotal = bedrock.length;
  const weekly = allTasks.filter(t => t.type === 'Weekly');
  const weeklyBehind = weekly.filter(t => t.targetCount && (t.currentCount || 0) < t.targetCount).length;

  // Fallback if activeCategoryId is stale after a state change
  if (!activeCategory && gameState.codex.length > 0) {
      setActiveCategoryId(gameState.codex[0].id);
      return <Loader text="Recalibrating Codex..." />;
  }

  return (
    <div className="relative min-h-screen bg-[#050509] text-white">
      <div className="absolute inset-0 blueprint-dot pointer-events-none opacity-20" />
      <div className="relative z-10 space-y-6 md:space-y-8">
        <div className="text-center pt-4 md:pt-6 mb-2 md:mb-4">
          <h1 className="text-3xl md:text-4xl font-bold font-orbitron tracking-tight">Protocol Codex</h1>
          <p className="mt-1 text-[10px] md:text-xs text-gray-400 tracking-[0.35em] uppercase">
            Central database of protocol mechanics and world intel.
          </p>
        </div>

        {/* Genesis Protocol Overview strip */}
        <div className="px-3 md:px-0">
          <Card className="!bg-black/90 border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.35)] rounded-md">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6">
              <div className="space-y-1.5 md:space-y-2 flex-1 min-w-0">
                <p className="text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-purple-300 font-black flex items-center gap-2">
                  <Shield size={14} className="text-purple-300" /> Genesis_Protocol_Overview
                </p>
                <p className="text-[11px] md:text-sm text-gray-300 leading-relaxed">
                  Bedrock protocols are your non-negotiable identity floor. Evolution vectors are the hobbies and systems that compound on top. The Codex explains why the floor comes first, how load is managed, and when to scale.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5 mt-1 md:mt-0">
                <div className="px-3 py-2 rounded-md border border-emerald-500/40 bg-emerald-900/15 min-w-[120px]">
                  <p className="text-[8px] text-emerald-300 uppercase tracking-[0.3em] font-mono">Bedrock</p>
                  <p className="text-sm md:text-base font-black font-orbitron text-emerald-100">
                    {bedrockSecured}/{bedrockTotal}
                  </p>
                  <p className="text-[8px] text-gray-500 mt-0.5 uppercase tracking-[0.22em]">Secured</p>
                </div>
                <div className="px-3 py-2 rounded-md border border-cyan-500/40 bg-cyan-900/10 min-w-[120px]">
                  <p className="text-[8px] text-cyan-300 uppercase tracking-[0.3em] font-mono flex items-center gap-1">
                    <Zap size={11} /> Vectors
                  </p>
                  <p className="text-sm md:text-base font-black font-orbitron text-cyan-100">
                    {weeklyBehind}
                  </p>
                  <p className="text-[8px] text-gray-500 mt-0.5 uppercase tracking-[0.22em]">Weeklies Behind</p>
                </div>
                <div className="px-3 py-2 rounded-md border border-purple-500/40 bg-purple-900/15 min-w-[120px]">
                  <p className="text-[8px] text-purple-200 uppercase tracking-[0.3em] font-mono flex items-center gap-1">
                    <Activity size={11} /> Rank
                  </p>
                  <p className="text-sm md:text-base font-black font-orbitron text-purple-100">
                    {gameState.rank.name}
                  </p>
                  <p className="text-[8px] text-gray-500 mt-0.5 uppercase tracking-[0.22em]">Operating Tier</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="px-3 md:px-0 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 pb-6">
          {/* Navigation Sidebar */}
          <nav className="md:col-span-1 md:sticky top-4 self-start">
            <Card className="p-2 md:p-3 !bg-black/90 border-gray-800/80">
              <div className="space-y-1">
                {gameState.codex.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategoryId(category.id)}
                    className={`w-full text-left p-2.5 md:p-3 rounded-md transition-all duration-200 flex items-start gap-3 ${
                      activeCategoryId === category.id
                        ? 'bg-purple-600/30 border border-purple-400/60 shadow-[0_0_18px_rgba(168,85,247,0.35)]'
                        : 'hover:bg-gray-800/60 border border-transparent'
                    }`}
                  >
                    <FileText className={`w-5 h-5 mt-1 flex-shrink-0 ${activeCategoryId === category.id ? 'text-purple-300' : 'text-gray-400'}`} />
                    <div>
                      <h3 className={`font-bold text-[13px] md:text-sm ${activeCategoryId === category.id ? 'text-white' : 'text-gray-300'}`}>{category.title}</h3>
                      <p className="text-[10px] md:text-xs text-gray-500 leading-snug">{category.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </nav>

          {/* Content Area */}
          <main className="md:col-span-2">
            <div className="codex-terminal-bg p-3 md:p-6 rounded-lg border border-purple-500/40 bg-black/95">
              <div className="flex justify-between items-center mb-3 md:mb-4 border-b-2 border-purple-500/50 pb-2">
                <h2 className="text-xl md:text-2xl font-orbitron font-bold text-purple-300 tracking-[0.3em] md:tracking-[0.4em] uppercase">
                  {activeCategory?.title || 'Codex Entry'}
                </h2>
                <div className="w-3 h-3 md:w-4 md:h-4 bg-purple-300 rounded-full animate-pulse" />
              </div>
              
              <div className="codex-terminal-content max-h-[65vh] overflow-y-auto pr-1.5 md:pr-2 custom-scrollbar">
                {activeCategory?.entries.map(entry => {
                  const requiredRankIndex = entry.requiredRank ? RANKS.findIndex(r => r.name === entry.requiredRank) : -1;
                  
                  if (!entry.requiredRank || userRankIndex >= requiredRankIndex) {
                    return (
                      <div key={entry.id} className="mb-6">
                        <h3 className="text-lg md:text-xl font-orbitron text-purple-200 mb-2">&gt; {entry.title}</h3>
                        {entry.type ? (
                          <LogEntry entry={entry} />
                        ) : (
                          <div 
                            className="prose prose-invert max-w-none prose-p:text-gray-300 prose-strong:text-white prose-blockquote:border-l-purple-500 font-sans"
                            dangerouslySetInnerHTML={{ __html: marked.parse(entry.content) as string }} 
                          />
                        )}
                      </div>
                    );
                  }
                  
                  return (
                    <div key={entry.id} className="mb-6 opacity-60">
                      <h3 className="text-lg md:text-xl font-orbitron text-gray-500 mb-2 flex items-center gap-2">
                        <Lock size={18} /> {entry.title}
                      </h3>
                      <div className="border border-dashed border-gray-700 rounded-md p-4 text-center text-gray-600">
                        <p>Insufficient Rank. Requires Rank: {entry.requiredRank}</p>
                        <p className="text-xs">Continue your progression to unlock this data.</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default GuidePage;