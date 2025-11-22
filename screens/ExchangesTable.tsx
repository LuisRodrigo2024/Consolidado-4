import React from 'react';
import { Exchange } from '../types';
import {SortIcon} from '../components/icons/iconsVentas';

interface ExchangesTableProps {
  exchanges: Exchange[];
}

const ExchangesTable: React.FC<ExchangesTableProps> = ({ exchanges }) => {
  const headers = ['Cód. Cambio', 'Venta', 'Cliente', 'Fecha', 'Producto Devuelto', 'Producto Nuevo', 'Diferencia', 'Motivo'];
  
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-white uppercase bg-[#60a5fa]">
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col" className="px-6 py-3 border-r border-blue-400 last:border-r-0">
                <div className="flex items-center justify-between">
                  {header}
                  <SortIcon />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {exchanges.length === 0 ? (
            <tr>
                <td colSpan={headers.length} className="text-center py-8 text-gray-500">
                    No hay cambios registrados.
                </td>
            </tr>
          ) : (
            exchanges.map((item, index) => (
              <tr key={item.id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/50'} hover:bg-blue-100`}>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-r">{item.id}</td>
                <td className="px-6 py-4 border-r font-medium text-gray-900">{item.saleId}</td>
                <td className="px-6 py-4 border-r text-gray-900">{item.client}</td>
                <td className="px-6 py-4 border-r text-gray-900">{item.date}</td>
                <td className="px-6 py-4 border-r text-gray-900">{item.returnedProduct.description} ({item.returnedProduct.quantity})</td>
                <td className="px-6 py-4 border-r text-gray-900">{item.newProduct.description} ({item.newProduct.quantity})</td>
                <td className="px-6 py-4 border-r font-semibold text-gray-900">{item.priceDifference}</td>
                <td className="px-6 py-4 border-r text-gray-900">{item.reason}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExchangesTable;