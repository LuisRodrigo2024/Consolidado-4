import React, { useMemo } from 'react';
import { Order, Dispatch, DeletedOrder } from '../types';
import StatusBadge from './StatusBadge';
import TurnoBadge from './TurnoBadge';

type ProductStatus = 'Recibido' | 'Programado' | 'En Camino' | 'Entregado' | 'Cancelado';

interface OrderItemsModalProps {
  order: Order | DeletedOrder;
  dispatches: Dispatch[];
  onClose: () => void;
  selectedDate: string;
}

const OrderItemsModal: React.FC<OrderItemsModalProps> = ({ order, dispatches, onClose, selectedDate }) => {
  const isCancelled = 'reason' in order;
  
  const [year, month, day] = selectedDate.split('-');
  const formattedSelectedDate = `${day}/${month}/${year}`;

  const productStatuses = useMemo(() => {
    const map = new Map<number, ProductStatus>();
    if (isCancelled) {
        order.products.forEach(p => map.set(p.id, 'Cancelado'));
        return map;
    }

    for (const product of order.products) {
      map.set(product.id, 'Recibido');
    }

    for (const dispatch of dispatches) {
      for (const stop of dispatch.stops) {
        for (const product of stop.products) {
          if (map.has(product.id)) {
            if (stop.status === 'Entregado') {
              map.set(product.id, 'Entregado');
            } else if (stop.status === 'En Camino' || dispatch.status === 'En Ruta') {
              map.set(product.id, 'En Camino');
            } else {
              map.set(product.id, 'Programado');
            }
          }
        }
      }
    }
    return map;
  }, [order, dispatches, isCancelled]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="items-modal-title">
      <div className="bg-slate-50 rounded-2xl shadow-2xl p-6 w-full max-w-4xl flex flex-col max-h-[90vh] animate-fade-in-down">
        <h2 id="items-modal-title" className="text-xl font-bold text-slate-800 mb-2">Detalle del Pedido</h2>
        <p className="text-sm text-slate-500 mb-4">Código: <span className="font-semibold text-slate-700">{order.code}</span></p>
        
        <div className="overflow-y-auto pr-2 -mr-2 flex-grow bg-white rounded-lg border border-slate-200 shadow-sm">
            <table className="min-w-full">
                <thead className="bg-slate-100 sticky top-0">
                    <tr>
                        <th scope="col" className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">Producto</th>
                        <th scope="col" className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">Cantidad</th>
                        <th scope="col" className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">Unidad</th>
                        <th scope="col" className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">Fecha Entrega</th>
                        <th scope="col" className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">Turno</th>
                        <th scope="col" className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">Estado</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                    {order.products.map((product) => {
                        const isHighlighted = product.deliveryDate === formattedSelectedDate;
                        return (
                            <tr key={product.id} className={`text-slate-800 ${isHighlighted ? 'bg-blue-100' : ''}`}>
                                <td className="py-3 px-4 text-sm">{product.name}</td>
                                <td className="py-3 px-4 text-sm">{product.quantity}</td>
                                <td className="py-3 px-4 text-sm">{product.unit}</td>
                                <td className="py-3 px-4 text-sm">{product.deliveryDate}</td>
                                <td className="py-3 px-4 text-sm"><TurnoBadge turno={product.turno} /></td>
                                <td className="py-3 px-4 text-sm"><StatusBadge status={productStatuses.get(product.id) || 'Recibido'} /></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
        
        <div className="flex justify-end items-center mt-6 pt-4 border-t border-slate-200">
            <button
                type="button"
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors duration-200 text-sm shadow-sm"
            >
                Cerrar
            </button>
        </div>
      </div>
    </div>
  );
};

export default OrderItemsModal;