
import React, { useState } from 'react';
import { Order } from '../types';
import { ExclamationTriangleIcon } from '../components/icons/IconsTransporte';

interface DeleteOrderModalProps {
  order: Order;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const DeleteOrderModal: React.FC<DeleteOrderModalProps> = ({ order, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (reason.trim()) {
        onConfirm(reason.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" role="dialog" aria-modal="true">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md flex flex-col text-center animate-fade-in-up">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
            <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Cancelar Pedido</h2>
        <p className="text-slate-600 mb-4 text-sm">
            Está a punto de cancelar el pedido <span className="font-semibold">{order.code}</span>. Esta acción no se puede deshacer.
        </p>
        
        <div className="w-full text-left">
            <label htmlFor="cancellation-reason" className="block text-sm font-medium text-slate-700 mb-1">
                Motivo de la cancelación (obligatorio)
            </label>
            <textarea
                id="cancellation-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder="Ej: Cliente canceló el pedido, error en el ingreso, etc."
            />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
            <button
                onClick={onClose}
                className="bg-white hover:bg-slate-100 text-slate-700 font-bold py-3 px-4 rounded-lg transition-colors duration-200 text-sm border border-slate-300 shadow-sm"
            >
                Volver
            </button>
            <button
                onClick={handleConfirm}
                disabled={!reason.trim()}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 text-sm shadow-sm disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
                Eliminar Pedido
            </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteOrderModal;
