import React, { useState } from 'react';
import { TransportOrderIcon } from '../components/icons/IconsTransporte';
import { EditIcon } from '../components/icons/IconsTransporte';
import { SearchIcon } from '../components/icons/IconsTransporte';
import { ProductWithClient } from '../types';

interface ReceivedOrdersProps {
  receivedProducts: ProductWithClient[];
  onBack: () => void;
  onGoHome: () => void;
  onSchedule: (date: string) => void;
}

const ReceivedOrders: React.FC<ReceivedOrdersProps> = ({ receivedProducts, onBack, onGoHome, onSchedule }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = receivedProducts.filter(product =>
    product.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="flex-1 p-10 flex flex-col" aria-labelledby="page-title">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div className="flex items-center">
          <div className="flex overflow-hidden rounded-lg shadow-lg">
            <div className="bg-[#475569] p-4 flex items-center justify-center" aria-hidden="true">
              <TransportOrderIcon className="h-8 w-8 text-white" />
            </div>
            <div className="bg-[#93c5fd] p-4 flex items-center justify-center" aria-hidden="true">
              <EditIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 id="page-title" className="ml-4 text-2xl font-bold text-slate-800">DETALLE DE PEDIDO DE TRANSPORTE - RECIBIDOS</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <label htmlFor="search-orders" className="sr-only">Search Orders</label>
            <input
              id="search-orders"
              type="search"
              className="border-2 border-slate-400 bg-white h-12 px-5 pr-12 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-80 text-black"
              placeholder="Buscar por cliente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-0 top-0 mt-3 mr-4" aria-hidden="true">
              <SearchIcon className="text-gray-600 h-6 w-6" />
            </div>
          </div>
          <button className="bg-[#475569] hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200">
            Actualizar
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto border-2 border-slate-400 rounded-lg flex-grow">
        <table className="min-w-full bg-white">
          <thead className="bg-[#93c5fd] text-slate-800">
            <tr>
              <th scope="col" className="py-3 px-4 text-left font-bold">Cliente</th>
              <th scope="col" className="py-3 px-4 text-left font-bold">Cantidad</th>
              <th scope="col" className="py-3 px-4 text-left font-bold">Producto</th>
              <th scope="col" className="py-3 px-4 text-left font-bold">Unidad de Medida</th>
              <th scope="col" className="py-3 px-4 text-left font-bold">Ubicacion Origen</th>
              <th scope="col" className="py-3 px-4 text-left font-bold">Ubicacion Destino</th>
              <th scope="col" className="py-3 px-4 text-left font-bold">Fecha Entrega</th>
              <th scope="col" className="py-3 px-4 text-center font-bold">Acción</th>
            </tr>
          </thead>
          <tbody>
            {receivedProducts.length > 0 ? (
              filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-t-2 border-slate-400 text-slate-900">
                    <td className="py-3 px-4 font-semibold">{product.clientName}</td>
                    <td className="py-3 px-4">{product.quantity}</td>
                    <td className="py-3 px-4">{product.name}</td>
                    <td className="py-3 px-4">{product.unit}</td>
                    <td className="py-3 px-4">{product.origin}</td>
                    <td className="py-3 px-4">{product.destination}</td>
                    <td className="py-3 px-4">{product.deliveryDate}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onSchedule(product.deliveryDate)}
                        className="bg-[#475569] hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                        Programar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-t-2 border-slate-400">
                  <td colSpan={8} className="text-center py-8 text-slate-600 font-semibold">
                    No se encontraron productos que coincidan con la búsqueda.
                  </td>
                </tr>
              )
            ) : (
              <tr className="border-t-2 border-slate-400">
                <td colSpan={8} className="text-center py-8 text-slate-600 font-semibold">
                  No hay productos recibidos pendientes de programación.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-auto flex justify-between items-center pt-8">
        <button
          onClick={onGoHome}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-10 rounded-lg transition-colors duration-200 text-xl shadow-lg border-2 border-green-700">
          Inicio
        </button>
        <button
          onClick={onBack}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-10 rounded-lg transition-colors duration-200 text-xl shadow-lg border-2 border-green-700">
          Volver
        </button>
      </div>
    </main>
  );
};

export default ReceivedOrders;