import React from 'react';
import { ChevronDownIcon } from '../components/icons/IconsTransporte';

interface NavItemProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  hasSubMenu?: boolean;
  isSubMenuOpen?: boolean;
  onToggleSubMenu?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ label, icon, isActive, onClick, hasSubMenu, isSubMenuOpen, onToggleSubMenu }) => {
  const baseClasses = "flex items-center w-full font-semibold py-3 px-4 rounded-lg transition-colors duration-200 text-left";
  const activeClasses = "bg-green-700 text-white shadow-inner";
  const inactiveClasses = "text-green-100 hover:bg-green-700 hover:text-white";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      <div className="h-6 w-6 mr-4 flex-shrink-0">{icon}</div>
      <span className="flex-grow">{label}</span>
      {hasSubMenu && onToggleSubMenu && (
        <span
          role="button"
          aria-label="Toggle submenu"
          tabIndex={0}
          onClick={(e) => {
              e.stopPropagation();
              onToggleSubMenu();
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
                e.preventDefault();
                onToggleSubMenu();
            }
          }}
          className="p-2 -mr-2 rounded-full hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-white"
        >
          <ChevronDownIcon 
            className={`h-5 w-5 transition-transform duration-200 ${isSubMenuOpen ? 'rotate-180' : ''}`} 
          />
        </span>
      )}
    </button>
  );
};

export default NavItem;