

import React, { useState, useEffect } from 'react';
import { Vehicle, VehicleStatus } from '../types';

interface VehicleFormModalProps {
  onClose: () => void;
  onSave: (vehicle: Omit<Vehicle, 'id'> | Vehicle) => void;
  initialData?: Vehicle | null;
  existingPlacas: string[];
}

const emptyForm = {
    placa: '',
    tipo: '',
    marca: '',
    capacidadCarga: '',
    volumenCarga: '',
    licenciaRequerida: '',
    estado: 'Operativo' as VehicleStatus,
};

const VehicleFormModal: React.FC<VehicleFormModalProps> = ({ onClose, onSave, initialData, existingPlacas }) => {
  const isEditMode = !!initialData;
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof emptyForm, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        placa: initialData.placa,
        tipo: initialData.tipo,
        marca: initialData.marca,
        capacidadCarga: String(initialData.capacidadCarga),
        volumenCarga: String(initialData.volumenCarga),
        licenciaRequerida: initialData.licenciaRequerida,
        estado: initialData.estado,
      });
    } else {
        setFormData(emptyForm);
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof typeof emptyForm, string>> = {};
    if (!formData.placa.trim()) newErrors.placa = 'La placa es requerida.';
    else if (!isEditMode && existingPlacas.some(p => p.toLowerCase() === formData.placa.toLowerCase())) {
        newErrors.placa = 'Esta placa ya existe.';
    }
    if (!formData.tipo.trim()) newErrors.tipo = 'El tipo es requerido.';
    if (!formData.marca.trim()) newErrors.marca = 'La marca es requerida.';
    if (!formData.capacidadCarga) newErrors.capacidadCarga = 'La capacidad es requerida.';
    else if (isNaN(Number(formData.capacidadCarga))) newErrors.capacidadCarga = 'Debe ser un número.';
    if (!formData.volumenCarga) newErrors.volumenCarga = 'El volumen es requerido.';
    else if (isNaN(Number(formData.volumenCarga))) newErrors.volumenCarga = 'Debe ser un número.';
    if (!formData.licenciaRequerida.trim()) newErrors.licenciaRequerida = 'La licencia es requerida.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
        setErrors(prev => ({...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const vehicleData = {
        placa: formData.placa,
        tipo: formData.tipo,
        marca: formData.marca,
        capacidadCarga: Number(formData.capacidadCarga),
        volumenCarga: Number(formData.volumenCarga),
        licenciaRequerida: formData.licenciaRequerida,
        estado: formData.estado,
      };

      if (isEditMode && initialData) {
        onSave({ ...initialData, ...vehicleData });
      } else {
        onSave(vehicleData);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" role="dialog" aria-modal="true">
      <form onSubmit={handleSubmit} className="bg-slate-50 rounded-2xl shadow-2xl p-6 w-full max-w-2xl flex flex-col max-h-[90vh] animate-fade-in-down">
        <h2 className="text-xl font-bold text-slate-800 mb-4">{isEditMode ? 'Editar Vehículo' : 'Añadir Nuevo Vehículo'}</h2>
        
        <div className="overflow-y-auto pr-2 -mr-2 flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            
            {/* Placa */}
            <div>
              <label htmlFor="placa" className="block text-sm font-medium text-slate-700 mb-1">Placa</label>
              <input type="text" name="placa" id="placa" value={formData.placa} onChange={handleChange} disabled={isEditMode}
                     className={`w-full border rounded-lg p-2.5 text-sm text-black ${errors.placa ? 'border-red-500' : 'border-slate-300'} ${isEditMode ? 'bg-slate-200 cursor-not-allowed' : 'bg-white'}`} />
              {errors.placa && <p className="text-red-500 text-xs mt-1">{errors.placa}</p>}
            </div>
            
            {/* Tipo */}
            <div>
              <label htmlFor="tipo" className="block text-sm font-medium text-slate-700 mb-1">Tipo de Vehículo</label>
              <input type="text" name="tipo" id="tipo" value={formData.tipo} onChange={handleChange}
                     className={`w-full border rounded-lg p-2.5 text-sm text-black ${errors.tipo ? 'border-red-500' : 'border-slate-300 bg-white'}`} />
              {errors.tipo && <p className="text-red-500 text-xs mt-1">{errors.tipo}</p>}
            </div>

            {/* Marca */}
            <div className="md:col-span-2">
              <label htmlFor="marca" className="block text-sm font-medium text-slate-700 mb-1">Marca</label>
              <input type="text" name="marca" id="marca" value={formData.marca} onChange={handleChange}
                     className={`w-full border rounded-lg p-2.5 text-sm text-black ${errors.marca ? 'border-red-500' : 'border-slate-300 bg-white'}`} />
              {errors.marca && <p className="text-red-500 text-xs mt-1">{errors.marca}</p>}
            </div>

            {/* Capacidad de Carga */}
            <div>
              <label htmlFor="capacidadCarga" className="block text-sm font-medium text-slate-700 mb-1">Capacidad de Carga (ton)</label>
              <input type="number" name="capacidadCarga" id="capacidadCarga" value={formData.capacidadCarga} onChange={handleChange} step="0.1"
                     className={`w-full border rounded-lg p-2.5 text-sm text-black ${errors.capacidadCarga ? 'border-red-500' : 'border-slate-300 bg-white'}`} />
              {errors.capacidadCarga && <p className="text-red-500 text-xs mt-1">{errors.capacidadCarga}</p>}
            </div>

            {/* Volumen de Carga */}
            <div>
              <label htmlFor="volumenCarga" className="block text-sm font-medium text-slate-700 mb-1">Volumen de Carga (m³)</label>
              <input type="number" name="volumenCarga" id="volumenCarga" value={formData.volumenCarga} onChange={handleChange} step="0.1"
                     className={`w-full border rounded-lg p-2.5 text-sm text-black ${errors.volumenCarga ? 'border-red-500' : 'border-slate-300 bg-white'}`} />
              {errors.volumenCarga && <p className="text-red-500 text-xs mt-1">{errors.volumenCarga}</p>}
            </div>
            
            {/* Categoria Licencia */}
            <div>
              <label htmlFor="licenciaRequerida" className="block text-sm font-medium text-slate-700 mb-1">Categoría de Licencia</label>
              <input type="text" name="licenciaRequerida" id="licenciaRequerida" value={formData.licenciaRequerida} onChange={handleChange}
                     className={`w-full border rounded-lg p-2.5 text-sm text-black ${errors.licenciaRequerida ? 'border-red-500' : 'border-slate-300 bg-white'}`} />
              {errors.licenciaRequerida && <p className="text-red-500 text-xs mt-1">{errors.licenciaRequerida}</p>}
            </div>

            {/* Estado */}
            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-slate-700 mb-1">Estado Físico</label>
              <select name="estado" id="estado" value={formData.estado} onChange={handleChange}
                      disabled={!isEditMode}
                      className={`w-full border rounded-lg p-2.5 text-sm border-slate-300 text-black ${!isEditMode ? 'bg-slate-200 cursor-not-allowed' : 'bg-white'}`}>
                <option value="Operativo">Operativo</option>
                <option value="En Mantenimiento">En Mantenimiento</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end items-center mt-6 pt-4 border-t border-slate-200 space-x-3">
            <button type="button" onClick={onClose} className="bg-white hover:bg-slate-100 text-slate-700 font-bold py-2.5 px-6 rounded-lg transition-colors duration-200 text-sm border border-slate-300 shadow-sm">
                Cancelar
            </button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors duration-200 text-sm shadow-sm">
                Guardar
            </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleFormModal;