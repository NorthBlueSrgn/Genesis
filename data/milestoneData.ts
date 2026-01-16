
// data/milestoneData.ts
import { SubStatName, AttributeRankName } from '../types';

const GENERIC_ELITE_MILESTONES = {
    [AttributeRankName.SS]: "You have transcended normal limits. Your ability is now a force of nature.",
    [AttributeRankName.SS_PLUS]: "APEX STATUS CONFIRMED. You are the theoretical limit made flesh.",
};

const createMilestones = (base: Partial<Record<AttributeRankName, string>>) => ({
    ...base,
    ...GENERIC_ELITE_MILESTONES
});

export const SUBSTAT_MILESTONES: Record<SubStatName, Partial<Record<AttributeRankName, string>>> = {
    // --- PHYSICAL ---
    [SubStatName.Strength]: createMilestones({
        'D': 'Raw muscular output. The first stirrings of true power.',
        'C': 'Your physical presence becomes more defined. The weight you move is a statement.',
        'B': 'You can lift your own bodyweight, a fundamental benchmark of functional power.',
        'A': 'Your strength enters the realm of the elite, moving with an authority others cannot challenge.',
        'S': 'The force you exert is formidable. You have become a physical powerhouse.',
    }),
    [SubStatName.Speed]: createMilestones({
        'D': 'Explosiveness and quickness. The world seems to slow, just a fraction.',
        'C': 'You react faster than you can think, seizing opportunities in the blink of an eye.',
        'B': 'You move like a blur to untrained eyes. Your agility is now a weapon.',
        'A': 'You can close the distance to a target with shocking velocity. A true tactical asset.',
        'S': 'You flow through combat with supernatural grace. Your movements seem impossible.',
    }),
    [SubStatName.Endurance]: createMilestones({
        'D': 'Sustained performance under fatigue. The fire in your lungs burns longer, hotter.',
        'C': 'You can push your body through pain barriers that would stop others cold.',
        'B': 'Extended exertion becomes your domain. You can outlast opponents, grinding them to dust.',
        'A': 'Your body becomes a fortress of stamina, operating at peak performance for extended periods.',
        'S': 'You are relentless. Fatigue is merely data, not a limitation. You simply do not stop.',
    }),
    [SubStatName.Dexterity]: createMilestones({
        'D': 'Precision and smoothness of movement. The connection between mind and body sharpens.',
        'C': 'You exhibit fine motor control that allows for complex, delicate tasks under pressure.',
        'B': 'Your movements are fluid and efficient, possessing a grace that is both beautiful and dangerous.',
        'A': 'Your reflexes and hand-eye coordination are at a level that can only be described as "combat-ready".',
        'S': 'You have the "catlike" grace of a master assassin. Your body is a perfectly controlled instrument.',
    }),
    [SubStatName.Agility]: createMilestones({
        'D': 'Ability to shift momentum. You feel more nimble and sure-footed.',
        'C': 'You can change direction explosively, navigating cluttered environments with ease.',
        'B': 'Your movements are evasive and unpredictable. You can turn an opponent\'s momentum against them.',
        'A': 'You possess exceptional body control, able to maintain balance in the most precarious situations.',
        'S': 'You move with a seamless, flowing grace that makes you an incredibly difficult target to pin down.',
    }),

    // --- VITALITY ---
    [SubStatName.Stamina]: createMilestones({
        'D': 'Energy levels and recovery rate. A deeper well of energy resides within you.',
        'C': 'Your life force burns brighter. Sickness and fatigue struggle to find purchase.',
        'B': 'Others notice your vibrant energy. You possess a palpable aura of health and vigor.',
        'A': 'Your internal systems operate at peak efficiency. You are resilient and overflowing with energy.',
        'S': 'Your vitality is so strong it acts as a shield, repelling ailments and weariness.',
    }),
    [SubStatName.Regeneration]: createMilestones({
        'D': 'Speed of physical restoration. Minor aches and fatigue vanish overnight.',
        'C': 'Your recovery from intense exertion is noticeably faster. You bounce back stronger.',
        'B': 'Deep, restorative sleep becomes your nightly norm. Your cognitive and physical recovery are dramatically enhanced.',
        'A': 'You have mastered the art of rest. You can achieve optimal recovery even under suboptimal conditions.',
        'S': 'Your ability to recover is extraordinary. You wake each day at 100% capacity.',
    }),
    [SubStatName.Adherence]: createMilestones({
        'D': 'Consistency in health habits. You begin to consciously fuel your body for performance.',
        'C': 'Your understanding of your body\'s needs becomes second nature. Your lifestyle is a tool you wield with precision.',
        'B': 'You can feel the direct impact of your choices on your energy. Your body is a finely-tuned machine.',
        'A': 'You have mastered your habits. You know exactly what your body needs to operate at peak capacity.',
        'S': 'Your discipline is so optimized that it provides a tangible edge in performance, surpassing your peers.',
    }),
    [SubStatName.Balance]: createMilestones({
        'D': 'Biological equilibrium. You feel a new sense of stability in your energy levels throughout the day.',
        'C': 'Your system becomes more robust, less prone to crashes from sugar or caffeine.',
        'B': 'You achieve a state of homeostasis where your body and mind work in concert, not in conflict.',
        'A': 'You can maintain your equilibrium even when faced with significant external stressors.',
        'S': 'Your internal balance is so profound it seems to project outwards, creating an aura of calm stability.',
    }),
    [SubStatName.Longevity]: createMilestones({
        'D': 'Durability over time. You notice a youthful resilience returning to your body and mind.',
        'C': 'The minor signs of aging and wear seem to stall, or even reverse. You feel timeless.',
        'B': 'You possess a vigor and appearance that defy your chronological age. You are built to last.',
        'A': 'Your biological systems are optimized for the long-haul, showing minimal degradation over time.',
        'S': 'You are a specimen of peak human condition, a testament to the potential for sustained excellence.',
    }),

    // --- INTELLIGENCE ---
    [SubStatName.Reason]: createMilestones({
        'D': 'Raw analytical processing power. Mental fog clears, and you identify logical fallacies with ease.',
        'C': 'Your reasoning sharpens. Complex problems begin to unravel as if by instinct.',
        'B': 'Your peers regard your reasoning as exceptionally sound. You see the solution first.',
        'A': 'You can deconstruct and analyze complex systems, from social dynamics to intricate machinery.',
        'S': 'You possess a "genius-level" aptitude for problem-solving. No puzzle seems impossible.',
    }),
    [SubStatName.Knowledge]: createMilestones({
        'D': 'Depth and breadth of retained information. Facts begin to stick, recalled with greater ease.',
        'C': 'You can absorb and retain large volumes of data without significant loss.',
        'B': 'You can learn new, complex skills or languages at an accelerated rate. Your mind is a sponge.',
        'A': 'Your recall is exceptional. You can access vast stores of knowledge instantly.',
        'S': 'You possess an encyclopedic knowledge of your chosen domains. You are a living database.',
    }),
    [SubStatName.Adaptability]: createMilestones({
        'D': 'How fast you absorb new patterns. You adjust to small changes without losing momentum.',
        'C': 'You are flexible. When a plan breaks, you can pivot to a new one without hesitation.',
        'B': 'You adapt to new challenges quickly, learning the rules while the game is still being played.',
        'A': 'You handle major life shifts with grace and efficiency, maintaining your core trajectory.',
        'S': 'You excel in chaos. Unpredictability is not a threat; it is an environment rich with opportunity.',
    }),
    [SubStatName.Strategy]: createMilestones({
        'D': 'Tactical and systemic thinking. You begin to think two steps ahead.',
        'C': 'You can formulate effective plans under pressure, seeing the path to victory.',
        'B': 'Your strategies account for multiple contingencies. You are rarely caught by surprise.',
        'A': 'You are a master tactician, able to orchestrate complex plans with multiple moving parts.',
        'S': 'You see the entire board. Your strategic vision encompasses not just the battle, but the entire war.',
    }),
    [SubStatName.Perception]: createMilestones({
        'D': 'Ability to notice fine details. You start to see things others miss.',
        'C': 'You can read a room, sensing subtle shifts in body language and tone.',
        'B': 'You have a "sharp eye," detecting lies, traps, and opportunities others overlook.',
        'A': 'Your awareness of your surroundings and the people in them is total. You miss nothing.',
        'S': 'You develop a hyper-awareness that warns you of danger and reveals hidden details.',
    }),

    // --- CREATIVITY ---
    [SubStatName.Imagination]: createMilestones({
        'D': 'Idea generation potential. Your inner world becomes more vivid, a workshop for new ideas.',
        'C': 'You can visualize concepts with such clarity that you can explore and refine them in your mind.',
        'B': 'You create immersive concepts that feel real to you and to others you share them with.',
        'A': 'Your imagination is a powerful tool, vast and sharply defined. You can build worlds within it.',
        'S': 'You possess world-building mastery, able to construct vast, coherent, and fascinating systems.',
    }),
    [SubStatName.Innovation]: createMilestones({
        'D': 'Ability to combine ideas into novelty. A steady current of new ideas flows through you.',
        'C': 'Your innovations are not just theoretical; you can manifest them into practical results.',
        'B': 'Your unique contributions begin to make waves, solving old problems in new ways.',
        'A': 'Your ideas are potent and disruptive. You are a force for change and novelty.',
        'S': 'You are a consistent font of innovation, a recognized creative force in your field.',
    }),
    [SubStatName.Style]: createMilestones({
        'D': 'Aesthetic identity. You begin to experiment, moving beyond the conventional.',
        'C': 'The first hints of a recognizable style emerge, a signature in everything you do.',
        'B': 'Your unique approach gets noticed. People can identify your work by its distinctive flair.',
        'A': 'Your personal style becomes refined, a potent and deliberate expression of your identity.',
        'S': 'Your style is distinct and widely admired. It is a benchmark of quality and originality.',
    }),
    [SubStatName.Expression]: createMilestones({
        'D': 'Translating inner vision outwardly. You find it easier to translate thoughts into compelling forms.',
        'C': 'Your art, writing, or speech gains a new level of polish and impact. It resonates with others.',
        'B': 'Your peers admire the power and clarity of your expression. Your voice is heard.',
        'A': 'You develop a unique artistic or creative "voice" that is unmistakably your own.',
        'S': 'You are a recognized talent, capable of moving people emotionally with the power of your creations.',
    }),
    [SubStatName.Vision]: createMilestones({
        'D': 'Conceptual foresight. You start to see not just what is, but what could be.',
        'C': 'You can accurately forecast the medium-term consequences of current actions and trends.',
        'B': 'You begin to formulate long-term goals that are both ambitious and achievable.',
        'A': 'Your vision inspires others. You can paint a picture of a future so compelling that people want to help build it.',
        'S': 'You are a true visionary, able to see years or even decades into the future with surprising clarity.',
    }),

    // --- SPIRIT ---
    [SubStatName.Faith]: createMilestones({
        'D': 'Strength of internal compass. A sense of inner grounding takes root, less swayed by external chaos.',
        'C': 'Your spiritual or philosophical focus sharpens, providing a clear compass for your actions.',
        'B': 'Your belief becomes a shield. You find a deep well of peace and resilience within.',
        'A': 'Your faith is a fortress. You remain calm and centered even in the heart of the storm.',
        'S': 'Your conviction is so powerful it becomes inspiring to those around you.',
    }),
    [SubStatName.Purpose]: createMilestones({
        'D': 'Degree of alignment between actions & ideals. You feel a growing sense of direction in your life.',
        'C': 'You can clearly articulate your primary goals and the "why" behind them.',
        'B': 'Your daily actions become tightly aligned with your long-term purpose. There is no wasted motion.',
        'A': 'You are driven by a powerful sense of purpose that fuels your discipline and resilience.',
        'S': 'Your purpose is so clear and compelling that it draws others to your cause.',
    }),
    [SubStatName.Tranquility]: createMilestones({
        'D': 'Inner calm during chaos. Minor annoyances and pressures no longer throw you off balance.',
        'C': 'You are calm and effective under pressure. Your performance does not degrade in the heat of the moment.',
        'B': 'You don\'t just tolerate stress; you can find a quiet center within it.',
        'A': 'You are rarely rattled. Chaos that panics others is simply a new set of variables for you to analyze.',
        'S': 'Your mind is a fortress of calm. You can weather emotional and psychological storms without wavering.',
    }),
    [SubStatName.Empathy]: createMilestones({
        'D': 'Connection to others’ energy. You become more attuned to the emotional states of those around you.',
        'C': 'You can accurately identify the underlying emotions behind someone\'s words and actions.',
        'B': 'You can form deep, authentic connections with others, making them feel seen and understood.',
        'A': 'Your empathy becomes a powerful tool for influence, negotiation, and leadership.',
        'S': 'You possess a profound understanding of the human heart, allowing you to navigate complex social dynamics with ease.',
    }),
    [SubStatName.Conviction]: createMilestones({
        'D': 'Capacity to hold belief when tested. You find it easier to stand by your principles.',
        'C': 'You can defend your beliefs with logic and passion, even in the face of opposition.',
        'B': 'Your integrity is recognized by others. You are known as someone who stands for something.',
        'A': 'Your conviction is a powerful force, allowing you to persevere when others would give up.',
        'S': 'You are a leader whose conviction inspires movements and changes minds.',
    }),

    // --- PSYCHE ---
    [SubStatName.Resilience]: createMilestones({
        'D': 'Bounce-back capacity. You recover from setbacks and disappointments more quickly.',
        'C': 'Failure is reframed as data. You learn from your mistakes without being defined by them.',
        'B': 'You can take a significant emotional or psychological blow and get back in the fight.',
        'A': 'You possess a powerful anti-fragility; stress and chaos do not just fail to break you, they make you stronger.',
        'S': 'You are known for your mental toughness. You are the one who stays standing when everyone else has fallen.',
    }),
    [SubStatName.Charisma]: createMilestones({
        'D': 'Magnetic influence and confidence projection. Social friction lessens. You navigate conversations with a new confidence.',
        'C': 'Your words begin to carry a subtle weight. People lean in, eager to listen.',
        'B': 'You become noticeably magnetic. People are drawn to you, interested in what you have to say.',
        'A': 'You are admired and persuasive. You can articulate your vision and inspire others to follow it.',
        'S': 'You possess a strong, commanding presence. When you speak, people don\'t just listen—they believe.',
    }),
    [SubStatName.Focus]: createMilestones({
        'D': 'Ability to sustain attention. The noise of the world fades. You can hold a single thought for longer.',
        'C': 'Your work sharpens. Distractions lose their power over you during dedicated sessions.',
        'B': 'You can enter states of deep focus, making hours of intense work feel effortless.',
        'A': 'The "flow state" becomes a familiar territory, a place you can enter with increasing ease.',
        'S': 'Your focus is like a laser, cutting through complexity and distraction to the heart of the matter.',
    }),
    [SubStatName.Willpower]: createMilestones({
        'D': 'Consistency of will. The voice of temptation grows quieter. You can choose the harder, better path.',
        'C': 'You can push through the burn, the boredom, the discomfort. Your resolve is hardening.',
        'B': 'You possess a high degree of will. Short-term gratification holds little power over you.',
        'A': 'Your willpower is like steel, forged in the fires of consistent effort and sacrifice.',
        'S': 'You are rarely deterred from your chosen course. Obstacles are not stop signs; they are challenges.',
    }),
    [SubStatName.Composure]: createMilestones({
        'D': 'Control under tension. You find yourself less reactive to sudden provocations or surprises.',
        'C': 'You can maintain a calm exterior and a clear head in moderately stressful situations.',
        'B': 'In arguments or negotiations, you remain cool and collected, rarely letting emotion cloud your judgment.',
        'A': 'You are a rock. Even when faced with chaos, you project an aura of unshakable calm.',
        'S': 'Your composure under fire is legendary, inspiring confidence and stability in those around you.',
    }),
};
