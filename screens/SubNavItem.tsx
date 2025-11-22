import React from 'react';

interface SubNavItemProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const SubNavItem: React.FC<SubNavItemProps> = ({ label, isActive, onClick }) => {
  const baseClasses = "w-full text-left py-2 px-4 rounded-md text-sm transition-colors duration-200 block";
  const activeClasses = "text-white font-bold bg-green-700";
  const inactiveClasses = "text-green-200 hover:text-white hover:bg-green-700";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {label}
    </button>
  );
};

export default SubNavItem;