import React, { useState, useEffect, useMemo } from 'react';
import { OfferedProduct, Provider } from '../types';
import { PRODUCTS } from '../constants';
import { BackIcon, PlusIcon, SaveIcon, TrashIcon } from '../components/icons/IconsAbastecimiento';

interface ProviderFormStep2Props {
  initialData: Partial<Provider>;
  onSave: (products: OfferedProduct[]) => void;
  onBack: () => void;
}

const ProviderFormStep2: React.FC<ProviderFormStep2Props> = ({ initialData, onSave, onBack }) => {
  const [products, setProducts] = useState<OfferedProduct[]>([]);
  const isEditing = !!initialData.id;
  
  const [productSearch, setProductSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setProducts(initialData.productos || []);
  }, [initialData]);

  const [newProduct, setNewProduct] = useState<Partial<OfferedProduct>>({
      producto: '',
      rubro: '',
      familia: '',
      clase: '',
      marca: '',
      unidad: '',
      precioUnitario: '',
  });

  useEffect(() => {
    // When a product is selected in newProduct, sync it with the search input
    if (newProduct.producto) {
      setProductSearch(newProduct.producto);
    }
  }, [newProduct.producto]);


  const filteredProducts = useMemo(() => {
    if (!productSearch) {
        return PRODUCTS;
    }
    const lowercasedSearch = productSearch.toLowerCase();
    // Show results only if the input text does not exactly match a product name
    if (PRODUCTS.some(p => p.nombre.toLowerCase() === lowercasedSearch)) {
        return [];
    }
    return PRODUCTS.filter(p => p.nombre.toLowerCase().includes(lowercasedSearch));
  }, [productSearch]);


  const handleProductSelect = (productName: string) => {
    const selectedProduct = PRODUCTS.find(p => p.nombre === productName);
    if(selectedProduct) {
        setNewProduct(prev => ({
            ...prev, 
            producto: selectedProduct.nombre,
            rubro: selectedProduct.rubro,
            familia: selectedProduct.familia,
            clase: selectedProduct.clase,
            marca: selectedProduct.marca,
            unidad: selectedProduct.unidad,
        }));
    }
    setIsDropdownOpen(false);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewProduct(prev => ({...prev, precioUnitario: e.target.value }));
  }

  const handleAddProduct = () => {
    if (newProduct.producto && newProduct.precioUnitario && newProduct.unidad && newProduct.rubro) {
      setProducts(prev => [...prev, newProduct as OfferedProduct]);
      setNewProduct({
        producto: '',
        rubro: '',
        familia: '',
        clase: '',
        marca: '',
        unidad: '',
        precioUnitario: '',
      });
      setProductSearch('');
    }
  };
  
  const handleRemoveProduct = (indexToRemove: number) => {
    setProducts(products.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex items-center mb-8">
          <button onClick={onBack} className="flex items-center text-sky-700 font-bold py-2 px-4 rounded-lg hover:bg-sky-100 transition-colors duration-200 mr-4">
              <BackIcon className="h-5 w-5 mr-2"/>
              Volver al Paso 1
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Artículos Ofrecidos: Paso 2</h1>
      </div>

      <div className="w-full border-2 border-sky-700 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
          <div className="lg:col-span-2 relative">
            <label className="block text-gray-700">Producto:</label>
            <input 
              type="text"
              value={productSearch}
              onChange={(e) => {
                setProductSearch(e.target.value);
                if (e.target.value !== newProduct.producto) {
                  setNewProduct(prev => ({...prev, producto: ''}));
                }
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)} // Delay to allow click
              placeholder="Escriba para buscar un producto..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring focus:ring-sky-500 focus:ring-opacity-50"
            />
            {isDropdownOpen && filteredProducts.length > 0 && (
              <ul className="absolute z-10 w-full bg-gray-700 text-white border border-gray-600 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                {filteredProducts.map(p => (
                  <li 
                    key={p.nombre} 
                    className="px-4 py-2 hover:bg-sky-600 hover:text-white cursor-pointer transition-colors duration-150"
                    onMouseDown={() => handleProductSelect(p.nombre)}
                  >
                    {p.nombre}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label className="block text-gray-700">Rubro:</label>
            <input value={newProduct.rubro} readOnly className="mt-1 block w-full rounded-md border-sky-200 bg-sky-50 text-sky-900 font-medium shadow-sm focus:outline-none focus:ring-0" />
          </div>
           <div>
            <label className="block text-gray-700">Familia:</label>
            <input value={newProduct.familia} readOnly className="mt-1 block w-full rounded-md border-sky-200 bg-sky-50 text-sky-900 font-medium shadow-sm focus:outline-none focus:ring-0" />
          </div>
           <div>
            <label className="block text-gray-700">Clase:</label>
            <input value={newProduct.clase} readOnly className="mt-1 block w-full rounded-md border-sky-200 bg-sky-50 text-sky-900 font-medium shadow-sm focus:outline-none focus:ring-0" />
          </div>
          <div>
            <label className="block text-gray-700">Marca:</label>
            <input value={newProduct.marca} readOnly className="mt-1 block w-full rounded-md border-sky-200 bg-sky-50 text-sky-900 font-medium shadow-sm focus:outline-none focus:ring-0" />
          </div>
          <div className="w-32">
            <label className="block text-gray-700">Unidad:</label>
            <input value={newProduct.unidad} readOnly className="mt-1 block w-full rounded-md border-sky-200 bg-sky-50 text-sky-900 font-medium shadow-sm focus:outline-none focus:ring-0" />
          </div>
          <div className="w-48">
            <label className="block text-gray-700">Precio Unitario Ref.:</label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">S/.</span>
                <input type="number" step="0.01" value={newProduct.precioUnitario} onChange={handlePriceChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm pl-9 focus:border-sky-500 focus:ring focus:ring-sky-500 focus:ring-opacity-50" />
            </div>
          </div>
          <button onClick={handleAddProduct} className="bg-sky-600 text-white p-2 h-10 w-10 justify-self-start rounded-full shadow-md hover:bg-sky-700 transition-colors duration-200">
            <PlusIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      <div className="w-full border-2 border-sky-700 rounded-lg p-4 mb-8">
        <table className="min-w-full bg-white">
          <thead className="bg-sky-700 text-white">
            <tr>
              <th className="text-left py-2 px-4 uppercase font-semibold text-sm">Producto</th>
              <th className="text-left py-2 px-4 uppercase font-semibold text-sm">Rubro</th>
              <th className="text-left py-2 px-4 uppercase font-semibold text-sm">Familia</th>
              <th className="text-left py-2 px-4 uppercase font-semibold text-sm">Clase</th>
              <th className="text-left py-2 px-4 uppercase font-semibold text-sm">Marca</th>
              <th className="text-left py-2 px-4 uppercase font-semibold text-sm">Unidad</th>
              <th className="text-right py-2 px-4 uppercase font-semibold text-sm">Precio Unitario Ref.</th>
              <th className="py-2 px-4"></th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {products.map((p, index) => (
              <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200`}>
                <td className="text-left py-2 px-4">{p.producto}</td>
                <td className="text-left py-2 px-4">{p.rubro}</td>
                <td className="text-left py-2 px-4">{p.familia}</td>
                <td className="text-left py-2 px-4">{p.clase}</td>
                <td className="text-left py-2 px-4">{p.marca}</td>
                <td className="text-left py-2 px-4">{p.unidad}</td>
                <td className="text-right py-2 px-4">S/. {parseFloat(p.precioUnitario).toFixed(2)}</td>
                <td className="text-center py-2 px-4">
                    <button onClick={() => handleRemoveProduct(index)} className="text-red-500 hover:text-red-700 transition-colors">
                        <TrashIcon className="w-5 h-5"/>
                    </button>
                </td>
              </tr>
            ))}
             {products.length === 0 && (
                <tr>
                    <td colSpan={8} className="text-center py-4 text-gray-500 italic">No se han agregado productos.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="w-full flex justify-between items-center">
            <button onClick={onBack} className="flex items-center justify-center bg-gray-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-200">
                <BackIcon className="mr-2 w-5 h-5"/> Volver
            </button>
            <button onClick={() => onSave(products)} className="flex items-center justify-center bg-sky-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-sky-700 transition-colors duration-200">
                {isEditing ? 'Guardar Cambios' : 'Guardar'} <SaveIcon className="ml-2 w-5 h-5"/>
            </button>
      </div>
    </div>
  );
};

export default ProviderFormStep2;