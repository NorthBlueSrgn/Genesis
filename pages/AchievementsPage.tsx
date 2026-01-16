
import React, { useMemo } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import Loader from '../components/ui/Loader';
import { Achievement, AchievementRarity } from '../types';
import { ACHIEVEMENTS_LIST } from '../data/achievementsData';
import { ICON_MAP } from '../constants';
import { Lock } from 'lucide-react';
import DossierHeader from '../components/ui/DossierHeader';

const rarityStyles: Record<AchievementRarity, { border: string; bg: string; text: string; shadow: string; }> = {
    [AchievementRarity.Common]: { border: 'border-gray-600', bg: 'bg-gray-800/50', text: 'text-gray-300', shadow: '' },
    [AchievementRarity.Uncommon]: { border: 'border-green-600/80', bg: 'bg-green-900/40', text: 'text-green-300', shadow: 'shadow-green-500/10' },
    [AchievementRarity.Rare]: { border: 'border-blue-600/80', bg: 'bg-blue-900/40', text: 'text-blue-300', shadow: 'shadow-blue-500/15' },
    [AchievementRarity.Epic]: { border: 'border-purple-600/80', bg: 'bg-purple-900/40', text: 'text-purple-300', shadow: 'shadow-purple-500/20' },
    [AchievementRarity.Legendary]: { border: 'border-amber-500/80', bg: 'bg-amber-900/40', text: 'text-amber-300', shadow: 'shadow-amber-500/25' },
};

const AchievementCard: React.FC<{ achievement: Achievement, unlockedTier: number | undefined }> = ({ achievement, unlockedTier }) => {
    const isSecret = achievement.isSecret && !unlockedTier;
    // Display the highest unlocked tier, or the first tier if not unlocked at all
    const displayTier = unlockedTier 
        ? achievement.tiers.find(t => t.tier === unlockedTier) || achievement.tiers[0] 
        : achievement.tiers[0];

    const styles = rarityStyles[displayTier.rarity];
    const Icon = isSecret ? Lock : ICON_MAP[displayTier.icon];

    return (
        <div className={`flex items-start p-4 rounded-lg border ${styles.border} ${styles.bg} ${styles.shadow} ${!unlockedTier && !isSecret ? 'opacity-50' : ''}`}>
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mr-4 ${styles.bg} border-2 ${styles.border}`}>
                <Icon className={`w-7 h-7 ${isSecret ? 'text-gray-500' : styles.text}`} />
            </div>
            <div className="flex-grow">
                <h3 className={`font-orbitron font-bold ${isSecret ? 'text-gray-500' : 'text-white'}`}>{isSecret ? 'SECRET ACHIEVEMENT' : achievement.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{isSecret ? 'Unlock this achievement to reveal its details.' : displayTier.description}</p>
                {unlockedTier && <p className={`text-xs font-bold mt-2 ${styles.text}`}>Unlocked (Tier {unlockedTier})</p>}
            </div>
        </div>
    );
};

const AchievementsPage: React.FC = () => {
    const { gameState, isLoading } = useGameState();

    const achievementsByRarity = useMemo(() => {
        const grouped: Partial<Record<AchievementRarity, Achievement[]>> = {};
        for (const achievement of ACHIEVEMENTS_LIST) {
            // Group by the highest tier's rarity for sorting purposes
            const highestTier = achievement.tiers[achievement.tiers.length - 1];
            const rarity = highestTier.rarity;
            if (!grouped[rarity]) {
                grouped[rarity] = [];
            }
            grouped[rarity]!.push(achievement);
        }
        return grouped;
    }, []);

    if (isLoading || !gameState) {
        return <Loader text="Loading Achievement Records..." />;
    }

    const unlockedAchievementsMap = new Map(gameState.unlockedAchievements.map(a => [a.id, a.highestTier]));
    
    const rarityOrder: AchievementRarity[] = [AchievementRarity.Legendary, AchievementRarity.Epic, AchievementRarity.Rare, AchievementRarity.Uncommon, AchievementRarity.Common];

    return (
        <div>
            <DossierHeader title="ACHIEVEMENT RECORDS" />

            <div className="space-y-8">
                {rarityOrder.map(rarity => (
                    achievementsByRarity[rarity] && (
                        <div key={rarity}>
                            <h2 className={`text-2xl font-orbitron font-bold mb-4 ${rarityStyles[rarity].text}`}>{rarity}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {achievementsByRarity[rarity]!.map(ach => (
                                    <AchievementCard key={ach.id} achievement={ach} unlockedTier={unlockedAchievementsMap.get(ach.id)} />
                                ))}
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default AchievementsPage;
