// constants.ts
import React from 'react';
import { Rank, Stat, AttributeRankName, StatName, SubStatName, IconName } from './types';
import {
  Activity, Award, BarChart2, Book, BookOpen, BookText, BrainCircuit, Calendar, Check, ChevronsUp,
  Database, Feather, Figma, Gem, Heart, HeartPulse, HelpCircle, LayoutDashboard, Leaf, ListChecks,
  ListTodo, MapPin, MessageSquare, Mic, Palette, PersonStanding, Send, Shield, Sparkles, Star,
  Swords, Target, TrendingUp, UserMinus, Users, Wrench, Zap, Anchor, BarChart, Code, Gamepad2, Wind,
  Flame, CheckCircle, Layers, Clock, Eye, Unlock, AlertTriangle,
  Box, Cpu, Crosshair, Terminal, Droplets, Footprints, UtensilsCrossed, Moon, Binary, ShieldAlert, Lightbulb,
  Music, Hammer, Scale, Dna, Globe
} from 'lucide-react';

// --- CORE GAME MECHANICS ---

export const EVOLUTION_INTERVAL = 5; 
export const FORSAKEN_BASE_DAILY_POTENTIAL = 200; 

export const BRAND_LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
    <defs>
        <filter id="uiGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"></feGaussianBlur>
            <feMerge>
                <feMergeNode in="coloredBlur"></feMergeNode>
                <feMergeNode in="SourceGraphic"></feMergeNode>
            </feMerge>
        </filter>
        <linearGradient id="helixGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#a855f7" />
            <stop offset="100%" stop-color="#22d3ee" />
        </linearGradient>
    </defs>
    <g filter="url(#uiGlow)" stroke="url(#helixGrad)" stroke-width="1.8" fill="none" stroke-linecap="square">
        <!-- Wings -->
        <path d="M 35,65 L 15,50 L 30,45" opacity="0.6" />
        <path d="M 65,65 L 85,50 L 70,45" opacity="0.6" />
        <!-- Helix -->
        <path d="M 46,80 L 40,75 L 46,70 M 54,60 L 48,55 L 54,50 M 46,40 L 40,35 L 46,30" />
        <path d="M 54,80 L 60,75 L 54,70 M 46,60 L 52,55 L 46,50 M 54,40 L 60,35 L 54,30" />
        <!-- Chevrons -->
        <path d="M 44,92 L 50,86 L 56,92" stroke-width="2" />
        <circle cx="50" cy="15" r="2" fill="#22d3ee" />
    </g>
</svg>`;

export const ICON_MAP: Record<IconName, React.ElementType> = {
  Activity, Award, BarChart2, Book, BookOpen, BookText, BrainCircuit, Calendar, Check, ChevronsUp,
  Database, Feather, Figma, Gem, Heart, HeartPulse, HelpCircle, LayoutDashboard, Leaf, ListChecks,
  ListTodo, MapPin, MessageSquare, Mic, Palette, PersonStanding, Send, Shield, Sparkles, Star,
  Swords, Target, TrendingUp, UserMinus, Users, Wrench, Zap, Anchor, BarChart, Code, Gamepad2, Wind,
  Flame, CheckCircle, Layers, Clock, Eye, Unlock, AlertTriangle, Box, Cpu, Crosshair, Terminal,
  Droplets, Footprints, UtensilsCrossed, Moon, Binary, ShieldAlert, Lightbulb,
  Music, Hammer, Scale, Dna, Globe
};

// --- STATS & RANKS ---

export const STAT_SUBSTAT_MAP: Record<StatName, SubStatName[]> = {
  [StatName.Physical]: [SubStatName.Strength, SubStatName.Speed, SubStatName.Endurance, SubStatName.Dexterity, SubStatName.Agility],
  [StatName.Vitality]: [SubStatName.Stamina, SubStatName.Regeneration, SubStatName.Adherence, SubStatName.Balance, SubStatName.Longevity],
  [StatName.Intelligence]: [SubStatName.Reason, SubStatName.Knowledge, SubStatName.Adaptability, SubStatName.Strategy, SubStatName.Perception],
  [StatName.Creativity]: [SubStatName.Imagination, SubStatName.Innovation, SubStatName.Style, SubStatName.Expression, SubStatName.Vision],
  [StatName.Spirit]: [SubStatName.Faith, SubStatName.Purpose, SubStatName.Tranquility, SubStatName.Empathy, SubStatName.Conviction],
  [StatName.Psyche]: [SubStatName.Resilience, SubStatName.Charisma, SubStatName.Focus, SubStatName.Willpower, SubStatName.Composure],
};

export const BINARY_SUBSTATS = new Set([
    SubStatName.Strength, SubStatName.Speed, SubStatName.Endurance,
    SubStatName.Stamina, SubStatName.Regeneration, SubStatName.Adherence, SubStatName.Longevity,
    SubStatName.Knowledge, SubStatName.Focus,
]);

export const NON_BINARY_SUBSTATS = new Set([
    SubStatName.Dexterity, SubStatName.Agility,
    SubStatName.Balance,
    SubStatName.Reason, SubStatName.Adaptability, SubStatName.Strategy, SubStatName.Perception,
    SubStatName.Imagination, SubStatName.Innovation, SubStatName.Style, SubStatName.Expression, SubStatName.Vision,
    SubStatName.Faith, SubStatName.Purpose, SubStatName.Tranquility, SubStatName.Empathy, SubStatName.Conviction,
    SubStatName.Resilience, SubStatName.Charisma, SubStatName.Willpower, SubStatName.Composure
]);

export const RANKS: Rank[] = [
  { name: AttributeRankName.E, threatLevel: 'Echo (Dormant)', attributeThreshold: 0, timeEstimate: 'Initial Phase', threatDescription: 'Baseline activation confirmed. Dormant potential.' },
  { name: AttributeRankName.D, threatLevel: 'Delta (Learning)', attributeThreshold: 1400, timeEstimate: '~3-6 Months', threatDescription: 'Learning, trainable; basic competence achieved.' },
  { name: AttributeRankName.C, threatLevel: 'Charlie (Standard)', attributeThreshold: 5600, timeEstimate: '~6-12 Months', threatDescription: 'Average human ability; handles structured tasks reliably.' },
  { name: AttributeRankName.B, threatLevel: 'Bravo (Elite)', attributeThreshold: 18000, timeEstimate: '~1-2 Years', threatDescription: 'Above-average; independent problem-solving, rapid growth.' },
  { name: AttributeRankName.A, threatLevel: 'Alpha (Command)', attributeThreshold: 40000, timeEstimate: '~2-4 Years', threatDescription: 'Exceptional skill; orchestrates complex tasks; leads teams.' },
  { name: AttributeRankName.S, threatLevel: 'The Complete One', attributeThreshold: 92000, timeEstimate: '~4-7 Years', threatDescription: 'Peak human integration across all attributes; rare and aspirational.' },
  { name: AttributeRankName.SS, threatLevel: 'Omega (Anomaly)', attributeThreshold: 134000, timeEstimate: '~7-10 Years', threatDescription: 'Near-singular anomaly; global-level mastery; extremely rare.' },
  { name: AttributeRankName.SS_PLUS, threatLevel: 'Transcendent', attributeThreshold: 156000, timeEstimate: '10+ Years', threatDescription: 'Ultimate human potential; flawless integration; unmatched.' },
];

export const ATTRIBUTE_RANKS: { name: AttributeRankName, threshold: number }[] = [
  { name: AttributeRankName.E, threshold: 0 },
  { name: AttributeRankName.D, threshold: 1400 },
  { name: AttributeRankName.C, threshold: 5600 },
  { name: AttributeRankName.B, threshold: 18000 },
  { name: AttributeRankName.A, threshold: 40000 },
  { name: AttributeRankName.S, threshold: 92000 },
  { name: AttributeRankName.SS, threshold: 134000 },
  { name: AttributeRankName.SS_PLUS, threshold: 156000 },
];

export const RANK_PERCENTILES: Record<AttributeRankName, { min: number, max: number }> = {
    [AttributeRankName.E]: { min: 0, max: 19 },
    [AttributeRankName.D]: { min: 20, max: 39 },
    [AttributeRankName.C]: { min: 40, max: 59 },
    [AttributeRankName.B]: { min: 60, max: 74 },
    [AttributeRankName.A]: { min: 75, max: 89 },
    [AttributeRankName.S]: { min: 90, max: 96 },
    [AttributeRankName.SS]: { min: 97, max: 99 },
    [AttributeRankName.SS_PLUS]: { min: 99.9, max: 100 },
};

export const SUBSTAT_RANK_THRESHOLDS: Record<SubStatName, { name: AttributeRankName, threshold: number }[]> = {
    ...Object.fromEntries(Object.values(SubStatName).map(subStat => [
        subStat,
        ATTRIBUTE_RANKS.map(r => ({ ...r, threshold: r.threshold / 5 }))
    ])) as any
};

export const RANK_MAP: Record<AttributeRankName, number> = { 
    [AttributeRankName.E]: 0, 
    [AttributeRankName.D]: 1, 
    [AttributeRankName.C]: 2, 
    [AttributeRankName.B]: 3, 
    [AttributeRankName.A]: 4, 
    [AttributeRankName.S]: 5, 
    [AttributeRankName.SS]: 6, 
    [AttributeRankName.SS_PLUS]: 7
};

export const INITIAL_STATS: Omit<Stat, 'rank' | 'subStats' | 'lastIncreased'>[] = [
  { name: StatName.Physical, value: 0 },
  { name: StatName.Vitality, value: 0 },
  { name: StatName.Intelligence, value: 0 },
  { name: StatName.Creativity, value: 0 },
  { name: StatName.Spirit, value: 0 },
  { name: StatName.Psyche, value: 0 },
];

export const DECAY_CONSTANTS = {
  INACTIVITY_THRESHOLD_DAYS: 3,
  DECAY_POINTS_BY_RANK: { 
      [AttributeRankName.E]: 3, 
      [AttributeRankName.D]: 3, 
      [AttributeRankName.C]: 2, 
      [AttributeRankName.B]: 2, 
      [AttributeRankName.A]: 1, 
      [AttributeRankName.S]: 1, 
      [AttributeRankName.SS]: 0, 
      [AttributeRankName.SS_PLUS]: 0
  }
};

export const SUBSTAT_PROGRESSION_RATES: Partial<Record<SubStatName, number>> = {
    [SubStatName.Willpower]: 1.2,
    [SubStatName.Focus]: 1.15,
    [SubStatName.Knowledge]: 1.1,
    [SubStatName.Speed]: 0.9,
    [SubStatName.Perception]: 0.95,
};

export const SUBSTAT_TIMELINES_MONTHS: Record<SubStatName, Record<AttributeRankName, number>> = {
  ...Object.fromEntries(Object.values(SubStatName).map(subStat => [
      subStat,
      { 
          [AttributeRankName.E]: 0, 
          [AttributeRankName.D]: 3, 
          [AttributeRankName.C]: 9, 
          [AttributeRankName.B]: 24, 
          [AttributeRankName.A]: 48, 
          [AttributeRankName.S]: 84, 
          [AttributeRankName.SS]: 120, 
          [AttributeRankName.SS_PLUS]: 180
      } 
  ])) as any
};

export const getRankForValue = (value: number, ranks: { name: AttributeRankName, threshold: number }[]): AttributeRankName => {
    for (let i = ranks.length - 1; i >= 0; i--) {
        if (value >= ranks[i].threshold) {
            return ranks[i].name;
        }
    }
    return AttributeRankName.E;
};

export const getRankForMainStatValue = (value: number, statName: StatName): AttributeRankName => {
    return getRankForValue(value, ATTRIBUTE_RANKS);
};

export const getRankForSubstatValue = (value: number, subStatName: SubStatName): AttributeRankName => {
    return getRankForValue(value, SUBSTAT_RANK_THRESHOLDS[subStatName]);
};

export const calculateXpForNextLevel = (level: number): number => {
  return Math.floor(3000 * Math.pow(1.15, level - 1));
};
