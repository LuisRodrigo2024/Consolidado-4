import React from 'react';
import { Provider } from '../types';
import { BackIcon, ClientsIcon } from '../components/icons/IconsAbastecimiento';

interface ProviderDetailsProps {
  provider: Provider;
  onBack: () => void;
}

const DetailItem: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg text-gray-800">{value || '-'}</p>
    </div>
);

const ProviderDetails: React.FC<ProviderDetailsProps> = ({ provider, onBack }) => {
  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Volver a la lista">
                <BackIcon className="h-6 w-6 text-gray-600"/>
            </button>
            <div className="flex items-center">
                <div className="w-16 h-16 mr-4 p-2 bg-sky-100 rounded-lg flex items-center justify-center">
                  <ClientsIcon className="w-12 h-12 text-sky-700"/>
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{provider.nombre}</h1>
                    <p className="text-md text-gray-500">Código: {parseInt(provider.id.split('-')[1], 10)}</p>
                </div>
            </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
            <h2 className="text-xl font-bold text-sky-800 border-b-2 border-sky-200 pb-2 mb-4">Información General</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailItem label="Razón Social" value={provider.razonSocial} />
                <DetailItem label="RUC" value={provider.ruc} />
            </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
            <h2 className="text-xl font-bold text-sky-800 border-b-2 border-sky-200 pb-2 mb-4">Información de Contacto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <DetailItem label="Dirección" value={provider.direccion} />
                <DetailItem label="Correo Electrónico" value={provider.correo} />
                <DetailItem label="Teléfono" value={provider.telefono} />
                <DetailItem label="WhatsApp" value={provider.whatsapp} />
            </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
             <h2 className="text-xl font-bold text-sky-800 border-b-2 border-sky-200 pb-2 mb-4">Artículos Ofrecidos</h2>
             {provider.productos && provider.productos.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full bg-white">
                        <thead className="bg-sky-700 text-white">
                            <tr>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Producto</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Rubro</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Familia</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Clase</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Marca</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Unidad</th>
                                <th className="text-right py-3 px-4 uppercase font-semibold text-sm">Precio Unitario Ref.</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {provider.productos.map((producto, index) => (
                                <tr key={index} className="border-b border-gray-200 hover:bg-sky-50">
                                    <td className="text-left py-3 px-4">{producto.producto}</td>
                                    <td className="text-left py-3 px-4">{producto.rubro}</td>
                                    <td className="text-left py-3 px-4">{producto.familia}</td>
                                    <td className="text-left py-3 px-4">{producto.clase}</td>
                                    <td className="text-left py-3 px-4">{producto.marca}</td>
                                    <td className="text-left py-3 px-4">{producto.unidad}</td>
                                    <td className="text-right py-3 px-4">S/. {parseFloat(producto.precioUnitario).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             ) : (
                <p className="text-gray-500 italic">Este proveedor no tiene productos registrados.</p>
             )}
        </div>
      </div>

    </div>
  );
};

export default ProviderDetails;
