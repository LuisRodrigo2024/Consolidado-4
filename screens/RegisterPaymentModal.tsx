import React, { useState, useEffect } from 'react';
import { PendingPayment, SaleDetail } from '../types';
import {CloseIcon} from '../components/icons/iconsVentas';
import {BigAddIcon} from '../components/icons/iconsVentas';
import {ChevronDownIcon} from '../components/icons/iconsVentas';
import {CheckIcon} from '../components/icons/iconsVentas';

type PayerType = 'titular' | 'otro';
type PaymentMethod = 'Efectivo' | 'Tarjeta débito/crédito' | 'Transferencia bancaria' | 'Yape/Plin';

interface RegisterPaymentModalProps {
  pendingPayment: PendingPayment;
  saleDetail: SaleDetail;
  onClose: () => void;
  onConfirm: (saleId: string, installmentNumber: number, paymentDetails: { paymentDate: string; paymentMethod: PaymentMethod; payerName?: string }) => void;
}

const RegisterPaymentModal: React.FC<RegisterPaymentModalProps> = ({ pendingPayment, saleDetail, onClose, onConfirm }) => {
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Efectivo');
  const [payerType, setPayerType] = useState<PayerType>('titular');
  const [payerName, setPayerName] = useState('');
  const [payerPhone, setPayerPhone] = useState('');
  const [isFormValid, setIsFormValid] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const now = new Date();
    // Format to YYYY-MM-DD for input[type="date"]
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    setPaymentDate(`${year}-${month}-${day}`);
  }, []);

  useEffect(() => {
    if (payerType === 'otro') {
      setIsFormValid(payerName.trim() !== '' && payerPhone.trim() !== '');
    } else {
      setIsFormValid(true);
    }
  }, [payerType, payerName, payerPhone]);
  
  const handleConfirmClick = () => {
    if (!isFormValid) return;
    setShowConfirmation(true);
    
    const payerForRecord = payerType === 'otro' ? payerName : undefined;
    const [year, month, day] = paymentDate.split('-');
    const formattedDate = `${day}/${month}/${year}`;

    const paymentDetails = {
      paymentDate: formattedDate,
      paymentMethod,
      payerName: payerForRecord,
    };
    
    setTimeout(() => {
        onConfirm(pendingPayment.saleId, pendingPayment.installment.installmentNumber, paymentDetails);
    }, 1500);
  };
  
  const paymentMethods: PaymentMethod[] = ['Efectivo', 'Tarjeta débito/crédito', 'Transferencia bancaria', 'Yape/Plin'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in">
      <div className="bg-gray-50 rounded-lg p-8 shadow-2xl w-full max-w-2xl relative animate-fade-in-up">
        {showConfirmation && (
            <div className="absolute inset-0 bg-gray-50 bg-opacity-95 flex flex-col justify-center items-center rounded-lg animate-fade-in z-10">
                <div className="animate-scale-in">
                    <CheckIcon />
                </div>
                <p className="text-2xl font-bold text-green-600 mt-4">Pago Registrado</p>
            </div>
        )}
        
        <button onClick={onClose} disabled={showConfirmation} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed">
          <CloseIcon />
        </button>
        <header className="flex justify-between items-center mb-6 pb-4 border-b">
            <div>
                <h2 className="text-3xl font-bold text-gray-800">Registrar Pago</h2>
                <p className="text-gray-500">Cuota {pendingPayment.installment.installmentNumber} de {pendingPayment.installment.totalInstallments}</p>
            </div>
            <div className="text-right">
                <span className="text-xl font-semibold text-gray-700 mr-2">Venta:</span>
                <span className="bg-[#2b5977] text-white font-bold text-xl px-4 py-1.5 rounded-md shadow-md">{pendingPayment.saleId}</span>
            </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Sale info column */}
            <div className="border p-4 rounded-md bg-white shadow-sm">
                <h3 className="font-bold text-lg text-gray-700 mb-3 border-b pb-2">Información de la Venta</h3>
                <div className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-2 text-sm">
                    <p className="font-semibold text-gray-600">Cliente:</p>
                    <p className="text-gray-800 font-medium">{saleDetail.client}</p>
                    <p className="font-semibold text-gray-600">Vendedor(a):</p>
                    <p className="text-gray-800">{saleDetail.seller}</p>
                    {saleDetail.deliveryAddress && (
                        <>
                        <p className="font-semibold text-gray-600">Dirección:</p>
                        <p className="text-gray-800">{saleDetail.deliveryAddress}</p>
                        </>
                    )}
                </div>
            </div>

            {/* Payment details column */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Fecha de vencimiento:</label>
                    <input type="text" readOnly value={pendingPayment.installment.dueDate} className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 font-medium text-black"/>
                </div>
                <div>
                    <label htmlFor="payment-date" className="block text-sm font-semibold text-gray-600 mb-1">Fecha de pago:</label>
                    <input 
                      id="payment-date"
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md bg-white font-medium text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Monto:</label>
                    <input type="text" readOnly value={pendingPayment.installment.amount} className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 font-bold text-lg text-black"/>
                </div>
                <div>
                    <label htmlFor="payment-method" className="block text-sm font-semibold text-gray-600 mb-1">Método:</label>
                    <div className="relative">
                        <select id="payment-method" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} className="w-full appearance-none bg-white p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-black">
                            {paymentMethods.map(method => <option key={method} value={method}>{method}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <ChevronDownIcon />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="border-t pt-6">
            <h3 className="font-bold text-lg text-gray-700 mb-3">¿Quién realiza el pago?</h3>
            <div className="flex space-x-6 mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" name="payerType" value="titular" checked={payerType === 'titular'} onChange={() => setPayerType('titular')} className="form-radio h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-gray-800">El titular de la venta</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" name="payerType" value="otro" checked={payerType === 'otro'} onChange={() => setPayerType('otro')} className="form-radio h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-gray-800">Otra persona</span>
                </label>
            </div>
            
            {payerType === 'otro' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-4 rounded-md border border-blue-200 animate-fade-in">
                    <div>
                        <label htmlFor="payerName" className="block text-sm font-semibold text-gray-600 mb-1">Nombre*:</label>
                        <input id="payerName" type="text" value={payerName} onChange={(e) => setPayerName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" placeholder="Nombre de quien paga"/>
                    </div>
                     <div>
                        <label htmlFor="payerPhone" className="block text-sm font-semibold text-gray-600 mb-1">Teléfono*:</label>
                        <input id="payerPhone" type="tel" value={payerPhone} onChange={(e) => setPayerPhone(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" placeholder="N° de celular"/>
                    </div>
                </div>
            )}
            <p className="text-xs text-gray-500 mt-2">(*) De quien realiza el pago</p>
        </div>
        
        <footer className="flex justify-end space-x-4 mt-8">
            <button onClick={onClose} disabled={showConfirmation} className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
                Cancelar
            </button>
            <button 
                onClick={handleConfirmClick} 
                disabled={!isFormValid || showConfirmation}
                className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                <span className="mr-2">Registrar</span>
                <BigAddIcon />
            </button>
        </footer>
      </div>
       <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
        @keyframes scale-in {
            from { transform: scale(0.5); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in { animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>
    </div>
  );
};

export default RegisterPaymentModal;