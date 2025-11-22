

import React, { useMemo, useState } from 'react';
import { Order, Dispatch, DeletedOrder } from '../types';
import PageHeader from './PageHeader';
import InfoCard from './InfoCard';
import StatusBadge from './StatusBadge';
import { CalendarDaysIcon } from '../components/icons/IconsTransporte';
import { TrashIcon } from '../components/icons/IconsTransporte';
import RescheduleModal from './RescheduleModal';
import CancelItemsModal from './CancelItemsModal';
import TurnoBadge from './TurnoBadge';

interface TransportOrderDetailProps {
  order: Order;
  dispatches: Dispatch[];
  deletedOrders: DeletedOrder[];
  onBack: () => void;
  onCancelOrderItems: (orderCode: string, productIds: number[], reason: string) => void;
  onRescheduleOrder: (orderCode: string, updates: { productId: number, newDate: string, newDestination: string }[]) => void;
}

const TransportOrderDetail: React.FC<TransportOrderDetailProps> = ({ order, dispatches, deletedOrders, onBack, onCancelOrderItems, onRescheduleOrder }) => {
  const [isRescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);

  const { allProducts, productStatusMap, orderStatus, isDeletionDisabled } = useMemo(() => {
    const map = new Map<number, 'Recibido' | 'Programado' | 'En Camino' | 'Entregado' | 'Cancelado'>();
    
    // 1. Get statuses for active products
    for (const product of order.products) {
      map.set(product.id, 'Recibido');
    }

    for (const dispatch of dispatches) {
      for (const stop of dispatch.stops) {
        for (const product of stop.products) {
          if (map.has(product.id)) { // only for active products
            if (stop.status === 'Entregado') map.set(product.id, 'Entregado');
            else if (stop.status === 'En Camino' || dispatch.status === 'En Ruta') map.set(product.id, 'En Camino');
            else map.set(product.id, 'Programado');
          }
        }
      }
    }
    
    // 2. Find and add cancelled products and their statuses
    const cancelledProducts = deletedOrders
      .filter(d => d.code === order.code && d.isPartial)
      .flatMap(d => d.products);
    cancelledProducts.forEach(p => {
      map.set(p.id, 'Cancelado');
    });
    
    // Create the combined list for rendering
    const combinedProducts = [...order.products, ...cancelledProducts];

    // 3. Calculate overall order status
    const statuses = Array.from(map.values());
    let finalOrderStatus: 'Recibido' | 'En Proceso' | 'Completado' | 'Cancelado' = 'Recibido';

    const activeStatuses = statuses.filter(s => s !== 'Cancelado');
    
    if (activeStatuses.length === 0 && combinedProducts.length > 0) {
        finalOrderStatus = 'Cancelado';
    } else {
        const deliveredCount = activeStatuses.filter(s => s === 'Entregado').length;
        const processedCount = activeStatuses.filter(s => s === 'Programado' || s === 'En Camino').length;
        
        if (deliveredCount === activeStatuses.length && activeStatuses.length > 0) {
            finalOrderStatus = 'Completado';
        } else if (processedCount > 0 || deliveredCount > 0) {
            finalOrderStatus = 'En Proceso';
        }
    }
    
    // 4. Determine if deletion should be disabled (based on active products only)
    const isDeletionDisabledResult = order.products.every(p => {
        const status = map.get(p.id);
        return status === 'En Camino' || status === 'Entregado';
    });
    
    return { 
        allProducts: combinedProducts, 
        productStatusMap: map,
        orderStatus: finalOrderStatus,
        isDeletionDisabled: isDeletionDisabledResult
    };

  }, [order, dispatches, deletedOrders]);

  const handleConfirmReschedule = (updates: { productId: number, newDate: string, newDestination: string }[]) => {
    onRescheduleOrder(order.code, updates);
    setRescheduleModalOpen(false);
  };
  
  const handleConfirmCancel = (productIds: number[], reason: string) => {
    onCancelOrderItems(order.code, productIds, reason);
    setCancelModalOpen(false);
  };


  return (
    <>
      <main className="flex-1 p-6 md:p-10 flex flex-col" aria-labelledby="page-title">
        <PageHeader
          title={order.name}
          subtitle={order.code}
          onBack={onBack}
        />
        
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm">
            <span className="text-sm font-bold text-slate-500 mr-3">ESTADO DEL PEDIDO:</span>
            <StatusBadge status={orderStatus} />
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setRescheduleModalOpen(true)}
              className="flex items-center bg-white hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-lg transition-colors duration-200 border border-slate-300 shadow-sm">
              <CalendarDaysIcon className="h-5 w-5 mr-2 text-blue-600"/>
              Reprogramar
            </button>
            <button 
              onClick={() => setCancelModalOpen(true)}
              disabled={isDeletionDisabled}
              className="flex items-center bg-red-50 hover:bg-red-100 text-red-700 font-bold py-2 px-4 rounded-lg transition-colors duration-200 border border-red-200 shadow-sm disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed">
              <TrashIcon className="h-5 w-5 mr-2"/>
              Eliminar
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <InfoCard title="Información General">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <p className="text-sm text-slate-500">Razón Social</p>
                <p className="font-semibold text-slate-800 text-base">{order.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">RUC</p>
                <p className="font-semibold text-slate-800 text-base">-</p>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="Información de Contacto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
              <div>
                  <p className="text-sm text-slate-500">Dirección</p>
                  <p className="font-semibold text-slate-800 text-base">-</p>
              </div>
              <div>
                  <p className="text-sm text-slate-500">Correo Electrónico</p>
                  <p className="font-semibold text-slate-800 text-base">-</p>
              </div>
              <div>
                  <p className="text-sm text-slate-500">Teléfono</p>
                  <p className="font-semibold text-slate-800 text-base">{order.phone}</p>
              </div>
            </div>
          </InfoCard>
          
          <div className="bg-white rounded-xl shadow-md flex-grow flex flex-col overflow-hidden">
            <div className="p-6 pb-0">
                <h2 className="text-lg font-bold text-blue-800 mb-2">Artículos</h2>
                <hr className="border-t border-blue-200" />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
              <thead className="bg-blue-900 text-white">
                  <tr>
                    <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Producto</th>
                    <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Cantidad</th>
                    <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Unidad</th>
                    <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Destino</th>
                    <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Fecha Entrega</th>
                    <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Turno</th>
                    <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Estado</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                  {allProducts.map((product) => (
                  <tr key={product.id} className="text-slate-800 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">{product.name}</td>
                      <td className="py-4 px-6">{product.quantity}</td>
                      <td className="py-4 px-6">{product.unit}</td>
                      <td className="py-4 px-6">{product.destination}</td>
                      <td className="py-4 px-6">{product.deliveryDate}</td>
                      <td className="py-4 px-6">
                        <TurnoBadge turno={product.turno} />
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={productStatusMap.get(product.id)!} />
                      </td>
                  </tr>
                  ))}
              </tbody>
              </table>
          </div>
        </div>
        </div>
      </main>

      {isRescheduleModalOpen && (
        <RescheduleModal
          order={order}
          productStatuses={productStatusMap}
          onClose={() => setRescheduleModalOpen(false)}
          onConfirm={handleConfirmReschedule}
        />
      )}

      {isCancelModalOpen && (
        <CancelItemsModal
          order={order}
          productStatuses={productStatusMap}
          onClose={() => setCancelModalOpen(false)}
          onConfirm={handleConfirmCancel}
        />
      )}
    </>
  );
};

export default TransportOrderDetail;