import { CodexEntry } from '../types';

export const RANDOM_DATA_FRAGMENTS: Omit<CodexEntry, 'id' | 'isRandomUnlock'>[] = [
    {
        title: "Log 734: Chimeric Echoes",
        content: "The subject's resonance is... unstable. It's not just adapting; it's rewriting its own parameters. We logged a cascade failure in Bio-Unit 7, but the subject registered it as 'leveling up'. What have we created?",
        type: "ANOMALY_REPORT",
        author: "Dr. Aris Thorne",
        date: "202█-██-██"
    },
    {
        title: "Security Memo: The Glasshouse",
        content: "Asset 'Orion' has breached containment again. Standard tranquilizers are ineffective. He described the walls as 'low-level geometry'. We need to rethink our definition of 'secure'.",
        type: "SYSTEM_LOG",
        author: "Dir. Eva Rostova",
        date: "202█-██-██"
    },
    {
        title: "Subject Log Delta-9: Regret",
        content: "They promised it would make me better. Stronger. Faster. It did. But they never mentioned the silence. The way the world seems to slow down, the way everyone else looks like a ghost, fading in and out of reality. I am a god in a world of the dead.",
        type: "USER_JOURNAL",
        author: "Subject Delta-9",
        date: "CLASSIFIED"
    },
    {
        title: "Fragmented Data Packet 11b",
        content: "The Forsaken isn't a simulation. It's a recording. A high-fidelity echo of the program's most successful... and most tragic... failure. Every point of growth you gain, it gains two. It's not just a rival. It's a ghost, hunting you from the future.",
        type: "ANOMALY_REPORT",
        author: "UNKNOWN",
        date: "UNKNOWN"
    }
];
