import React, { useState, useMemo } from 'react';
import SalesTable from './SalesTable';
import {SearchIcon} from '../components/icons/iconsVentas';
import {AddIcon} from '../components/icons/iconsVentas';
import { SaleVentas, SaleDetail, ModalType, Installment, PendingPayment } from '../types';
import SaleDetailComponent from './SaleDetail';
import CashRegisterModal from './CashRegisterModal';
import RegisterSale from './RegisterSale';
import PaymentSchedule from './PaymentSchedule';
import PaymentReceipt from './PaymentReceipt';
import InstallmentReceipt from './InstallmentReceipt';
import {HomeIcon} from '../components/icons/iconsVentas';
import {SalesHeaderIcon} from '../components/icons/iconsVentas';

interface MainContentProps {
  sales: SaleVentas[];
  saleDetails: SaleDetail[];
  selectedSaleDetail: SaleDetail | null;
  onSelectSale: (saleId: string) => void;
  onBack: () => void;
  isCashRegisterOpen: boolean;
  modalType: ModalType;
  onToggleCashRegister: () => void;
  onConfirmAction: () => void;
  onCloseModal: () => void;
  isRegisteringSale: boolean;
  onStartRegisterSale: () => void;
  onCancelRegisterSale: () => void;
  onRegisterSale: (newSale: SaleDetail) => void;
  viewingPaymentInfoFor: string | null;
  onShowPaymentInfo: (saleId: string) => void;
  onBackToDetail: () => void;
  viewingInstallmentReceipt: Installment | null;
  onShowInstallmentReceipt: (installment: Installment) => void;
  onBackToSchedule: () => void;
  onGoToMainMenu: () => void;
  onRegisterPayment: (payment: PendingPayment) => void;
  onOpenClaimModal: (sale: SaleDetail, type: 'return' | 'exchange') => void;
  onOpenAnnulmentModal: (sale: SaleDetail) => void;
}

const MainContent: React.FC<MainContentProps> = ({ 
  sales,
  saleDetails,
  selectedSaleDetail, 
  onSelectSale, 
  onBack,
  isCashRegisterOpen,
  modalType,
  onToggleCashRegister,
  onConfirmAction,
  onCloseModal,
  isRegisteringSale,
  onStartRegisterSale,
  onCancelRegisterSale,
  onRegisterSale,
  viewingPaymentInfoFor,
  onShowPaymentInfo,
  onBackToDetail,
  viewingInstallmentReceipt,
  onShowInstallmentReceipt,
  onBackToSchedule,
  onGoToMainMenu,
  onRegisterPayment,
  onOpenClaimModal,
  onOpenAnnulmentModal,
}) => {

  const [searchTerm, setSearchTerm] = useState('');

  const toggleBgClass = isCashRegisterOpen ? 'bg-green-500' : 'bg-gray-300';
  const toggleCircleClass = isCashRegisterOpen ? 'translate-x-6' : 'translate-x-1';
  
  const saleForPaymentInfo = viewingPaymentInfoFor ? saleDetails.find(s => s.id === viewingPaymentInfoFor) : null;

  const filteredSales = useMemo(() => {
    if (!searchTerm) {
        return sales;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return sales.filter(sale => {
        return Object.values(sale).some(value =>
            String(value).toLowerCase().includes(lowercasedFilter)
        );
    });
  }, [sales, searchTerm]);


  const renderContent = () => {
    if (viewingInstallmentReceipt) {
      return <InstallmentReceipt saleDetails={saleDetails} installment={viewingInstallmentReceipt} onBack={onBackToSchedule} />;
    }
    if (isRegisteringSale) {
      return <RegisterSale sales={sales} onCancel={onCancelRegisterSale} onRegister={onRegisterSale} />;
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
                onBack={onBack} 
                onShowPaymentInfo={() => onShowPaymentInfo(selectedSaleDetail.id)} 
                onOpenClaimModal={(type) => onOpenClaimModal(selectedSaleDetail, type)}
                onOpenAnnulmentModal={() => onOpenAnnulmentModal(selectedSaleDetail)}
             />;
    }
    return (
      <>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <SalesTable sales={filteredSales} onSelectSale={onSelectSale} />
        </div>
      </>
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
      <header className="flex justify-between items-start mb-6">
        <div className="flex items-center">
            <button 
              onClick={onGoToMainMenu} 
              className="mr-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              aria-label="Volver al menú principal"
            >
              <HomeIcon />
            </button>
            <div className="bg-[#16a34a] p-3 rounded-lg shadow-md">
                <SalesHeaderIcon />
            </div>
          <h1 className="text-4xl font-bold text-gray-800 ml-4">Ventas</h1>
        </div>
        {!isRegisteringSale && !selectedSaleDetail && !viewingPaymentInfoFor && (
            <div className="flex flex-col items-end space-y-2">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar venta..."
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
                <button 
                    onClick={onStartRegisterSale}
                    disabled={!isCashRegisterOpen}
                    className={`flex items-center justify-center font-semibold py-2 px-4 rounded-lg shadow-md transition-colors border ${
                        isCashRegisterOpen 
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 border-gray-300' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                    }`}
                >
                    <span className="mr-2">Registrar Venta</span>
                    <AddIcon />
                </button>
            </div>
        )}
      </header>
      {renderContent()}
    </main>
  );
};

export default MainContent;