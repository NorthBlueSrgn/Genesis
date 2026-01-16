
// data/labyrinthGameData.ts
import { LabyrinthFloor, SubStatName } from '../types';

export const LABYRINTH_FLOORS: LabyrinthFloor[] = [
  // 1. STRATEGY
  {
    id: 'floor-1',
    title: 'The War Room',
    subtitle: 'Strategic Allocation',
    coreConcepts: ['Zero-Sum Game', 'Resource Management'],
    subtests: [
      {
        id: 'strategy_zero_sum',
        title: 'High-Stakes War Room',
        description: 'Advanced tactical simulation. Allocate energy across Attack, Defend, and Economy. Victory requires non-linear thinking over 8 high-pressure rounds.',
        rounds: 8,
        uiMode: 'zero_sum',
        substats: [SubStatName.Strategy, SubStatName.Conviction],
        config: {
            opponentType: 'adaptive', // Learns user patterns
            lanes: ['Attack', 'Defend', 'Economy']
        }
      }
    ]
  },
  // 2. REASON
  {
    id: 'floor-2',
    title: 'The Glass Matrix',
    subtitle: 'Deductive Reasoning',
    coreConcepts: ['Constraint Logic', 'Elimination'],
    subtests: [
      {
        id: 'reason_matrix',
        title: 'Logic-Locked Matrix',
        description: 'A deductive puzzle where activating nodes restricts future moves. Optimize your path to clear the grid with minimal moves.',
        uiMode: 'logic_grid',
        substats: [SubStatName.Reason],
        config: {
            mode: 'standard', // Lights out / Sudoku hybrid logic
            gridSize: 4
        }
      }
    ]
  },
  // 4. PERCEPTION
  {
    id: 'floor-4',
    title: 'The Mirage',
    subtitle: 'Signal Detection',
    coreConcepts: ['Signal Noise', 'Pattern Recognition'],
    subtests: [
      {
        id: 'perception_mirage',
        title: 'Neural Noise Scan',
        description: 'High-Density Time-Attack: Locate the deviant signal amidst a 144-node corrupted matrix. Neural noise and character mimics will attempt to break your lock.',
        rounds: 10,
        uiMode: 'flux_reaction',
        substats: [SubStatName.Perception],
        config: {
            mode: 'signal_detection', 
            noiseLevel: 'elite',
            gridSize: 12
        }
      }
    ]
  },
  // 5. INNOVATION
  {
    id: 'floor-5',
    title: 'The Box',
    subtitle: 'Lateral Thinking',
    coreConcepts: ['Meta-Gaming', 'Rule Bending'],
    subtests: [
      {
        id: 'innovation_sandbox',
        title: 'Mechanic-Bending Sandbox',
        description: 'Solve the maze. The obvious path is blocked. The solution requires using the interface in an unintended way.',
        uiMode: 'logic_grid',
        substats: [SubStatName.Innovation],
        config: {
            mode: 'meta_puzzle', // Dragging UI elements, clicking outside bounds
        }
      }
    ]
  },
  // 6. FOCUS
  {
    id: 'floor-6',
    title: 'The Sniper\'s Eye',
    subtitle: 'Sustained Inhibition & Composure',
    coreConcepts: ['Variable Tempo', 'Trigger Discipline'],
    subtests: [
      {
        id: 'focus_precision',
        title: 'High-Fidelity Engagement',
        description: 'Engage moving targets within the rail zone over 15 intensive rounds. Simulated heartbeat wobble and extreme kinetic surges test elite composure. 3 Strikes = Fail.',
        uiMode: 'stress_clock', 
        substats: [SubStatName.Focus, SubStatName.Composure],
        config: {
            difficulty: 'elite',
            rounds: 15,
            baseSpeed: 1.5, 
            pulseIntensity: 2.5
        }
      }
    ]
  },
  // 7. WILLPOWER
  {
    id: 'floor-7',
    title: 'The Reactor',
    subtitle: 'Risk Tolerance',
    coreConcepts: ['Discount Rates', 'Impulse Control'],
    subtests: [
      {
        id: 'willpower_reactor',
        title: 'Critical Mass',
        description: 'Hold to charge the core. Higher charge = Higher score. If Stability hits 0, you crash and get NOTHING for the round. 3 Rounds.',
        uiMode: 'incentive_gamble',
        substats: [SubStatName.Willpower],
        config: {
            mode: 'hold_risk',
            rounds: 3
        }
      }
    ]
  },
  // 8. RESILIENCE
  {
    id: 'floor-8',
    title: 'The Pit',
    subtitle: 'Loss Recovery',
    coreConcepts: ['Tilt Control', 'Expected Value'],
    subtests: [
      {
        id: 'resilience_spiral',
        title: 'Loss Spiral Recovery',
        description: 'A game of chance rigged to lose initially. Do not tilt. Stick to the optimal strategy to reclaim losses when the odds normalize.',
        rounds: 10,
        uiMode: 'incentive_gamble',
        substats: [SubStatName.Resilience],
        config: {
            mode: 'rigged_loss', // First 3 rounds are losses
            winCondition: 'persistence'
        }
      }
    ]
  },
  // 9. IMAGINATION
  {
    id: 'floor-9',
    title: 'The Void',
    subtitle: 'Hypothetical Modeling',
    coreConcepts: ['Mental Models', 'Prediction'],
    subtests: [
      {
        id: 'imagination_hypothetical',
        title: 'Hypothetical State Generator',
        description: 'Predict the opponent\'s move in a game with incomplete rules. You must infer the mechanics from limited observation.',
        rounds: 5,
        uiMode: 'trust_signal', // Reusing the face/interaction engine
        substats: [SubStatName.Imagination],
        config: {
            mode: 'pattern_completion' 
        }
      }
    ]
  },
  // 10. CONVICTION
  {
    id: 'floor-10',
    title: 'The Edge',
    subtitle: 'Commitment Strategies',
    coreConcepts: ['Chicken Game', 'Credible Threats'],
    subtests: [
      {
        id: 'conviction_chicken',
        title: 'Identity-Based Commitment',
        description: 'A test of nerve. Lock in your strategy. If you swerve, you lose. If you both hold, you crash. Dare the opponent to swerve.',
        uiMode: 'zero_sum',
        substats: [SubStatName.Conviction],
        config: {
            mode: 'chicken', // High stakes collision logic
        }
      }
    ]
  },
  // 11. KNOWLEDGE
  {
    id: 'floor-11',
    title: 'The Library',
    subtitle: 'Meta-Game Recognition',
    coreConcepts: ['Nash Equilibrium', 'Classic Games'],
    subtests: [
      {
        id: 'knowledge_meta',
        title: 'Meta-Library Classification',
        description: 'Rapidly identify the Game Theory scenario presented (e.g., Prisoner\'s Dilemma, Stag Hunt). Speed is key.',
        rounds: 5,
        uiMode: 'flux_reaction', // Reusing reaction engine for multiple choice
        substats: [SubStatName.Knowledge],
        config: {
            mode: 'trivia_classification'
        }
      }
    ]
  },
  // 12. CHARISMA
  {
    id: 'floor-12',
    title: 'The Table',
    subtitle: 'Signaling & Trust',
    coreConcepts: ['Public Goods', 'Signaling'],
    subtests: [
      {
        id: 'charisma_trust',
        title: 'Signaling & Trust Game',
        description: 'Signal your intent to an AI partner. Build a loop of trust to maximize the shared pot without being exploited.',
        rounds: 5,
        uiMode: 'trust_signal',
        substats: [SubStatName.Charisma],
        config: {
            mode: 'public_goods'
        }
      }
    ]
  }
];
