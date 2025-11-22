import React from 'react';
import { ArrowLeftIcon } from '../components/icons/IconsTransporte';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onBack?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon, onBack }) => {
  return (
    <header className="flex items-center mb-8">
      {onBack && (
        <button onClick={onBack} className="mr-5 text-slate-500 hover:text-slate-800 transition-colors" aria-label="Volver">
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
      )}
      {icon && (
        <div className="bg-blue-100 p-3 rounded-lg mr-4 flex-shrink-0">
          {icon}
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">{subtitle}</p>}
      </div>
    </header>
  );
};

export default PageHeader;
