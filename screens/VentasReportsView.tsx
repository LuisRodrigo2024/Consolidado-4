import React, { useState, useMemo } from 'react';
import { SaleDetail, SaleStatus, Return, Exchange, Annulment } from '../types';
import {HomeIcon} from '../components/icons/iconsVentas';
import {ReportsHeaderIcon} from '../components/icons/iconsVentas';
import {TotalSalesIcon} from '../components/icons/iconsVentas';
import {AvgTicketIcon} from '../components/icons/iconsVentas';
import {NumSalesIcon} from '../components/icons/iconsVentas';
import {CashSalesIcon} from '../components/icons/iconsVentas';
import {CreditSalesIcon} from '../components/icons/iconsVentas';
import {AnnulledSalesIcon} from '../components/icons/iconsVentas';
import {ChartLineIcon} from '../components/icons/iconsVentas';
import {ChartPieIcon} from '../components/icons/iconsVentas';
import {TrophyIcon} from '../components/icons/iconsVentas';
import ClaimsChart from './ClaimsChart';


interface ReportsViewProps {
    saleDetails: SaleDetail[];
    returns: Return[];
    exchanges: Exchange[];
    annulments: Annulment[];
    onGoToMainMenu: () => void;
}

type Period = 'today' | 'week' | 'month' | 'custom';

const parseDateFromString = (dateTimeStr: string): Date => {
    const [datePart] = dateTimeStr.split(' ');
    const [day, month, year] = datePart.split('/').map(Number);
    return new Date(year, month - 1, day);
};

const parseCurrency = (value: string): number => {
    if (typeof value !== 'string' || value.trim() === '-' || value.trim() === '') {
        return 0;
    }
    const numberValue = parseFloat(value.replace(/S\/\s*/, ''));
    return isNaN(numberValue) ? 0 : numberValue;
};


const ReportsView: React.FC<ReportsViewProps> = ({ saleDetails, returns, exchanges, annulments, onGoToMainMenu }) => {
    const [period, setPeriod] = useState<Period>('month');
    const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });


    const filteredSales = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (period === 'custom') {
            if (!customDateRange.start || !customDateRange.end) {
                return [];
            }
            const startDate = new Date(customDateRange.start + 'T00:00:00');
            const endDate = new Date(customDateRange.end + 'T23:59:59');

            return saleDetails.filter(sale => {
                const saleDate = parseDateFromString(sale.dateTime);
                return saleDate >= startDate && saleDate <= endDate;
            });
        }

        return saleDetails.filter(sale => {
            const saleDate = parseDateFromString(sale.dateTime);
            if (period === 'today') {
                return saleDate.getTime() === today.getTime();
            }
            if (period === 'week') {
                const firstDayOfWeek = new Date(today);
                firstDayOfWeek.setDate(today.getDate() - today.getDay());
                return saleDate >= firstDayOfWeek && saleDate <= today;
            }
            if (period === 'month') {
                return saleDate.getMonth() === today.getMonth() && saleDate.getFullYear() === today.getFullYear();
            }
            return true;
        });
    }, [saleDetails, period, customDateRange]);

    const reportData = useMemo(() => {
        const validSales = filteredSales.filter(s => s.status !== SaleStatus.Annulled);
        
        const totalSales = validSales.reduce((sum, sale) => sum + parseCurrency(sale.total), 0);
        const numSales = validSales.length;
            
        const salesContado = validSales
            .filter(s => s.paymentCondition === 'CONTADO')
            .reduce((sum, sale) => sum + parseCurrency(sale.total), 0);

        const salesCredito = validSales
            .filter(s => s.paymentCondition === 'CRÉDITO')
            .reduce((sum, sale) => sum + parseCurrency(sale.total), 0);

        const salesByDay: Record<string, number> = {};
        validSales.forEach(sale => {
            const day = sale.dateTime.split(' ')[0];
            salesByDay[day] = (salesByDay[day] || 0) + parseCurrency(sale.total);
        });

        const salesBySeller: Record<string, number> = {};
        validSales.forEach(sale => {
            salesBySeller[sale.seller] = (salesBySeller[sale.seller] || 0) + parseCurrency(sale.total);
        });

        const topSellers = Object.entries(salesBySeller)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);

        const salesByProduct: Record<string, { quantity: number; sales: number }> = {};
        validSales.flatMap(s => s.products).forEach(product => {
            if (!salesByProduct[product.description]) {
                salesByProduct[product.description] = { quantity: 0, sales: 0 };
            }
            salesByProduct[product.description].quantity += product.quantity;
            salesByProduct[product.description].sales += parseCurrency(product.amount);
        });

        const topProducts = Object.entries(salesByProduct)
            .sort(([, a], [, b]) => b.quantity - a.quantity)
            .slice(0, 5);
        
        return { totalSales, numSales, salesByDay, topSellers, topProducts, salesContado, salesCredito };
    }, [filteredSales]);

    return (
        <main className="flex-1 p-8 overflow-y-auto bg-gray-50">
            <header className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <button 
                      onClick={onGoToMainMenu} 
                      className="mr-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                      aria-label="Volver al menú principal"
                    >
                      <HomeIcon />
                    </button>
                    <div className="flex -space-x-4">
                        <div className="bg-[#1d4ed8] p-3 rounded-lg shadow-md"><ReportsHeaderIcon /></div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 ml-4">Reporte de Ventas</h1>
                </div>
                <div className="flex items-center bg-white p-1 rounded-lg shadow-sm border">
                    {(['today', 'week', 'month'] as const).map(p => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${period === p ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            {p === 'today' ? 'Hoy' : p === 'week' ? 'Esta Semana' : 'Este Mes'}
                        </button>
                    ))}
                    <button
                        onClick={() => setPeriod('custom')}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${period === 'custom' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Personalizado
                    </button>
                </div>
            </header>

            {period === 'custom' && (
                <div className="flex items-center space-x-4 mb-6 bg-white p-4 rounded-lg shadow-sm border animate-fade-in">
                    <label htmlFor="startDate" className="font-semibold text-gray-600">Desde:</label>
                    <input
                        type="date"
                        id="startDate"
                        value={customDateRange.start}
                        onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                        className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                    />
                    <label htmlFor="endDate" className="font-semibold text-gray-600">Hasta:</label>
                    <input
                        type="date"
                        id="endDate"
                        value={customDateRange.end}
                        onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                        min={customDateRange.start}
                        className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                    />
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KpiCard icon={<TotalSalesIcon />} title="Ventas Totales" value={`S/${reportData.totalSales.toFixed(2)}`} colorClass="bg-blue-500" />
                <KpiCard icon={<CashSalesIcon />} title="Ventas al Contado" value={`S/${reportData.salesContado.toFixed(2)}`} colorClass="bg-green-500" />
                <KpiCard icon={<CreditSalesIcon />} title="Ventas a Crédito" value={`S/${reportData.salesCredito.toFixed(2)}`} colorClass="bg-yellow-500" />
                <KpiCard icon={<NumSalesIcon />} title="N° de Ventas" value={reportData.numSales.toString()} colorClass="bg-purple-500" />
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2">
                    <LineChart data={reportData.salesByDay} />
                </div>
                <div>
                     <PaymentDoughnutChart contado={reportData.salesContado} credito={reportData.salesCredito} />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
                 <TopPerformersTable 
                    title="Top 5 Vendedores" 
                    data={reportData.topSellers.map(([label, value]) => ({ label, value: `S/${value.toFixed(2)}` }))} 
                    headers={['Vendedor', 'Monto Total']}
                />
                 <TopPerformersTable 
                    title="Top 5 Productos Vendidos (unidades)" 
                    data={reportData.topProducts.map(([label, data]) => ({ label, value: `${data.quantity} u.` }))} 
                    headers={['Producto', 'Cantidad']}
                />
            </div>

            <div className="mt-8">
                <ClaimsChart returns={returns} exchanges={exchanges} annulments={annulments} />
            </div>
             <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
            `}</style>
        </main>
    );
};


const KpiCard: React.FC<{ icon: React.ReactNode; title: string; value: string; colorClass: string; }> = ({ icon, title, value, colorClass }) => (
    <div className={`bg-white p-5 rounded-xl shadow-md flex items-center space-x-4 border-l-4 ${colorClass.replace('bg-', 'border-').replace('-500', '-600')}`}>
        <div className={`p-3 rounded-full ${colorClass}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const LineChart: React.FC<{ data: Record<string, number> }> = ({ data }) => {
    // FIX: Cast Object.entries to [string, number][] to fix type inference issues.
    const entries = (Object.entries(data) as [string, number][]).sort(([dateA], [dateB]) => parseDateFromString(dateA).getTime() - parseDateFromString(dateB).getTime());
    const maxValue = Math.max(...entries.map(([, value]) => value), 0);
    const chartHeight = 300;
    const chartWidth = 800;
    const yAxisLabels = 5;
    const numEntries = entries.length;

    const points = entries.map(([, value], index) => {
        const x = (index / (entries.length - 1 || 1)) * chartWidth;
        const y = chartHeight - (value / (maxValue || 1)) * chartHeight;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="bg-white p-6 rounded-xl shadow-md h-full">
            <div className="flex items-center mb-4">
                <ChartLineIcon />
                <h3 className="text-lg font-semibold text-gray-700 ml-2">Tendencia de Ventas</h3>
            </div>
            {entries.length > 1 ? (
                 <svg viewBox={`-80 -10 ${chartWidth + 100} ${chartHeight + 60}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
                    {/* Y-axis labels and grid lines */}
                    {Array.from({ length: yAxisLabels + 1 }).map((_, i) => {
                        const y = (i / yAxisLabels) * chartHeight;
                        const labelValue = maxValue - (i * (maxValue / yAxisLabels));
                        return (
                            <g key={i}>
                                <line x1="0" y1={y} x2={chartWidth} y2={y} stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="2,4"/>
                                <text x="-15" y={y + 5} textAnchor="end" fill="#4b5563" fontSize="12">S/{labelValue.toFixed(0)}</text>
                            </g>
                        );
                    })}
                     {/* X-axis labels */}
                    {entries.map(([date], index) => {
                        const shouldShowLabel = () => {
                            if (numEntries <= 12) return true; // Show all for up to 12 data points
                            const maxLabels = 8; // Target around 8 labels for larger sets
                            const step = Math.ceil(numEntries / maxLabels);
                            if (step <= 1) return true;
                            if (index === 0 || index === numEntries - 1) return true;
                            return index % step === 0;
                        };

                        if (!shouldShowLabel()) {
                            return null;
                        }

                        const x = (index / (numEntries - 1 || 1)) * chartWidth;
                        return (
                             <text key={date} x={x} y={chartHeight + 30} textAnchor="middle" fill="#4b5563" fontSize="12">{date.substring(0,5)}</text>
                        )
                    })}
                    {/* Axis Lines */}
                    <line x1="0" y1="0" x2="0" y2={chartHeight} stroke="#9ca3af" strokeWidth="1" />
                    <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#9ca3af" strokeWidth="1" />
                    {/* Line */}
                    <polyline fill="none" stroke="#3b82f6" strokeWidth="3" points={points} />
                    {/* Points */}
                    {entries.map(([, value], index) => {
                        const x = (index / (entries.length - 1 || 1)) * chartWidth;
                        const y = chartHeight - (value / (maxValue || 1)) * chartHeight;
                        return <circle key={index} cx={x} cy={y} r="4" fill="#3b82f6" />;
                    })}
                </svg>
            ) : <div className="flex items-center justify-center h-full min-h-[250px]"><p className="text-center text-gray-500 py-20">No hay suficientes datos para mostrar una tendencia.</p></div>}
        </div>
    );
};

const PaymentDoughnutChart: React.FC<{ contado: number; credito: number }> = ({ contado, credito }) => {
    const total = contado + credito;
    const contadoPercent = total > 0 ? (contado / total) * 100 : 0;
    const creditoPercent = total > 0 ? 100 - contadoPercent : 0;
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const contadoOffset = circumference - (contadoPercent / 100) * circumference;

    return (
        <div className="bg-white p-6 rounded-xl shadow-md h-full">
            <div className="flex items-center mb-4">
                <ChartPieIcon />
                <h3 className="text-lg font-semibold text-gray-700 ml-2">Ventas por Condición de Pago</h3>
            </div>
            <div className="flex justify-center items-center my-6 relative">
                 <svg className="transform -rotate-90" width="200" height="200" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r={radius} fill="transparent" stroke="#facc15" strokeWidth="20" />
                    <circle 
                        cx="100" 
                        cy="100" 
                        r={radius} 
                        fill="transparent" 
                        stroke="#10b981" 
                        strokeWidth="20" 
                        strokeDasharray={circumference} 
                        strokeDashoffset={contadoOffset} 
                    />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-800">S/{total.toFixed(2)}</span>
                    <span className="text-sm text-gray-500">Total</span>
                </div>
            </div>
            <div className="space-y-3">
                 <div className="flex justify-between items-center text-sm text-gray-800">
                    <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#10b981] mr-2"></span>Contado</span>
                    <span className="font-semibold">{contadoPercent.toFixed(1)}% (S/{contado.toFixed(2)})</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-800">
                    <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>Crédito</span>
                    <span className="font-semibold">{creditoPercent.toFixed(1)}% (S/{credito.toFixed(2)})</span>
                </div>
            </div>
        </div>
    );
};

const TopPerformersTable: React.FC<{ title: string; data: { label: string; value: string }[], headers: string[] }> = ({ title, data, headers }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center mb-4">
            <TrophyIcon />
            <h3 className="text-lg font-semibold text-gray-700 ml-2">{title}</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b">
                        <th className="text-left font-semibold text-gray-600 p-3">{headers[0]}</th>
                        <th className="text-right font-semibold text-gray-600 p-3">{headers[1]}</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? data.map((item) => (
                        <tr key={item.label} className="border-b last:border-0 hover:bg-gray-50">
                            <td className="p-3 text-gray-800 truncate">{item.label}</td>
                            <td className="p-3 text-gray-800 font-bold text-right">{item.value}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={2} className="text-center text-gray-500 py-8">No hay datos para mostrar.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

export default ReportsView;