import React, { useState, useMemo } from 'react';
import {HomeIcon} from '../components/icons/iconsVentas';
import PaymentsTable from './PaymentsTable';
import InstallmentReceipt from './InstallmentReceipt';
import { Installment, ModalType, Payment, PendingPayment, SaleDetail } from '../types';
import PendingPaymentsTable from './PendingPaymentsTable';
import {PaymentsHeaderIcon} from '../components/icons/iconsVentas';
import CashRegisterModal from './CashRegisterModal';
import {SearchIcon} from '../components/icons/iconsVentas';

interface PaymentsViewProps {
    payments: Payment[];
    pendingPayments: PendingPayment[];
    saleDetails: SaleDetail[];
    onGoToMainMenu: () => void;
    onRegisterPayment: (payment: PendingPayment) => void;
    isCashRegisterOpen: boolean;
    modalType: ModalType;
    onToggleCashRegister: () => void;
    onConfirmAction: () => void;
    onCloseModal: () => void;
}

const PaymentsView: React.FC<PaymentsViewProps> = ({ 
    payments, 
    pendingPayments, 
    saleDetails, 
    onGoToMainMenu, 
    onRegisterPayment,
    isCashRegisterOpen,
    modalType,
    onToggleCashRegister,
    onConfirmAction,
    onCloseModal,
}) => {
    const [activeTab, setActiveTab] = useState<'realizados' | 'pendientes'>('realizados');
    const [viewingReceiptFor, setViewingReceiptFor] = useState<Installment | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleBgClass = isCashRegisterOpen ? 'bg-green-500' : 'bg-gray-300';
    const toggleCircleClass = isCashRegisterOpen ? 'translate-x-6' : 'translate-x-1';

    const handleShowReceipt = (payment: Payment) => {
        setViewingReceiptFor(payment.installment);
    };

    const handleBackToPayments = () => {
        setViewingReceiptFor(null);
    };
    
    const filteredPayments = useMemo(() => {
        if (!searchTerm) return payments;
        const lowercasedFilter = searchTerm.toLowerCase();
        return payments.filter(payment => 
            Object.values(payment).some(value =>
                String(value).toLowerCase().includes(lowercasedFilter)
            ) ||
            Object.values(payment.installment).some(value =>
                String(value).toLowerCase().includes(lowercasedFilter)
            )
        );
    }, [payments, searchTerm]);

    const filteredPendingPayments = useMemo(() => {
        if (!searchTerm) return pendingPayments;
        const lowercasedFilter = searchTerm.toLowerCase();
        return pendingPayments.filter(payment => 
            Object.values(payment).some(value =>
                String(value).toLowerCase().includes(lowercasedFilter)
            ) ||
            Object.values(payment.installment).some(value =>
                String(value).toLowerCase().includes(lowercasedFilter)
            )
        );
    }, [pendingPayments, searchTerm]);


    const renderContent = () => {
        if (viewingReceiptFor) {
            return <InstallmentReceipt saleDetails={saleDetails} installment={viewingReceiptFor} onBack={handleBackToPayments} />;
        }

        return (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {activeTab === 'realizados' ? (
                    <PaymentsTable payments={filteredPayments} onShowReceipt={handleShowReceipt} />
                ) : (
                    <PendingPaymentsTable 
                        pendingPayments={filteredPendingPayments} 
                        saleDetails={saleDetails}
                        onRegisterPayment={onRegisterPayment} 
                        isCashRegisterOpen={isCashRegisterOpen}
                    />
                )}
            </div>
        );
    };

    return (
        <main className="flex-1 p-8 overflow-y-auto bg-gray-50">
             {modalType && (
                <CashRegisterModal 
                    type={modalType} 
                    onConfirm={onConfirmAction}
                    onClose={onCloseModal} 
                />
            )}
            <header className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <button 
                      onClick={onGoToMainMenu} 
                      className="mr-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                      aria-label="Volver al menú principal"
                    >
                      <HomeIcon />
                    </button>
                    <div className="flex -space-x-4">
                        <div className="bg-[#16a34a] p-3 rounded-lg shadow-md"><PaymentsHeaderIcon /></div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 ml-4">Pagos</h1>
                </div>
                <div className="flex items-center space-x-4">
                     <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-64 pl-4 pr-10 py-2 border-2 border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <SearchIcon />
                        </div>
                    </div>
                    <button 
                        onClick={onToggleCashRegister}
                        className="flex items-center bg-[#2b5977] text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-[#3b82f6] transition-colors"
                    >
                        <span>{isCashRegisterOpen ? 'Cerrar Caja' : 'Abrir Caja'}</span>
                        <div className={`ml-3 w-12 h-6 ${toggleBgClass} rounded-full flex items-center p-1 transition-colors duration-300 ease-in-out`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform ${toggleCircleClass} transition-transform duration-300 ease-in-out`}></div>
                        </div>
                    </button>
                </div>
            </header>

            <div className="mb-6">
                <div className="flex border-b border-gray-300">
                    <button
                        onClick={() => setActiveTab('realizados')}
                        className={`py-3 px-6 font-semibold text-lg transition-colors duration-200 ${
                            activeTab === 'realizados'
                                ? 'border-b-4 border-blue-600 text-blue-700'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Pagos Realizados
                    </button>
                    <button
                        onClick={() => setActiveTab('pendientes')}
                        className={`py-3 px-6 font-semibold text-lg transition-colors duration-200 ${
                            activeTab === 'pendientes'
                                ? 'border-b-4 border-blue-600 text-blue-700'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Pagos Pendientes
                    </button>
                </div>
            </div>

            {renderContent()}
        </main>
    );
};

export default PaymentsView;