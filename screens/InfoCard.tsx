
import React from 'react';

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, children, className, titleClassName }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className || ''}`}>
      <h2 className={`text-lg font-bold text-blue-800 mb-2 ${titleClassName || ''}`}>{title}</h2>
      <hr className="border-t border-blue-200 mb-6" />
      {children}
    </div>
  );
};

export default InfoCard;
