import React from 'react';
import { SolicitudCotizacion } from '../types';
import { BackIcon, SalesIcon } from '../components/icons/IconsAbastecimiento';

interface SolicitudDetailsProps {
  solicitud: SolicitudCotizacion;
  onBack: () => void;
}

const DetailItem: React.FC<{ label: string; value?: string; children?: React.ReactNode }> = ({ label, value, children }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        {value && <p className="text-lg font-semibold text-gray-800">{value}</p>}
        {children}
    </div>
);

const SolicitudDetails: React.FC<SolicitudDetailsProps> = ({ solicitud, onBack }) => {

  const getStatusClass = (status: SolicitudCotizacion['estado']) => {
    switch (status) {
      case 'Generada': return 'text-blue-700 bg-blue-100';
      case 'Enviada': return 'text-yellow-700 bg-yellow-100';
      case 'Cotizada': return 'text-green-700 bg-green-100';
      case 'Adjudicada': return 'text-purple-700 bg-purple-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const hasCotizaciones = solicitud.cotizaciones_recibidas && solicitud.cotizaciones_recibidas.length > 0;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Volver a la lista">
                <BackIcon className="h-6 w-6 text-gray-600"/>
            </button>
            <div className="flex items-center">
                <div className="w-16 h-16 mr-4 p-2 bg-sky-100 rounded-lg flex items-center justify-center">
                  <SalesIcon className="w-12 h-12 text-sky-700"/>
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Detalle de Solicitud</h1>
                    <p className="text-md text-gray-500">Código : {parseInt(solicitud.id_solicitud.split('-')[1], 10)}</p>
                </div>
            </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg border-2 border-sky-700 shadow-sm">
            <h2 className="text-xl font-bold text-sky-800 border-b-2 border-sky-200 pb-2 mb-4">Datos de la Solicitud</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DetailItem label="codigo" value={parseInt(solicitud.id_solicitud.split('-')[1], 10).toString()} />
                <DetailItem label="Fecha Emisión" value={solicitud.fecha_emision_solicitud} />
                <DetailItem label="Estado">
                    <span className={`px-3 py-1.5 text-lg font-semibold leading-tight rounded-full ${getStatusClass(solicitud.estado)}`}>
                        {solicitud.estado}
                    </span>
                </DetailItem>
            </div>
        </div>

        <div className="bg-white p-6 rounded-lg border-2 border-sky-700 shadow-sm">
             <h2 className="text-xl font-bold text-sky-800 border-b-2 border-sky-200 pb-2 mb-4">Ítems Incluidos ({solicitud.items.length})</h2>
             {solicitud.items && solicitud.items.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full bg-white">
                        <thead className="bg-sky-700 text-white">
                            <tr>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">NOMBRE PRODUCTO</th>
                                <th className="text-center py-3 px-4 uppercase font-semibold text-sm">CANTIDAD REQUERIDA</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">UNIDAD</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">FECHA REQUERIDA</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {solicitud.items.map((item, index) => (
                                <tr key={index} className="border-b border-gray-200 hover:bg-sky-50">
                                    <td className="text-left py-3 px-4 font-medium">{item.nombre_producto}</td>
                                    <td className="text-center py-3 px-4">{item.cantidad_requerida}</td>
                                    <td className="text-left py-3 px-4">{item.unidad_medida}</td>
                                    <td className="text-left py-3 px-4">{item.fecha_requerida}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             ) : (
                <p className="text-gray-500 italic">Esta solicitud no tiene ítems registrados.</p>
             )}
        </div>
        
        {hasCotizaciones && (
            <div className="bg-white p-6 rounded-lg border-2 border-green-700 shadow-sm">
                <h2 className="text-xl font-bold text-green-800 border-b-2 border-green-200 pb-2 mb-4">Cotizaciones Recibidas</h2>
                {solicitud.cotizaciones_recibidas?.map((cotizacion, index) => (
                    <div key={index} className="mb-6 last:mb-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                            <DetailItem label="Proveedor" value={cotizacion.nombre_proveedor} />
                            <DetailItem label="Fecha Cotización" value={cotizacion.fecha_emision_cotizacion} />
                            <DetailItem label="Plazo Entrega" value={cotizacion.plazo_entrega} />
                            <DetailItem label="Monto Total Ofertado" value={`S/. ${cotizacion.monto_total.toFixed(2)}`} />
                        </div>
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="min-w-full bg-white">
                                <thead className="bg-gray-600 text-white">
                                    <tr>
                                        <th className="text-left py-2 px-3 uppercase font-semibold text-xs">Producto</th>
                                        <th className="text-center py-2 px-3 uppercase font-semibold text-xs">Cantidad</th>
                                        <th className="text-left py-2 px-3 uppercase font-semibold text-xs">Modalidad Pago</th>
                                        <th className="text-right py-2 px-3 uppercase font-semibold text-xs">Monto Ofertado (Total Línea)</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-700">
                                    {cotizacion.items.map((item, itemIndex) => {
                                        const unitPrice = item.cantidad_requerida > 0 ? item.monto_total_ofertado / item.cantidad_requerida : 0;
                                        return (
                                            <tr key={itemIndex} className="border-b border-gray-200">
                                                <td className="text-left py-2 px-3 text-sm font-medium">{item.nombre_producto}</td>
                                                <td className="text-center py-2 px-3 text-sm">{item.cantidad_requerida}</td>
                                                <td className="text-left py-2 px-3 text-sm">{item.modalidad_pago_ofrecida}</td>
                                                <td className="text-right py-2 px-3 text-sm">
                                                    <div>S/. {item.monto_total_ofertado.toFixed(2)}</div>
                                                    <div className="text-xs text-gray-500">(S/. {unitPrice.toFixed(2)} c/u)</div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default SolicitudDetails;
