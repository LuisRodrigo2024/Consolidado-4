import React from 'react';
import { Annulment } from '../types';
import {SortIcon} from '../components/icons/iconsVentas';
import {PlusIcon} from '../components/icons/iconsVentas';

interface AnnulmentsTableProps {
  annulments: Annulment[];
  onSelectSale: (saleId: string) => void;
}

const AnnulmentsTable: React.FC<AnnulmentsTableProps> = ({ annulments, onSelectSale }) => {
  const headers = ['Cód. Anulación', 'Venta', 'Cliente', 'Vendedor', 'Fecha', 'Monto', 'Motivo', 'Detalle'];
  
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-white uppercase bg-[#60a5fa]">
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col" className="px-6 py-3 border-r border-blue-400 last:border-r-0">
                <div className="flex items-center justify-between">
                  {header}
                  {header !== 'Detalle' && <SortIcon />}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {annulments.length === 0 ? (
            <tr>
                <td colSpan={headers.length} className="text-center py-8 text-gray-500">
                    No hay anulaciones registradas.
                </td>
            </tr>
          ) : (
            annulments.map((item, index) => (
              <tr key={item.id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/50'} hover:bg-blue-100`}>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-r">{item.id}</td>
                <td className="px-6 py-4 border-r font-medium text-gray-900">{item.saleId}</td>
                <td className="px-6 py-4 border-r text-gray-900">{item.client}</td>
                <td className="px-6 py-4 border-r text-gray-900">{item.seller}</td>
                <td className="px-6 py-4 border-r text-gray-900">{item.date}</td>
                <td className="px-6 py-4 border-r font-semibold text-gray-900">{item.amount}</td>
                <td className="px-6 py-4 border-r text-gray-900">{item.reason}</td>
                <td className="px-6 py-4 text-center">
                  <button 
                    className="text-gray-700 hover:text-blue-600 transform hover:scale-125 transition-transform"
                    onClick={() => onSelectSale(item.saleId)}
                    aria-label={`Ver detalle de venta anulada ${item.saleId}`}
                  >
                    <PlusIcon />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AnnulmentsTable;