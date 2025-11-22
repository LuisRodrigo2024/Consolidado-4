import React, { useState, useMemo } from 'react';
import { SaleDetail } from '../types';
import { annulmentReasons } from '../constants';
import {CloseIcon} from '../components/icons/iconsVentas';
import {ChevronDownIcon} from '../components/icons/iconsVentas';
import {CheckIcon} from '../components/icons/iconsVentas';

interface AnnulmentModalProps {
  sale: SaleDetail;
  onClose: () => void;
  onConfirm: (saleId: string, reason: string) => void;
}

const AnnulmentModal: React.FC<AnnulmentModalProps> = ({ sale, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const finalReason = useMemo(() => {
    return reason === 'Otro' ? customReason.trim() : reason;
  }, [reason, customReason]);
  
  const isConfirmDisabled = !finalReason;

  const handleConfirmClick = () => {
    if (isConfirmDisabled) return;
    setShowConfirmation(true);
    setTimeout(() => {
        onConfirm(sale.id, finalReason);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-lg p-8 shadow-2xl w-full max-w-lg relative animate-fade-in-up">
        {showConfirmation && (
            <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col justify-center items-center rounded-lg animate-fade-in z-10">
                <div className="animate-scale-in">
                    <CheckIcon />
                </div>
                <p className="text-2xl font-bold text-green-600 mt-4">Venta Anulada</p>
            </div>
        )}
        <button onClick={onClose} disabled={showConfirmation} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed">
          <CloseIcon />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Anular Venta</h2>
        <p className="text-gray-600 mb-6">Está a punto de anular la venta <span className="font-semibold text-red-600">{sale.id}</span>. Esta acción no se puede deshacer.</p>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="annulment-reason">
            Motivo de la anulación
          </label>
          <div className="relative">
            <select
              id="annulment-reason"
              className="w-full appearance-none bg-white p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="">Seleccione un motivo...</option>
              {annulmentReasons.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700"><ChevronDownIcon /></div>
          </div>
          {reason === 'Otro' && (
              <textarea 
                  className="w-full p-2 border border-gray-300 rounded-lg mt-2 animate-fade-in bg-white text-black" 
                  rows={3} 
                  placeholder="Especifique el motivo..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
              ></textarea>
          )}
        </div>
        
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button onClick={onClose} disabled={showConfirmation} className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 disabled:bg-gray-300 disabled:cursor-not-allowed">
            Cancelar
          </button>
          <button 
            onClick={handleConfirmClick}
            disabled={isConfirmDisabled || showConfirmation}
            className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Confirmar Anulación
          </button>
        </div>
      </div>
       <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
        @keyframes scale-in {
            from { transform: scale(0.5); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in { animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>
    </div>
  );
};

export default AnnulmentModal;