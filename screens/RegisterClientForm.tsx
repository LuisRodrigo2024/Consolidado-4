import React from 'react';
import { AddIcon, CloseIcon } from '../components/icons/iconsClientes';

const FormSection: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`p-6 border border-blue-300 rounded-lg bg-white ${className}`}>
    <div className="space-y-4">
        {children}
    </div>
  </div>
);

const InputField: React.FC<{ label: string; }> = ({ label }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type="text"
      className="w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
    />
  </div>
);

const SelectField: React.FC<{ label: string; }> = ({ label }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select className="w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white">
          <option>Seleccionar</option>
      </select>
    </div>
);


export const RegisterClientForm: React.FC<{ onCancel: () => void; onSuccess: () => void; }> = ({ onCancel, onSuccess }) => {
  return (
    <div className="flex-grow flex flex-col items-center pt-4">
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <FormSection className="md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SelectField label="*Tipo de Documento:" />
                    <InputField label="*Número de Documento:" />
                </div>
            </FormSection>

            <FormSection>
                <SelectField label="*Tipo persona:" />
                <InputField label="*Nombre:" />
                <InputField label="Teléfono:" />
                <InputField label="Correo:" />
            </FormSection>

            <FormSection>
                <InputField label="Distrito:" />
                <InputField label="Calle:" />
                <InputField label="Número:" />
                <InputField label="Ciudad:" />
            </FormSection>
        </div>
        
        <div className="flex justify-center items-center flex-col gap-4">
            <div className="flex gap-4">
                <button
                    onClick={onCancel}
                    className="flex items-center gap-2 bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-all shadow">
                    Cancelar
                    <CloseIcon className="w-4 h-4" />
                </button>
                <button
                    onClick={onSuccess}
                    className="flex items-center gap-2 bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-all shadow">
                    Registrar
                    <AddIcon className="w-5 h-5" />
                </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">(*) Es un campo obligatorio</p>
        </div>
      </div>
    </div>
  );
};