import React, { useMemo } from 'react';
import { Screen, OrdenCompra, Recepcion } from '../types';
import { BackIcon, ClipboardListIcon } from '../components/icons/IconsAbastecimiento';

interface ReceptionCountListProps {
  onNavigate: (screen: Screen) => void;
  orders: OrdenCompra[];
  onStartCount: (order: OrdenCompra, recepcion: Recepcion) => void;
}

const ReceptionCountList: React.FC<ReceptionCountListProps> = ({ onNavigate, orders, onStartCount }) => {
  const receptionsInProgress = useMemo(() => {
    const receptions: { order: OrdenCompra, recepcion: Recepcion }[] = [];
    orders.forEach(order => {
      order.recepciones?.forEach(recepcion => {
        if (recepcion.estado_recepcion === 'En Curso') {
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
                  <ClipboardListIcon className="w-12 h-12 text-sky-700"/>
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Recepciones en Curso</h1>
            </div>
        </div>
      </div>
       <p className="text-gray-600 mb-4">Mostrando todas las recepciones que se encuentran actualmente en proceso de conteo físico.</p>

      <div className="overflow-x-auto rounded-lg border border-gray-300">
        <table className="min-w-full bg-white">
          <thead className="bg-sky-700 text-white">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">ID Recepción</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">ID Orden</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Proveedor</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Hora de Inicio</th>
              <th className="text-center py-3 px-4 uppercase font-semibold text-sm">Acción</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {receptionsInProgress.length === 0 ? (
                <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-500 italic">No hay recepciones en curso actualmente.</td>
                </tr>
            ) : (
                receptionsInProgress.map(({ order, recepcion }, index) => (
                  <tr key={recepcion.id_recepcion} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200 hover:bg-sky-50`}>
                    <td className="text-left py-3 px-4 font-medium">{recepcion.id_recepcion}</td>
                    <td className="text-left py-3 px-4">{order.id_orden}</td>
                    <td className="text-left py-3 px-4">{order.nombre_proveedor}</td>
                    <td className="text-left py-3 px-4">{recepcion.hora_inicio_recepcion}</td>
                    <td className="text-center py-3 px-4">
                        <button onClick={() => onStartCount(order, recepcion)} className="bg-sky-600 text-white text-xs font-bold py-2 px-3 rounded-md shadow-sm hover:bg-sky-700 transition-colors">
                            Registrar Conteo
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

export default ReceptionCountList;