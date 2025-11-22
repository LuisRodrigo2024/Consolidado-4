
import React from 'react';
import { Dispatch } from '../types';
import StatusBadge from './StatusBadge';

interface DispatchStopsDetailModalProps {
  dispatch: Dispatch;
  onClose: () => void;
}

const DispatchStopsDetailModal: React.FC<DispatchStopsDetailModalProps> = ({ dispatch, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="stops-detail-modal-title">
      <div className="bg-slate-50 rounded-2xl shadow-2xl p-6 w-full max-w-3xl flex flex-col max-h-[90vh] animate-fade-in-down">
        <h2 id="stops-detail-modal-title" className="text-xl font-bold text-slate-800 mb-2">Detalle de Paradas del Despacho</h2>
        <p className="text-sm text-slate-500 mb-4">Código Despacho: <span className="font-semibold text-slate-700">{dispatch.id}</span></p>
        
        <div className="overflow-y-auto pr-2 -mr-2 flex-grow bg-white rounded-lg border border-slate-200 shadow-sm">
            <table className="min-w-full">
                <thead className="bg-slate-100 sticky top-0">
                    <tr>
                        <th scope="col" className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">Secuencia</th>
                        <th scope="col" className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">Origen</th>
                        <th scope="col" className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">Destino</th>
                        <th scope="col" className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">Hora de Llegada</th>
                        <th scope="col" className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">Estado</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                    {dispatch.stops.sort((a, b) => a.sequence - b.sequence).map((stop) => (
                        <tr key={stop.id} className="text-slate-800 text-sm">
                            <td className="py-3 px-4 text-center font-bold text-slate-500">{stop.sequence}</td>
                            <td className="py-3 px-4">{stop.origin}</td>
                            <td className="py-3 px-4">{stop.destination}</td>
                            <td className="py-3 px-4">{stop.arrivalTime || 'N/A'}</td>
                            <td className="py-3 px-4"><StatusBadge status={stop.status} /></td>
                        </tr>
                    ))}
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

export default DispatchStopsDetailModal;
