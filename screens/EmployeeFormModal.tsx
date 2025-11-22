import React, { useState, useEffect } from 'react';
import { Employee, EmployeeStatus } from '../types';

interface EmployeeFormModalProps {
  onClose: () => void;
  onSave: (employee: Omit<Employee, 'id'> | Employee) => void;
  initialData?: Employee | null;
  existingCodigos: string[];
  nextEmployeeCode: string;
}

const emptyForm = {
    codigo: '',
    nombre: '',
    telefono: '',
    brevete: '',
    fechaVencimiento: '',
    estado: 'Activo' as EmployeeStatus,
};

const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({ onClose, onSave, initialData, existingCodigos, nextEmployeeCode }) => {
  const isEditMode = !!initialData;
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<typeof emptyForm, 'codigo'>, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        codigo: initialData.codigo,
        nombre: initialData.nombre,
        telefono: initialData.telefono,
        brevete: initialData.brevete,
        fechaVencimiento: initialData.fechaVencimiento,
        estado: initialData.estado,
      });
    } else {
        setFormData({
            ...emptyForm,
            codigo: nextEmployeeCode,
        });
    }
  }, [initialData, nextEmployeeCode]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Omit<typeof emptyForm, 'codigo' | 'estado'>, string>> = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido.';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido.';
    if (!formData.brevete.trim()) newErrors.brevete = 'El brevete es requerido.';
    if (!formData.fechaVencimiento) newErrors.fechaVencimiento = 'La fecha es requerida.';

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
      const employeeData = {
        codigo: formData.codigo,
        nombre: formData.nombre,
        telefono: formData.telefono,
        brevete: formData.brevete,
        fechaVencimiento: formData.fechaVencimiento,
        estado: formData.estado as EmployeeStatus,
      };

      if (isEditMode && initialData) {
        onSave({ ...initialData, ...employeeData });
      } else {
        onSave(employeeData);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" role="dialog" aria-modal="true">
      <form onSubmit={handleSubmit} className="bg-slate-50 rounded-2xl shadow-2xl p-6 w-full max-w-2xl flex flex-col max-h-[90vh] animate-fade-in-down">
        <h2 className="text-xl font-bold text-slate-800 mb-4">{isEditMode ? 'Editar Empleado' : 'Añadir Nuevo Empleado'}</h2>
        
        <div className="overflow-y-auto pr-2 -mr-2 flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            
            {/* Código */}
            <div>
              <label htmlFor="codigo" className="block text-sm font-medium text-slate-700 mb-1">Código</label>
              <input type="text" name="codigo" id="codigo" value={formData.codigo} 
                     disabled
                     className="w-full border rounded-lg p-2.5 text-sm border-slate-300 bg-white text-black cursor-not-allowed" />
            </div>
            
            {/* Nombre */}
            <div className="md:col-span-2">
              <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
              <input type="text" name="nombre" id="nombre" value={formData.nombre} onChange={handleChange}
                     className={`w-full border rounded-lg p-2.5 text-sm text-black ${errors.nombre ? 'border-red-500' : 'border-slate-300 bg-white'}`} />
              {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
              <input type="text" name="telefono" id="telefono" value={formData.telefono} onChange={handleChange}
                     className={`w-full border rounded-lg p-2.5 text-sm text-black ${errors.telefono ? 'border-red-500' : 'border-slate-300 bg-white'}`} />
              {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
            </div>

            {/* Brevete */}
            <div>
              <label htmlFor="brevete" className="block text-sm font-medium text-slate-700 mb-1">Brevete</label>
              <input type="text" name="brevete" id="brevete" value={formData.brevete} onChange={handleChange}
                     className={`w-full border rounded-lg p-2.5 text-sm text-black ${errors.brevete ? 'border-red-500' : 'border-slate-300 bg-white'}`} />
              {errors.brevete && <p className="text-red-500 text-xs mt-1">{errors.brevete}</p>}
            </div>
            
            {/* Fecha de Vencimiento */}
            <div>
              <label htmlFor="fechaVencimiento" className="block text-sm font-medium text-slate-700 mb-1">Fecha de Vencimiento</label>
              <input type="date" name="fechaVencimiento" id="fechaVencimiento" value={formData.fechaVencimiento} onChange={handleChange}
                     className={`w-full border rounded-lg p-2.5 text-sm text-black ${errors.fechaVencimiento ? 'border-red-500' : 'border-slate-300 bg-white'}`} />
              {errors.fechaVencimiento && <p className="text-red-500 text-xs mt-1">{errors.fechaVencimiento}</p>}
            </div>

            {/* Estado */}
            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
              <select name="estado" id="estado" value={formData.estado} onChange={handleChange}
                      disabled={!isEditMode}
                      className={`w-full border rounded-lg p-2.5 text-sm border-slate-300 text-black ${!isEditMode ? 'bg-slate-200 cursor-not-allowed' : 'bg-white'}`}>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                <option value="Con Licencia">Con Licencia</option>
                <option value="De Vacaciones">De Vacaciones</option>
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

export default EmployeeFormModal;