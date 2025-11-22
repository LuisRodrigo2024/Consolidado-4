
import React from 'react';
import type { Client } from '../types';
import { AddIcon, CloseIcon } from '../components/icons/iconsClientes';

const ClientInfoCard: React.FC<{ client: Client }> = ({ client }) => (
    <div className="p-6 border border-blue-300 rounded-lg bg-white h-full">
        <h3 className="font-bold text-lg mb-4 text-gray-800">Cliente Base: {client.nombre}, {client.apellidos}</h3>
        <div className="space-y-2 text-sm text-gray-600">
            <p><span className="font-semibold">RUC:</span> {client.ruc}</p>
            <p><span className="font-semibold">Teléfono:</span> {client.telefono}</p>
            <p><span className="font-semibold">Correo:</span> {client.correo}</p>
            <p><span className="font-semibold">Dirección:</span> No especificada</p>
            <p><span className="font-semibold">Fecha de Registro:</span> {client.fechaRegistro}</p>
        </div>
    </div>
);

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

export const RegisterMaestroForm: React.FC<{ client: Client; onCancel: () => void; onSuccess: () => void; }> = ({ client, onCancel, onSuccess }) => {
    return (
        <div className="flex-grow flex flex-col items-center pt-10">
            <div className="w-full max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <ClientInfoCard client={client} />
                    <div className="space-y-6">
                        <InputField label="*RUC:" defaultValue={client.ruc} className="border-blue-300 border-dashed" />
                        <InputField label="*Especialidad:" className="border-black" />
                    </div>
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
