
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Client } from '../types';
import { UserIcon, RefreshIcon, SortIcon } from '../components/icons/iconsClientes';
import { SALES_HISTORY_DATA, CHART_DATA } from '../constants';

interface ClientDetailViewProps {
  client: Client;
  onUpdate: () => void;
}

const StatCard: React.FC<{ label: string; value: string; }> = ({ label, value }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center shadow-sm">
        <p className="text-2xl font-bold text-blue-600">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
    </div>
);

const SalesHistoryTable: React.FC = () => {
    const headers = ['Fecha_Venta', 'Monto_Total', 'Tipo_Pago', 'Nro_Comprobante'];
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <h3 className="text-xl font-bold text-gray-800 p-4">Historial de Ventas</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-white uppercase bg-blue-600">
                        <tr>
                            {headers.map(header => (
                                <th key={header} scope="col" className="px-6 py-4 font-bold">
                                    <div className="flex items-center gap-2">
                                        {header}
                                        <SortIcon className="w-4 h-4" />
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {SALES_HISTORY_DATA.map((sale, index) => (
                            <tr key={index} className="bg-white hover:bg-gray-50">
                                <td className="px-6 py-4">{sale.fecha}</td>
                                <td className="px-6 py-4">{sale.monto}</td>
                                <td className="px-6 py-4">{sale.tipoPago}</td>
                                <td className="px-6 py-4">{sale.nroComprobante}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


export const ClientDetailView: React.FC<ClientDetailViewProps> = ({ client, onUpdate }) => {
  return (
    <div className="flex-grow flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
                <UserIcon className="w-32 h-32 text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">{client.nombre}, {client.apellidos}</h2>
                <button onClick={onUpdate} className="flex items-center gap-2 bg-slate-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-slate-800 transition-all my-4">
                    Actualizar Datos
                    <RefreshIcon className="w-5 h-5" />
                </button>
                <div className="text-left text-sm text-gray-600 space-y-2 border-t pt-4 w-full">
                    <p><span className="font-semibold">RUC:</span> {client.ruc}</p>
                    <p><span className="font-semibold">Telefono:</span> {client.telefono}</p>
                    <p><span className="font-semibold">Correo:</span> {client.correo}</p>
                    <p><span className="font-semibold">Direccion:</span> {client.direccion}</p>
                    <p><span className="font-semibold">Fecha de Registro:</span> {client.fechaRegistro}</p>
                </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-6">
                    <StatCard label="COMPRAS" value="95" />
                    <StatCard label="GASTADOS" value="S/ 5K" />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-lg flex-grow">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={CHART_DATA} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Bottom Section */}
        <div>
            <SalesHistoryTable />
        </div>
    </div>
  );
};
