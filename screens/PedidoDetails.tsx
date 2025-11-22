import React from 'react';
import { Pedido } from '../types';
import { BackIcon, RequestsIcon, SaveIcon } from '../components/icons/IconsAbastecimiento';

interface PedidoDetailsProps {
  pedido: Pedido;
  onBack: () => void;
  onMarkAsReviewed: (pedidoId: string) => void;
}

const DetailItem: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-800">{value || '-'}</p>
    </div>
);

const PedidoDetails: React.FC<PedidoDetailsProps> = ({ pedido, onBack, onMarkAsReviewed }) => {
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Volver a la lista">
                <BackIcon className="h-6 w-6 text-gray-600"/>
            </button>
            <div className="flex items-center">
                <div className="w-16 h-16 mr-4 p-2 bg-sky-100 rounded-lg flex items-center justify-center">
                  <RequestsIcon className="w-12 h-12 text-sky-700"/>
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Detalle del Pedido</h1>
                    <p className="text-md text-gray-500">{pedido.id_pedido.split('-')[1]}</p>
                </div>
            </div>
        </div>
        {pedido.estado_pedido === 'Pendiente' && (
            <button 
                onClick={() => onMarkAsReviewed(pedido.id_pedido)}
                className="flex items-center bg-sky-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-sky-700 transition-colors duration-200"
            >
                Marcar como Revisado
                <SaveIcon className="ml-2 h-5 w-5"/>
            </button>
        )}
      </div>

      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg border-2 border-sky-700 shadow-sm">
            <h2 className="text-xl font-bold text-sky-800 border-b-2 border-sky-200 pb-2 mb-4">Datos del Pedido</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DetailItem label="codigo" value={parseInt(pedido.id_pedido.split('-')[1], 10).toString()} />
                <DetailItem label="Fecha Pedido" value={pedido.fecha_pedido} />
                <DetailItem label="Hora Pedido" value={pedido.hora_pedido} />
                <DetailItem label="Estado" value={pedido.estado_pedido} />
                <DetailItem label="Empleado Generador" value={`${pedido.empleadoGenerador.nombre} (${pedido.empleadoGenerador.area})`} />
            </div>
        </div>

        <div className="bg-white p-6 rounded-lg border-2 border-sky-700 shadow-sm">
             <h2 className="text-xl font-bold text-sky-800 border-b-2 border-sky-200 pb-2 mb-4">Productos Requeridos</h2>
             {pedido.productos && pedido.productos.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full bg-white">
                        <thead className="bg-sky-700 text-white">
                            <tr>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">NOMBRE</th>
                                <th className="text-center py-3 px-4 uppercase font-semibold text-sm">CANTIDAD REQUERIDA</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">UNIDAD</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">FECHA REQUERIDA</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">TIPO DESTINO</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">DIRECCION</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {pedido.productos.map((producto, index) => (
                                <tr key={index} className="border-b border-gray-200 hover:bg-sky-50">
                                    <td className="text-left py-3 px-4 font-medium">{producto.nombre_producto}</td>
                                    <td className="text-center py-3 px-4">{producto.cantidad_requerida}</td>
                                    <td className="text-left py-3 px-4">{producto.unidad_medida}</td>
                                    <td className="text-left py-3 px-4">{producto.fecha_requerida}</td>
                                    <td className="text-left py-3 px-4">{producto.tipo_destino}</td>
                                    <td className="text-left py-3 px-4">{producto.direccion || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             ) : (
                <p className="text-gray-500 italic">Este pedido no tiene productos registrados.</p>
             )}
        </div>
      </div>

    </div>
  );
};

export default PedidoDetails;