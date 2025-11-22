import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Report } from '../types';
import { CHART_DATA } from '../constants';
import { RefreshIcon } from '../components/icons/iconsClientes';

interface ReportDetailViewProps {
  report: Report;
  onBack: () => void;
}

const kpiData = [
    { value: '591', label: 'NUEVOS CLIENTES' },
    { value: '1627', label: 'CLIENTES ACTIVOS' },
    { value: 'S/ 78', label: 'VALOR PROMEDIO DE COMPRA' },
    { value: '26', label: 'NUEVOS MAESTROS' },
    { value: '120', label: 'MAESTROS ACTIVOS' },
    { value: '50', label: 'PUNTOS PROMEDIO POR COMPRA' },
    { value: 'S/ 16 395', label: 'TOTAL VENTAS' },
    { value: '2 600', label: 'PUNTOS OBTENIDOS' },
    { value: '1 550', label: 'PUNTOS GASTADOS' },
];

const StatCard: React.FC<{ value: string; label: string }> = ({ value, label }) => (
    <div className="bg-white border-2 border-blue-400 rounded-lg p-4 text-center shadow-md">
        <p className="text-3xl font-bold text-blue-600">{value}</p>
        <p className="text-sm text-gray-600 font-semibold mt-1">{label}</p>
    </div>
);

export const ReportDetailView: React.FC<ReportDetailViewProps> = ({ report, onBack }) => {
    return (
        <div className="flex flex-col gap-8 items-center">
            <h2 className="text-3xl font-bold text-gray-800">REPORTE 01-2025/12-2025</h2>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kpiData.slice(0, 6).map(kpi => <StatCard key={kpi.label} {...kpi} />)}
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="md:col-span-1 flex flex-col gap-6">
                    {kpiData.slice(6).map(kpi => <StatCard key={kpi.label} {...kpi} />)}
                 </div>
                 <div className="md:col-span-2 bg-white p-4 rounded-lg shadow-lg border-2 border-gray-200">
                    <h3 className="text-center font-bold text-lg mb-4">FRECUENCIA DE VENTAS</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={CHART_DATA} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 7 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            <button
                onClick={onBack}
                className="flex items-center gap-2 bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-all shadow mt-4"
            >
                VOLVER A REPORTES
                <RefreshIcon className="w-5 h-5" />
            </button>
        </div>
    );
};
