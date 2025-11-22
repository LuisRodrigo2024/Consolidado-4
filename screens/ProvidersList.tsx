
import React, { useState, useMemo } from 'react';
import { Screen, Provider } from '../types';
import { PlusIcon, SearchIcon, ViewIcon, EditIcon, ClientsIcon, BackIcon } from '../components/icons/IconsAbastecimiento';

interface ProvidersListProps {
  onNavigate: (screen: Screen) => void;
  providers: Provider[];
  onViewProvider: (provider: Provider) => void;
  onRegister: () => void;
  onEditProvider: (provider: Provider) => void;
}

const ProvidersList: React.FC<ProvidersListProps> = ({ onNavigate, providers, onViewProvider, onRegister, onEditProvider }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProviders = useMemo(() => {
    if (!searchTerm) {
      return providers;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return providers.filter(provider =>
      provider.nombre.toLowerCase().includes(lowercasedTerm) ||
      provider.razonSocial.toLowerCase().includes(lowercasedTerm) ||
      provider.ruc.toLowerCase().includes(lowercasedTerm)
    );
  }, [providers, searchTerm]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
            <button onClick={() => onNavigate(Screen.MainMenu)} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Volver al menú principal">
                <BackIcon className="h-6 w-6 text-gray-600"/>
            </button>
            <div className="flex items-center">
                <div className="w-16 h-16 mr-4 p-2 bg-sky-100 rounded-lg flex items-center justify-center">
                  <ClientsIcon className="w-12 h-12 text-sky-700"/>
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Proveedores</h1>
            </div>
        </div>
        <div className="flex items-center space-x-4">
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Buscar por Nombre, Razón Social o RUC..." 
                    className="border-2 border-gray-300 rounded-lg p-2 pl-4 pr-10 focus:outline-none focus:border-sky-500 w-80" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"/>
            </div>
            <button 
              onClick={onRegister}
              className="flex items-center bg-sky-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-sky-700 transition-colors duration-200"
            >
              Registrar Proveedor
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
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Nombre Comercial</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Razón Social</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">RUC</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm"></th>
              <th className="py-3 px-4 uppercase font-semibold text-sm"></th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredProviders.map((provider, index) => (
              <tr key={provider.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200 hover:bg-sky-50`}>
                <td className="text-left py-3 px-4">{provider.nombre}</td>
                <td className="text-left py-3 px-4">{provider.razonSocial}</td>
                <td className="text-left py-3 px-4">{provider.ruc}</td>
                <td className="text-center py-3 px-4">
                    <button onClick={() => onViewProvider(provider)} className="text-sky-600 hover:text-sky-800" aria-label={`Ver ${provider.nombre}`}><ViewIcon className="w-5 h-5"/></button>
                </td>
                 <td className="text-center py-3 px-4">
                    <button onClick={() => onEditProvider(provider)} className="text-gray-500 hover:text-gray-700" aria-label={`Editar ${provider.nombre}`}><EditIcon className="w-5 h-5"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProvidersList;
