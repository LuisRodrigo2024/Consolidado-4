import React, { useMemo } from 'react';
import { Dispatch } from '../types';

interface HourlyDispatchesModalProps {
    hour: number;
    dispatches: Dispatch[];
    onClose: () => void;
}

const HourlyDispatchesModal: React.FC<HourlyDispatchesModalProps> = ({ hour, dispatches, onClose }) => {
    
    const activeDispatches = useMemo(() => {
        return dispatches.filter(d => {
            if (!d.startTime || !d.endTime) return false;
            const startHour = parseInt(d.startTime.split(':')[0], 10);
            const endHour = parseInt(d.endTime.split(':')[0], 10);
            return startHour <= hour && endHour > hour;
        });
    }, [hour, dispatches]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" role="dialog" aria-modal="true">
            <div className="bg-slate-50 rounded-2xl shadow-2xl p-6 w-full max-w-3xl flex flex-col max-h-[90vh] animate-fade-in-down">
                <h2 className="text-xl font-bold text-slate-800 mb-2">Despachos Activos</h2>
                <p className="text-sm text-slate-500 mb-4">
                    Horario: <span className="font-semibold text-slate-700">{String(hour).padStart(2, '0')}:00 - {String(hour + 1).padStart(2, '0')}:00</span>
                </p>
                <div className="overflow-y-auto flex-grow bg-white rounded-lg border border-slate-200 shadow-sm">
                    {activeDispatches.length > 0 ? (
                        <table className="min-w-full">
                            <thead className="bg-slate-100 sticky top-0">
                                <tr>
                                    <th className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">Despacho</th>
                                    <th className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">Operador</th>
                                    <th className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">Vehículo</th>
                                    <th className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">H. Salida (Est.)</th>
                                    <th className="py-3 px-4 text-left font-semibold text-sm text-slate-600 uppercase">H. Regreso (Est.)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {activeDispatches.map(dispatch => (
                                    <tr key={dispatch.id} className="text-slate-800 text-sm">
                                        <td className="py-3 px-4 font-medium text-slate-600">{dispatch.id}</td>
                                        <td className="py-3 px-4">{dispatch.operator}</td>
                                        <td className="py-3 px-4">{dispatch.vehicle}</td>
                                        <td className="py-3 px-4">{dispatch.startTime}</td>
                                        <td className="py-3 px-4">{dispatch.endTime}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="p-8 text-center text-slate-500">No hay despachos activos en esta hora.</p>
                    )}
                </div>
                <div className="flex justify-end items-center mt-6 pt-4 border-t border-slate-200">
                    <button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors duration-200 text-sm shadow-sm">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HourlyDispatchesModal;