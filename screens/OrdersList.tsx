import React from 'react';
import { Screen, OrdenCompra } from '../types';
import { BackIcon, PurchaseOrderIcon, MonitoringIcon } from '../components/icons/IconsAbastecimiento';

interface OrdersListProps {
  onNavigate: (screen: Screen) => void;
  orders: OrdenCompra[];
  onViewOrder: (order: OrdenCompra) => void;
}

const OrdersList: React.FC<OrdersListProps> = ({ onNavigate, orders, onViewOrder }) => {
  
  const getStatusClass = (status: OrdenCompra['estado']) => {
    switch(status) {
        case 'Emitida': return 'text-blue-700 bg-blue-100';
        case 'En Proceso': return 'text-indigo-700 bg-indigo-100';
        case 'Programada': return 'text-yellow-700 bg-yellow-100';
        case 'Cerrada': return 'text-green-700 bg-green-100';
        default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
            <button onClick={() => onNavigate(Screen.MainMenu)} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Volver al menú principal">
                <BackIcon className="h-6 w-6 text-gray-600"/>
            </button>
            <div className="flex items-center">
                <div className="w-16 h-16 mr-4 p-2 bg-sky-100 rounded-lg flex items-center justify-center">
                  <PurchaseOrderIcon className="w-12 h-12 text-sky-700"/>
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Órdenes de Compra</h1>
            </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-300">
        <table className="min-w-full bg-white">
          <thead className="bg-sky-700 text-white">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">CODIGO</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Proveedor</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Fecha Emisión</th>
              <th className="text-right py-3 px-4 uppercase font-semibold text-sm">Monto Total</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Estado</th>
              <th className="text-center py-3 px-4 uppercase font-semibold text-sm">Monitorear</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {orders.length === 0 ? (
                <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-500 italic">No se han generado órdenes de compra todavía.</td>
                </tr>
            ) : (
                orders.map((order, index) => (
                  <tr key={order.id_orden} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200 hover:bg-sky-50`}>
                    <td className="text-left py-3 px-4 font-medium">{parseInt(order.id_orden.split('-')[1], 10)}</td>
                    <td className="text-left py-3 px-4">{order.nombre_proveedor}</td>
                    <td className="text-left py-3 px-4">{order.fecha_emision}</td>
                    <td className="text-right py-3 px-4">S/. {order.monto_total_orden.toFixed(2)}</td>
                     <td className="text-left py-3 px-4">
                        <span className={`px-2 py-1 font-semibold leading-tight rounded-full ${getStatusClass(order.estado)}`}>
                           {order.estado}
                        </span>
                    </td>
                    <td className="text-center py-3 px-4">
                        {order.estado !== 'Cerrada' && (
                            <button onClick={() => onViewOrder(order)} className="text-sky-600 hover:text-sky-800" aria-label={`Monitorear orden ${order.id_orden}`}>
                                <MonitoringIcon className="w-6 h-6"/>
                            </button>
                        )}
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersList;