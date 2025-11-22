
import React from 'react';
import { CheckIcon } from '../components/icons/iconsClientes';

export const RegistrationSuccess: React.FC<{ onBackToList: () => void; message: string }> = ({ onBackToList, message }) => {
  return (
    <div className="flex-grow flex items-center justify-center bg-emerald-300 rounded-lg">
      <div className="text-center">
        <div className="inline-block bg-emerald-800 p-4 rounded-full">
          <CheckIcon className="w-16 h-16 text-white" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-black">
          {message}
        </h2>
        <button
          onClick={onBackToList}
          className="mt-8 bg-emerald-800 text-white font-bold py-2 px-6 rounded-lg hover:bg-emerald-900 transition-all shadow-md"
        >
          Volver a la Lista
        </button>
      </div>
    </div>
  );
};
