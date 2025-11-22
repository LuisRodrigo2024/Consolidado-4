import React, { useState } from 'react';
import { SaleDetail, SaleStatus, ProductStatus } from '../types';
import {SortIcon} from '../components/icons/iconsVentas';
import {ArrowLeftIcon} from '../components/icons/iconsVentas';
import { dispatchTimeSlotMap } from '../constants';
import {TransportIcon} from '../components/icons/iconsVentas';

interface SaleDetailProps {
  sale: SaleDetail;
  onBack: () => void;
  onShowPaymentInfo: () => void;
  onOpenClaimModal: (type: 'return' | 'exchange') => void;
  onOpenAnnulmentModal: () => void;
}

const getStatusClasses = (status: SaleStatus) => {
  switch (status) {
    case SaleStatus.Paid:
      return 'bg-green-100 text-green-800';
    case SaleStatus.Pending:
      return 'bg-yellow-100 text-yellow-800';
    case SaleStatus.Annulled:
        return 'bg-gray-200 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getProductStatusPillClasses = (status: ProductStatus) => {
    switch (status) {
        case ProductStatus.Entregado:
            return 'text-green-800 bg-green-200';
        case ProductStatus.PorEntregar:
            return 'text-yellow-800 bg-yellow-200';
        case ProductStatus.Devuelto:
            return 'text-gray-800 bg-gray-300';
        case ProductStatus.Cambiado:
            return 'text-blue-800 bg-blue-200';
        default:
            return 'text-gray-800 bg-gray-200';
    }
};


const SaleDetailComponent: React.FC<SaleDetailProps> = ({ sale, onBack, onShowPaymentInfo, onOpenClaimModal, onOpenAnnulmentModal }) => {
  const [claimMenuOpen, setClaimMenuOpen] = useState(false);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);

  const productHeaders = ['Producto', 'Descripción', 'Cantidad', 'Precio Unitario', 'Descuento', 'Puntos', 'Monto', 'Estado', 'Despacho'];
  const showPaymentSchedule = sale.paymentCondition === 'CRÉDITO';
  const isAnnulled = sale.status === SaleStatus.Annulled;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
            <h2 className="text-2xl font-semibold text-gray-700">Detalle de venta:</h2>
            <span className="ml-3 bg-blue-500 text-white font-bold text-lg px-4 py-1 rounded-md">{sale.id}</span>
        </div>
        <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800 font-semibold">
            <ArrowLeftIcon />
            <span className="ml-2">Volver al registro</span>
        </button>
      </div>

      <div className="overflow-x-auto mb-6">
        <table className="min-w-full text-sm text-left text-gray-500 border">
          <thead className="text-xs text-white uppercase bg-[#60a5fa]">
            <tr>
              {productHeaders.map((header) => (
                <th key={header} scope="col" className="px-4 py-3 border-r border-blue-400 last:border-r-0">
                  <div className="flex items-center justify-between">
                    {header}
                    <SortIcon />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sale.products.map((product, index) => (
              <React.Fragment key={product.id}>
                <tr className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/50'}`}>
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap border-r">{product.id}</td>
                  <td className="px-4 py-3 border-r text-gray-900">{product.description}</td>
                  <td className="px-4 py-3 border-r text-center text-gray-900">{product.quantity}</td>
                  <td className="px-4 py-3 border-r text-gray-900">{product.unitPrice}</td>
                  <td className="px-4 py-3 border-r text-gray-900">{product.discount}</td>
                  <td className="px-4 py-3 border-r text-center font-medium text-blue-600">{product.points}</td>
                  <td className="px-4 py-3 border-r text-gray-900">{product.amount}</td>
                  <td className="px-4 py-3 border-r text-center">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${getProductStatusPillClasses(product.status)}`}
                            style={{ textShadow: '0 0 5px rgba(255,255,255,0.7)' }}
                      >
                          {product.status}
                      </span>
                  </td>
                  <td className="px-4 py-3 border-r text-center">
                    {product.dispatchDate ? (
                        <button 
                            onClick={() => setExpandedProductId(prev => prev === product.id ? null : product.id)}
                            className="text-blue-600 hover:text-blue-800"
                            aria-label="Ver detalles de despacho"
                        >
                            <TransportIcon />
                        </button>
                    ) : (
                        <span>-</span>
                    )}
                  </td>
                </tr>
                {expandedProductId === product.id && (
                    <tr className="bg-blue-50">
                        <td colSpan={productHeaders.length} className="p-4 border-b">
                            <h4 className="font-bold text-sm text-blue-800 mb-2">Detalles del Despacho</h4>
                            <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 text-sm">
                                <p className="font-semibold text-gray-600">Dirección:</p>
                                <p className="text-gray-800">{product.deliveryAddress || 'No especificada'}</p>
                                <p className="font-semibold text-gray-600">Fecha:</p>
                                <p className="text-gray-800">{product.dispatchDate}</p>
                                {product.dispatchTimeSlot && (
                                    <>
                                        <p className="font-semibold text-gray-600">Horario:</p>
                                        <p className="text-gray-800">{product.dispatchTimeSlot} ({dispatchTimeSlotMap[product.dispatchTimeSlot]})</p>
                                    </>
                                )}
                            </div>
                        </td>
                    </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-semibold text-gray-900">
                <td colSpan={8} className="text-right px-6 py-3">Total:</td>
                <td className="bg-blue-200 px-6 py-3 text-base">{sale.total}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="border p-4 rounded-md mb-6 bg-gray-50">
        <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 text-sm">
          <p className="font-semibold text-gray-600">Cliente:</p>
          <p className="text-gray-800">{sale.client}</p>
          
          <p className="font-semibold text-gray-600">Fecha y hora:</p>
          <p className="text-gray-800">{sale.dateTime}</p>
          
          <p className="font-semibold text-gray-600">Vendedor(a):</p>
          <p className="text-gray-800">{sale.seller}</p>

          {sale.paymentCondition && (
            <>
              <p className="font-semibold text-gray-600 pt-2 border-t mt-2">Condición de pago:</p>
              <p className="text-gray-800 pt-2 border-t mt-2">{sale.paymentCondition === 'CONTADO' ? 'Contado' : 'Crédito'}</p>
              
              {sale.paymentCondition === 'CRÉDITO' && sale.totalInstallments != null && sale.paidInstallments != null && (
                <>
                  <p className="font-semibold text-gray-600">Cuotas pagadas:</p>
                  <p className="text-gray-800">{sale.paidInstallments} de {sale.totalInstallments}</p>
                  <p className="font-semibold text-gray-600">Cuotas pendientes:</p>
                  <p className="text-gray-800">{sale.totalInstallments - sale.paidInstallments}</p>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
            <span className="font-bold text-gray-600">Estado:</span>
            <span className={`px-4 py-1.5 rounded-md font-bold text-sm ${getStatusClasses(sale.status)}`}>{sale.status.toUpperCase()}</span>
            <span className="font-bold text-gray-600">Puntos Obtenidos:</span>
            <span className="bg-blue-100 text-blue-800 px-4 py-1.5 rounded-md font-bold text-sm">{sale.points}</span>
        </div>
        <div className="flex space-x-4">
            <div className="relative">
                <button 
                    onClick={() => !isAnnulled && setClaimMenuOpen(!claimMenuOpen)}
                    disabled={isAnnulled}
                    className={`font-bold py-2 px-6 rounded-lg shadow-md transition-colors ${
                      isAnnulled
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#052e44] text-white hover:bg-blue-900'
                    }`}
                >
                    RECLAMO
                </button>
                {claimMenuOpen && (
                    <div className="absolute bottom-full right-0 mb-2 w-56 bg-white rounded-md shadow-lg z-10 border animate-fade-in-up">
                        <button 
                            onClick={() => { onOpenClaimModal('return'); setClaimMenuOpen(false); }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Devolución
                        </button>
                        <button 
                            onClick={() => { onOpenClaimModal('exchange'); setClaimMenuOpen(false); }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Cambio de Producto
                        </button>
                        {sale.paymentCondition === 'CRÉDITO' && (
                             <button 
                                onClick={() => { onOpenAnnulmentModal(); setClaimMenuOpen(false); }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Anulación
                            </button>
                        )}
                    </div>
                )}
            </div>
            <button 
                onClick={onShowPaymentInfo}
                disabled={isAnnulled}
                className={`font-bold py-2 px-6 rounded-lg shadow-md transition-colors ${
                  isAnnulled
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
            >
                {showPaymentSchedule ? 'MOSTRAR CRONOGRAMA DE PAGOS' : 'MOSTRAR PAGO'}
            </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SaleDetailComponent;