import React, { useMemo } from 'react';
import { Return, Exchange, Annulment } from '../types';
import {ChartBarIcon} from '../components/icons/iconsVentas';

interface ClaimsChartProps {
    returns: Return[];
    exchanges: Exchange[];
    annulments: Annulment[];
}

interface ReasonData {
    [reason: string]: number;
}

interface AggregatedData {
    devoluciones: ReasonData;
    cambios: ReasonData;
    anulaciones: ReasonData;
}

const ClaimsChart: React.FC<ClaimsChartProps> = ({ returns, exchanges, annulments }) => {

    const { aggregatedData, maxCount } = useMemo(() => {
        const data: AggregatedData = {
            devoluciones: {},
            cambios: {},
            anulaciones: {}
        };

        returns.forEach(item => {
            data.devoluciones[item.reason] = (data.devoluciones[item.reason] || 0) + 1;
        });

        exchanges.forEach(item => {
            data.cambios[item.reason] = (data.cambios[item.reason] || 0) + 1;
        });
        
        annulments.forEach(item => {
            data.anulaciones[item.reason] = (data.anulaciones[item.reason] || 0) + 1;
        });
        
        const allCounts = [
            ...Object.values(data.devoluciones), 
            ...Object.values(data.cambios), 
            ...Object.values(data.anulaciones)
        ];

        const max = Math.max(...allCounts, 0);

        return { aggregatedData: data, maxCount: max === 0 ? 1 : max }; // Avoid division by zero
    }, [returns, exchanges, annulments]);
    
    const chartConfig = {
        devoluciones: { title: 'Devoluciones', color: 'bg-blue-500' },
        cambios: { title: 'Cambios', color: 'bg-orange-500' },
        anulaciones: { title: 'Anulaciones', color: 'bg-red-500' }
    };

    const hasData = returns.length > 0 || exchanges.length > 0 || annulments.length > 0;

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
                <ChartBarIcon />
                <h3 className="text-lg font-semibold text-gray-700 ml-2">Análisis de Reclamos y Anulaciones</h3>
            </div>
            {hasData ? (
                <div>
                     <div className="flex items-center space-x-4 mb-6 text-sm text-gray-800">
                        <span className="font-semibold">Leyenda:</span>
                        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>Devoluciones</div>
                        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>Cambios</div>
                        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>Anulaciones</div>
                    </div>
                    <div className="space-y-6">
                        {(Object.keys(chartConfig) as Array<keyof typeof chartConfig>).map(type => {
                            const reasons = aggregatedData[type];
                            if (Object.keys(reasons).length === 0) return null;

                            return (
                                <div key={type}>
                                    <h4 className="font-semibold text-gray-800 mb-2">{chartConfig[type].title}</h4>
                                    <div className="space-y-3">
                                        {/* FIX: Cast Object.entries to ensure correct type inference for numbers, resolving arithmetic operation errors. */}
                                        {(Object.entries(reasons) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([reason, count]) => (
                                            <div key={reason} className="flex items-center">
                                                <div className="w-2/5 pr-4 text-right truncate">
                                                    <span className="text-sm text-gray-600">{reason}</span>
                                                </div>
                                                <div className="w-3/5 flex items-center">
                                                    <div className="flex-1 bg-gray-200 rounded-full h-5">
                                                        <div 
                                                            className={`${chartConfig[type].color} h-5 rounded-full`}
                                                            style={{ width: `${(count / maxCount) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="font-bold text-sm ml-2 w-8 text-right">{count}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-full min-h-[150px]">
                    <p className="text-center text-gray-500 py-10">No hay datos de reclamos o anulaciones para mostrar.</p>
                </div>
            )}
        </div>
    );
};

export default ClaimsChart;