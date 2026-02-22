import React, { useState, useMemo, useCallback } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { useLocation } from 'react-router-dom';
import { ChevronRight, X } from 'lucide-react';

const TutorialOverlay: React.FC = () => {
    const { gameState, endTour, nextTourStep } = useGameState();
    const location = useLocation();
    const [hasSeenTutorial, setHasSeenTutorial] = useState(false);
    
    // Disable tutorial entirely for now - render nothing
    return null;
    
    if (!gameState?.isTourActive) return null;

    // Define comprehensive tutorial steps for each page
    const tutorialSteps = useMemo(() => {
        const path = location.pathname;
        
        // Base tutorial for dashboard
        const dashboardSteps = [
            {
                title: "Welcome, Operative",
                text: "I am Central. Your command center displays your Grade Progression, Attribute Snapshot, and Nemesis status. Monitor your Apex Threat Index (ATI) closely.",
                position: "center"
            },
            {
                title: "Your Attributes",
                text: "Six core stats define you: Physical, Vitality, Intelligence, Creativity, Spirit, and Psyche. Each has 5 substats. Increase them through consistent action.",
                position: "center"
            },
            {
                title: "Daily Grind",
                text: "Complete daily tasks to earn XP and stat boosts. The more you complete, the more you grow. Consistency is mandatory.",
                position: "center"
            },
            {
                title: "Resonance Signature",
                text: "Your unique profile determines your tactical approach. As you progress, you may awaken new resonance types.",
                position: "center"
            }
        ];

        const protocolsSteps = [
            {
                title: "Protocols = Training",
                text: "Protocols are curated training regimens with daily and weekly tasks. Each protocol targets specific stats.",
                position: "top-left"
            },
            {
                title: "Build Your Arsenal",
                text: "Select protocols that align with your goals. You can evolve protocols as you discover new specializations.",
                position: "center-left"
            }
        ];

        const missionsSteps = [
            {
                title: "Directives (Missions)",
                text: "When you need a specific objective or large XP boost, request a mission. Completion grants significant rewards.",
                position: "center-left"
            },
            {
                title: "Side Quests",
                text: "Create custom missions tailored to your goals. Break them into stages for maximum clarity and motivation.",
                position: "center-left"
            }
        ];

        const plannerSteps = [
            {
                title: "Time Architecture",
                text: "Use the Planner to schedule your tasks by hour. Automated scheduling maximizes your weekly efficiency.",
                position: "center-left"
            },
            {
                title: "Weekly Strategy",
                text: "Plan which protocols to run each day. Consistency across weeks compounds your gains.",
                position: "center-left"
            }
        ];

        const labyrinthSteps = [
            {
                title: "The Labyrinth",
                text: "A multi-floor psychometric assessment. Each floor tests different cognitive and behavioral dimensions.",
                position: "top-left"
            },
            {
                title: "Your Intelligence Ceiling",
                text: "Labyrinth results inform your Intelligence and Psyche substats. Solve puzzles to unlock deeper self-knowledge.",
                position: "center"
            }
        ];

        const journalSteps = [
            {
                title: "The Journal",
                text: "Record deep reflections here. Your insights compound over time, revealing patterns in your growth.",
                position: "center"
            },
            {
                title: "Apex Feats",
                text: "Mark exceptional days as Apex Feats. These become your lore—legendary moments in your journey.",
                position: "center"
            }
        ];

        const statsSteps = [
            {
                title: "Stats Breakdown",
                text: "Deep dive into your attribute history. Watch your growth trajectory and identify your strongest/weakest substats.",
                position: "center"
            },
            {
                title: "Stat Snapshots",
                text: "Daily snapshots track your progression. Use this data to refine your strategies.",
                position: "center"
            }
        ];

        const achievementsSteps = [
            {
                title: "Achievements",
                text: "Unlock rare achievements through specific actions. Some are secret—discover them through gameplay.",
                position: "top-left"
            }
        ];

        const guideSteps = [
            {
                title: "The Codex",
                text: "Your knowledge repository. Unlock entries through progression and reading. Some require specific ranks.",
                position: "top-left"
            }
        ];

        // Map routes to tutorial steps
        const stepMap: Record<string, any[]> = {
            '/dashboard': dashboardSteps,
            '/paths': protocolsSteps,
            '/missions': missionsSteps,
            '/planner': plannerSteps,
            '/labyrinth': labyrinthSteps,
            '/journal': journalSteps,
            '/stats': statsSteps,
            '/achievements': achievementsSteps,
            '/guide': guideSteps
        };

        return stepMap[path] || dashboardSteps;
    }, [location.pathname]);

    const currentStepIndex = Math.min(gameState.tourStep, tutorialSteps.length - 1);
    const step = tutorialSteps[currentStepIndex];

    const handleNext = useCallback(() => {
        if (currentStepIndex >= tutorialSteps.length - 1) {
            endTour();
        } else {
            nextTourStep();
        }
    }, [currentStepIndex, tutorialSteps.length, endTour, nextTourStep]);

    const handleSkip = useCallback(() => {
        endTour();
    }, [endTour]);

    return (
        <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300">
            {/* Tutorial Card - Mobile responsive */}
            <div className={`w-full max-w-md bg-gray-900 border border-purple-500 rounded-lg shadow-[0_0_30px_rgba(168,85,247,0.3)] animate-in fade-in slide-in-from-bottom-4 duration-300`}>
                {/* Header */}
                <div className="flex justify-between items-start p-4 sm:p-6 border-b border-purple-500/20">
                    <div className="flex-1 pr-4">
                        <h3 className="text-lg sm:text-xl font-orbitron font-bold text-purple-400 uppercase tracking-wide">
                            {step.title}
                        </h3>
                    </div>
                    <button 
                        onClick={handleSkip}
                        className="flex-shrink-0 text-gray-500 hover:text-white transition-colors p-1"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 space-y-4">
                    <p className="text-gray-300 font-mono text-sm leading-relaxed">
                        <span className="text-purple-500 font-bold mr-2">&gt;</span>
                        {step.text}
                    </p>

                    {/* Progress Dots */}
                    <div className="flex justify-center gap-2 pt-2">
                        {Array.from({ length: tutorialSteps.length }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    // Allow direct navigation to steps
                                    const diff = i - currentStepIndex;
                                    if (diff > 0) {
                                        for (let j = 0; j < diff; j++) nextTourStep();
                                    }
                                }}
                                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                                    i === currentStepIndex
                                        ? 'bg-purple-400 shadow-lg'
                                        : i < currentStepIndex
                                        ? 'bg-purple-600/50'
                                        : 'bg-gray-700'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center p-4 sm:p-6 border-t border-purple-500/20 gap-3">
                    <span className="text-xs text-gray-600 font-mono">
                        {currentStepIndex + 1} / {tutorialSteps.length}
                    </span>
                    <div className="flex gap-2">
                        <button 
                            onClick={handleSkip}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-400 hover:text-gray-300 font-orbitron uppercase tracking-widest transition-colors"
                        >
                            Skip
                        </button>
                        <button 
                            onClick={handleNext}
                            className="btn-primary py-1.5 sm:py-2 px-4 sm:px-6 text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap"
                        >
                            {currentStepIndex === tutorialSteps.length - 1 ? "Got It" : "Next"}
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorialOverlay;