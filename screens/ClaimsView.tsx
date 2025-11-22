import React, { useState, useMemo } from 'react';
import {HomeIcon} from '../components/icons/iconsVentas';
import {ClaimsHeaderIcon} from '../components/icons/iconsVentas';
import { SaleDetail, Return, Exchange, Annulment, Installment, PendingPayment } from '../types';
import { initialReturnsData, initialExchangesData } from '../constants';
import ReturnsTable from './ReturnsTable';
import ExchangesTable from './ExchangesTable';
import AnnulmentsTable from './AnnulmentsTable';
import SaleDetailComponent from './SaleDetail';
import PaymentSchedule from './PaymentSchedule';
import PaymentReceipt from './PaymentReceipt';
import InstallmentReceipt from './InstallmentReceipt';
import {SearchIcon} from '../components/icons/iconsVentas';

interface ClaimsViewProps {
    saleDetails: SaleDetail[];
    selectedSaleDetail: SaleDetail | null;
    onGoToMainMenu: () => void;
    onSelectSale: (saleId: string) => void;
    onBackFromDetail: () => void;
    viewingPaymentInfoFor: string | null;
    onShowPaymentInfo: (saleId: string) => void;
    onBackToDetail: () => void;
    viewingInstallmentReceipt: Installment | null;
    onShowInstallmentReceipt: (installment: Installment) => void;
    onBackToSchedule: () => void;
    onRegisterPayment: (payment: PendingPayment) => void;
    onOpenClaimModal: (sale: SaleDetail, type: 'return' | 'exchange') => void;
    annulments: Annulment[];
    onOpenAnnulmentModal: (sale: SaleDetail) => void;
}

const ClaimsView: React.FC<ClaimsViewProps> = ({ 
    saleDetails, 
    selectedSaleDetail, 
    onGoToMainMenu, 
    onSelectSale,
    onBackFromDetail,
    viewingPaymentInfoFor,
    onShowPaymentInfo,
    onBackToDetail,
    viewingInstallmentReceipt,
    onShowInstallmentReceipt,
    onBackToSchedule,
    onRegisterPayment,
    onOpenClaimModal,
    annulments,
    onOpenAnnulmentModal,
}) => {
    const [activeTab, setActiveTab] = useState<'devoluciones' | 'cambios' | 'anulaciones'>('devoluciones');
    const [searchTerm, setSearchTerm] = useState('');

    const returns: Return[] = initialReturnsData;
    const exchanges: Exchange[] = initialExchangesData;
    
    const filteredReturns = useMemo(() => {
        if (!searchTerm) return returns;
        const lowercasedFilter = searchTerm.toLowerCase();
        return returns.filter(item => Object.values(item).some(value => String(value).toLowerCase().includes(lowercasedFilter)));
    }, [returns, searchTerm]);

    const filteredExchanges = useMemo(() => {
        if (!searchTerm) return exchanges;
        const lowercasedFilter = searchTerm.toLowerCase();
        return exchanges.filter(item => 
            Object.values(item).some(value => {
                if (typeof value === 'object' && value !== null) {
                    return Object.values(value).some(nestedValue => String(nestedValue).toLowerCase().includes(lowercasedFilter));
                }
                return String(value).toLowerCase().includes(lowercasedFilter);
            })
        );
    }, [exchanges, searchTerm]);

    const filteredAnnulments = useMemo(() => {
        if (!searchTerm) return annulments;
        const lowercasedFilter = searchTerm.toLowerCase();
        return annulments.filter(item => Object.values(item).some(value => String(value).toLowerCase().includes(lowercasedFilter)));
    }, [annulments, searchTerm]);


    const saleForPaymentInfo = viewingPaymentInfoFor ? saleDetails.find(s => s.id === viewingPaymentInfoFor) : null;

    if (viewingInstallmentReceipt) {
      return <InstallmentReceipt saleDetails={saleDetails} installment={viewingInstallmentReceipt} onBack={onBackToSchedule} />;
    }
    if (saleForPaymentInfo) {
      if (saleForPaymentInfo.paymentCondition === 'CRÉDITO') {
        return <PaymentSchedule sale={saleForPaymentInfo} onBack={onBackToDetail} onShowInstallmentReceipt={onShowInstallmentReceipt} onRegisterPayment={onRegisterPayment} />;
      } else {
        return <PaymentReceipt sale={saleForPaymentInfo} onBack={onBackToDetail} />;
      }
    }
    if (selectedSaleDetail) {
      return <SaleDetailComponent 
                sale={selectedSaleDetail} 
                onBack={onBackFromDetail} 
                onShowPaymentInfo={() => onShowPaymentInfo(selectedSaleDetail.id)}
                onOpenClaimModal={(type) => onOpenClaimModal(selectedSaleDetail, type)} 
                onOpenAnnulmentModal={() => onOpenAnnulmentModal(selectedSaleDetail)}
             />;
    }

    const renderTables = () => {
        return (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {activeTab === 'devoluciones' && <ReturnsTable returns={filteredReturns} />}
                {activeTab === 'cambios' && <ExchangesTable exchanges={filteredExchanges} />}
                {activeTab === 'anulaciones' && <AnnulmentsTable annulments={filteredAnnulments} onSelectSale={onSelectSale} />}
            </div>
        );
    };

    return (
        <main className="flex-1 p-8 overflow-y-auto bg-gray-50">
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
                        <div className="bg-[#ef4444] p-3 rounded-lg shadow-md"><ClaimsHeaderIcon /></div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 ml-4">Reclamos</h1>
                </div>
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
            </header>

            <div className="mb-6">
                <div className="flex border-b border-gray-300">
                    <button
                        onClick={() => setActiveTab('devoluciones')}
                        className={`py-3 px-6 font-semibold text-lg transition-colors duration-200 ${
                            activeTab === 'devoluciones'
                                ? 'border-b-4 border-red-600 text-red-700'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Devoluciones
                    </button>
                    <button
                        onClick={() => setActiveTab('cambios')}
                        className={`py-3 px-6 font-semibold text-lg transition-colors duration-200 ${
                            activeTab === 'cambios'
                                ? 'border-b-4 border-red-600 text-red-700'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Cambios de Producto
                    </button>
                    <button
                        onClick={() => setActiveTab('anulaciones')}
                        className={`py-3 px-6 font-semibold text-lg transition-colors duration-200 ${
                            activeTab === 'anulaciones'
                                ? 'border-b-4 border-red-600 text-red-700'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Anulaciones
                    </button>
                </div>
            </div>

            {renderTables()}
        </main>
    );
};

export default ClaimsView;