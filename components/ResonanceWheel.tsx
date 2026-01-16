
import React from 'react';
import { ResonanceType, ResonanceVector } from '../types';

interface ResonanceWheelProps {
  userResonance: ResonanceType;
  resonanceVector?: ResonanceVector;
}

const ResonanceWheel: React.FC<ResonanceWheelProps> = ({ userResonance, resonanceVector }) => {
  // FIXED: Updated types array to use members existing in ResonanceType enum (from types.ts)
  const types: ResonanceType[] = [
    ResonanceType.Juggernaut, 
    ResonanceType.Joker, 
    ResonanceType.Cipher, 
    ResonanceType.Catalyst, 
    ResonanceType.Virtuoso, 
    ResonanceType.Chameleon
  ];
  const radius = 150;
  const centerX = 200;
  const centerY = 200;

  const positions = types.map((_, i) => {
    const angle = (i * 2 * Math.PI) / types.length - Math.PI / 2; // Start at top
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  // If unawakened/calibrating, use the vector for visualization logic
  const isCalibrating = userResonance === ResonanceType.Unawakened;
  const typeIndex = types.indexOf(userResonance);
  
  // Helper to get value from vector or fallback to 0
  const getVectorValue = (type: ResonanceType) => resonanceVector ? (resonanceVector[type] || 0) : 0;

  return (
    <svg width="400" height="400" viewBox="0 0 400 400" className="font-orbitron" 
      style={{ '--color-accent': '#a855f7', '--color-border': '#4b5563', '--color-bg-medium': '#1c2128', '--color-text-muted': '#7d8590' } as React.CSSProperties}>
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
        <radialGradient id="active-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Connection Lines */}
      <g>
        {positions.map((pos, i) => {
          const nextPos = positions[(i + 1) % types.length];
          const oppositePos = positions[(i + 3) % types.length];
          
          return (
            <React.Fragment key={i}>
              {/* Adjacent Lines */}
              <line 
                x1={pos.x} y1={pos.y} 
                x2={nextPos.x} y2={nextPos.y} 
                stroke="var(--color-border)" 
                strokeWidth="1" 
              />
              {/* Opposite Lines */}
              <line 
                x1={pos.x} y1={pos.y} 
                x2={oppositePos.x} y2={oppositePos.y} 
                stroke="var(--color-border)" 
                strokeWidth="1" 
                strokeDasharray="4"
              />
            </React.Fragment>
          );
        })}
      </g>

      {/* Nodes */}
      {positions.map((pos, i) => {
        const type = types[i];
        
        let isActive = false;
        let nodeRadius = 40;
        let nodeOpacity = 1;
        
        if (isCalibrating && resonanceVector) {
            // Dynamic sizing based on probability
            const prob = getVectorValue(type);
            nodeRadius = 30 + (prob * 100); // Scale radius
            nodeOpacity = 0.3 + (prob * 2); // Scale opacity
            isActive = prob > 0.2; // Highlight top contenders
        } else {
            isActive = userResonance === type;
        }
        
        const isAdjacent = (typeIndex !== -1) && ((typeIndex - i + types.length) % types.length === 1 || (i - typeIndex + types.length) % types.length === 1);
        const isOpposite = (typeIndex !== -1) && ((typeIndex - i + types.length) % types.length === 3);

        return (
          <g key={type} transform={`translate(${pos.x}, ${pos.y})`}>
            {isActive && <circle r={nodeRadius + 10} fill="url(#active-glow)" />}
            <circle
              r={nodeRadius}
              fill={isActive ? 'var(--color-accent)' : 'var(--color-bg-medium)'}
              stroke={isActive ? 'var(--color-accent)' : isAdjacent ? '#a0aec0' : isOpposite ? '#f87171' : 'var(--color-border)'}
              strokeWidth="2"
              style={isActive ? { filter: 'url(#glow)', opacity: nodeOpacity } : { opacity: nodeOpacity }}
            />
            <text
              textAnchor="middle"
              dy=".3em"
              fill={isActive ? 'white' : 'var(--color-text-muted)'}
              fontSize="12"
              fontWeight="bold"
              className="select-none"
            >
              {type}
              {isCalibrating && resonanceVector && <tspan x="0" dy="1.2em" fontSize="10">{(getVectorValue(type) * 100).toFixed(0)}%</tspan>}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default ResonanceWheel;
