
import React, { useState, useMemo } from 'react';
import { Order } from '../types';
import { InfoIcon } from '../components/icons/IconsTransporte';

// FIX: Added 'Cancelado' to support all possible statuses from the parent component.
type ProductStatus = 'Recibido' | 'Programado' | 'En Camino' | 'Entregado' | 'Cancelado';

interface CancelItemsModalProps {
  order: Order;
  productStatuses: Map<number, ProductStatus>;
  onClose: () => void;
  onConfirm: (productIds: number[], reason: string) => void;
}

const CancelItemsModal: React.FC<CancelItemsModalProps> = ({ order, productStatuses, onClose, onConfirm }) => {
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const cancellableProducts = useMemo(() => {
    return order.products.filter(p => {
        const status = productStatuses.get(p.id);
        return status !== 'En Camino' && status !== 'Entregado';
    });
  }, [order.products, productStatuses]);

  const nonCancellableProductsExist = cancellableProducts.length < order.products.length;

  const handleToggleProduct = (productId: number) => {
    setSelectedProductIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleConfirmPartial = () => {
    if (!reason.trim()) {
      setError('El motivo de la cancelación es obligatorio.');
      return;
    }
    if (selectedProductIds.length === 0) {
      setError('Debe seleccionar al menos un artículo para cancelar.');
      return;
    }
    onConfirm(selectedProductIds, reason.trim());
  };

  const handleConfirmTotal = () => {
    if (!reason.trim()) {
        setError('El motivo de la cancelación es obligatorio.');
        return;
    }
    const allCancellableIds = cancellableProducts.map(p => p.id);
    onConfirm(allCancellableIds, reason.trim());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" role="dialog" aria-modal="true">
      <div className="bg-slate-50 rounded-2xl shadow-2xl p-6 w-full max-w-3xl flex flex-col max-h-[90vh]">
        <h2 className="text-xl font-bold text-slate-800 mb-1">Cancelar Artículos del Pedido</h2>
        <p className="text-sm text-slate-500 mb-4">Pedido: <span className="font-semibold text-slate-700">{order.code}</span></p>
        
        {nonCancellableProductsExist && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4 flex items-start">
            <InfoIcon className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-yellow-800">
              Algunos artículos ya están <span className="font-bold">En Camino</span> o han sido <span className="font-bold">Entregados</span> y no se pueden cancelar.
            </p>
          </div>
        )}

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex-grow overflow-hidden flex flex-col">
           <div className="overflow-y-auto">
                <table className="min-w-full">
                    <thead className="bg-slate-100 sticky top-0">
                        <tr>
                            <th scope="col" className="py-3 px-4 w-12"><span className="sr-only">Seleccionar</span></th>
                            <th scope="col" className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">Producto</th>
                            <th scope="col" className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">Cantidad</th>
                            <th scope="col" className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {order.products.map(product => {
                            const status = productStatuses.get(product.id);
                            const isCancellable = status !== 'En Camino' && status !== 'Entregado';
                            return (
                                <tr key={product.id} className={`transition-colors ${!isCancellable ? 'bg-slate-100 text-slate-500' : 'hover:bg-slate-50'} ${selectedProductIds.includes(product.id) ? 'bg-blue-50' : ''}`}>
                                    <td className="py-3 px-4">
                                        <input 
                                            type="checkbox"
                                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-200"
                                            checked={selectedProductIds.includes(product.id)}
                                            onChange={() => handleToggleProduct(product.id)}
                                            disabled={!isCancellable}
                                            aria-label={`Seleccionar ${product.name}`}
                                        />
                                    </td>
                                    <td className="py-3 px-4 text-sm text-slate-800">{product.name}</td>
                                    <td className="py-3 px-4 text-sm text-slate-600">{product.quantity} {product.unit}</td>
                                    <td className="py-3 px-4 text-sm text-slate-600">{status}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
           </div>
        </div>

        <div className="mt-4">
            <label htmlFor="cancellation-reason" className="block text-sm font-medium text-slate-700 mb-1">
                Motivo de la cancelación (obligatorio)
            </label>
            <textarea
                id="cancellation-reason"
                value={reason}
                onChange={(e) => { setReason(e.target.value); setError(''); }}
                rows={2}
                className={`w-full border rounded-lg p-2 text-sm focus:outline-none ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'}`}
                placeholder="Ej: Cliente canceló el pedido, error en el ingreso, etc."
            />
            {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200">
            <button 
                onClick={handleConfirmTotal}
                disabled={cancellableProducts.length === 0}
                className="bg-red-50 hover:bg-red-100 text-red-700 font-bold py-2.5 px-6 rounded-lg transition-colors duration-200 text-sm border border-red-200 shadow-sm disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed">
                Cancelar Pedido Completo
            </button>
            <div className="flex items-center space-x-3">
                <button onClick={onClose} className="bg-white hover:bg-slate-100 text-slate-700 font-bold py-2.5 px-6 rounded-lg transition-colors duration-200 text-sm border border-slate-300 shadow-sm">
                    Volver
                </button>
                <button 
                    onClick={handleConfirmPartial} 
                    disabled={selectedProductIds.length === 0}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors duration-200 text-sm shadow-sm disabled:bg-slate-400 disabled:cursor-not-allowed">
                    Cancelar Items ({selectedProductIds.length})
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CancelItemsModal;
