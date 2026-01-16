import React from 'react';
import { Dna } from 'lucide-react';

interface GenesisIconProps {
  size?: number;
  className?: string;
}

/**
 * Genesis Protocol Icon - DNA Helix from lucide-react
 */
const GenesisIcon: React.FC<GenesisIconProps> = ({ size = 64, className = '' }) => {
  return (
    <Dna 
      size={size} 
      className={`text-purple-500 ${className}`}
    />
  );
};

export default GenesisIcon;
