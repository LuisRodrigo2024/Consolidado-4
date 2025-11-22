

import React, { useMemo, useState } from 'react';
import { Order, Dispatch, DeletedOrder } from '../types';
import StatusBadge from './StatusBadge';
import DispatchStopsDetailModal from './DispatchStopsDetailModal';

type OrderWithStatus = (Order | DeletedOrder) & { status: 'Recibido' | 'En Proceso' | 'Completado' | 'Cancelado' };

interface OrderDispatchesModalProps {
  order: OrderWithStatus;
  dispatches: Dispatch[];
  onClose: () => void;
}

const OrderDispatchesModal: React.FC<OrderDispatchesModalProps> = ({ order, dispatches, onClose }) => {
  const [viewingStops, setViewingStops] = useState<Dispatch | null>(null);

  const associatedDispatches = useMemo(() => {
    const orderProductIds = new Set(order.products.map(p => p.id));
    return dispatches.filter(dispatch =>
      dispatch.stops.some(stop =>
        stop.products.some(product => orderProductIds.has(product.id))
      )
    );
  }, [order, dispatches]);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="dispatches-modal-title">
        <div className="bg-slate-50 rounded-2xl shadow-2xl p-6 w-full max-w-6xl flex flex-col max-h-[90vh] animate-fade-in-down">
          <h2 id="dispatches-modal-title" className="text-xl font-bold text-slate-800 mb-2">Despachos Asociados al Pedido</h2>
          <p className="text-sm text-slate-500 mb-4">Código Pedido: <span className="font-semibold text-slate-700">{order.code}</span></p>
          
          <div className="overflow-y-auto pr-2 -mr-2 flex-grow bg-white rounded-lg border border-slate-200 shadow-sm">
              {associatedDispatches.length > 0 ? (
                  <table className="min-w-full">
                      <thead className="bg-slate-100 sticky top-0">
                          <tr>
                              <th scope="col" className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">Código Despacho</th>
                              <th scope="col" className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">Fecha</th>
                              <th scope="col" className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">Operador</th>
                              <th scope="col" className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">Ayudantes</th>
                              <th scope="col" className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">Vehículo</th>
                              <th scope="col" className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">H. Salida (Est.)</th>
                              <th scope="col" className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">H. Regreso (Est.)</th>
                              <th scope="col" className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">H. Salida (Real)</th>
                              <th scope="col" className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">H. Regreso (Real)</th>
                              <th scope="col" className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">Estado</th>
                              <th scope="col" className="py-3 px-4 text-center font-semibold text-sm text-slate-600 uppercase">Acciones</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                          {associatedDispatches.map((dispatch) => (
                              <tr key={dispatch.id} className="text-slate-800 text-sm">
                                  <td className="py-3 px-4 font-medium text-slate-600">{dispatch.id}</td>
                                  <td className="py-3 px-4">{dispatch.date}</td>
                                  <td className="py-3 px-4">{dispatch.operator}</td>
                                  <td className="py-3 px-4 text-xs">{(dispatch.assistants && dispatch.assistants.length > 0) ? dispatch.assistants.join(', ') : 'N/A'}</td>
                                  <td className="py-3 px-4">{dispatch.vehicle}</td>
                                  <td className="py-3 px-4">{dispatch.startTime}</td>
                                  <td className="py-3 px-4">{dispatch.endTime}</td>
                                  <td className="py-3 px-4">{dispatch.actualStartTime || 'N/A'}</td>
                                  <td className="py-3 px-4">{dispatch.actualEndTime || 'N/A'}</td>
                                  <td className="py-3 px-4"><StatusBadge status={dispatch.status} /></td>
                                  <td className="py-3 px-4 text-center">
                                      <button
                                          onClick={() => setViewingStops(dispatch)}
                                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1 px-3 rounded-md transition-colors duration-200 text-xs shadow-sm border border-slate-300">
                                          Ver Paradas
                                      </button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              ) : (
                  <div className="p-8 text-center text-slate-500">
                      No se encontraron despachos para este pedido.
                  </div>
              )}
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

      {viewingStops && (
        <DispatchStopsDetailModal
            dispatch={viewingStops}
            onClose={() => setViewingStops(null)}
        />
      )}
    </>
  );
};

export default OrderDispatchesModal;