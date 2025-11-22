import React from 'react';
import { PostQuoteModalData } from '../types';

const PostQuoteModal: React.FC<PostQuoteModalData> = ({ isOpen, title, message, onAddAnother, onFinish }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onFinish}
            className="bg-gray-500 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-200"
          >
            Finalizar Registro
          </button>
          <button
            onClick={onAddAnother}
            className="bg-sky-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-sky-700 transition-colors duration-200"
          >
            Añadir Otra Cotización
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostQuoteModal;
