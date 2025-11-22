import React from 'react';
import { Turno } from '../types';

interface TurnoBadgeProps {
  turno: Turno;
}

const turnoStyles: Record<Turno, string> = {
  'Mañana': 'bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-600/20',
  'Tarde': 'bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-600/20',
  'Noche': 'bg-indigo-100 text-indigo-800 ring-1 ring-inset ring-indigo-600/20',
};

const TurnoBadge: React.FC<TurnoBadgeProps> = ({ turno }) => {
  const style = turnoStyles[turno] || 'bg-gray-100 text-gray-800';
  return (
    <span className={`px-3 py-1 text-sm font-semibold rounded-full inline-flex items-center ${style}`}>
      {turno}
    </span>
  );
};

export default TurnoBadge;