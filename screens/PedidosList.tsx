
import React, { useMemo } from 'react';
import { Screen, Pedido } from '../types';
import { SearchIcon, ViewIcon, RequestsIcon, BackIcon } from '../components/icons/IconsAbastecimiento';

interface PedidosListProps {
  onNavigate: (screen: Screen) => void;
  pedidos: Pedido[];
  onViewPedido: (pedido: Pedido) => void;
}

const PedidosList: React.FC<PedidosListProps> = ({ onNavigate, pedidos, onViewPedido }) => {

  const sortedPedidos = useMemo(() => {
    const statusOrder: Record<Pedido['estado_pedido'], number> = { 
        'Pendiente': 1, 
        'Revisado': 2, 
        'En Proceso': 3,
        'Atendido': 4,
        'Cancelado': 5 
    };
    return [...pedidos].sort((a, b) => {
        const orderA = statusOrder[a.estado_pedido];
        const orderB = statusOrder[b.estado_pedido];
        if (orderA !== orderB) {
            return orderA - orderB;
        }
        return a.id_pedido.localeCompare(b.id_pedido);
    });
  }, [pedidos]);

  const getStatusClass = (status: Pedido['estado_pedido']) => {
    switch (status) {
        case 'Pendiente': return 'text-yellow-700 bg-yellow-100';
        case 'Revisado': return 'text-blue-700 bg-blue-100';
        case 'En Proceso': return 'text-indigo-700 bg-indigo-100';
        case 'Atendido': return 'text-green-700 bg-green-100';
        case 'Cancelado': return 'text-red-700 bg-red-100';
        default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
            <button onClick={() => onNavigate(Screen.MainMenu)} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Volver al menú principal">
                <BackIcon className="h-6 w-6 text-gray-600"/>
            </button>
            <div className="flex items-center">
                <div className="w-16 h-16 mr-4 p-2 bg-sky-100 rounded-lg flex items-center justify-center">
                  <RequestsIcon className="w-12 h-12 text-sky-700"/>
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Pedidos de Abastecimiento</h1>
            </div>
        </div>
        <div className="flex items-center space-x-4">
            <div className="relative">
                <input type="text" placeholder="Buscar..." className="border-2 border-gray-300 rounded-lg p-2 pl-4 pr-10 focus:outline-none focus:border-sky-500" />
                <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"/>
            </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-300">
        <table className="min-w-full bg-white">
          <thead className="bg-sky-700 text-white">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">CODIGO</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">FECHA PEDIDO</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">HORA PEDIDO</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">ESTADO PEDIDO</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-center">REVISAR</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {sortedPedidos.map((pedido, index) => (
              <tr key={pedido.id_pedido} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200 hover:bg-sky-50`}>
                <td className="text-left py-3 px-4 font-medium">{parseInt(pedido.id_pedido.split('-')[1], 10)}</td>
                <td className="text-left py-3 px-4">{pedido.fecha_pedido}</td>
                <td className="text-left py-3 px-4">{pedido.hora_pedido}</td>
                <td className="text-left py-3 px-4">
                    <span className={`px-2 py-1 font-semibold leading-tight rounded-full ${getStatusClass(pedido.estado_pedido)}`}>
                        {pedido.estado_pedido}
                    </span>
                </td>
                <td className="text-center py-3 px-4 h-[53px]">
                  {pedido.estado_pedido === 'Pendiente' && (
                    <button onClick={() => onViewPedido(pedido)} className="text-sky-600 hover:text-sky-800" aria-label={`Revisar pedido ${pedido.id_pedido}`}>
                        <ViewIcon className="w-5 h-5"/>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PedidosList;