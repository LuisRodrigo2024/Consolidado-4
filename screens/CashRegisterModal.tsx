import React, { useState, useEffect } from 'react';
import { ModalType } from '../types';
import {AttentionIcon} from '../components/icons/iconsVentas';
import {CloseIcon} from '../components/icons/iconsVentas';
import {CheckIcon} from '../components/icons/iconsVentas';

interface CashRegisterModalProps {
  type: ModalType;
  onConfirm: () => void;
  onClose: () => void;
}

type AnimationStatus = 'idle' | 'processing' | 'confirmed';

const CashRegisterModal: React.FC<CashRegisterModalProps> = ({ type, onConfirm, onClose }) => {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const [status, setStatus] = useState<AnimationStatus>('idle');

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-'));
    setCurrentTime(now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // Wait for animation to finish
  };

  const handleConfirm = () => {
    setStatus('processing');
    setTimeout(() => {
      onConfirm();
      setStatus('confirmed');
      setTimeout(() => {
        handleClose();
      }, 1200); // Time to show confirmation
    }, 1500); // Time to show processing
  };

  const isOpenModal = type === 'open';

  const modalContent = {
    title: '¡Atención!',
    description: isOpenModal
      ? 'Se procederá a abrir caja para el ingreso de ventas del día'
      : 'Se procederá a cerrar caja, no se podrán ingresar más ventas hasta la reapertura',
    confirmText: isOpenModal ? 'CONFIRMAR APERTURA' : 'CONFIRMAR CIERRE',
    confirmClass: isOpenModal ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600',
  };

  const animationClass = isClosing ? 'animate-fade-out-down' : 'animate-boing-in';
  const isActionInProgress = status !== 'idle';

  const renderOverlay = () => {
    if (status === 'processing') {
      return (
        <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col justify-center items-center rounded-2xl animate-fade-in z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          <p className="text-2xl font-bold text-gray-800 mt-6">
            {isOpenModal ? 'Abriendo Caja...' : 'Cerrando Caja...'}
          </p>
        </div>
      );
    }
    if (status === 'confirmed') {
      return (
        <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col justify-center items-center rounded-2xl animate-fade-in z-10">
          <div className="animate-scale-in">
            <CheckIcon />
          </div>
          <p className="text-2xl font-bold text-green-600 mt-4">
            {isOpenModal ? 'Caja Abierta' : 'Caja Cerrada'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className={`bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md relative ${animationClass}`}>
        {renderOverlay()}
        <button onClick={handleClose} disabled={isActionInProgress} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-50">
          <CloseIcon />
        </button>
        
        <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gray-100 mb-4">
                <AttentionIcon />
            </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{modalContent.title}</h2>
          <p className="text-gray-600 mb-6">{modalContent.description}</p>
        </div>

        <div className="space-y-4 mb-8">
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">FECHA:</label>
                <input 
                    type="date" 
                    id="date"
                    value={currentDate}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-center text-gray-900"
                />
            </div>
            <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">HORA:</label>
                <input 
                    type="time" 
                    id="time"
                    value={currentTime}
                    readOnly
                    step="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-center text-gray-900"
                />
            </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={isActionInProgress}
          className={`w-full text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md ${modalContent.confirmClass} disabled:bg-gray-400 disabled:cursor-not-allowed`}
        >
          {modalContent.confirmText}
        </button>
      </div>
       <style>{`
        @keyframes boing-in {
            0% {
                opacity: 0;
                transform: scale(0.5) translateY(20px);
            }
            80% {
                transform: scale(1.05) translateY(0);
            }
            100% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        .animate-boing-in {
            animation: boing-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes fade-out-down {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(20px);
            }
        }
        .animate-fade-out-down {
            animation: fade-out-down 0.3s ease-out forwards;
        }

        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
        }

        @keyframes scale-in {
            from { transform: scale(0.5); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
            animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default CashRegisterModal;