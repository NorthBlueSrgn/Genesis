import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`hud-card p-4 md:p-6 ${className}`}
      {...props}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Card;