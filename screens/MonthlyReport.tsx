import React, { useState, useMemo } from 'react';
import { Order, Dispatch, DeletedOrder, Turno } from '../types';
import PageHeader from './PageHeader';
import { DocumentReportIcon } from '../components/icons/IconsTransporte';
import StatusBadge from './StatusBadge';
import OrderItemsModal from './OrderItemsModal';
import { InboxArrowDownIcon } from '../components/icons/IconsTransporte';
import { HourglassIcon } from '../components/icons/IconsTransporte';
import { CheckBadgeIcon } from '../components/icons/IconsTransporte';
import OrderDispatchesModal from './OrderDispatchesModal';
import { SunIcon } from '../components/icons/IconsTransporte';
import { ClockIcon } from '../components/icons/IconsTransporte';
import { MoonIcon } from '../components/icons/IconsTransporte';
import DailyScheduleTimeline from './DailyScheduleTimeline';
import HourlyDispatchesModal from './HourlyDispatchesModal';

interface MonthlyReportProps {
  orders: Order[];
  dispatches: Dispatch[];
  deletedOrders: DeletedOrder[];
  onBack: () => void;
}

type OrderWithStatus = (Order | DeletedOrder) & { status: 'Recibido' | 'En Proceso' | 'Completado' | 'Cancelado' };

interface DailySummaryCardProps {
    title: string;
    count: number;
    icon: React.ReactNode;
    color: string;
}

const DailySummaryCard: React.FC<DailySummaryCardProps> = ({ title, count, icon, color }) => (
    <div className={`p-4 rounded-lg flex items-center shadow-sm ${color}`}>
        <div className="mr-4">{icon}</div>
        <div>
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-2xl font-bold">{count}</p>
        </div>
    </div>
);


