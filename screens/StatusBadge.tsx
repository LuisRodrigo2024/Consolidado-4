


import React from 'react';

// FIX: Added 'Cancelado' to the Status type to support cancelled orders.
type Status = 'Recibido' | 'En Proceso' | 'Completado' | 'Cancelado' | 'Programado' | 'Picking' | 'En Ruta' | 'Pendiente' | 'En Camino' | 'Entregado' | 'Operativo' | 'En Mantenimiento' | 'Habilitado' | 'No Habilitado' | 'Suspendido' | 'Activo' | 'Inactivo' | 'Con Licencia' | 'De Vacaciones';

interface StatusBadgeProps {
  status: Status;
}

const statusStyles: Record<Status, string> = {
  // Order Statuses
  'Recibido': 'bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-600/20',
  'En Proceso': 'bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-600/20',
  'Completado': 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-600/20',
  'Cancelado': 'bg-red-100 text-red-800 ring-1 ring-inset ring-red-600/20',
  // Dispatch Statuses
  'Programado': 'bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-600/20',
  'Picking': 'bg-purple-100 text-purple-800 ring-1 ring-inset ring-purple-600/20',
  'En Ruta': 'bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-600/20',
  // Stop Statuses
  'Pendiente': 'bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-600/20',
  // FIX: Added 'En Camino' to the statusStyles object to match the Status type.
  'En Camino': 'bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-600/20',
  'Entregado': 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-600/20',
  // Vehicle Statuses
  'Operativo': 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-600/20',
  'En Mantenimiento': 'bg-orange-100 text-orange-800 ring-1 ring-inset ring-orange-600/20',
  // Permission Statuses
  'Habilitado': 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-600/20',
  'No Habilitado': 'bg-slate-100 text-slate-800 ring-1 ring-inset ring-slate-600/20',
  'Suspendido': 'bg-red-100 text-red-800 ring-1 ring-inset ring-red-600/20',
  // Employee Statuses
  'Activo': 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-600/20',
  'Inactivo': 'bg-slate-100 text-slate-800 ring-1 ring-inset ring-slate-600/20',
  'Con Licencia': 'bg-orange-100 text-orange-800 ring-1 ring-inset ring-orange-600/20',
  'De Vacaciones': 'bg-sky-100 text-sky-800 ring-1 ring-inset ring-sky-600/20',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const style = statusStyles[status] || 'bg-gray-100 text-gray-800';
  return (
    <span className={`px-3 py-1 text-sm font-semibold rounded-full inline-flex items-center ${style}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
export type { Status };