// services/alignmentService.ts
import { AlignmentScores, SubStatName } from '../types';

/**
 * Alignment Service
 * Maps alignment scores to substat modifications
 * 
 * Alignment System:
 * - Lawful-Chaotic: -100 (Lawful/Order) to 100 (Chaotic/Freedom)
 * - Good-Evil: -100 (Good/Compassion) to 100 (Evil/Selfish)
 * 
 * Creates a 9-point alignment grid:
 *   Lawful Good     Neutral Good     Chaotic Good
 *   Lawful Neutral  True Neutral     Chaotic Neutral
 *   Lawful Evil     Neutral Evil     Chaotic Evil
 */

/**
 * Determine alignment profile from scores
 */
export const getAlignmentProfile = (lawfulChaotic: number, goodEvil: number): string => {
    const lawfulLabel = lawfulChaotic <= -33 ? 'Lawful' : lawfulChaotic >= 33 ? 'Chaotic' : 'Neutral';
    const moralLabel = goodEvil <= -33 ? 'Good' : goodEvil >= 33 ? 'Evil' : 'Neutral';
    
    if (lawfulLabel === 'Neutral' && moralLabel === 'Neutral') {
        return 'True Neutral';
    }
    
    return `${lawfulLabel} ${moralLabel}`;
};

/**
 * Calculate substat modifications based on alignment
 * Modifies Spiritual and Psyche substats
 * 
 * Spiritual Substats (affected by Good-Evil):
 * - Faith: +10 per 10 points toward Good, -10 per 10 points toward Evil
 * - Purpose: +5 per 10 points toward Good (more altruistic purpose)
 * - Conviction: Neutral alignment gives +5 balance bonus
 * 
 * Psyche Substats (affected by Lawful-Chaotic):
 * - Focus: +10 per 10 points toward Lawful (discipline)
 * - Willpower: +10 per 10 points toward Lawful (commitment)
 * - Composure: Lawful gives +5, Chaotic gives -5 (recklessness)
 * 
 * Resilience (affected by both):
 * - Chaos reduces resilience (-5 per 10 points)
 * - Evil reduces resilience (-5 per 10 points)
 * - Good increases resilience (+5 per 10 points)
 */
export const calculateAlignmentModifiers = (alignment: AlignmentScores): Record<string, number> => {
    const { lawfulChaotic, goodEvil } = alignment;
    
    const modifiers: Record<string, number> = {};
    
    // Lawful-Chaotic affects Willpower, Focus, and Composure
    const lawfulBonus = Math.max(0, -lawfulChaotic) / 10; // 0-10 for lawful
    const chaoticBonus = Math.max(0, lawfulChaotic) / 10; // 0-10 for chaotic
    
    modifiers[SubStatName.Willpower] = lawfulBonus * 10; // +100 max at lawful extreme
    modifiers[SubStatName.Focus] = lawfulBonus * 10; // +100 max at lawful extreme
    modifiers[SubStatName.Composure] = lawfulBonus * 5 - chaoticBonus * 5; // +50 lawful, -50 chaotic
    
    // Good-Evil affects Faith, Purpose, Empathy, and Conviction
    const goodBonus = Math.max(0, -goodEvil) / 10; // 0-10 for good
    const evilBonus = Math.max(0, goodEvil) / 10; // 0-10 for evil
    const neutralPenalty = Math.abs(goodEvil) < 33 ? 5 : 0; // Small bonus for true neutral
    
    modifiers[SubStatName.Faith] = goodBonus * 10 - evilBonus * 10; // +100 good, -100 evil
    modifiers[SubStatName.Purpose] = goodBonus * 5 + neutralPenalty; // +50 good, +5 neutral
    modifiers[SubStatName.Conviction] = neutralPenalty; // +5 for neutral alignment
    modifiers[SubStatName.Empathy] = goodBonus * 8 - evilBonus * 5; // Good favors empathy
    
    // Resilience is affected by both axes
    modifiers[SubStatName.Resilience] = 
        goodBonus * 5 - evilBonus * 5 - chaoticBonus * 5 + lawfulBonus * 3;
    
    // Tranquility (Spirit) - Neutral Good tends toward tranquility
    modifiers[SubStatName.Tranquility] = 
        (Math.min(goodBonus, lawfulBonus) * 3) + (Math.abs(goodEvil) + Math.abs(lawfulChaotic) < 50 ? 10 : 0);
    
    return modifiers;
};

/**
 * Apply alignment modifiers to a substat value
 */
export const applyAlignmentModifier = (
    baseValue: number,
    subStatName: SubStatName,
    alignment: AlignmentScores
): number => {
    const modifiers = calculateAlignmentModifiers(alignment);
    const modifier = modifiers[subStatName] || 0;
    return Math.max(1, baseValue + modifier); // Ensure minimum of 1
};

/**
 * Get a description of alignment-based stat impacts
 */
export const getAlignmentDescription = (alignment: AlignmentScores): string => {
    const { lawfulChaotic, goodEvil, profile } = alignment;
    
    let description = `${profile} Alignment\n`;
    
    if (lawfulChaotic <= -50) {
        description += '• Highly Lawful: Superior focus, willpower, and discipline\n';
    } else if (lawfulChaotic <= -20) {
        description += '• Lawful: Enhanced focus and willpower\n';
    } else if (lawfulChaotic <= 20) {
        description += '• Neutral Order: Balanced approach to structure and freedom\n';
    } else if (lawfulChaotic <= 50) {
        description += '• Chaotic: Less structured, more adaptable approach\n';
    } else {
        description += '• Highly Chaotic: Reduced focus and willpower; more spontaneous\n';
    }
    
    if (goodEvil <= -50) {
        description += '• Highly Good: Exceptional faith, purpose, and resilience\n';
    } else if (goodEvil <= -20) {
        description += '• Good: Enhanced empathy and purpose\n';
    } else if (goodEvil <= 20) {
        description += '• Neutral Morality: Self-interested balance\n';
    } else if (goodEvil <= 50) {
        description += '• Evil: Reduced empathy; stronger conviction\n';
    } else {
        description += '• Highly Evil: Self-serving; reduced resilience\n';
    }
    
    return description;
};

/**
 * Create default True Neutral alignment
 */
export const createNeutralAlignment = (): AlignmentScores => {
    return {
        lawfulChaotic: 0,
        goodEvil: 0,
        profile: 'True Neutral'
    };
};

/**
 * Create alignment from raw scores (normalize to -100 to 100)
 */
export const createAlignmentFromScores = (
    lawfulChaotic: number,
    goodEvil: number
): AlignmentScores => {
    // Clamp to -100 to 100
    const lc = Math.max(-100, Math.min(100, lawfulChaotic));
    const ge = Math.max(-100, Math.min(100, goodEvil));
    
    return {
        lawfulChaotic: lc,
        goodEvil: ge,
        profile: getAlignmentProfile(lc, ge)
    };
};
