
import React from 'react';
import { Screen, Product } from '../types';
import { PlusIcon, SearchIcon, ViewIcon, EditIcon, InventoryIcon, BackIcon } from '../components/icons/IconsAbastecimiento';

interface ProductsListProps {
  onNavigate: (screen: Screen) => void;
  products: Product[];
  onViewProduct: (product: Product) => void;
  onRegister: () => void;
  onEditProduct: (product: Product) => void;
}

const ProductsList: React.FC<ProductsListProps> = ({ onNavigate, products, onViewProduct, onRegister, onEditProduct }) => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
            <button onClick={() => onNavigate(Screen.MainMenu)} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Volver al menú principal">
                <BackIcon className="h-6 w-6 text-gray-600"/>
            </button>
            <div className="flex items-center">
                <div className="w-16 h-16 mr-4 p-2 bg-sky-100 rounded-lg flex items-center justify-center">
                  <InventoryIcon className="w-12 h-12 text-sky-700"/>
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Productos</h1>
            </div>
        </div>
        <div className="flex items-center space-x-4">
            <div className="relative">
                <input type="text" placeholder="Buscar..." className="border-2 border-gray-300 rounded-lg p-2 pl-4 pr-10 focus:outline-none focus:border-sky-500" />
                <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"/>
            </div>
            <button 
              onClick={onRegister}
              className="flex items-center bg-sky-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-sky-700 transition-colors duration-200"
            >
              Registrar Producto
              <div className="ml-2 bg-white rounded-full p-1">
                <PlusIcon className="h-5 w-5 text-sky-600"/>
              </div>
            </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-300">
        <table className="min-w-full bg-white">
          <thead className="bg-sky-700 text-white">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">CODIGO</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">NOMBRE</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">RUBRO</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">FAMILIA</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">CLASE</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">MARCA</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">UNIDAD</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">PRECIO BASE</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-center">VER</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-center">EDITAR</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {products.map((product, index) => (
              <tr key={product.id_producto} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200 hover:bg-sky-50`}>
                <td className="text-left py-3 px-4">{index + 1}</td>
                <td className="text-left py-3 px-4 font-medium">{product.nombre}</td>
                <td className="text-left py-3 px-4">{product.rubro}</td>
                <td className="text-left py-3 px-4">{product.familia}</td>
                <td className="text-left py-3 px-4">{product.clase}</td>
                <td className="text-left py-3 px-4">{product.marca || '-'}</td>
                <td className="text-left py-3 px-4">{product.unidad}</td>
                <td className="text-left py-3 px-4">S/. {parseFloat(product.precio_base).toFixed(2)}</td>
                <td className="text-center py-3 px-4">
                    <button onClick={() => onViewProduct(product)} className="text-sky-600 hover:text-sky-800"><ViewIcon className="w-5 h-5"/></button>
                </td>
                 <td className="text-center py-3 px-4">
                    <button onClick={() => onEditProduct(product)} className="text-gray-500 hover:text-gray-700"><EditIcon className="w-5 h-5"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsList;