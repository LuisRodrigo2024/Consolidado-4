import React from 'react';
import { CLIENT_DATA } from '../constants';
import { SortIcon } from '../components/icons/iconsClientes';
import type { Client } from '../types';

const headers = [
  'NOMBRE',
  'DISTRITO',
  'TELÉFONO',
  'CORREO',
  'FECHA REGISTRO',
];

interface ClientTableProps {
  onClientSelect: (client: Client) => void;
}

export const ClientTable: React.FC<ClientTableProps> = ({ onClientSelect }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
      <div className="overflow-x-auto h-full">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-white uppercase bg-blue-600">
            <tr>
              {headers.map(header => (
                <th key={header} scope="col" className="px-6 py-4 font-bold">
                  <div className="flex items-center gap-2">
                    {header}
                    <SortIcon className="w-4 h-4" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {CLIENT_DATA.map((client) => (
              <tr 
                key={client.id} 
                className="bg-white hover:bg-gray-100 cursor-pointer"
                onClick={() => onClientSelect(client)}
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{`${client.nombre}, ${client.apellidos}`}</td>
                <td className="px-6 py-4">{client.distrito}</td>
                <td className="px-6 py-4">{client.telefono}</td>
                <td className="px-6 py-4">{client.correo}</td>
                <td className="px-6 py-4">{client.fechaRegistro}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};