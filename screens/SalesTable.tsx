import React from 'react';
import { Sale, SaleStatus } from '../types';
import {PlusIcon} from '../components/icons/iconsVentas';
import {SortIcon} from '../components/icons/iconsVentas';

interface SalesTableProps {
  sales: Sale[];
  onSelectSale: (saleId: string) => void;
}

const getStatusClass = (status: SaleStatus) => {
  switch (status) {
    case SaleStatus.Pending:
      return 'bg-yellow-100 text-yellow-800';
    case SaleStatus.Paid:
      return 'bg-green-100 text-green-800';
    case SaleStatus.Annulled:
      return 'bg-gray-200 text-gray-700';
    default:
      return 'text-gray-100 text-gray-800';
  }
};

const SalesTable: React.FC<SalesTableProps> = ({ sales, onSelectSale }) => {
  const headers = ['Venta', 'Vendedor', 'Fecha', 'Hora', 'Monto', 'Estado', 'Detalle'];
  
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
          {sales.map((sale, index) => (
            <tr key={sale.id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/50'} hover:bg-blue-100`}>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-r">{sale.id}</td>
              <td className="px-6 py-4 border-r text-gray-900">{sale.seller}</td>
              <td className="px-6 py-4 border-r text-gray-900">{sale.date}</td>
              <td className="px-6 py-4 border-r text-gray-900">{sale.time}</td>
              <td className="px-6 py-4 border-r text-gray-900">{sale.amount}</td>
              <td className="px-6 py-4 text-center border-r">
                <span
                  className={`inline-block px-3 py-1 text-xs font-bold rounded-full shadow-sm ${getStatusClass(sale.status)}`}
                  style={{ textShadow: '0 0 5px rgba(255,255,255,0.7)' }}
                >
                  {sale.status}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <button 
                  className="text-gray-700 hover:text-blue-600 transform hover:scale-125 transition-transform"
                  onClick={() => onSelectSale(sale.id)}
                  aria-label={`Ver detalle de venta ${sale.id}`}
                >
                  <PlusIcon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesTable;