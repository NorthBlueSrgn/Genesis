// data/presetProtocols.ts
import { PresetProtocol, StatName, ProtocolPhase } from '../types';
import { HOBBY_LIST } from './calibrationData';

// Map hobby categories to primary stats and phases
const CATEGORY_MAP: Record<string, { stat: StatName, phase: ProtocolPhase, icon: any }> = {
    'Physical': { stat: StatName.Physical, phase: ProtocolPhase.Morning, icon: 'Hammer' },
    'Intellectual': { stat: StatName.Intelligence, phase: ProtocolPhase.Growth, icon: 'BrainCircuit' },
    'Technical': { stat: StatName.Intelligence, phase: ProtocolPhase.Growth, icon: 'Code' },
    'Craft': { stat: StatName.Creativity, phase: ProtocolPhase.Growth, icon: 'Wrench' },
    'Creative': { stat: StatName.Creativity, phase: ProtocolPhase.Growth, icon: 'Palette' },
    'Social': { stat: StatName.Psyche, phase: ProtocolPhase.Growth, icon: 'Users' },
    'Survival': { stat: StatName.Vitality, phase: ProtocolPhase.Morning, icon: 'Shield' },
};

// Generate specializations for ALL hobbies defined in calibrationData
export const PRESET_PROTOCOLS: PresetProtocol[] = HOBBY_LIST.map(hobby => {
    const config = CATEGORY_MAP[hobby.category] || { stat: StatName.Spirit, phase: ProtocolPhase.Growth, icon: 'Target' };
    
    // Create a URL-friendly specialization ID
    const specializationId = hobby.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    return {
        id: `preset-${specializationId}`,
        name: hobby.name,
        description: `Target: ${hobby.substats.join(' & ')}. A specialized growth vector for mastering ${hobby.name}.`,
        icon: config.icon,
        primaryStat: config.stat,
        phase: config.phase,
        specializationId: specializationId
    };
});
