// data/calibrationData.ts
import { CalibrationBenchmark, Hobby, SubStatName } from '../types';

export const HOBBY_LIST: Hobby[] = [
    // --- PHYSICAL (STRENGTH / SPEED / ENDURANCE / AGILITY) ---
    { name: 'Weightlifting (Olympic)', category: 'Physical', proficiency: 'Novice', substats: [SubStatName.Strength, SubStatName.Speed, SubStatName.Focus] },
    { name: 'Powerlifting', category: 'Physical', proficiency: 'Novice', substats: [SubStatName.Strength, SubStatName.Willpower] },
    { name: 'Bodybuilding', category: 'Physical', proficiency: 'Novice', substats: [SubStatName.Strength, SubStatName.Adherence] },
    { name: 'CrossFit', category: 'Physical', proficiency: 'Novice', substats: [SubStatName.Endurance, SubStatName.Resilience] },
    { name: 'Calisthenics', category: 'Physical', proficiency: 'Novice', substats: [SubStatName.Strength, SubStatName.Agility] },
    { name: 'Running (Marathon/Ultra)', category: 'Physical', proficiency: 'Novice', substats: [SubStatName.Endurance, SubStatName.Willpower, SubStatName.Longevity] },
    { name: 'Sprinting', category: 'Physical', proficiency: 'Novice', substats: [SubStatName.Speed, SubStatName.Stamina] },
    { name: 'Swimming', category: 'Physical', proficiency: 'Novice', substats: [SubStatName.Endurance, SubStatName.Tranquility] },
    { name: 'Cycling (Road/MTB)', category: 'Physical', proficiency: 'Novice', substats: [SubStatName.Endurance, SubStatName.Strength] },
    { name: 'Rock Climbing', category: 'Physical', proficiency: 'Novice', substats: [SubStatName.Strength, SubStatName.Dexterity, SubStatName.Strategy] },
    { name: 'Parkour', category: 'Physical', proficiency: 'Novice', substats: [SubStatName.Agility, SubStatName.Balance, SubStatName.Vision] },
    { name: 'Yoga / Pilates', category: 'Physical', proficiency: 'Novice', substats: [SubStatName.Balance, SubStatName.Tranquility, SubStatName.Dexterity] },
    { name: 'Martial Arts (Striking)', category: 'Physical', proficiency: 'Novice', substats: [SubStatName.Speed, SubStatName.Composure, SubStatName.Agility] },
    { name: 'Martial Arts (Grappling/BJJ)', category: 'Physical', proficiency: 'Novice', substats: [SubStatName.Strength, SubStatName.Strategy, SubStatName.Resilience] },
    { name: 'Fencing', category: 'Physical', proficiency: 'Novice', substats: [SubStatName.Speed, SubStatName.Perception, SubStatName.Focus] },
    { name: 'Archery', category: 'Physical', proficiency: 'Novice', substats: [SubStatName.Focus, SubStatName.Composure, SubStatName.Dexterity] },

    // --- INTELLECTUAL (KNOWLEDGE / REASON / STRATEGY) ---
    { name: 'Reading (Non-Fiction)', category: 'Intellectual', proficiency: 'Novice', substats: [SubStatName.Knowledge, SubStatName.Reason] },
    { name: 'Chess / Go', category: 'Intellectual', proficiency: 'Novice', substats: [SubStatName.Strategy, SubStatName.Reason, SubStatName.Vision] },
    { name: 'Poker (Competitive)', category: 'Intellectual', proficiency: 'Novice', substats: [SubStatName.Perception, SubStatName.Composure, SubStatName.Strategy] },
    { name: 'Learning Languages', category: 'Intellectual', proficiency: 'Novice', substats: [SubStatName.Knowledge, SubStatName.Adaptability] },
    { name: 'History / Archeology', category: 'Intellectual', proficiency: 'Novice', substats: [SubStatName.Knowledge, SubStatName.Purpose] },
    { name: 'Philosophy (Stoicism/Logic)', category: 'Intellectual', proficiency: 'Novice', substats: [SubStatName.Reason, SubStatName.Faith, SubStatName.Conviction] },
    { name: 'Mathematics / Physics', category: 'Intellectual', proficiency: 'Novice', substats: [SubStatName.Reason, SubStatName.Focus] },
    { name: 'Investing / Finance', category: 'Intellectual', proficiency: 'Novice', substats: [SubStatName.Strategy, SubStatName.Vision, SubStatName.Willpower] },
    { name: 'Debate / Law', category: 'Intellectual', proficiency: 'Novice', substats: [SubStatName.Reason, SubStatName.Charisma, SubStatName.Conviction] },
    { name: 'Astronomy', category: 'Intellectual', proficiency: 'Novice', substats: [SubStatName.Knowledge, SubStatName.Imagination] },

    // --- TECHNICAL & CRAFT (INNOVATION / DEXTERITY / REASON) ---
    { name: 'Coding / Software Engineering', category: 'Technical', proficiency: 'Novice', substats: [SubStatName.Reason, SubStatName.Innovation, SubStatName.Focus] },
    { name: 'Electronics / Robotics', category: 'Technical', proficiency: 'Novice', substats: [SubStatName.Innovation, SubStatName.Dexterity, SubStatName.Reason] },
    { name: 'Cybersecurity / Hacking', category: 'Technical', proficiency: 'Novice', substats: [SubStatName.Strategy, SubStatName.Perception, SubStatName.Knowledge] },
    { name: '3D Modeling / Printing', category: 'Technical', proficiency: 'Novice', substats: [SubStatName.Innovation, SubStatName.Vision, SubStatName.Style] },
    { name: 'Woodworking / Metalworking', category: 'Craft', proficiency: 'Novice', substats: [SubStatName.Dexterity, SubStatName.Innovation, SubStatName.Focus] },
    { name: 'Mechanics (Cars/Engines)', category: 'Craft', proficiency: 'Novice', substats: [SubStatName.Reason, SubStatName.Dexterity] },
    { name: 'Lockpicking', category: 'Technical', proficiency: 'Novice', substats: [SubStatName.Dexterity, SubStatName.Perception, SubStatName.Composure] },
    { name: 'Watchmaking', category: 'Craft', proficiency: 'Novice', substats: [SubStatName.Dexterity, SubStatName.Focus, SubStatName.Composure] },

    // --- CREATIVE (IMAGINATION / STYLE / EXPRESSION) ---
    { name: 'Creative Writing / Poetry', category: 'Creative', proficiency: 'Novice', substats: [SubStatName.Imagination, SubStatName.Expression] },
    { name: 'Digital Painting / Design', category: 'Creative', proficiency: 'Novice', substats: [SubStatName.Style, SubStatName.Innovation, SubStatName.Vision] },
    { name: 'Traditional Art (Oil/Charcoal)', category: 'Creative', proficiency: 'Novice', substats: [SubStatName.Style, SubStatName.Dexterity, SubStatName.Expression] },
    { name: 'Photography (Film/Digital)', category: 'Creative', proficiency: 'Novice', substats: [SubStatName.Vision, SubStatName.Style, SubStatName.Perception] },
    { name: 'Music Production (DAW)', category: 'Creative', proficiency: 'Novice', substats: [SubStatName.Imagination, SubStatName.Innovation, SubStatName.Reason] },
    { name: 'Playing an Instrument', category: 'Creative', proficiency: 'Novice', substats: [SubStatName.Dexterity, SubStatName.Expression, SubStatName.Focus] },
    { name: 'Videography / Editing', category: 'Creative', proficiency: 'Novice', substats: [SubStatName.Vision, SubStatName.Style, SubStatName.Strategy] },
    { name: 'Cooking / Gastronomy', category: 'Creative', proficiency: 'Novice', substats: [SubStatName.Innovation, SubStatName.Adherence, SubStatName.Perception] },
    { name: 'Fashion / Styling', category: 'Creative', proficiency: 'Novice', substats: [SubStatName.Style, SubStatName.Charisma, SubStatName.Vision] },
    { name: 'Game Design', category: 'Creative', proficiency: 'Novice', substats: [SubStatName.Imagination, SubStatName.Strategy, SubStatName.Reason] },

    // --- SOCIAL & SURVIVAL (CHARISMA / EMPATHY / ADAPTABILITY) ---
    { name: 'Public Speaking', category: 'Social', proficiency: 'Novice', substats: [SubStatName.Charisma, SubStatName.Composure, SubStatName.Expression] },
    { name: 'Leadership / Management', category: 'Social', proficiency: 'Novice', substats: [SubStatName.Strategy, SubStatName.Empathy, SubStatName.Purpose] },
    { name: 'Networking / Sales', category: 'Social', proficiency: 'Novice', substats: [SubStatName.Charisma, SubStatName.Adaptability, SubStatName.Perception] },
    { name: 'Volunteering / Mentoring', category: 'Social', proficiency: 'Novice', substats: [SubStatName.Empathy, SubStatName.Purpose, SubStatName.Faith] },
    { name: 'Survivalism / Bushcraft', category: 'Survival', proficiency: 'Novice', substats: [SubStatName.Resilience, SubStatName.Adaptability, SubStatName.Tranquility] },
    { name: 'Gardening / Permaculture', category: 'Survival', proficiency: 'Novice', substats: [SubStatName.Longevity, SubStatName.Tranquility, SubStatName.Purpose] },
    { name: 'Meditation / Mindfulness', category: 'Social', proficiency: 'Novice', substats: [SubStatName.Focus, SubStatName.Tranquility, SubStatName.Composure] },
    { name: 'Competitive Gaming (Esports)', category: 'Social', proficiency: 'Novice', substats: [SubStatName.Focus, SubStatName.Speed, SubStatName.Strategy] },
    { name: 'Tabletop RPGs (D&D)', category: 'Social', proficiency: 'Novice', substats: [SubStatName.Imagination, SubStatName.Empathy, SubStatName.Expression] },
    { name: 'Tactical Shooting / Airsoft', category: 'Survival', proficiency: 'Novice', substats: [SubStatName.Focus, SubStatName.Composure, SubStatName.Perception] },
];


