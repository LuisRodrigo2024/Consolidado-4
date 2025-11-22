import React, { useMemo } from 'react';
import { Screen, OrdenCompra, Recepcion } from '../types';
import { BackIcon, ClipboardCheckIcon } from '../components/icons/IconsAbastecimiento';

interface RemissionGuideListProps {
  onNavigate: (screen: Screen) => void;
  orders: OrdenCompra[];
  onValidate: (order: OrdenCompra, recepcion: Recepcion, serial: number) => void;
}

const RemissionGuideList: React.FC<RemissionGuideListProps> = ({ onNavigate, orders, onValidate }) => {

  const scheduledReceptions = useMemo(() => {
    const receptions: { order: OrdenCompra, recepcion: Recepcion }[] = [];
    orders.forEach(order => {
      order.recepciones?.forEach(recepcion => {
        if (recepcion.estado_recepcion === 'Pendiente') {
          receptions.push({ order, recepcion });
        }
      });
    });
    return receptions;
  }, [orders]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
            <button onClick={() => onNavigate(Screen.MainMenu)} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Volver al menú principal">
                <BackIcon className="h-6 w-6 text-gray-600"/>
            </button>
            <div className="flex items-center">
                <div className="w-16 h-16 mr-4 p-2 bg-sky-100 rounded-lg flex items-center justify-center">
                  <ClipboardCheckIcon className="w-12 h-12 text-sky-700"/>
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Validación de Guías de Remisión</h1>
            </div>
        </div>
      </div>
       <p className="text-gray-600 mb-4">Mostrando todas las recepciones programadas pendientes de validación.</p>

      <div className="overflow-x-auto rounded-lg border border-gray-300">
        <table className="min-w-full bg-white">
          <thead className="bg-sky-700 text-white">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">CODIGO RECEPCION</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">CODIGO ORDEN</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Proveedor</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Fecha Programada</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Hora Programada</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Estado</th>
              <th className="text-center py-3 px-4 uppercase font-semibold text-sm">Acción</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {scheduledReceptions.length === 0 ? (
                <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-500 italic">No hay recepciones programadas pendientes.</td>
                </tr>
            ) : (
                scheduledReceptions.map(({ order, recepcion }, index) => (
                  <tr key={recepcion.id_recepcion} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200 hover:bg-sky-50`}>
                    <td className="text-left py-3 px-4 font-medium">{index + 1}</td>
                    <td className="text-left py-3 px-4">{parseInt(order.id_orden.split('-')[1], 10)}</td>
                    <td className="text-left py-3 px-4">{order.nombre_proveedor}</td>
                    <td className="text-left py-3 px-4">{recepcion.fecha_recepcion_programada}</td>
                    <td className="text-left py-3 px-4">{recepcion.hora_recepcion_programada}</td>
                    <td className="text-left py-3 px-4">
                        <span className="px-2 py-1 font-semibold leading-tight rounded-full text-yellow-700 bg-yellow-100">
                           {recepcion.estado_recepcion}
                        </span>
                    </td>
                    <td className="text-center py-3 px-4">
                        <button onClick={() => onValidate(order, recepcion, index + 1)} className="bg-sky-600 text-white text-xs font-bold py-2 px-3 rounded-md shadow-sm hover:bg-sky-700 transition-colors">
                            Registrar Guía
                        </button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RemissionGuideList;