
import React from 'react';
import { Vehicle } from '../types';
import { ExclamationTriangleIcon } from '../components/icons/IconsTransporte';

interface DeleteConfirmationModalProps {
  vehicle: Vehicle;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ vehicle, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" role="dialog" aria-modal="true">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md flex flex-col text-center animate-fade-in-down">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
            <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Eliminar Vehículo</h2>
        <p className="text-slate-600 mb-6 text-sm">
            ¿Está seguro de que desea eliminar permanentemente el vehículo con placa <span className="font-semibold">{vehicle.placa}</span>? Esta acción no se puede deshacer.
        </p>
        
        <div className="grid grid-cols-2 gap-4">
            <button
                onClick={onClose}
                className="bg-white hover:bg-slate-100 text-slate-700 font-bold py-3 px-4 rounded-lg transition-colors duration-200 text-sm border border-slate-300 shadow-sm"
            >
                Cancelar
            </button>
            <button
                onClick={onConfirm}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 text-sm shadow-sm"
            >
                Sí, Eliminar
            </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
