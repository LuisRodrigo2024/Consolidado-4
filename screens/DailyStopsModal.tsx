
import React from 'react';

interface StopInfo {
  origin: string;
  destination: string;
}

interface DailyStopsModalProps {
  date: string;
  stops: StopInfo[];
  onClose: () => void;
}

const DailyStopsModal: React.FC<DailyStopsModalProps> = ({ date, stops, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="stops-modal-title">
      <div className="bg-slate-50 rounded-2xl shadow-2xl p-6 w-full max-w-lg flex flex-col max-h-[90vh] animate-fade-in-down">
        <h2 id="stops-modal-title" className="text-xl font-bold text-slate-800 mb-2">Paradas Pendientes</h2>
        <p className="text-sm text-slate-500 mb-4">Fecha: <span className="font-semibold text-slate-700">{date}</span></p>
        
        <div className="overflow-y-auto pr-2 -mr-2 flex-grow bg-white rounded-lg border border-slate-200 shadow-sm">
            {stops.length > 0 ? (
                <table className="min-w-full">
                    <thead className="bg-slate-100 sticky top-0">
                        <tr>
                            <th scope="col" className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">Origen</th>
                            <th scope="col" className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">Destino</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {stops.map((stop, index) => (
                            <tr key={index} className="text-slate-800">
                                <td className="py-3 px-4 text-sm">{stop.origin}</td>
                                <td className="py-3 px-4 text-sm">{stop.destination}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="p-8 text-center text-slate-500">
                    No hay paradas pendientes para esta fecha.
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
  );
};

export default DailyStopsModal;
