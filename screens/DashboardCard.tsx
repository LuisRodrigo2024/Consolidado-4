
import React from 'react';

interface DashboardCardProps {
  label: string;
  icon: React.ReactNode;
  colorClassName: string;
  onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ label, icon, colorClassName, onClick }) => {
  const isClickable = !!onClick;
  return (
    <div 
      className={`p-6 rounded-xl flex flex-col items-center justify-center text-center transition-opacity duration-200 ${colorClassName} ${isClickable ? 'cursor-pointer hover:opacity-90' : ''}`}
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : -1}
      onKeyPress={(e) => { if (e.key === 'Enter' && onClick) onClick() }}
      aria-label={label}
    >
      <div className="h-12 w-12 mb-3">
        {icon}
      </div>
      <h2 className="text-base font-bold">{label}</h2>
    </div>
  );
};

export default DashboardCard;
