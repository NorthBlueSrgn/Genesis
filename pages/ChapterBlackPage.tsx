import React, { useState, useMemo } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import Loader from '../components/ui/Loader';
import Card from '../components/ui/Card';
import { BookOpen, Lock, CheckCircle, ChevronRight, ChevronDown } from 'lucide-react';
import { LoreEntry } from '../types';

const CollapsibleEntry: React.FC<{ entry: LoreEntry, children: React.ReactNode }> = ({ entry, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-gray-800/50 rounded-lg">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between text-left p-3">
                <h3 className="text-lg font-orbitron font-bold text-gray-300 flex-grow pr-4">
                   <span className="text-purple-400/80 mr-2">Entry {entry.chapterNumber}:</span>{entry.title}
                </h3>
                 <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-4 border-t border-gray-700">
                    {children}
                </div>
            )}
        </div>
    );
}

const PastChapter: React.FC<{ entry: LoreEntry }> = ({ entry }) => {
    return (
        <CollapsibleEntry entry={entry}>
            <p className="text-gray-300 text-base whitespace-pre-wrap">{entry.content}</p>
            {entry.userChoice && (
                <div className="mt-4 pt-3 border-t border-gray-700/50">
                    <p className="text-sm font-semibold text-gray-400">Your Decision:</p>
                    <p className="italic text-purple-300">"{entry.userChoice}"</p>
                </div>
            )}
        </CollapsibleEntry>
    );
};

const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="collapsible-section">
            <button onClick={() => setIsOpen(!isOpen)} className="collapsible-header">
                <h3 className="text-2xl font-orbitron font-bold text-gray-400">{title}</h3>
                <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="collapsible-content">
                    {children}
                </div>
            )}
        </div>
    );
};


const ChapterBlackPage: React.FC = () => {
    const { gameState, isLoading, generateAndRecordChapter, makeStoryChoice } = useGameState();
    const [isChronicling, setIsChronicling] = useState(false);
    
    const groupedLore = useMemo(() => {
        if (!gameState) return {};
        // Sort lore ascending by chapter number first
        const sortedLore = [...(gameState.lore || [])].sort((a, b) => a.chapterNumber - b.chapterNumber);
        
        return sortedLore.reduce((acc, entry) => {
            const arcStart = Math.floor((entry.chapterNumber - 1) / 10) * 10 + 1;
            const arcEnd = arcStart + 9;
            const arcKey = `Volume: Entries ${arcStart}-${arcEnd}`;
            if (!acc[arcKey]) {
                acc[arcKey] = [];
            }
            acc[arcKey].push(entry);
            return acc;
        }, {} as Record<string, LoreEntry[]>);
    }, [gameState?.lore]);

    if (isLoading || !gameState) {
        return <Loader text="Accessing Chapter Black..." />;
    }
    
    const handleBeginChapter = async () => {
        setIsChronicling(true);
        try {
            await generateAndRecordChapter();
        } catch (error) {
            console.error("Failed to generate chapter:", error);
        } finally {
            setIsChronicling(false);
        }
    };
    
    const handleChoice = (choice: string) => {
        if (latestChapter) {
            makeStoryChoice(latestChapter.id, choice);
        }
    };

    const { chapterBlack, lore } = gameState;
    const { isUnlockedToday, dailyTaskCompletionPercentage } = chapterBlack;
    const canUnlock: boolean = dailyTaskCompletionPercentage >= 80;
    
    const latestChapter = lore.length > 0 ? [...lore].sort((a,b) => b.chapterNumber - a.chapterNumber)[0] : null;
    const needsChoice: boolean = !!(latestChapter && latestChapter.choices && latestChapter.choices.length > 0 && !latestChapter.userChoice);

    const renderDailyChronicle = () => {
        if (needsChoice && latestChapter) {
            return (
                <Card className="!border-cyan-500/50">
                    <h2 className="text-2xl font-bold font-orbitron text-cyan-300 mb-2">Decision Point</h2>
                    <p className="text-gray-400 mb-4 text-center">The simulation is paused pending your input. Your story cannot proceed until a decision is made.</p>
                    <div className="space-y-3">
                        {latestChapter.choices?.map((choice, index) => (
                            <button
                                key={index}
                                onClick={() => handleChoice(choice)}
                                className="w-full text-left p-3 rounded-md bg-gray-800 hover:bg-purple-900/50 border border-gray-700 hover:border-purple-500/50 transition-all flex items-center justify-between"
                            >
                                <span className="font-semibold">{choice}</span>
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        ))}
                    </div>
                </Card>
            );
        }
        
        return (
            <Card>
                <h2 className="text-2xl font-bold font-orbitron hud-text-accent mb-4">Daily Chronicle</h2>
                <p className="text-gray-400 mb-2 text-center">Maintain 80% daily task completion to record today's entry.</p>
                <div className="w-full bg-gray-800 rounded-full h-4 my-4 border border-gray-700 p-0.5">
                    <div
                        className="bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full h-full text-xs flex items-center justify-center font-bold text-black"
                        style={{ width: `${dailyTaskCompletionPercentage}%`, transition: 'width 0.5s ease-in-out' }}
                    >
                        {dailyTaskCompletionPercentage > 10 ? `${dailyTaskCompletionPercentage}%` : ''}
                    </div>
                </div>

                {isUnlockedToday ? (
                    <div className="mt-4 flex items-center justify-center text-green-400">
                    <CheckCircle className="w-6 h-6 mr-2" />
                    <p className="font-bold text-lg">Today's entry has been recorded.</p>
                    </div>
                ) : (
                    <button
                        onClick={handleBeginChapter}
                        disabled={!canUnlock || isChronicling || needsChoice}
                        className="mt-4 w-full flex items-center justify-center bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                        {isChronicling ? (
                            <div className="flex items-center justify-center"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div><span>Recording...</span></div>
                        ) : needsChoice ? (
                             <><Lock className="w-5 h-5 mr-2" /> Make a choice to continue</>
                        ) : canUnlock ? (
                            <><BookOpen className="w-5 h-5 mr-2" /> Unlock Today's Chapter</>
                        ) : (
                            <><Lock className="w-5 h-5 mr-2" /> {80 - dailyTaskCompletionPercentage}% More Required</>
                        )}
                    </button>
                )}
            </Card>
        );
    }

    return (
        <div>
            <h1 className="text-4xl font-bold font-orbitron text-center mb-6">Chapter Black</h1>

            <div className="mb-6">
                {renderDailyChronicle()}
            </div>
            
            <h2 className="text-3xl font-bold font-orbitron text-center text-gray-400 my-6">Archived Entries</h2>
            <div className="space-y-6">
                {lore.length > 0 ? (
                    Object.keys(groupedLore).reverse().map((arcKey, index) => (
                        <CollapsibleSection key={arcKey} title={arcKey} defaultOpen={index === 0}>
                            <div className="space-y-4">
                                {groupedLore[arcKey].slice().reverse().map(entry => (
                                    <PastChapter key={entry.id} entry={entry} />
                                ))}
                            </div>
                        </CollapsibleSection>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-600">
                        <p>No entries have been recorded yet.</p>
                        <p>Your file is empty.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChapterBlackPage;