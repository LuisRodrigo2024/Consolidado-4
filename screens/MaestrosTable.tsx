import React from 'react';
import { MAESTRO_DATA } from '../constants';
import { SortIcon } from '../components/icons/iconsClientes';
import type { Maestro } from '../types';

const headers = [
  'NOMBRE',
  'RUC',
  'DISTRITO',
  'TELÉFONO',
  'CORREO',
  'ESPECIALIDAD',
  'FECHA REGISTRO',
];

interface MaestrosTableProps {
  onMaestroSelect: (maestro: Maestro) => void;
}

export const MaestrosTable: React.FC<MaestrosTableProps> = ({ onMaestroSelect }) => {
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
            {MAESTRO_DATA.map((maestro) => (
              <tr 
                key={maestro.id} 
                className="bg-white hover:bg-gray-100 cursor-pointer"
                onClick={() => onMaestroSelect(maestro)}
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{`${maestro.nombre}, ${maestro.apellidos}`}</td>
                <td className="px-6 py-4">{maestro.ruc}</td>
                <td className="px-6 py-4">{maestro.distrito}</td>
                <td className="px-6 py-4">{maestro.telefono}</td>
                <td className="px-6 py-4">{maestro.correo}</td>
                <td className="px-6 py-4">{maestro.especialidad}</td>
                <td className="px-6 py-4">{maestro.fechaRegistro}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};