
import React, { useMemo, useState } from 'react';
import { Order, Dispatch, Turno, DeletedOrder } from '../types';
import PageHeader from './PageHeader';
import { ChartBarIcon } from '../components/icons/IconsTransporte';
import { InboxArrowDownIcon } from '../components/icons/IconsTransporte';
import { HourglassIcon } from '../components/icons/IconsTransporte';
import { CheckBadgeIcon } from '../components/icons/IconsTransporte';
import { ArrowLeftIcon } from '../components/icons/IconsTransporte';
import { SunIcon } from '../components/icons/IconsTransporte';
import { ClockIcon } from '../components/icons/IconsTransporte';
import { MoonIcon } from '../components/icons/IconsTransporte';
import ReasonModal from './ReasonModal';
import { XCircleIcon } from '../components/icons/IconsTransporte';

interface CurrentStateProps {
  orders: Order[];
  dispatches: Dispatch[];
  deletedOrders: DeletedOrder[];
  onBack: () => void;
}

interface SummaryCardProps {
    title: string;
    count: number;
    icon: React.ReactNode;
    colorClasses: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, count, icon, colorClasses }) => (
    <div className={`p-6 rounded-xl flex items-center shadow-md transition-transform hover:scale-105 ${colorClasses}`}>
        <div className="mr-5 p-4 rounded-lg bg-white bg-opacity-30">
            {icon}
        </div>
        <div>
            <p className="text-lg font-semibold text-white opacity-90">{title}</p>
            <p className="text-4xl font-bold text-white">{count}</p>
        </div>
    </div>
);

const CurrentState: React.FC<CurrentStateProps> = ({ orders, dispatches, deletedOrders, onBack }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewingReason, setViewingReason] = useState<string | null>(null);

    const { receivedCount, scheduledCount, completedCount } = useMemo(() => {
        const scheduled = dispatches.filter(d => d.status === 'Programado').length;
        const completed = dispatches.filter(d => d.status === 'Completado').length;
        const allDispatchedProductIds = new Set(dispatches.flatMap(d => d.stops.flatMap(s => s.products.map(p => p.id))));
        let received = 0;
        for (const order of orders) {
            if (!order.products.some(p => allDispatchedProductIds.has(p.id))) {
                received++;
            }
        }
        return { receivedCount: received, scheduledCount: scheduled, completedCount: completed };
    }, [orders, dispatches]);

    const monthlyShiftData = useMemo(() => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const counts: Record<Turno, number> = { Mañana: 0, Tarde: 0, Noche: 0 };
        const allOrders = [...orders, ...deletedOrders];

        allOrders.forEach(order => {
            const shiftsInOrder = new Set<Turno>();
            order.products.forEach(product => {
                const [day, pMonth, pYear] = product.deliveryDate.split('/').map(Number);
                if (pYear === year && pMonth - 1 === month) {
                    shiftsInOrder.add(product.turno);
                }
            });

            shiftsInOrder.forEach(shift => {
                counts[shift]++;
            });
        });

        return counts;
    }, [currentDate, orders, deletedOrders]);

    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const totalShiftOrders = monthlyShiftData.Mañana + monthlyShiftData.Tarde + monthlyShiftData.Noche;

    return (
      <>
        <main className="flex-1 p-6 md:p-10 flex flex-col space-y-8" aria-labelledby="page-title">
            <PageHeader
                title="Estado Actual de Operaciones"
                icon={<ChartBarIcon className="h-8 w-8 text-emerald-800" />}
                onBack={onBack}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard title="Pedidos Recibidos" count={receivedCount} icon={<InboxArrowDownIcon className="h-8 w-8 text-white" />} colorClasses="bg-gradient-to-br from-yellow-400 to-orange-500" />
                <SummaryCard title="Pedidos Programados" count={scheduledCount} icon={<HourglassIcon className="h-8 w-8 text-white" />} colorClasses="bg-gradient-to-br from-blue-400 to-indigo-500" />
                <SummaryCard title="Pedidos Completados" count={completedCount} icon={<CheckBadgeIcon className="h-8 w-8 text-white" />} colorClasses="bg-gradient-to-br from-green-400 to-teal-500" />
                <SummaryCard title="Pedidos Cancelados" count={deletedOrders.length} icon={<XCircleIcon className="h-8 w-8 text-white" />} colorClasses="bg-gradient-to-br from-red-400 to-pink-500" />
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-blue-800">Pedidos por Turno</h3>
                    <div className="flex items-center space-x-2">
                        <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800" aria-label="Mes anterior"><ArrowLeftIcon className="h-5 w-5" /></button>
                        <span className="font-semibold text-slate-700 text-sm w-32 text-center capitalize">{new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(currentDate)}</span>
                        <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800" aria-label="Mes siguiente"><ArrowLeftIcon className="h-5 w-5 rotate-180" /></button>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                    {[
                        { turno: 'Mañana', count: monthlyShiftData.Mañana, icon: <SunIcon className="h-6 w-6 text-yellow-500" />, color: 'bg-yellow-100' },
                        { turno: 'Tarde', count: monthlyShiftData.Tarde, icon: <ClockIcon className="h-6 w-6 text-blue-500" />, color: 'bg-blue-100' },
                        { turno: 'Noche', count: monthlyShiftData.Noche, icon: <MoonIcon className="h-6 w-6 text-indigo-500" />, color: 'bg-indigo-100' }
                    ].map(({ turno, count, icon, color }) => (
                        <div key={turno} className={`p-4 rounded-lg ${color}`}>
                            <div className="flex items-center justify-center space-x-2 mb-2">{icon}<span className="font-bold text-slate-700">{turno}</span></div>
                            <p className="text-3xl font-bold text-slate-800">{count}</p>
                            <p className="text-xs text-slate-500">pedidos</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md flex-grow flex flex-col">
                <div className="p-6 border-b border-slate-200">
                    <h3 className="text-lg font-bold text-blue-800">Historial de Pedidos Eliminados</h3>
                </div>
                <div className="overflow-x-auto flex-grow">
                    <table className="min-w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="py-3 px-6 text-left font-semibold text-sm text-slate-600 uppercase">Código</th>
                                <th scope="col" className="py-3 px-6 text-left font-semibold text-sm text-slate-600 uppercase">Cliente</th>
                                <th scope="col" className="py-3 px-6 text-left font-semibold text-sm text-slate-600 uppercase">Motivo de Cancelación</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {deletedOrders.length > 0 ? deletedOrders.map(order => (
                                <tr key={order.code} className="text-slate-800">
                                    <td className="py-4 px-6 font-medium text-slate-600">{order.code}</td>
                                    <td className="py-4 px-6">{order.name}</td>
                                    <td className="py-4 px-6">
                                        <button 
                                            onClick={() => setViewingReason(order.reason)}
                                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1 px-3 rounded-md transition-colors duration-200 text-xs shadow-sm border border-slate-300">
                                            Ver Motivo
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={3} className="text-center py-16 text-slate-500 font-semibold">No hay pedidos eliminados.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
        {viewingReason && (
            <ReasonModal
                title="Motivo de Cancelación"
                reason={viewingReason}
                onClose={() => setViewingReason(null)}
            />
        )}
      </>
    );
};

export default CurrentState;