export const CALIBRATION_BENCHMARKS: CalibrationBenchmark[] = [
    {
        id: 'narrative-prompt',
        type: 'narrative',
        title: 'Narrative Projection',
        prompt: "Describe the person you want to become. What skills define them? What impact do they have on the world? Be specific.",
        questions: [{ key: 'narrative-prompt' }]
    },
    {
        id: 'biometric-data',
        type: 'data-entry',
        title: 'Biometric Input',
        questions: [
            { 
                key: 'dateOfBirth', 
                prompt: 'Date of Birth (MM/DD/YYYY)', 
                inputType: 'text', 
                defaultValue: '01/15/1995',
                answers: []
            },
            { key: 'gender', prompt: 'Gender', inputType: 'select', defaultValue: 'Male', answers: [{ text: 'Male' }, { text: 'Female' }, { text: 'Other' }] },
            { 
                key: 'weight', 
                prompt: 'Weight (kg)', 
                inputType: 'select', 
                defaultValue: '80kg',
                answers: Array.from({length: 160}, (_, i) => ({ text: `${i + 40}kg` }))
            },
            { 
                key: 'heightFt', 
                prompt: 'Height (Feet)', 
                inputType: 'select', 
                defaultValue: '5',
                answers: Array.from({length: 4}, (_, i) => ({ text: `${i + 4}` }))
            },
            { 
                key: 'heightIn', 
                prompt: 'Height (Inches)', 
                inputType: 'select', 
                defaultValue: '10',
                answers: Array.from({length: 12}, (_, i) => ({ text: `${i}` }))
            },
        ],
    },
    {
        id: 'mbti-assessment',
        type: 'mbti-test',
        title: 'Psychometric Profile (MBTI)',
    },
    {
        id: 'hobby-selection',
        type: 'hobby-selection',
        title: 'Skill & Interest Profiling',
    },
    {
        id: 'physical-performance',
        type: 'data-entry',
        title: 'Physical Performance Metrics',
        questions: [
            { key: 'benchPress', prompt: 'Bench Press (1 Rep Max in kg)', inputType: 'select', defaultValue: '60kg', answers: [{ text: 'Untrained' }, ...Array.from({length: 60}, (_, i) => ({ text: `${(i * 2.5) + 20}kg` })), { text: '>170kg' }] },
            { key: 'squat', prompt: 'Squat (1 Rep Max in kg)', inputType: 'select', defaultValue: '80kg', answers: [{ text: 'Untrained' }, ...Array.from({length: 60}, (_, i) => ({ text: `${(i * 5) + 20}kg` })), { text: '>320kg' }] },
            { key: 'deadlift', prompt: 'Deadlift (1 Rep Max in kg)', inputType: 'select', defaultValue: '100kg', answers: [{ text: 'Untrained' }, ...Array.from({length: 60}, (_, i) => ({ text: `${(i * 5) + 30}kg` })), { text: '>330kg' }] },
            { key: 'pullUps', prompt: 'Pull-ups (Strict, Max Reps)', inputType: 'select', defaultValue: '5', answers: Array.from({length: 51}, (_, i) => ({ text: `${i}` })).concat([{ text: '50+' }]) },
            { key: 'pushUps', prompt: 'Push-ups (Strict, Max Reps)', inputType: 'select', defaultValue: '20', answers: Array.from({length: 101}, (_, i) => ({ text: `${i}` })).concat([{ text: '100+' }]) },
            { key: 'sprint100m', prompt: '100m Sprint Time (seconds)', inputType: 'select', defaultValue: '14.0s', answers: [{ text: 'Untrained' }, ...Array.from({length: 100}, (_, i) => ({ text: `${(20 - (i * 0.1)).toFixed(1)}s` })), { text: '<10s' }] },
            { key: 'run5k', prompt: '5k Run Time (minutes)', inputType: 'select', defaultValue: '28.0m', answers: [{ text: 'Untrained' }, ...Array.from({length: 60}, (_, i) => ({ text: `${45 - (i * 0.5)}m` })), { text: '<15m' }] },
            { key: 'proAgility', prompt: '5-10-5 Pro Agility Shuttle (seconds)', inputType: 'select', defaultValue: '5.0s', answers: [{ text: 'Untrained' }, ...Array.from({length: 50}, (_, i) => ({ text: `${(7.0 - (i * 0.1)).toFixed(1)}s` })), { text: '<4.0s' }] },
            { key: 'typingSpeed', prompt: 'Typing Speed (Words Per Minute)', inputType: 'select', defaultValue: '60', answers: [{ text: '<20' }, ...Array.from({length: 150}, (_, i) => ({ text: `${i + 20}` })), { text: '170+' }] },
        ]
    },
    {
        id: 'fitts-law-test',
        type: 'fitts-law-test',
        title: 'Dexterity / CNS Twitch'
    },
    {
        id: 'simon-says-test',
        type: 'simon-says',
        title: 'Cognitive Adaptability (Simon Says)'
    },
    {
        id: 'breath-hold-test',
        type: 'breath-hold-test',
        title: 'CO2 Tolerance (Vitality Gate)'
    },
    {
        id: 'vitality-questionnaire',
        type: 'questionnaire',
        title: 'Lifestyle & Toxicology Audit',
        questions: [
            // Regeneration
            { key: 'sleepHours', prompt: 'Average nightly sleep duration:', inputType: 'select', defaultValue: '7 hrs', answers: [{ text: '<4 hrs' }, { text: '4 hrs' }, { text: '5 hrs' }, { text: '6 hrs' }, { text: '7 hrs' }, { text: '8 hrs' }, { text: '9 hrs' }, { text: '10+ hrs' }] },
            { key: 'sleepQuality', prompt: 'How would you rate your sleep quality?', inputType: 'range', min: 1, max: 100, defaultValue: '50', rangeLabels: { min: 'Insomniac', max: 'Restorative' } },
            
            // Adherence
            { key: 'dietConsistency', prompt: 'Adherence to a healthy diet:', inputType: 'range', min: 1, max: 100, defaultValue: '50', rangeLabels: { min: 'Chaotic', max: 'Disciplined' } },
            
            // Balance & Longevity (Substances)
            { key: 'caffeineReliance', prompt: 'Caffeine Dependency:', inputType: 'range', min: 1, max: 100, defaultValue: '50', rangeLabels: { min: 'None', max: 'Addicted' } },
            { key: 'alcoholConsumption', prompt: 'Alcohol Consumption (Weekly Frequency):', inputType: 'range', min: 1, max: 100, defaultValue: '20', rangeLabels: { min: 'None', max: 'Heavy' } },
            { key: 'smokingHabits', prompt: 'Nicotine/Vaping Habit:', inputType: 'range', min: 1, max: 100, defaultValue: '1', rangeLabels: { min: 'None', max: 'Heavy' } },
            { key: 'stressLevels', prompt: 'Average Daily Stress:', inputType: 'range', min: 1, max: 100, defaultValue: '40', rangeLabels: { min: 'Zen', max: 'Panic' } },
        ]
    },
    {
        id: 'psyche-social-questionnaire',
        type: 'questionnaire',
        title: 'Psycho-Social Calibration',
        questions: [
            // Charisma
            { key: 'socialConfidence', prompt: 'Confidence in new social environments:', inputType: 'range', min: 1, max: 100, defaultValue: '50', rangeLabels: { min: 'Invisible', max: 'Magnetic' } },
            // Composure
            { key: 'conflictResolution', prompt: 'Reaction to sudden conflict or aggression:', inputType: 'range', min: 1, max: 100, defaultValue: '50', rangeLabels: { min: 'Freeze', max: 'Control' } },
            // Faith
            { key: 'religiosity', prompt: 'How important is faith/spirituality in your life?', inputType: 'range', min: 1, max: 100, defaultValue: '50', rangeLabels: { min: 'Secular', max: 'Devoted' } },
        ]
    },
    {
        id: 'psychometric-evaluation',
        type: 'labyrinth-assessment',
        title: 'Deep Psychometric Calibration',
    },
    {
        id: 'resilience-stroop',
        type: 'resilience-stroop',
        title: 'Inhibition & Resilience Protocol'
    },
    {
        id: 'creative-protocol-test',
        type: 'creative-protocol-test',
        title: 'Creative Protocol: Sport & Game Design'
    },
    {
        id: 'ai-adaptive-reasoning',
        type: 'ai-adaptive-test',
        title: 'Adaptive Reasoning Gauntlet',
        questions: [{ subject: 'Reasoning', answerFormat: 'multiple-choice' }]
    },
    {
        id: 'adaptive-knowledge-test',
        type: 'adaptive-knowledge-test',
        title: 'Adaptive Knowledge Matrix',
    },
    {
        id: 'high-stakes-war-room',
        type: 'strategy-optimization',
        title: 'Strategic Optimization Protocol',
    }
];