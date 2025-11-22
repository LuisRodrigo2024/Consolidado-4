import React from 'react';
import { SaleDetail } from '../types';

interface PaymentReceiptProps {
  sale: SaleDetail;
  onBack: () => void;
}

const PaymentReceipt: React.FC<PaymentReceiptProps> = ({ sale, onBack }) => {
  const productHeaders = ['ID', 'Descripción', 'Cant.', 'P. Unit.', 'Monto'];

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Comprobante de Pago</h2>
        <p className="text-gray-500">Venta Rápida</p>
      </div>

      <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-dashed">
        <div>
          <p className="font-semibold text-gray-700">Cliente:</p>
          <p className="text-gray-900">{sale.client}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-700">Venta ID:</p>
          <p className="font-mono text-gray-900">{sale.id}</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6 text-sm">
        <div>
          <p className="font-semibold text-gray-700">Fecha y Hora:</p>
          <p className="text-gray-900">{sale.dateTime}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-700">Vendedor(a):</p>
          <p className="text-gray-900">{sale.seller}</p>
        </div>
      </div>

      <div className="overflow-x-auto mb-6">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b-2 border-gray-300">
            <tr>
              {productHeaders.map((header) => (
                <th key={header} scope="col" className="pb-2 font-semibold text-gray-600 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sale.products.map((product) => (
              <tr key={product.id} className="border-b border-gray-200">
                <td className="py-3 font-mono text-gray-800">{product.id}</td>
                <td className="py-3 text-gray-800">{product.description}</td>
                <td className="py-3 text-center">{product.quantity}</td>
                <td className="py-3">{product.unitPrice}</td>
                <td className="py-3 font-semibold">{product.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-8">
        <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between font-medium text-gray-700">
                <span>Subtotal:</span>
                <span>{sale.total}</span>
            </div>
            <div className="flex justify-between font-medium text-gray-700">
                <span>Descuento Total:</span>
                <span>S/0.00</span>
            </div>
            <div className="flex justify-between font-bold text-2xl text-gray-900 pt-2 border-t-2 border-gray-300">
                <span>TOTAL:</span>
                <span>{sale.total}</span>
            </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500">
        <p>Gracias por su compra.</p>
        <p>Este es un comprobante de pago no fiscal.</p>
      </div>
      
       <div className="mt-8 text-center">
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

export default PaymentReceipt;
