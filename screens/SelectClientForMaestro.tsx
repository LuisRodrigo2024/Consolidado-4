
import React from 'react';
import { CLIENT_DATA } from '../constants';
import { SearchIcon, SortIcon, CheckIcon, CloseIcon } from '../components/icons/iconsClientes';
import type { Client } from '../types';

const headers = [
  'NOMBRE',
  'RUC',
  'DISTRITO',
  'ACCIÓN',
];

export const SelectClientForMaestro: React.FC<{ onCancel: () => void; onSelect: (client: Client) => void; }> = ({ onCancel, onSelect }) => {
  return (
    <div className="flex-grow flex flex-col items-center pt-4">
      <div className="w-full max-w-5xl text-center">
        <h2 className="text-3xl font-bold text-gray-800">Seleccionar Cliente Base para Registro de Maestro</h2>
        <p className="text-gray-600 mt-2 mb-6">
          Busca y selecciona el cliente que deseas registrar como Maestro. Solo los clientes existentes pueden ser registrados como Maestros.
        </p>

        <div className="relative w-full max-w-md mx-auto mb-6">
            <input 
                type="text" 
                className="border-2 border-gray-300 bg-white h-10 px-5 pr-12 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-full"
                placeholder="Buscar por Nombre, RUC o Distrito..."
            />
            <button type="button" onClick={() => {}} className="absolute right-0 top-0 mt-1 mr-1 p-2 bg-blue-600 rounded-md hover:bg-blue-700">
                <SearchIcon className="text-white h-4 w-4" />
            </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-white uppercase bg-blue-600">
                <tr>
                    {headers.map(header => (
                    <th key={header} scope="col" className="px-6 py-4 font-bold">
                        <div className="flex items-center gap-2">
                        {header}
                        {header !== 'ACCIÓN' && <SortIcon className="w-4 h-4" />}
                        </div>
                    </th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {CLIENT_DATA.map((client) => (
                    <tr key={client.id} className="bg-white hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{`${client.nombre}, ${client.apellidos}`}</td>
                    <td className="px-6 py-4">{client.ruc}</td>
                    <td className="px-6 py-4">{client.distrito}</td>
                    <td className="px-6 py-4">
                        <button onClick={() => onSelect(client)} className="flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition-all text-xs">
                            Seleccionar
                            <CheckIcon className="w-4 h-4" />
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>

        <div className="mt-8">
            <button
                onClick={onCancel}
                className="flex items-center gap-2 bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-all shadow mx-auto">
                Cancelar
                <CloseIcon className="w-4 h-4" />
            </button>
        </div>

      </div>
    </div>
  );
};
