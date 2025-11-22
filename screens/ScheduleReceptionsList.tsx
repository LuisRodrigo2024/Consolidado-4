import React, { useMemo } from 'react';
import { Screen, OrdenCompra } from '../types';
import { BackIcon, CalendarPlusIcon } from '../components/icons/IconsAbastecimiento';

interface ScheduleReceptionsListProps {
  onNavigate: (screen: Screen) => void;
  orders: OrdenCompra[];
  onScheduleReception: (order: OrdenCompra) => void;
}

const ScheduleReceptionsList: React.FC<ScheduleReceptionsListProps> = ({ onNavigate, orders, onScheduleReception }) => {
  
  const schedulableOrders = useMemo(() => {
    return orders.filter(order => {
      // @FIX: Corrected the valid states to match the OrdenCompra['estado'] type.
      // The original states 'Enviada', 'En tránsito', and 'Programada para Recepción' are not valid.
      // Updated to include states that logically allow for scheduling new receptions.
      const validStates: OrdenCompra['estado'][] = ['Emitida', 'En Proceso', 'Programada'];
      if (!validStates.includes(order.estado)) {
        return false;
      }

      // Check if all items are fully scheduled
      const isFullyScheduled = order.items.every(item => {
        const totalProgramado = order.recepciones?.reduce((sum, recepcion) => {
          const recepcionItem = recepcion.items.find(ri => ri.nombre_producto === item.nombre_producto);
          return sum + (recepcionItem?.cantidad_programada || 0);
        }, 0) || 0;
        return totalProgramado >= item.cantidad_adjudicada;
      });

      return !isFullyScheduled;
    });
  }, [orders]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
            <button onClick={() => onNavigate(Screen.MainMenu)} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Volver al menú principal">
                <BackIcon className="h-6 w-6 text-gray-600"/>
            </button>
            <div className="flex items-center">
                <div className="w-16 h-16 mr-4 p-2 bg-sky-100 rounded-lg flex items-center justify-center">
                  <CalendarPlusIcon className="w-12 h-12 text-sky-700"/>
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Órdenes Pendientes de Recepción</h1>
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
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Estado</th>
              <th className="text-center py-3 px-4 uppercase font-semibold text-sm">Acción</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {schedulableOrders.length === 0 ? (
                <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-500 italic">No hay órdenes de compra pendientes de programación.</td>
                </tr>
            ) : (
                schedulableOrders.map((order, index) => (
                  <tr key={order.id_orden} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200 hover:bg-sky-50`}>
                    <td className="text-left py-3 px-4 font-medium">{parseInt(order.id_orden.split('-')[1], 10)}</td>
                    <td className="text-left py-3 px-4">{order.nombre_proveedor}</td>
                    <td className="text-left py-3 px-4">{order.fecha_emision}</td>
                    <td className="text-left py-3 px-4">{order.estado}</td>
                    <td className="text-center py-3 px-4">
                        <button onClick={() => onScheduleReception(order)} className="bg-sky-600 text-white text-xs font-bold py-2 px-3 rounded-md shadow-sm hover:bg-sky-700 transition-colors">
                            Programar Recepción
                        </button>
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

export default ScheduleReceptionsList;
