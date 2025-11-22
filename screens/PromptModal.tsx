
import React, { useState } from 'react';
import { ExclamationTriangleIcon } from '../components/icons/IconsTransporte';

interface PromptModalProps {
  action: 'edit' | 'delete';
  itemType: 'Vehículo' | 'Empleado';
  identifierName: 'placa' | 'código';
  placeholder: string;
  onClose: () => void;
  onConfirm: (identifier: string) => void;
  existingIdentifiers: string[];
}

const PromptModal: React.FC<PromptModalProps> = ({ 
  action, 
  itemType,
  identifierName,
  placeholder,
  onClose, 
  onConfirm, 
  existingIdentifiers 
}) => {
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');

  const titles = {
    edit: `Editar ${itemType}`,
    delete: `Eliminar ${itemType}`
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
        setError(`El campo de ${identifierName} no puede estar vacío.`);
        return;
    }
    const identifierExists = existingIdentifiers.some(p => p.toLowerCase() === identifier.toLowerCase());

    if (identifierExists) {
      onConfirm(identifier);
    } else {
      setError(`El ${identifierName} "${identifier}" no fue encontrado. Intente de nuevo.`);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdentifier(e.target.value);
    if(error) setError('');
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" role="dialog" aria-modal="true">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm flex flex-col text-center animate-fade-in-down">
        <h2 className="text-xl font-bold text-slate-800 mb-2">{titles[action]}</h2>
        <p className="text-slate-600 mb-4 text-sm">
            Por favor, ingrese el {identifierName} del {itemType.toLowerCase()} que desea {action === 'edit' ? 'editar' : 'eliminar'}.
        </p>
        
        <div className="w-full text-left mb-2">
            <label htmlFor="identifier-input" className="block text-sm font-medium text-slate-700 mb-1 capitalize">
                {identifierName} del {itemType.toLowerCase()}
            </label>
            <input
                id="identifier-input"
                value={identifier}
                onChange={handleChange}
                autoFocus
                className={`w-full border rounded-lg p-2.5 text-base focus:outline-none bg-white text-black placeholder:text-slate-400 ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'}`}
                placeholder={placeholder}
            />
        </div>
        
        {error && (
            <div className="flex items-start text-left text-red-600 text-sm p-2 rounded-md bg-red-50 border border-red-200">
                <ExclamationTriangleIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
            </div>
        )}

        <div className="grid grid-cols-2 gap-4 mt-6">
            <button
                type="button"
                onClick={onClose}
                className="bg-white hover:bg-slate-100 text-slate-700 font-bold py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm border border-slate-300 shadow-sm"
            >
                Cancelar
            </button>
            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm shadow-sm"
            >
                Confirmar
            </button>
        </div>
      </form>
    </div>
  );
};

export default PromptModal;