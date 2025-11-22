import React from 'react';
import { Payment } from '../types';
import {SortIcon} from '../components/icons/iconsVentas';

interface PaymentsTableProps {
  payments: Payment[];
  onShowReceipt: (payment: Payment) => void;
}

const PaymentsTable: React.FC<PaymentsTableProps> = ({ payments, onShowReceipt }) => {
  const headers = ['Cód. Pago', 'Venta', 'N° Cuota', 'Fecha Pago', 'Monto', 'Comprobante'];
  
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-white uppercase bg-[#60a5fa]">
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col" className="px-6 py-3 border-r border-blue-400 last:border-r-0">
                <div className="flex items-center justify-between">
                  {header}
                  {header !== 'Comprobante' && <SortIcon />}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={payment.id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/50'} hover:bg-blue-100`}>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-r">{payment.id}</td>
              <td className="px-6 py-4 border-r font-medium text-gray-900">{payment.saleId}</td>
              <td className="px-6 py-4 border-r text-center text-gray-900">{`${payment.installment.installmentNumber} de ${payment.installment.totalInstallments}`}</td>
              <td className="px-6 py-4 border-r text-gray-900">{payment.installment.paymentDate}</td>
              <td className="px-6 py-4 border-r font-semibold text-gray-900">{payment.installment.amount}</td>
              <td className="px-6 py-4 text-center">
                <button 
                  onClick={() => onShowReceipt(payment)}
                  className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-orange-600 transition-colors text-xs"
                >
                  VISUALIZAR COMPROBANTE
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentsTable;