import React from 'react';
import { PendingPayment, SaleDetail } from '../types';
import {SortIcon} from '../components/icons/iconsVentas';
import {PayIcon} from '../components/icons/iconsVentas';

interface PendingPaymentsTableProps {
  pendingPayments: PendingPayment[];
  saleDetails: SaleDetail[];
  onRegisterPayment: (payment: PendingPayment) => void;
  isCashRegisterOpen: boolean;
}

const PendingPaymentsTable: React.FC<PendingPaymentsTableProps> = ({ pendingPayments, saleDetails, onRegisterPayment, isCashRegisterOpen }) => {
  const headers = ['Venta', 'Cliente', 'N° Cuota', 'Fecha Vencimiento', 'Monto', 'Condición', 'Acción'];
  
  const getConditionBadge = (dueDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to midnight for accurate comparison

    const [day, month, year] = dueDateStr.split('/').map(Number);
    const dueDate = new Date(year, month - 1, day);
    dueDate.setHours(0, 0, 0, 0); // Also normalize the due date

    if (dueDate < today) {
      return (
        <span className="bg-red-100 text-red-800 text-xs font-semibold px-3 py-1.5 rounded-full">
          Vencida
        </span>
      );
    } else {
      return (
        <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1.5 rounded-full">
          Pendiente
        </span>
      );
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-white uppercase bg-[#60a5fa]">
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col" className="px-6 py-3 border-r border-blue-400 last:border-r-0">
                <div className="flex items-center justify-between">
                  {header}
                  {header !== 'Acción' && <SortIcon />}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pendingPayments.length === 0 ? (
            <tr>
                <td colSpan={headers.length} className="text-center py-8 text-gray-500">
                    No hay pagos pendientes.
                </td>
            </tr>
          ) : (
            pendingPayments.map((payment, index) => {
                const sale = saleDetails.find(s => s.id === payment.saleId);
                const isPayable = sale ? payment.installment.installmentNumber === (sale.paidInstallments || 0) + 1 : false;
                const canPay = isPayable && isCashRegisterOpen;

                return (
                    <tr key={`${payment.saleId}-${payment.installment.installmentNumber}`} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/50'} ${canPay ? 'hover:bg-blue-100' : 'bg-gray-50'}`}>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-r">{payment.saleId}</td>
                        <td className="px-6 py-4 border-r text-gray-900">{payment.clientName}</td>
                        <td className="px-6 py-4 border-r text-center text-gray-900">{`${payment.installment.installmentNumber} de ${payment.installment.totalInstallments}`}</td>
                        <td className="px-6 py-4 border-r text-gray-900">{payment.installment.dueDate}</td>
                        <td className="px-6 py-4 border-r font-semibold text-gray-900">{payment.installment.amount}</td>
                        <td className="px-6 py-4 border-r text-center">
                            {getConditionBadge(payment.installment.dueDate)}
                        </td>
                        <td className="px-6 py-4 text-center">
                            <button 
                                onClick={() => onRegisterPayment(payment)}
                                disabled={!canPay}
                                className={`text-white p-2 rounded-full shadow-md transition-colors ${
                                    canPay 
                                    ? 'bg-green-500 hover:bg-green-600' 
                                    : 'bg-gray-400 cursor-not-allowed'
                                }`}
                                aria-label={canPay ? `Registrar pago para la venta ${payment.saleId}` : 'Pago no disponible'}
                                title={!isCashRegisterOpen ? 'La caja está cerrada. Abra la caja para registrar pagos.' : !isPayable ? 'Solo se puede pagar la siguiente cuota pendiente.' : 'Registrar Pago'}
                            >
                                <PayIcon />
                            </button>
                        </td>
                    </tr>
                )
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PendingPaymentsTable;