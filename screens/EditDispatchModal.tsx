import React, { useState, useMemo, useEffect } from 'react';
import { Dispatch, Vehicle, Employee, Permission } from '../types';

interface EditDispatchModalProps {
  dispatch: Dispatch;
  vehicles: Vehicle[];
  employees: Employee[];
  permissions: Permission[];
  onClose: () => void;
  onConfirm: (dispatchId: string, vehicle: string, operator: string) => void;
}

const EditDispatchModal: React.FC<EditDispatchModalProps> = ({ dispatch, vehicles, employees, permissions, onClose, onConfirm }) => {
  const [selectedVehiclePlaca, setSelectedVehiclePlaca] = useState(dispatch.vehicle || '');
  const [selectedOperatorName, setSelectedOperatorName] = useState(dispatch.operator || '');

  const availableVehicles = useMemo(() => vehicles.filter(v => v.estado === 'Operativo'), [vehicles]);

  const selectedVehicle = useMemo(() => {
    return availableVehicles.find(v => v.placa === selectedVehiclePlaca);
  }, [selectedVehiclePlaca, availableVehicles]);
  
  const availableOperators = useMemo(() => {
    if (!selectedVehicle) return [];
    return employees.filter(e => {
      const hasCorrectLicense = e.brevete === selectedVehicle.licenciaRequerida;
      const hasPermission = permissions.find(p => p.employeeId === e.id && p.vehicleId === selectedVehicle.id)?.status === 'Habilitado';
      return hasCorrectLicense && hasPermission;
    });
  }, [selectedVehicle, employees, permissions]);

  // Reset operator if the available list changes and the current one is no longer valid
  useEffect(() => {
    if (selectedOperatorName && !availableOperators.some(op => op.nombre === selectedOperatorName)) {
        setSelectedOperatorName('');
    }
  }, [availableOperators, selectedOperatorName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedVehiclePlaca && selectedOperatorName) {
      onConfirm(dispatch.id, selectedVehiclePlaca, selectedOperatorName);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" role="dialog" aria-modal="true">
      <form onSubmit={handleSubmit} className="bg-slate-50 rounded-2xl shadow-2xl p-6 w-full max-w-lg flex flex-col animate-fade-in-down">
        <h2 className="text-xl font-bold text-slate-800 mb-1">Editar Despacho</h2>
        <p className="text-sm text-slate-500 mb-6">Código: <span className="font-semibold text-slate-700">{dispatch.id}</span></p>
        
        <div className="space-y-4">
            <div>
                <label htmlFor="vehicle-select" className="block text-sm font-medium text-slate-700 mb-1">Vehículo</label>
                <select
                    id="vehicle-select"
                    value={selectedVehiclePlaca}
                    onChange={(e) => setSelectedVehiclePlaca(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                    <option value="">Seleccione un vehículo</option>
                    {availableVehicles.map(v => (
                        <option key={v.id} value={v.placa}>{v.placa} ({v.tipo})</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="operator-select" className="block text-sm font-medium text-slate-700 mb-1">Operador</label>
                <select
                    id="operator-select"
                    value={selectedOperatorName}
                    onChange={(e) => setSelectedOperatorName(e.target.value)}
                    disabled={!selectedVehicle}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white text-black focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-slate-200 disabled:cursor-not-allowed"
                >
                    <option value="">{selectedVehicle ? 'Seleccione un operador' : 'Seleccione un vehículo primero'}</option>
                     {availableOperators.map(e => (
                        <option key={e.id} value={e.nombre}>{e.nombre}</option>
                    ))}
                </select>
            </div>
        </div>

        <div className="flex justify-end items-center mt-6 pt-4 border-t border-slate-200 space-x-3">
          <button type="button" onClick={onClose} className="bg-white hover:bg-slate-100 text-slate-700 font-bold py-2.5 px-6 rounded-lg transition-colors duration-200 text-sm border border-slate-300 shadow-sm">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!selectedVehiclePlaca || !selectedOperatorName}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors duration-200 text-sm shadow-sm disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDispatchModal;
