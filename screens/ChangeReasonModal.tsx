
import React, { useState } from 'react';

interface ChangeReasonModalProps {
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const ChangeReasonModal: React.FC<ChangeReasonModalProps> = ({ onClose, onConfirm }) => {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (reason.trim()) {
        onConfirm(reason.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" role="dialog" aria-modal="true">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md flex flex-col text-center animate-fade-in-down">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Confirmar Cambio de Estado</h2>
        <p className="text-slate-600 mb-4 text-sm">
            Por favor, ingrese un motivo para este cambio de permiso.
        </p>
        
        <div className="w-full text-left">
            <label htmlFor="change-reason" className="block text-sm font-medium text-slate-700 mb-1">
                Motivo del cambio (obligatorio)
            </label>
            <textarea
                id="change-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                autoFocus
                className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Ej: Aprobación de examen de manejo, falta disciplinaria, etc."
            />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
            <button
                type="button"
                onClick={onClose}
                className="bg-white hover:bg-slate-100 text-slate-700 font-bold py-3 px-4 rounded-lg transition-colors duration-200 text-sm border border-slate-300 shadow-sm"
            >
                Cancelar
            </button>
            <button
                onClick={handleConfirm}
                disabled={!reason.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 text-sm shadow-sm disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
                Confirmar
            </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeReasonModal;