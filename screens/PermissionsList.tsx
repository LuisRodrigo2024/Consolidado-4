import React, { useState, useMemo } from 'react';
import { SearchIcon } from '../components/icons/IconsTransporte';
import { PermissionIcon } from '../components/icons/IconsTransporte';
import { Vehicle, Employee, Permission, PermissionStatus } from '../types';
import PageHeader from './PageHeader';
import StatusBadge from './StatusBadge';
import ChangeReasonModal from './ChangeReasonModal';
import ReasonModal from './ReasonModal';

interface PermissionsListProps {
  permissions: Permission[];
  employees: Employee[];
  vehicles: Vehicle[];
  onUpdatePermission: (permissionId: string, newStatus: PermissionStatus, reason: string) => void;
  onBack: () => void;
}

const PermissionsList: React.FC<PermissionsListProps> = ({ permissions, employees, vehicles, onUpdatePermission, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalInfo, setModalInfo] = useState<{ permission: Permission, newStatus: PermissionStatus } | null>(null);
  const [viewingReason, setViewingReason] = useState<string | null>(null);
  
  const permissionsWithDetails = useMemo(() => {
    return permissions
      .map(p => {
        const employee = employees.find(e => e.id === p.employeeId);
        const vehicle = vehicles.find(v => v.id === p.vehicleId);
        // Filter out permissions if the employee is inactive or if either employee/vehicle record is missing
        if (!employee || employee.estado === 'Inactivo' || !vehicle) {
          return null;
        }
        return { ...p, employee, vehicle };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null); // Use a type guard to remove nulls and fix type
  }, [permissions, employees, vehicles]);


  const filteredPermissions = permissionsWithDetails.filter(p => 
    p.employee.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.vehicle.placa.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleStatusChange = (permission: Permission, newStatus: PermissionStatus) => {
    if (permission.status !== newStatus) {
      setModalInfo({ permission, newStatus });
    }
  };
  
  const handleConfirmReason = (reason: string) => {
    if (modalInfo) {
      onUpdatePermission(modalInfo.permission.id, modalInfo.newStatus, reason);
    }
    setModalInfo(null);
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    // Handles both DD/MM/YYYY and YYYY-MM-DD
    if (dateString.includes('-')) {
        try {
            const [year, month, day] = dateString.split('-');
            return `${day}/${month}/${year}`;
        } catch {
            return dateString;
        }
    }
    return dateString;
  };


  return (
    <>
      <main className="flex-1 p-6 md:p-10 flex flex-col" aria-labelledby="page-title">
        <PageHeader
          title="Gestión de Permisos"
          icon={<PermissionIcon className="h-8 w-8 text-violet-800" />}
          onBack={onBack}
        />

        <div className="bg-white rounded-xl shadow-md flex-grow flex flex-col">
          <div className="p-6 flex justify-start items-center border-b border-slate-200">
            <div className="relative">
              <label htmlFor="search-permissions" className="sr-only">Buscar Permisos</label>
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                id="search-permissions"
                type="search"
                className="border border-slate-300 bg-white h-11 px-4 pl-11 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-80 text-black"
                placeholder="Buscar por empleado o placa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto flex-grow">
            <table className="min-w-full">
              <thead className="bg-blue-800 text-white">
                <tr>
                  <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider rounded-tl-xl">Empleado</th>
                  <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Brevete</th>
                  <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Vencimiento</th>
                  <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Vehículo</th>
                  <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Tipo</th>
                  <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Estado</th>
                  <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Último Cambio</th>
                  <th scope="col" className="py-3 px-6 text-center font-semibold text-sm uppercase tracking-wider rounded-tr-xl">Motivo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredPermissions.map((p) => (
                  <tr key={p.id} className="text-slate-800 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-6">{p.employee?.nombre || 'N/A'}</td>
                    <td className="py-3 px-6">{p.employee?.brevete || 'N/A'}</td>
                    <td className="py-3 px-6 text-sm">{p.employee ? formatDate(p.employee.fechaVencimiento) : 'N/A'}</td>
                    <td className="py-3 px-6 font-medium text-slate-600">{p.vehicle?.placa || 'N/A'}</td>
                    <td className="py-3 px-6">{p.vehicle?.tipo || 'N/A'}</td>
                    <td className="py-3 px-6 w-48">
                      <select
                        value={p.status}
                        onChange={(e) => handleStatusChange(p, e.target.value as PermissionStatus)}
                        className="border rounded-lg p-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="Habilitado">Habilitado</option>
                        <option value="No Habilitado">No Habilitado</option>
                        <option value="Suspendido">Suspendido</option>
                      </select>
                    </td>
                    <td className="py-3 px-6 text-sm">{formatDate(p.lastChangeDate) || 'N/A'}</td>
                    <td className="py-3 px-6 text-center">
                       <button 
                          onClick={() => setViewingReason(p.changeReason)}
                          disabled={!p.changeReason}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1 px-3 rounded-md transition-colors duration-200 text-xs shadow-sm border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed">
                          Ver Motivo
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
      {modalInfo && (
        <ChangeReasonModal
          onClose={() => setModalInfo(null)}
          onConfirm={handleConfirmReason}
        />
      )}

      {viewingReason && (
        <ReasonModal
          title="Motivo del Cambio"
          reason={viewingReason}
          onClose={() => setViewingReason(null)}
        />
      )}
    </>
  );
};

export default PermissionsList;