import React from 'react';
import { ConfirmationModalData } from '../types';

const ConfirmationModal: React.FC<ConfirmationModalData> = ({ isOpen, title, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-sky-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-sky-700 transition-colors duration-200"
          >
            Cerrar y Volver a Lista Principal
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;