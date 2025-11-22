
import React, { useState, useEffect } from 'react';
import { Product, UnidadMedida } from '../types';
import { CloseIcon, SaveIcon, BackIcon } from '../components/icons/IconsAbastecimiento';
import { UNIDADES_DE_MEDIDA } from '../constants';

interface ProductFormProps {
  initialData: Partial<Product>;
  onSave: (data: Partial<Product>) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Product>>(initialData);
  const isEditing = !!initialData.id_producto;

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = formData.nombre && formData.rubro && formData.familia && formData.clase && formData.unidad && formData.precio_base;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
        onSave(formData);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex items-center mb-8">
          <button onClick={onCancel} className="flex items-center text-sky-700 font-bold py-2 px-4 rounded-lg hover:bg-sky-100 transition-colors duration-200 mr-4">
              <BackIcon className="h-5 w-5 mr-2"/>
              Volver a la lista
          </button>
          <h1 className="text-3xl font-bold text-gray-800">{isEditing ? 'Editar Producto' : 'Registrar Producto'}</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="border-2 border-sky-700 rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="block">
                  <span className="text-gray-700">*Nombre:</span>
                  <input type="text" name="nombre" value={formData.nombre || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring focus:ring-sky-500 focus:ring-opacity-50" required />
              </label>
               <label className="block">
                  <span className="text-gray-700">*Rubro:</span>
                  <input type="text" name="rubro" value={formData.rubro || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring focus:ring-sky-500 focus:ring-opacity-50" required />
              </label>
               <label className="block">
                  <span className="text-gray-700">*Familia:</span>
                  <input type="text" name="familia" value={formData.familia || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring focus:ring-sky-500 focus:ring-opacity-50" required />
              </label>
                <label className="block">
                  <span className="text-gray-700">*Clase:</span>
                  <input type="text" name="clase" value={formData.clase || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring focus:ring-sky-500 focus:ring-opacity-50" required />
              </label>
               <label className="block">
                  <span className="text-gray-700">Marca:</span>
                  <input type="text" name="marca" value={formData.marca || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring focus:ring-sky-500 focus:ring-opacity-50" />
              </label>
               <label className="block">
                  <span className="text-gray-700">*Unidad:</span>
                  <select name="unidad" value={formData.unidad || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring focus:ring-sky-500 focus:ring-opacity-50" required>
                      <option value="" disabled>Seleccione una unidad</option>
                      {UNIDADES_DE_MEDIDA.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                  </select>
              </label>
               <label className="block">
                  <span className="text-gray-700">*Precio Base:</span>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">S/.</span>
                    <input type="number" step="0.01" name="precio_base" value={formData.precio_base || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm pl-9 focus:border-sky-500 focus:ring focus:ring-sky-500 focus:ring-opacity-50" required />
                  </div>
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
                    {isEditing ? 'Guardar Cambios' : 'Guardar'} <SaveIcon className="ml-2 w-5 h-5"/>
                </button>
            </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;