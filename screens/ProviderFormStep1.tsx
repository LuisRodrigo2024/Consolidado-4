import React, { useState, useEffect } from 'react';
import { Provider } from '../types';
import { CloseIcon, ContinueIcon, BackIcon } from '../components/icons/IconsAbastecimiento';

interface ProviderFormStep1Props {
  initialData: Partial<Provider>;
  onContinue: (data: Partial<Provider>) => void;
  onCancel: () => void;
}

const ProviderFormStep1: React.FC<ProviderFormStep1Props> = ({ initialData, onContinue, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Provider>>(initialData);
  const isEditing = !!initialData.id;

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = formData.nombre && formData.razonSocial && formData.ruc && formData.telefono;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
        onContinue(formData);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex items-center mb-8">
          <button onClick={onCancel} className="flex items-center text-sky-700 font-bold py-2 px-4 rounded-lg hover:bg-sky-100 transition-colors duration-200 mr-4">
              <BackIcon className="h-5 w-5 mr-2"/>
              Volver a la lista
          </button>
          <h1 className="text-3xl font-bold text-gray-800">{isEditing ? 'Actualizar Proveedor' : 'Registrar Proveedor'}: Paso 1</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="border-2 border-sky-700 rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                  <span className="text-gray-700">*Nombre Comercial:</span>
                  <input type="text" name="nombre" value={formData.nombre || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring focus:ring-sky-500 focus:ring-opacity-50" required />
              </label>
              <label className="block">
                  <span className="text-gray-700">*Razón Social:</span>
                  <input type="text" name="razonSocial" value={formData.razonSocial || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring focus:ring-sky-500 focus:ring-opacity-50" required />
              </label>
          </div>
          <label className="block md:w-1/2 pr-2">
              <span className="text-gray-700">*RUC:</span>
              <input 
                type="text" 
                name="ruc" 
                value={formData.ruc || ''} 
                onChange={handleChange} 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring focus:ring-sky-500 focus:ring-opacity-50 disabled:bg-gray-200 disabled:text-gray-500" 
                required
                disabled={isEditing}
              />
          </label>
        </div>

        <div className="border-2 border-sky-700 rounded-lg p-6 space-y-4">
            <label className="block">
                <span className="text-gray-700">Dirección:</span>
                <input type="text" name="direccion" value={formData.direccion || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring focus:ring-sky-500 focus:ring-opacity-50" />
            </label>
            <label className="block">
                <span className="text-gray-700">Correo:</span>
                <input type="email" name="correo" value={formData.correo || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring focus:ring-sky-500 focus:ring-opacity-50" />
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                    <span className="text-gray-700">*Telefono:</span>
                    <input type="tel" name="telefono" value={formData.telefono || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring focus:ring-sky-500 focus:ring-opacity-50" required />
                </label>
                <label className="block">
                    <span className="text-gray-700">WhatsApp:</span>
                    <input type="tel" name="whatsapp" value={formData.whatsapp || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring focus:ring-sky-500 focus:ring-opacity-50" />
                </label>
            </div>
        </div>
        
        <div className="flex justify-between items-center pt-4">
            <p className="text-gray-600">(*) Es un campo obligatorio</p>
            <div className="flex space-x-4">
                <button type="button" onClick={onCancel} className="flex items-center justify-center bg-gray-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-200">
                    Cancelar <CloseIcon className="ml-2 w-5 h-5"/>
                </button>
                <button type="submit" disabled={!isFormValid} className="flex items-center justify-center bg-sky-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-sky-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed">
                    Continuar <ContinueIcon className="ml-2 w-5 h-5"/>
                </button>
            </div>
        </div>
      </form>
    </div>
  );
};

export default ProviderFormStep1;