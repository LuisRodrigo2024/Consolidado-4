
import React, { useState, useMemo } from 'react';
import { Order } from '../types';
import { InfoIcon } from '../components/icons/IconsTransporte';

// FIX: Added 'Cancelado' to support all possible statuses from the parent component.
type ProductStatus = 'Recibido' | 'Programado' | 'En Camino' | 'Entregado' | 'Cancelado';

interface RescheduleModalProps {
  order: Order;
  productStatuses: Map<number, ProductStatus>;
  onClose: () => void;
  onConfirm: (updates: { productId: number, newDate: string, newDestination: string }[]) => void;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({ order, productStatuses, onClose, onConfirm }) => {
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [newDate, setNewDate] = useState('');
  const [newDestination, setNewDestination] = useState('');

  const modifiableProducts = useMemo(() => {
    return order.products.filter(p => {
        const status = productStatuses.get(p.id);
        return status !== 'En Camino' && status !== 'Entregado';
    });
  }, [order.products, productStatuses]);

  const nonModifiableProductsExist = modifiableProducts.length < order.products.length;

  const handleToggleProduct = (productId: number) => {
    setSelectedProductIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };
  
  const handleToggleAll = () => {
    if (selectedProductIds.length === modifiableProducts.length) {
        setSelectedProductIds([]);
    } else {
        setSelectedProductIds(modifiableProducts.map(p => p.id));
    }
  };

  const handleConfirm = () => {
    if (selectedProductIds.length > 0 && (newDate || newDestination)) {
        const updates = selectedProductIds.map(id => ({
            productId: id,
            newDate,
            newDestination
        }));
        onConfirm(updates);
    }
  };

  const isAllModifiableSelected = modifiableProducts.length > 0 && selectedProductIds.length === modifiableProducts.length;
  const canConfirm = selectedProductIds.length > 0 && (newDate !== '' || newDestination.trim() !== '');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" role="dialog" aria-modal="true">
      <div className="bg-slate-50 rounded-2xl shadow-2xl p-6 w-full max-w-3xl flex flex-col max-h-[90vh]">
        <h2 className="text-xl font-bold text-slate-800 mb-1">Reprogramar Artículos</h2>
        <p className="text-sm text-slate-500 mb-4">Pedido: <span className="font-semibold text-slate-700">{order.code}</span></p>
        
        {nonModifiableProductsExist && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4 flex items-start">
            <InfoIcon className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-yellow-800">
              Algunos artículos ya están <span className="font-bold">En Camino</span> o han sido <span className="font-bold">Entregados</span> y no pueden ser modificados.
            </p>
          </div>
        )}

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex-grow overflow-hidden flex flex-col">
           <div className="overflow-y-auto">
                <table className="min-w-full">
                    <thead className="bg-slate-100 sticky top-0">
                        <tr>
                            <th scope="col" className="py-3 px-4 w-12">
                                <input 
                                    type="checkbox"
                                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    checked={isAllModifiableSelected}
                                    onChange={handleToggleAll}
                                    disabled={modifiableProducts.length === 0}
                                    aria-label="Seleccionar todos los artículos"
                                />
                            </th>
                            <th scope="col" className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">Producto</th>
                            <th scope="col" className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">Destino Actual</th>
                            <th scope="col" className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">Fecha Actual</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {order.products.map(product => {
                            const status = productStatuses.get(product.id);
                            const isModifiable = status !== 'En Camino' && status !== 'Entregado';
                            return (
                                <tr key={product.id} className={`transition-colors ${!isModifiable ? 'bg-slate-100 text-slate-500' : 'hover:bg-slate-50'} ${selectedProductIds.includes(product.id) ? 'bg-blue-50' : ''}`}>
                                    <td className="py-3 px-4">
                                        <input 
                                            type="checkbox"
                                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-200"
                                            checked={selectedProductIds.includes(product.id)}
                                            onChange={() => handleToggleProduct(product.id)}
                                            disabled={!isModifiable}
                                            aria-label={`Seleccionar ${product.name}`}
                                        />
                                    </td>
                                    <td className="py-3 px-4 text-sm text-slate-800">{product.name}</td>
                                    <td className="py-3 px-4 text-sm text-slate-600">{product.destination}</td>
                                    <td className="py-3 px-4 text-sm text-slate-600">{product.deliveryDate}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
           </div>
        </div>

        {selectedProductIds.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-bold text-blue-800 mb-3 text-base">Nuevos Datos de Entrega ({selectedProductIds.length} artículos)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="new-date" className="block text-sm font-medium text-slate-700 mb-1">Nueva Fecha de Entrega</label>
                        <input
                            id="new-date"
                            type="date"
                            value={newDate}
                            onChange={e => setNewDate(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                     <div>
                        <label htmlFor="new-destination" className="block text-sm font-medium text-slate-700 mb-1">Nueva Dirección de Destino</label>
                        <input
                            id="new-destination"
                            type="text"
                            value={newDestination}
                            placeholder="Dejar en blanco para no cambiar"
                            onChange={e => setNewDestination(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                </div>
            </div>
        )}

        <div className="flex justify-end items-center mt-6 space-x-3">
            <button onClick={onClose} className="bg-white hover:bg-slate-100 text-slate-700 font-bold py-2.5 px-6 rounded-lg transition-colors duration-200 text-sm border border-slate-300 shadow-sm">
                Cancelar
            </button>
            <button 
                onClick={handleConfirm} 
                disabled={!canConfirm}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors duration-200 text-sm shadow-sm disabled:bg-slate-400 disabled:cursor-not-allowed">
                Confirmar Cambios
            </button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleModal;