const MonthlyReport: React.FC<MonthlyReportProps> = ({ orders, dispatches, deletedOrders, onBack }) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedOrderItems, setSelectedOrderItems] = useState<Order | DeletedOrder | null>(null);
    const [selectedOrderDispatches, setSelectedOrderDispatches] = useState<OrderWithStatus | null>(null);
    const [selectedHour, setSelectedHour] = useState<number | null>(null);

    const getOrderStatus = (order: Order): 'Recibido' | 'En Proceso' | 'Completado' => {
        const totalProducts = order.products.length;
        if (totalProducts === 0) return 'Completado';

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

    const dailyOrders = useMemo((): OrderWithStatus[] => {
        if (!selectedDate) return [];
    
        const [year, month, day] = selectedDate.split('-');
        const formattedDate = `${day}/${month}/${year}`;
    
        const allOrders: (Order | DeletedOrder)[] = [...orders, ...deletedOrders];
    
        return allOrders
            .filter(order => order.products.some(p => p.deliveryDate === formattedDate))
            .map((order): OrderWithStatus => {
                if ('reason' in order) {
                    return { ...order, status: 'Cancelado' };
                }
                return { ...order, status: getOrderStatus(order) };
            })
            .sort((a, b) => a.code.localeCompare(b.code));
    
    }, [selectedDate, orders, dispatches, deletedOrders]);
    
    const dailySummary = useMemo(() => {
        const summary = { received: 0, scheduled: 0, completed: 0 };
        dailyOrders.forEach(order => {
            if (order.status === 'Recibido') summary.received++;
            else if (order.status === 'En Proceso') summary.scheduled++;
            else if (order.status === 'Completado') summary.completed++;
        });
        return summary;
    }, [dailyOrders]);

    const dailyShiftSummary = useMemo(() => {
        if (!selectedDate) return { Mañana: 0, Tarde: 0, Noche: 0 };
    
        const [year, month, day] = selectedDate.split('-');
        const formattedDate = `${day}/${month}/${year}`;
    
        const ordersForDate = orders.filter(order =>
            order.products.some(p => p.deliveryDate === formattedDate)
        );
    
        const shifts = {
            Mañana: new Set<string>(),
            Tarde: new Set<string>(),
            Noche: new Set<string>(),
        };
    
        ordersForDate.forEach(order => {
            order.products.forEach(product => {
                if (product.deliveryDate === formattedDate) {
                    shifts[product.turno].add(order.code);
                }
            });
        });
    
        return {
            Mañana: shifts.Mañana.size,
            Tarde: shifts.Tarde.size,
            Noche: shifts.Noche.size,
        };
    }, [selectedDate, orders]);
    
    const orderHasDispatches = (order: OrderWithStatus) => {
        if (order.status === 'Cancelado' || order.status === 'Recibido') return false;
        const orderProductIds = new Set(order.products.map(p => p.id));
        return dispatches.some(d => d.stops.some(s => s.products.some(p => orderProductIds.has(p.id))));
    };

    const dispatchesForSelectedDate = useMemo(() => {
        if (!selectedDate) return [];
        const [year, month, day] = selectedDate.split('-');
        const formattedDate = `${day}/${month}/${year}`;
        return dispatches.filter(d => d.date === formattedDate);
    }, [selectedDate, dispatches]);

    return (
      <>
        <main className="flex-1 p-6 md:p-10 flex flex-col" aria-labelledby="page-title">
            <PageHeader
                title="Vista General"
                icon={<DocumentReportIcon className="h-8 w-8 text-emerald-800" />}
                onBack={onBack}
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 flex-grow">
                <div className="xl:col-span-2 flex flex-col space-y-8">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-end space-x-4 mb-4">
                            <div>
                                <label htmlFor="select-day" className="block text-sm font-medium text-slate-700 mb-1">Seleccionar Fecha</label>
                                <input
                                    id="select-day"
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="border border-slate-300 bg-white h-11 px-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                />
                            </div>
                            <button
                                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors duration-200 text-sm shadow-sm"
                            >
                                Hoy
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <DailySummaryCard title="Pedidos Recibidos" count={dailySummary.received} icon={<InboxArrowDownIcon className="h-7 w-7 text-yellow-600" />} color="bg-yellow-100 text-yellow-800" />
                            <DailySummaryCard title="Pedidos Programados" count={dailySummary.scheduled} icon={<HourglassIcon className="h-7 w-7 text-blue-600" />} color="bg-blue-100 text-blue-800" />
                            <DailySummaryCard title="Pedidos Completados" count={dailySummary.completed} icon={<CheckBadgeIcon className="h-7 w-7 text-green-600" />} color="bg-green-100 text-green-800" />
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-200">
                            <h4 className="text-sm font-bold text-slate-600 mb-3 uppercase tracking-wider">Resumen de Pedidos por Turno</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                {[
                                    { turno: 'Mañana', count: dailyShiftSummary.Mañana, icon: <SunIcon className="h-6 w-6 text-yellow-500" />, color: 'bg-yellow-50' },
                                    { turno: 'Tarde', count: dailyShiftSummary.Tarde, icon: <ClockIcon className="h-6 w-6 text-blue-500" />, color: 'bg-blue-50' },
                                    { turno: 'Noche', count: dailyShiftSummary.Noche, icon: <MoonIcon className="h-6 w-6 text-indigo-500" />, color: 'bg-indigo-50' }
                                ].map(({ turno, count, icon, color }) => (
                                    <div key={turno} className={`p-4 rounded-lg border border-slate-200 ${color}`}>
                                        <div className="flex items-center justify-center space-x-2 mb-2">{icon}<span className="font-bold text-slate-700">{turno}</span></div>
                                        <p className="text-3xl font-bold text-slate-800">{count}</p>
                                        <p className="text-xs text-slate-500">pedidos</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md flex-grow flex flex-col">
                        <div className="p-6 border-b border-slate-200">
                            <h3 className="text-lg font-bold text-blue-800">Pedidos del Día</h3>
                        </div>
                        <div className="overflow-x-auto flex-grow">
                            <table className="min-w-full">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th scope="col" className="py-3 px-6 text-left font-semibold text-sm text-slate-600 uppercase">Código</th>
                                        <th scope="col" className="py-3 px-6 text-left font-semibold text-sm text-slate-600 uppercase">Cliente</th>
                                        <th scope="col" className="py-3 px-6 text-left font-semibold text-sm text-slate-600 uppercase">Fechas de Entrega</th>
                                        <th scope="col" className="py-3 px-6 text-left font-semibold text-sm text-slate-600 uppercase">Estado</th>
                                        <th scope="col" className="py-3 px-6 text-left font-semibold text-sm text-slate-600 uppercase text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {dailyOrders.length > 0 ? dailyOrders.map(order => {
                                        const deliveryDates = [...new Set(order.products.map(p => p.deliveryDate))].join(', ');
                                        return (
                                            <tr key={order.code}>
                                                <td className="py-4 px-6 text-slate-600 font-medium">{order.code}</td>
                                                <td className="py-4 px-6 text-slate-800">{order.name}</td>
                                                <td className="py-4 px-6 text-slate-600 text-sm">{deliveryDates}</td>
                                                <td className="py-4 px-6"><StatusBadge status={order.status} /></td>
                                                <td className="py-4 px-6 text-center space-x-2">
                                                    <button 
                                                        onClick={() => setSelectedOrderItems(order)}
                                                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1 px-3 rounded-md transition-colors duration-200 text-xs shadow-sm border border-slate-300">
                                                        Ver Items
                                                    </button>
                                                    <button 
                                                        onClick={() => setSelectedOrderDispatches(order)}
                                                        disabled={!orderHasDispatches(order)}
                                                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1 px-3 rounded-md transition-colors duration-200 text-xs shadow-sm border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                                        Ver Despachos
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    }) : (
                                        <tr><td colSpan={5} className="text-center py-16 text-slate-500 font-semibold">No hay pedidos para la fecha seleccionada.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="xl:col-span-1">
                    <DailyScheduleTimeline 
                        dispatches={dispatchesForSelectedDate}
                        onHourClick={setSelectedHour}
                    />
                </div>
            </div>
        </main>
        {selectedOrderItems && (
            <OrderItemsModal
                order={selectedOrderItems}
                dispatches={dispatches}
                onClose={() => setSelectedOrderItems(null)}
                selectedDate={selectedDate}
            />
        )}
         {selectedOrderDispatches && (
            <OrderDispatchesModal
                order={selectedOrderDispatches}
                dispatches={dispatches}
                onClose={() => setSelectedOrderDispatches(null)}
            />
        )}
        {selectedHour !== null && (
            <HourlyDispatchesModal
                hour={selectedHour}
                dispatches={dispatchesForSelectedDate}
                onClose={() => setSelectedHour(null)}
            />
        )}
      </>
    );
};

export default MonthlyReport;