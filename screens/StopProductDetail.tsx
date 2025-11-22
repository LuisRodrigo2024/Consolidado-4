
import React from 'react';
import { TransportOrderIcon } from '../components/icons/IconsTransporte';
import { Order, Stop, ProductTransporte } from '../types';
import PageHeader from './PageHeader';
import InfoCard from './InfoCard';

interface StopProductDetailProps {
  stop: Stop;
  orders: Order[];
  onBack: () => void;
}

const StopProductDetail: React.FC<StopProductDetailProps> = ({ stop, orders, onBack }) => {

  const getProductDetailCode = (productToFind: ProductTransporte): string => {
    for (const order of orders) {
      const productIndex = order.products.findIndex(p => p.id === productToFind.id);
      if (productIndex !== -1) {
        return `${order.code}${String(productIndex + 1).padStart(2, '0')}`;
      }
    }
    return `ID-${productToFind.id}`; // Fallback
  };


  return (
    <main className="flex-1 p-6 md:p-10 flex flex-col" aria-labelledby="page-title">
       <PageHeader
        title="Detalle de Artículos por Parada"
        subtitle={stop.id}
        icon={<TransportOrderIcon className="h-8 w-8 text-blue-600" />}
        onBack={onBack}
      />
      
      <div className="space-y-8">
        <InfoCard title="Información de la Parada">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                  <p className="text-sm text-slate-500">Cliente</p>
                  <p className="font-semibold text-slate-800 text-base">{stop.clientName}</p>
              </div>
              <div>
                  <p className="text-sm text-slate-500">Estado</p>
                  <p className="font-semibold text-slate-800 text-base">{stop.status}</p>
              </div>
              <div>
                  <p className="text-sm text-slate-500">Origen</p>
                  <p className="font-semibold text-slate-800 text-base">{stop.origin}</p>
              </div>
              <div>
                  <p className="text-sm text-slate-500">Destino</p>
                  <p className="font-semibold text-slate-800 text-base">{stop.destination}</p>
              </div>
          </div>
        </InfoCard>

        <div className="bg-white rounded-xl shadow-md flex-grow flex flex-col">
            <div className="p-6 pb-0">
                <h2 className="text-lg font-bold text-blue-800 mb-2">Artículos a Entregar</h2>
                <hr className="border-t border-blue-200" />
            </div>
            <div className="overflow-x-auto flex-grow">
              <table className="min-w-full">
              <thead className="bg-blue-800 text-white">
                  <tr>
                  <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider rounded-tl-xl">Código Detalle</th>
                  <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Cantidad</th>
                  <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Producto</th>
                  <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider rounded-tr-xl">Unidad</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                  {stop.products.map((product) => (
                  <tr key={product.id} className="text-slate-800 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-600">{getProductDetailCode(product)}</td>
                      <td className="py-4 px-6">{product.quantity}</td>
                      <td className="py-4 px-6">{product.name}</td>
                      <td className="py-4 px-6">{product.unit}</td>
                  </tr>
                  ))}
              </tbody>
              </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default StopProductDetail;
