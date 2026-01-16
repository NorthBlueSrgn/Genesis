import React from 'react';

interface DossierHeaderProps {
  title: string;
}

const DossierHeader: React.FC<DossierHeaderProps> = ({ title }) => {
  const classifiedText = '[CLASSIFIED]';
  return (
    <div className="dossier-header text-center mb-6">
      <div className="flex items-center justify-center gap-4">
        <div className="rec-light-container">
          <div className="rec-light"></div>
          <span>REC</span>
        </div>
        <h1 className="text-4xl font-bold font-orbitron">{title}</h1>
        <div className="classified-stamp">
            {classifiedText}
        </div>
      </div>
    </div>
  );
};

export default DossierHeader;