
import React from 'react';
import { REPORTS_DATA } from '../constants';
import type { Report } from '../types';
import { SortIcon, SearchIcon, DownloadIcon } from '../components/icons/iconsClientes';

interface ReportsViewProps {
  onReportSelect: (report: Report) => void;
}

const headers = [
  'ID_REPORTE',
  'FECHA_GENERACION',
  'PERIODO_ANALISIS',
  'ID_USUARIO_GENERADOR',
  'VER_REPORTE'
];

export const ReportsView: React.FC<ReportsViewProps> = ({ onReportSelect }) => {
  return (
    <div className="flex flex-col gap-4">
        <div className="relative w-full max-w-sm">
            <input
                type="text"
                className="border-2 border-gray-300 bg-white h-10 px-5 pr-12 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-full"
                placeholder="Buscar por rango de tiempo..."
            />
            <button type="button" onClick={() => {}} className="absolute right-0 top-0 mt-1 mr-1 p-2 bg-blue-600 rounded-md hover:bg-blue-700">
                <SearchIcon className="text-white h-4 w-4" />
            </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
            <div className="overflow-x-auto h-full">
                <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-white uppercase bg-blue-600">
                    <tr>
                    {headers.map(header => (
                        <th key={header} scope="col" className="px-6 py-4 font-bold">
                        <div className="flex items-center gap-2">
                            {header}
                            {header !== 'VER_REPORTE' && <SortIcon className="w-4 h-4" />}
                        </div>
                        </th>
                    ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {REPORTS_DATA.map((report) => (
                    <tr 
                        key={report.id} 
                        className="bg-white hover:bg-gray-100"
                    >
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{report.id}</td>
                        <td className="px-6 py-4">{report.fechaGeneracion}</td>
                        <td className="px-6 py-4">{report.periodoAnalisis}</td>
                        <td className="px-6 py-4">{report.idUsuarioGenerador}</td>
                        <td className="px-6 py-4">
                            <button
                                onClick={() => onReportSelect(report)}
                                className="flex items-center gap-2 bg-slate-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-slate-800 transition-all text-xs"
                            >
                                Ver Reporte
                                <DownloadIcon className="w-4 h-4" />
                            </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};