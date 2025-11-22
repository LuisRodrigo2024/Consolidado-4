import React, { useState, useMemo } from 'react';
import { OrdenCompra, Recepcion } from '../types';
import { BackIcon, PurchaseOrderIcon } from '../components/icons/IconsAbastecimiento';

interface OrderDetailMonitoringProps {
  order: OrdenCompra;
  onBack: () => void;
}

interface ItemFulfillmentStatus {
    solicitada: number;
    recibida: number;
    pendiente: number;
    status: 'Completado' | 'Recepción Parcial' | 'Pendiente';
}

const DetailItem: React.FC<{ label: string; value?: string; children?: React.ReactNode }> = ({ label, value, children }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        {value && <p className="text-lg font-semibold text-gray-800">{value}</p>}
        {children}
    </div>
);

const MetricCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="bg-blue-200 p-4 rounded-lg text-center">
        <p className="text-sm text-blue-800">{label}</p>
        <p className="text-3xl font-bold text-blue-900">{value}</p>
    </div>
);

const ProgressBar: React.FC<{ received: number; requested: number }> = ({ received, requested }) => {
    const percentage = requested > 0 ? (received / requested) * 100 : 0;
    let barColor = 'bg-gray-400';
    if (percentage > 0 && percentage < 100) {
        barColor = 'bg-yellow-500';
    } else if (percentage >= 100) {
        barColor = 'bg-green-500';
    }

    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className={`${barColor} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
        </div>
    );
};


const OrderDetailMonitoring: React.FC<OrderDetailMonitoringProps> = ({ order, onBack }) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const fulfillmentStatus = useMemo((): Map<string, ItemFulfillmentStatus> => {
    const statusMap = new Map<string, ItemFulfillmentStatus>();

    order.items.forEach(item => {
        statusMap.set(item.nombre_producto, {
            solicitada: item.cantidad_adjudicada,
            recibida: 0,
            pendiente: item.cantidad_adjudicada,
            status: 'Pendiente',
        });
    });

    order.recepciones?.forEach(recepcion => {
        recepcion.items.forEach(item => {
            if(item.cantidad_recibida) {
                const currentStatus = statusMap.get(item.nombre_producto);
                if (currentStatus) {
                    currentStatus.recibida += item.cantidad_recibida;
                }
            }
        });
    });

    statusMap.forEach((status) => {
        status.pendiente = status.solicitada - status.recibida;
        if (status.recibida >= status.solicitada) {
            status.status = 'Completado';
            status.pendiente = 0;
        } else if (status.recibida > 0) {
            status.status = 'Recepción Parcial';
        } else {
            status.status = 'Pendiente';
        }
    });

    return statusMap;
  }, [order]);
  
  const recepcionesRealizadas = useMemo(() => order.recepciones?.filter(r => r.estado_recepcion !== 'Pendiente') || [], [order.recepciones]);
  const recepcionesPendientes = useMemo(() => order.recepciones?.filter(r => r.estado_recepcion === 'Pendiente') || [], [order.recepciones]);


  const getRecepcionStatusClass = (status: Recepcion['estado_recepcion']) => {
    switch (status) {
      case 'Pendiente': return 'text-yellow-700 bg-yellow-100';
      case 'Recibida Parcial': return 'text-orange-700 bg-orange-100';
      case 'Conforme': return 'text-green-700 bg-green-100';
      case 'No Conforme': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getQualityStatusClass = (status: 'Conforme' | 'No Conforme' | 'Pendiente') => {
    switch(status) {
      case 'Conforme': return 'text-green-700 bg-green-100';
      case 'No Conforme': return 'text-red-700 bg-red-100';
      case 'Pendiente': return 'text-yellow-700 bg-yellow-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  }

  const getItemStatusClass = (status: ItemFulfillmentStatus['status']) => {
    switch (status) {
      case 'Pendiente': return 'text-gray-700';
      case 'Recepción Parcial': return 'text-yellow-700';
      case 'Completado': return 'text-green-700';
      default: return 'text-gray-700';
    }
  };

  const handleToggleRow = (key: string) => {
    setExpandedRow(prev => (prev === key ? null : key));
  };


  return (
    <div className="p-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Volver a la lista">
                    <BackIcon className="h-6 w-6 text-gray-600"/>
                </button>
                <div className="flex items-center">
                    <div className="w-16 h-16 mr-4 p-2 bg-sky-100 rounded-lg flex items-center justify-center">
                    <PurchaseOrderIcon className="w-12 h-12 text-sky-700"/>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Monitoreo de Orden de Compra</h1>
                        <p className="text-md text-gray-500 font-mono">CÓDIGO: {parseInt(order.id_orden.split('-')[1], 10)}</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-8">
            {/* Panel 1: Datos de la Orden */}
            <div className="bg-white p-6 rounded-lg border-2 border-sky-700 shadow-sm">
                <h2 className="text-xl font-bold text-sky-800 border-b-2 border-sky-200 pb-2 mb-4">Datos de la Orden de Compra</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <DetailItem label="Codigo" value={parseInt(order.id_orden.split('-')[1], 10).toString()} />
                    <DetailItem label="Proveedor" value={order.nombre_proveedor} />
                    <DetailItem label="Monto Total" value={`S/. ${order.monto_total_orden.toFixed(2)}`} />
                    <DetailItem label="Fecha de Emisión" value={order.fecha_emision} />
                </div>
            </div>

            {/* Panel 2: Detalle de Productos de la OC */}
            <div className="bg-white p-6 rounded-lg border-2 border-sky-700 shadow-sm">
                <h2 className="text-xl font-bold text-sky-800 border-b-2 border-sky-200 pb-2 mb-4">Dashboard de Cumplimiento de Productos</h2>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full bg-white">
                        <thead className="bg-sky-700 text-white">
                            <tr>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Producto</th>
                                <th className="text-center py-3 px-4 uppercase font-semibold text-sm">Cant. Solicitada</th>
                                <th className="text-center py-3 px-4 uppercase font-semibold text-sm">Cant. Recibida (Total)</th>
                                <th className="text-center py-3 px-4 uppercase font-semibold text-sm">Cant. Pendiente</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm w-1/4">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {order.items.map((item, index) => {
                                const status = fulfillmentStatus.get(item.nombre_producto);
                                if (!status) return null;

                                return (
                                    <tr key={index} className="border-b border-gray-200 hover:bg-sky-50">
                                        <td className="text-left py-3 px-4 font-medium">{item.nombre_producto}</td>
                                        <td className="text-center py-3 px-4 font-mono">{status.solicitada}</td>
                                        <td className="text-center py-3 px-4 font-mono font-bold text-green-600">{status.recibida}</td>
                                        <td className="text-center py-3 px-4 font-mono font-bold text-red-600">{status.pendiente}</td>
                                        <td className="text-left py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-full">
                                                    <ProgressBar received={status.recibida} requested={status.solicitada} />
                                                </div>
                                                <span className={`w-32 text-center text-xs font-bold ${getItemStatusClass(status.status)}`}>
                                                    {status.status}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {order.monitoreo && (
                <>
                {/* Panel 3: Métricas de Recepción */}
                <div className="bg-blue-100 p-6 rounded-lg border-2 border-blue-700 shadow-sm">
                    <h2 className="text-xl font-bold text-blue-800 border-b-2 border-blue-200 pb-2 mb-4">Métricas de Recepción</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <MetricCard label="Recepciones Programadas" value={order.monitoreo.total_recepciones_programadas} />
                       <MetricCard label="Recepciones Completadas" value={order.monitoreo.recepciones_completadas} />
                       <div className="bg-blue-200 p-4 rounded-lg text-center">
                         <p className="text-sm text-blue-800">Estado General de Monitoreo</p>
                         <p className="text-3xl font-bold text-blue-900">{order.monitoreo.estado_monitoreo}</p>
                       </div>
                    </div>
                </div>

                {/* Panel 4: Detalle de Recepciones Programadas */}
                <div className="bg-white p-6 rounded-lg border-2 border-sky-700 shadow-sm">
                    <h2 className="text-xl font-bold text-sky-800 border-b-2 border-sky-200 pb-2 mb-4">Plan de Recepción</h2>
                    
                    {/* Sub-Panel: Recepciones Realizadas */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Recepciones Realizadas</h3>
                        {recepcionesRealizadas.length > 0 ? (
                             <div className="overflow-x-auto rounded-lg border border-gray-200">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-700 text-white">
                                        <tr>
                                            <th className="py-3 px-4 w-12"></th>
                                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Fecha</th>
                                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Hora</th>
                                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-700">
                                        {recepcionesRealizadas.map((recepcion, index) => {
                                            const key = `realizada-${index}`;
                                            return (
                                                <React.Fragment key={key}>
                                                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                                                        <td className="text-center py-3 px-4">
                                                            <button onClick={() => handleToggleRow(key)} className="font-mono text-sky-600 text-xl">
                                                                {expandedRow === key ? '−' : '+'}
                                                            </button>
                                                        </td>
                                                        <td className="text-left py-3 px-4">{recepcion.fecha_recepcion_programada}</td>
                                                        <td className="text-left py-3 px-4">{recepcion.hora_recepcion_programada}</td>
                                                        <td className="text-left py-3 px-4">
                                                            <span className={`px-2 py-1 font-semibold leading-tight rounded-full ${getRecepcionStatusClass(recepcion.estado_recepcion)}`}>
                                                                {recepcion.estado_recepcion}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    {expandedRow === key && (
                                                        <tr className="bg-gray-50 border-b-2 border-gray-300">
                                                            <td></td>
                                                            <td colSpan={3} className="p-3">
                                                            <h4 className="font-bold text-md text-gray-700 mb-2 ml-2">Auditoría de Recepción:</h4>
                                                            <div className="overflow-hidden rounded-lg border border-gray-300">
                                                                <table className="min-w-full bg-white">
                                                                    <thead className="bg-gray-600 text-white">
                                                                        <tr>
                                                                            <th className="text-left py-2 px-3 uppercase font-semibold text-xs">Producto</th>
                                                                            <th className="text-center py-2 px-3 uppercase font-semibold text-xs">Cant. Programada</th>
                                                                            <th className="text-center py-2 px-3 uppercase font-semibold text-xs">Cant. Recibida</th>
                                                                            <th className="text-left py-2 px-3 uppercase font-semibold text-xs">Estado Calidad</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="text-gray-600">
                                                                        {recepcion.items?.map((item, prodIndex) => (
                                                                            <tr key={prodIndex} className="border-b border-gray-200 last:border-b-0">
                                                                                <td className="text-left py-2 px-3 text-sm font-medium">{item.nombre_producto}</td>
                                                                                <td className="text-center py-2 px-3 text-sm">{item.cantidad_programada}</td>
                                                                                <td className="text-center py-2 px-3 text-sm font-bold">{item.cantidad_recibida}</td>
                                                                                <td className="text-left py-2 px-3 text-sm">
                                                                                <span className={`px-2 py-0.5 text-xs font-semibold leading-tight rounded-full ${getQualityStatusClass(item.estado_calidad!)}`}>
                                                                                    {item.estado_calidad}
                                                                                </span>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                           <p className="text-gray-500 italic px-4">No se han realizado recepciones todavía.</p>
                        )}
                    </div>
                     {/* Sub-Panel: Recepciones Pendientes */}
                    <div>
                         <h3 className="text-lg font-semibold text-gray-800 mb-3">Próximas Recepciones (Pendientes)</h3>
                         {recepcionesPendientes.length > 0 ? (
                              <div className="overflow-x-auto rounded-lg border border-gray-200">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-sky-700 text-white">
                                        <tr>
                                            <th className="py-3 px-4 w-12"></th>
                                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Fecha Programada</th>
                                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Hora Programada</th>
                                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-700">
                                       {recepcionesPendientes.map((recepcion, index) => {
                                            const key = `pendiente-${index}`;
                                            return (
                                                <React.Fragment key={key}>
                                                    <tr className="border-b border-gray-200 hover:bg-sky-50">
                                                        <td className="text-center py-3 px-4">
                                                            <button onClick={() => handleToggleRow(key)} className="font-mono text-sky-600 text-xl">
                                                                {expandedRow === key ? '−' : '+'}
                                                            </button>
                                                        </td>
                                                        <td className="text-left py-3 px-4">{recepcion.fecha_recepcion_programada}</td>
                                                        <td className="text-left py-3 px-4">{recepcion.hora_recepcion_programada}</td>
                                                        <td className="text-left py-3 px-4">
                                                            <span className={`px-2 py-1 font-semibold leading-tight rounded-full ${getRecepcionStatusClass(recepcion.estado_recepcion)}`}>
                                                                {recepcion.estado_recepcion}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                     {expandedRow === key && (
                                                        <tr className="bg-sky-50 border-b-2 border-sky-300">
                                                            <td></td>
                                                            <td colSpan={3} className="p-3">
                                                            <h4 className="font-bold text-md text-sky-800 mb-2 ml-2">Detalle de Productos Programados:</h4>
                                                            <div className="overflow-hidden rounded-lg border border-sky-300">
                                                                <table className="min-w-full bg-white">
                                                                    <thead className="bg-sky-600 text-white">
                                                                        <tr>
                                                                            <th className="text-left py-2 px-3 uppercase font-semibold text-xs">Producto</th>
                                                                            <th className="text-center py-2 px-3 uppercase font-semibold text-xs">Cantidad Programada</th>
                                                                            <th className="text-left py-2 px-3 uppercase font-semibold text-xs">Unidad</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="text-gray-600">
                                                                        {recepcion.items?.map((item, prodIndex) => (
                                                                            <tr key={prodIndex} className="border-b border-gray-200 last:border-b-0">
                                                                                <td className="text-left py-2 px-3 text-sm font-medium">{item.nombre_producto}</td>
                                                                                <td className="text-center py-2 px-3 text-sm">{item.cantidad_programada}</td>
                                                                                <td className="text-left py-2 px-3 text-sm">{item.unidad_medida}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            )
                                       })}
                                    </tbody>
                                </table>
                              </div>
                         ) : (
                            <p className="text-gray-500 italic px-4">No hay más recepciones pendientes programadas.</p>
                         )}
                    </div>
                </div>
                </>
            )}
        </div>
    </div>
  );
};

export default OrderDetailMonitoring;