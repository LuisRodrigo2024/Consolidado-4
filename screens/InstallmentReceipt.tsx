import React from 'react';
import { Installment, SaleDetail } from '../types';

interface InstallmentReceiptProps {
  installment: Installment;
  saleDetails: SaleDetail[];
  onBack: () => void;
}

const InstallmentReceipt: React.FC<InstallmentReceiptProps> = ({ installment, saleDetails, onBack }) => {
  const sale = saleDetails.find(s => s.id === installment.saleId);

  if (!sale) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto text-center">
        <h2 className="text-2xl font-bold text-red-600">Error</h2>
        <p className="text-gray-600 mt-2">No se pudo encontrar la venta asociada a este pago.</p>
         <button 
            onClick={onBack}
            className="mt-6 bg-gray-600 text-white font-bold py-2 px-8 rounded-lg shadow-md hover:bg-gray-700 transition-colors"
        >
            Volver
        </button>
      </div>
    );
  }

  const payerInfo = installment.payerName 
    ? { label: "Persona que realiza el pago:", name: installment.payerName }
    : { label: "Pagado por:", name: sale.client };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto font-sans">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Comprobante de Pago de Cuota</h2>
        <p className="text-gray-500">Venta a Crédito</p>
      </div>

      <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-dashed">
        <div>
          <p className="font-semibold text-gray-700">Cliente:</p>
          <p className="text-gray-900 text-lg font-medium">{sale.client}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-700">Venta ID:</p>
          <p className="font-mono text-gray-900 text-lg">{sale.id}</p>
        </div>
      </div>

      <div className="mb-6 pb-4 border-b-2 border-dashed">
        <p className="font-semibold text-gray-700">{payerInfo.label}</p>
        <p className="text-gray-900 text-lg font-medium">{payerInfo.name}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
        <div>
            <p className="font-semibold text-gray-700">Cuota Pagada:</p>
            <p className="text-gray-900 font-medium">{installment.installmentNumber} de {installment.totalInstallments}</p>
        </div>
        <div className="text-right">
            <p className="font-semibold text-gray-700">Fecha de Vencimiento:</p>
            <p className="text-gray-900">{installment.dueDate}</p>
        </div>
         <div>
            <p className="font-semibold text-gray-700">Método de Pago:</p>
            <p className="text-gray-900 font-medium">{installment.paymentMethod}</p>
        </div>
         <div className="text-right">
            <p className="font-semibold text-gray-700">Fecha de Emisión:</p>
            <p className="text-gray-900">{new Date().toLocaleDateString('es-ES')}</p>
        </div>
      </div>

      <div className="flex justify-end mb-8">
        <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between font-bold text-3xl text-gray-900 pt-3 border-t-2 border-gray-300">
                <span>TOTAL PAGADO:</span>
                <span>{installment.amount}</span>
            </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500">
        <p>Este comprobante certifica el pago de la cuota especificada.</p>
        <p>Gracias por su pago.</p>
      </div>
      
       <div className="mt-10 text-center">
            <button 
                onClick={onBack}
                className="bg-gray-600 text-white font-bold py-2 px-8 rounded-lg shadow-md hover:bg-gray-700 transition-colors"
            >
                Volver
            </button>
        </div>
    </div>
  );
};

export default InstallmentReceipt;