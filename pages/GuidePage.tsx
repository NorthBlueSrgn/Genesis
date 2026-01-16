import React, { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import { Lock, FileText } from 'lucide-react';
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

  // Fallback if activeCategoryId is stale after a state change
  if (!activeCategory && gameState.codex.length > 0) {
      setActiveCategoryId(gameState.codex[0].id);
      return <Loader text="Recalibrating Codex..." />;
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold font-orbitron">Protocol Codex</h1>
        <p className="hud-text-accent">Central database of protocol mechanics and world intel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Navigation Sidebar */}
        <nav className="md:col-span-1 md:sticky top-4 self-start">
            <Card className="p-2">
                 <div className="space-y-1">
                    {gameState.codex.map(category => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategoryId(category.id)}
                        className={`w-full text-left p-3 rounded-md transition-all duration-200 flex items-start gap-3 ${
                          activeCategoryId === category.id
                            ? 'bg-purple-600/30'
                            : 'hover:bg-gray-700/50'
                        }`}
                      >
                        <FileText className={`w-5 h-5 mt-1 flex-shrink-0 ${activeCategoryId === category.id ? 'text-purple-300' : 'text-gray-400'}`} />
                        <div>
                           <h3 className={`font-bold ${activeCategoryId === category.id ? 'text-white' : 'text-gray-300'}`}>{category.title}</h3>
                           <p className="text-xs text-gray-500">{category.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
            </Card>
        </nav>

        {/* Content Area */}
        <main className="md:col-span-2">
            <div className="codex-terminal-bg p-4 md:p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4 border-b-2 border-purple-500/50 pb-2">
                    <h2 className="text-2xl font-orbitron font-bold text-purple-300 tracking-widest">
                        {activeCategory?.title || 'Codex Entry'}
                    </h2>
                    <div className="w-4 h-4 bg-purple-300 rounded-full animate-pulse"></div>
                </div>
                
                <div className="codex-terminal-content max-h-[65vh] overflow-y-auto pr-2">
                    {activeCategory?.entries.map(entry => {
                        const requiredRankIndex = entry.requiredRank ? RANKS.findIndex(r => r.name === entry.requiredRank) : -1;
                        
                        if (!entry.requiredRank || userRankIndex >= requiredRankIndex) {
                             return (
                                <div key={entry.id} className="mb-6">
                                    <h3 className="text-xl font-orbitron text-purple-200 mb-2">&gt; {entry.title}</h3>
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
                             <div key={entry.id} className="mb-6 opacity-50">
                                <h3 className="text-xl font-orbitron text-gray-500 mb-2 flex items-center gap-2">
                                    <Lock size={18} /> {entry.title}
                                </h3>
                                <div className="border border-dashed border-gray-700 rounded-md p-4 text-center text-gray-600">
                                    <p>Insufficient Rank. Requires Rank: {entry.requiredRank}</p>
                                    <p className="text-xs">Continue your progression to unlock this data.</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </main>
      </div>
    </div>
  );
};

export default GuidePage;