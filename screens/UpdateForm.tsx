
import React from 'react';
import type { Client, Maestro } from '../types';
import { UserIcon, CameraIcon, RefreshIcon, CloseIcon } from '../components/icons/iconsClientes';

interface UpdateFormProps {
    client?: Client;
    maestro?: Maestro;
    onCancel: () => void;
    onOpenContacts: () => void;
    onOpenDirecciones: () => void;
}

const InputField: React.FC<{ label: string; defaultValue?: string; className?: string }> = ({ label, defaultValue, className }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <input
            type="text"
            defaultValue={defaultValue}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white ${className}`}
        />
    </div>
);

const SelectField: React.FC<{ label: string; defaultValue?: string; }> = ({ label, defaultValue }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <select defaultValue={defaultValue} className="w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white">
            <option>RUC</option>
            <option>DNI</option>
        </select>
    </div>
);

const ActionButton: React.FC<{ label: string, onClick: () => void, primary?: boolean }> = ({ label, onClick, primary = false }) => (
    <button 
        onClick={onClick}
        className={`flex items-center justify-center gap-2 w-full text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all ${primary ? 'bg-teal-500 hover:bg-teal-600' : 'bg-teal-600 hover:bg-teal-700'}`}
    >
        {label}
        <RefreshIcon className="w-5 h-5" />
    </button>
);


export const UpdateForm: React.FC<UpdateFormProps> = ({ client, maestro, onCancel, onOpenContacts, onOpenDirecciones }) => {
    const person = client || maestro;
    if (!person) return null;

    return (
        <div className="flex-grow flex justify-center items-start pt-8">
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Left Section */}
                <div className="md:col-span-2 p-6 border border-blue-300 rounded-lg bg-white flex items-start gap-8">
                    <div className="flex flex-col items-center gap-2">
                        <UserIcon className="w-24 h-24 text-gray-300" />
                        <button className="flex items-center gap-2 bg-gray-700 text-white text-xs font-bold py-1 px-3 rounded-md hover:bg-gray-800">
                            <CameraIcon className="w-4 h-4" />
                            CAMBIAR IMAGEN
                        </button>
                    </div>
                    <div className="flex-grow space-y-4">
                        <h3 className="text-lg font-bold text-gray-800">AGREGAR DOCUMENTO</h3>
                        <SelectField label="Tipo de Documento:" defaultValue="RUC" />
                        <InputField label="Número de Documento:" defaultValue={person.ruc} />
                    </div>
                </div>

                {/* Right Section */}
                <div className="md:col-span-1 p-6 border border-blue-300 rounded-lg bg-white">
                    <div className="space-y-4">
                        <InputField label="*Nombre:" defaultValue={`${person.nombre}, ${person.apellidos}`} />
                        {maestro && (
                            <InputField label="*Especialidad:" defaultValue={maestro.especialidad} />
                        )}
                        <p className="text-xs text-gray-500 pt-2">(*) Es un campo obligatorio</p>
                        
                        <div className="space-y-3 pt-4 border-t">
                            <ActionButton label="ACTUALIZAR DATOS" onClick={() => {}} primary />
                             <ActionButton label="ACTUALIZAR CONTACTOS" onClick={onOpenContacts} />
                            <ActionButton label="ACTUALIZAR DIRECCIONES" onClick={onOpenDirecciones} />
                            <button
                                onClick={onCancel}
                                className="flex items-center justify-center gap-2 w-full bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-all shadow mt-2">
                                CANCELAR
                                <CloseIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};