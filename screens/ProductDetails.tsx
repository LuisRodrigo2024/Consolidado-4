
import React from 'react';
import { Product } from '../types';
import { BackIcon, InventoryIcon, EditIcon } from '../components/icons/IconsAbastecimiento';

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onEdit: () => void;
}

const DetailItem: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-800">{value || '-'}</p>
    </div>
);

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onBack, onEdit }) => {
  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Volver a la lista">
                <BackIcon className="h-6 w-6 text-gray-600"/>
            </button>
            <div className="flex items-center">
                <div className="w-16 h-16 mr-4 p-2 bg-sky-100 rounded-lg flex items-center justify-center">
                  <InventoryIcon className="w-12 h-12 text-sky-700"/>
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{product.nombre}</h1>
                    <p className="text-md text-gray-500">{product.id_producto}</p>
                </div>
            </div>
        </div>
        <button 
            onClick={onEdit}
            className="flex items-center bg-sky-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-sky-700 transition-colors duration-200"
        >
            Editar Producto
            <EditIcon className="ml-2 h-5 w-5"/>
        </button>
      </div>

      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg border-2 border-sky-700 shadow-sm">
            <h2 className="text-xl font-bold text-sky-800 border-b-2 border-sky-200 pb-2 mb-4">Información del Producto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DetailItem label="ID Producto" value={product.id_producto} />
                <DetailItem label="Nombre" value={product.nombre} />
                <DetailItem label="Rubro" value={product.rubro} />
                <DetailItem label="Familia" value={product.familia} />
                <DetailItem label="Clase" value={product.clase} />
                <DetailItem label="Marca" value={product.marca} />
                <DetailItem label="Unidad" value={product.unidad} />
                <DetailItem label="Precio Base" value={`S/. ${parseFloat(product.precio_base).toFixed(2)}`} />
            </div>
        </div>
      </div>

    </div>
  );
};

export default ProductDetails;