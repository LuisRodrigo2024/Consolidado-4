

import React from 'react';
import { SaleDetail, Installment, PendingPayment } from '../types';
import {SortIcon} from '../components/icons/iconsVentas';
import {ArrowLeftIcon} from '../components/icons/iconsVentas';

interface PaymentScheduleProps {
  sale: SaleDetail;
  onBack: () => void;
  onShowInstallmentReceipt: (installment: Installment) => void;
  onRegisterPayment: (payment: PendingPayment) => void;
}

const parseCurrency = (value: string): number => {
    if (typeof value !== 'string' || value.trim() === '-' || value.trim() === '') {
        return 0;
    }
    const numberValue = parseFloat(value.replace(/S\/\s*/, ''));
    return isNaN(numberValue) ? 0 : numberValue;
};


const PaymentSchedule: React.FC<PaymentScheduleProps> = ({ sale, onBack, onShowInstallmentReceipt, onRegisterPayment }) => {
  const headers = ['Fecha Vencimiento', 'Monto', 'Fecha de Pago', 'Método de Pago', 'Comprobante de Pago'];

  const totalAmount = parseCurrency(sale.total);
  const totalInstallments = sale.totalInstallments || 1;
  const paidInstallments = sale.paidInstallments || 0;
  const standardInstallment = parseFloat((totalAmount / totalInstallments).toFixed(2));

  const installments: Installment[] = Array.from({ length: totalInstallments }, (_, i) => {
    const installmentNumber = i + 1;
    
    const [saleDayStr, saleMonthStr, saleYearStr] = sale.dateTime.split(' ')[0].split('/');
    const saleDate = new Date(parseInt(saleYearStr), parseInt(saleMonthStr) - 1, parseInt(saleDayStr));
    
    // Calculate Due Date: First payment on sale date, subsequent payments monthly on the same day.
    const dueDate = new Date(saleDate);
    dueDate.setMonth(saleDate.getMonth() + i);

    const isPaid = installmentNumber <= paidInstallments;
    const isLastInstallment = installmentNumber === totalInstallments;
    const amount = isLastInstallment
      ? totalAmount - (standardInstallment * (totalInstallments - 1))
      : standardInstallment;

    // Calculate Payment Date for paid installments
    let paymentDateStr = undefined;
    if (isPaid) {
      // First installment is paid on sale date. Subsequent paid installments are on their due date.
      const paymentDateObj = new Date(dueDate);
      paymentDateStr = paymentDateObj.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    return {
      dueDate: dueDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      amount: `S/${amount.toFixed(2)}`,
      paymentMethod: isPaid ? (i % 2 === 0 ? 'Efectivo' : 'Transferencia') : '-',
      isPaid: isPaid,
      paymentDate: paymentDateStr,
      installmentNumber,
      totalInstallments,
      saleId: sale.id,
    };
  });

  const paidAmount = installments.filter(i => i.isPaid).reduce((acc, curr) => acc + parseCurrency(curr.amount), 0);
  const pendingAmount = totalAmount - paidAmount;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h2 className="text-3xl font-bold text-gray-800">Cronograma de Pagos</h2>
                <div className="mt-4 border p-4 rounded-md bg-gray-50 text-sm w-full max-w-xl">
                    <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2">
                        <p className="font-semibold text-gray-600">Cliente:</p>
                        <p className="text-gray-800 font-medium">{sale.client}</p>
                        <p className="font-semibold text-gray-600">Fecha y hora:</p>
                        <p className="text-gray-800">{sale.dateTime}</p>
                        <p className="font-semibold text-gray-600">Vendedor(a):</p>
                        <p className="text-gray-800">{sale.seller}</p>
                        {sale.deliveryAddress && (
                            <>
                                <p className="font-semibold text-gray-600">Dirección de entrega:</p>
                                <p className="text-gray-800">{sale.deliveryAddress}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="text-right">
                <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800 font-semibold mb-2 ml-auto">
                    <ArrowLeftIcon />
                    <span className="ml-2">Volver al detalle</span>
                </button>
                <p className="text-sm font-medium text-gray-500">Fecha: {new Date().toLocaleDateString('es-ES')}</p>
                <p className="text-sm font-medium text-gray-500">Hora: {new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})}h</p>
                <div className="flex items-center justify-end mt-4">
                    <span className="text-xl font-semibold text-gray-700 mr-3">Venta:</span>
                    <span className="bg-blue-600 text-white font-bold text-xl px-5 py-2 rounded-md shadow-md">{sale.id}</span>
                </div>
            </div>
        </div>

        <div className="overflow-x-auto mb-4 border rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-700">
                <thead className="text-xs text-white uppercase bg-[#2b5977]">
                    <tr>
                        {headers.map((header) => (
                            <th key={header} scope="col" className="px-6 py-3 border-r border-blue-900/20 last:border-r-0">
                                <div className="flex items-center justify-between">
                                    {header}
                                    <SortIcon />
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {installments.map((item, index) => {
                      const isPayable = !item.isPaid && item.installmentNumber === (sale.paidInstallments || 0) + 1;
                      return (
                        <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="px-6 py-3 font-medium border-r">{item.dueDate}</td>
                            <td className="px-6 py-3 font-medium border-r">{item.amount}</td>
                            <td className="px-6 py-3 border-r font-medium text-gray-600">{item.paymentDate || '-'}</td>
                            <td className="px-6 py-3 border-r">{item.paymentMethod}</td>
                            <td className="px-6 py-3 text-center">
                                {item.isPaid ? (
                                    <button 
                                        onClick={() => onShowInstallmentReceipt(item)}
                                        className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-orange-600 transition-colors text-xs"
                                    >
                                        VISUALIZAR COMPROBANTE
                                    </button>
                                ) : (
                                    <button 
                                      onClick={() => onRegisterPayment({ saleId: sale.id, clientName: sale.client, installment: item })}
                                      disabled={!isPayable}
                                      className={`font-bold py-2 px-4 rounded-lg shadow-md transition-colors text-xs ${
                                        isPayable 
                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                      }`}
                                    >
                                        PAGAR
                                    </button>
                                )}
                            </td>
                        </tr>
                      );
                    })}
                </tbody>
            </table>
        </div>

        <div className="flex justify-end">
            <div className="w-full max-w-sm space-y-2 text-base">
                <div className="flex justify-between items-center font-bold">
                    <span className="text-gray-800">Total:</span>
                    <span className="px-4 py-1.5 rounded-md text-gray-900 bg-blue-200 border-2 border-blue-400 w-40 text-right">{`S/${totalAmount.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between items-center font-bold">
                    <span className="text-gray-800">Pagado:</span>
                    <span className="px-4 py-1.5 rounded-md text-gray-900 bg-blue-200 border-2 border-blue-400 w-40 text-right">{`S/${paidAmount.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between items-center font-bold">
                    <span className="text-gray-800">Pendiente:</span>
                    <span className="px-4 py-1.5 rounded-md text-gray-900 bg-blue-200 border-2 border-blue-400 w-40 text-right">{`S/${pendingAmount.toFixed(2)}`}</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default PaymentSchedule;