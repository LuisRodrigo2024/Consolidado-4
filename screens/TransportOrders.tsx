import React, { useState, useMemo } from 'react';
import { SearchIcon } from '../components/icons/IconsTransporte';
import { Order, Dispatch } from '../types';
import PageHeader from './PageHeader';
import { TransportOrderIcon } from '../components/icons/IconsTransporte';
import StatusBadge from './StatusBadge';

interface TransportOrdersProps {
  orders: Order[];
  dispatches: Dispatch[];
  onViewOrder: (order: Order) => void;
  onGoHome: () => void;
}

const TransportOrders: React.FC<TransportOrdersProps> = ({ 
  orders, 
  dispatches,
  onViewOrder, 
  onGoHome,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const getOrderStatus = (order: Order): 'Recibido' | 'En Proceso' | 'Completado' => {
    const totalProducts = order.products.length;
    if (totalProducts === 0) return 'Recibido';

    const productStatusMap = new Map<number, 'Recibido' | 'Programado' | 'En Camino' | 'Entregado'>();
    for (const product of order.products) {
      productStatusMap.set(product.id, 'Recibido');
    }

    for (const dispatch of dispatches) {
      for (const stop of dispatch.stops) {
        for (const product of stop.products) {
          if (productStatusMap.has(product.id)) {
            if (stop.status === 'Entregado') {
              productStatusMap.set(product.id, 'Entregado');
            } else if (stop.status === 'En Camino' || dispatch.status === 'En Ruta') {
              productStatusMap.set(product.id, 'En Camino');
            } else {
              productStatusMap.set(product.id, 'Programado');
            }
          }
        }
      }
    }

    let deliveredCount = 0;
    let processedCount = 0;
    for (const status of productStatusMap.values()) {
        if (status === 'Entregado') {
            deliveredCount++;
            processedCount++;
        } else if (status === 'Programado' || status === 'En Camino') {
            processedCount++;
        }
    }
    
    if (deliveredCount === totalProducts) return 'Completado';
    if (processedCount > 0) return 'En Proceso';
    return 'Recibido';
  };

  const ordersWithStatus = useMemo(() => {
    return orders.map(order => ({
      ...order,
      status: getOrderStatus(order)
    })).filter(order => order.status !== 'Completado');
  }, [orders, dispatches]);

  const filteredOrders = ordersWithStatus.filter(order =>
    order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="flex-1 p-6 md:p-10 flex flex-col" aria-labelledby="page-title">
      <PageHeader
        title="Pedidos de Transporte"
        icon={<TransportOrderIcon className="h-8 w-8 text-blue-600" />}
        onBack={onGoHome}
      />

      <div className="bg-white rounded-xl shadow-md flex-grow flex flex-col">
        <div className="p-6 flex justify-start items-center border-b border-slate-200">
          <div className="relative">
            <label htmlFor="search-orders" className="sr-only">Buscar Pedidos</label>
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              id="search-orders"
              type="search"
              className="border border-slate-300 bg-white h-11 px-4 pl-11 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-80 text-black"
              placeholder="Buscar por cliente o código..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto flex-grow">
          <table className="min-w-full">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider rounded-tl-xl">Codigo Pedido</th>
                <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Nombre</th>
                <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Telefono</th>
                <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Estado</th>
                <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider rounded-tr-xl"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.code} className="text-slate-800 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-600">{order.code}</td>
                    <td className="py-4 px-6">{order.name}</td>
                    <td className="py-4 px-6">{order.phone}</td>
                    <td className="py-4 px-6"><StatusBadge status={order.status} /></td>
                    <td className="py-4 px-6 text-center">
                      <button 
                        onClick={() => onViewOrder(order)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-md transition-colors duration-200 text-xs shadow-sm hover:shadow-md">
                        VER
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                 <tr>
                    <td colSpan={5} className="text-center py-16 text-slate-500 font-semibold">
                      No se encontraron pedidos.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default TransportOrders;