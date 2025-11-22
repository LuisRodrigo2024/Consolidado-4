import React, { useState, useMemo } from 'react';
import { PREMIOS_CATALOG_DATA } from '../constants';
import type { Premio } from '../types';
import { CloseIcon, SearchIcon, AddIcon, TrashIcon, SortIcon } from '../components/icons/iconsClientes';
interface AnadirPremioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPremios: (premios: (Premio & { cantidad: number })[]) => void;
}

type SelectedPremio = Premio & { cantidad: number };

export const AnadirPremioModal: React.FC<AnadirPremioModalProps> = ({ isOpen, onClose, onAddPremios }) => {
  const [selectedPremios, setSelectedPremios] = useState<SelectedPremio[]>([]);
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});

  const totalPoints = useMemo(() => {
    return selectedPremios.reduce((total, p) => total + (p.costo * p.cantidad), 0);
  }, [selectedPremios]);

  if (!isOpen) return null;

  const handleAddClick = (premio: Premio) => {
    const cantidad = quantities[premio.id] || 1;
    if(cantidad <= 0) return;

    setSelectedPremios(prev => {
        const existing = prev.find(p => p.id === premio.id);
        if (existing) {
            return prev.map(p => p.id === premio.id ? { ...p, cantidad: p.cantidad + cantidad } : p);
        }
        return [...prev, { ...premio, cantidad }];
    });
  };

  const handleRemoveFromSelected = (premioId: string) => {
    setSelectedPremios(prev => prev.filter(p => p.id !== premioId));
  }

  const handleConfirm = () => {
    onAddPremios(selectedPremios);
    onClose();
    // Reset state for next time modal opens
    setSelectedPremios([]);
    setQuantities({});
  };

  const handleCancel = () => {
    onClose();
    // Reset state for next time modal opens
    setSelectedPremios([]);
    setQuantities({});
  };
  
  const catalogHeaders = ['NOMBRE', 'DESCRIPCIÓN', 'COSTO', 'CATEGORÍA', 'CANTIDAD', 'AÑADIR'];
  const selectedHeaders = ['PREMIO', 'CANT.', 'COSTO (PTOS)', 'SUBTOTAL', ''];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl h-[95vh] flex flex-col relative">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-2xl font-bold text-gray-800">Añadir Premio</h2>
            <button onClick={handleCancel} className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100" aria-label="Cerrar modal">
                <CloseIcon className="w-6 h-6" />
            </button>
        </div>
        
        {/* Body */}
        <div className="grid grid-cols-12 gap-6 p-6 flex-grow overflow-hidden">
            {/* Left: Catalog */}
            <div className="col-span-7 flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Catálogo de Premios</h3>
                </div>
                <div className="relative w-full max-w-sm mb-4">
                    <input type="text" placeholder="Buscar..." className="border-2 border-gray-300 bg-white h-10 px-5 pr-12 rounded-lg text-sm focus:outline-none w-full focus:border-blue-500" />
                    <button type="button" className="absolute right-0 top-0 mt-1 mr-1 p-2 bg-blue-600 rounded-md hover:bg-blue-700" aria-label="Buscar">
                        <SearchIcon className="text-white h-4 w-4" />
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto border rounded-lg">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-white uppercase bg-blue-600 sticky top-0">
                            <tr>
                                {catalogHeaders.map(h => (
                                    <th key={h} scope="col" className="px-4 py-3 font-semibold tracking-wider">
                                        <div className="flex items-center gap-1">
                                            {h}
                                            {h !== 'AÑADIR' && <SortIcon className="w-4 h-4 opacity-70" />}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {PREMIOS_CATALOG_DATA.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 font-medium text-gray-900">{p.nombre}</td>
                                    <td className="px-4 py-2 text-gray-600 text-xs">{p.descripcion}</td>
                                    <td className="px-4 py-2 text-gray-600">{p.costo}</td>
                                    <td className="px-4 py-2 text-gray-600 text-xs">{p.categoria}</td>
                                    <td className="px-4 py-2">
                                        <input type="number" min="1" defaultValue="1" onChange={(e) => setQuantities({...quantities, [p.id]: parseInt(e.target.value, 10)})} className="w-20 border border-gray-300 rounded px-2 py-1 text-center" aria-label={`Cantidad para ${p.nombre}`} />
                                    </td>
                                    <td className="px-4 py-2">
                                        <button onClick={() => handleAddClick(p)} className="bg-green-500 text-white p-1.5 rounded-md hover:bg-green-600" aria-label={`Añadir ${p.nombre}`}>
                                          <AddIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Right: Selected */}
            <div className="col-span-5 flex flex-col h-full">
                <h3 className="text-xl font-bold mb-4">Premios Seleccionados ({selectedPremios.length})</h3>
                <div className="flex-grow overflow-y-auto rounded-lg shadow-inner bg-gray-50 border">
                   <table className="w-full text-sm text-left">
                    <thead className="text-xs text-white uppercase bg-slate-800 sticky top-0">
                        <tr>
                            {selectedHeaders.slice(0, 4).map(h => <th key={h} scope="col" className="px-3 py-3 font-semibold tracking-wider">{h}</th>)}
                            <th scope="col" className="px-3 py-3"><span className="sr-only">Eliminar</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {selectedPremios.length > 0 ? selectedPremios.map(p => (
                            <tr key={p.id}>
                                <td className="px-3 py-2 font-medium text-gray-900">{p.nombre}</td>
                                <td className="px-3 py-2 text-gray-600 text-center">{p.cantidad}</td>
                                <td className="px-3 py-2 text-gray-600 text-center">{p.costo}</td>
                                <td className="px-3 py-2 text-gray-600 text-center font-semibold">{p.costo * p.cantidad}</td>
                                <td className="px-3 py-2 text-center">
                                    <button onClick={() => handleRemoveFromSelected(p.id)} className="bg-red-500 text-white p-1.5 rounded-md hover:bg-red-600" aria-label={`Eliminar ${p.nombre}`}>
                                      <TrashIcon className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                           <tr>
                                <td colSpan={5} className="text-center py-16 text-gray-500">
                                    Aún no has seleccionado premios.
                                </td>
                            </tr> 
                        )}
                    </tbody>
                    </table>
                </div>
                <div className="mt-auto pt-6 flex flex-col gap-4">
                    <div className="bg-gray-100 p-3 rounded-lg flex justify-between items-center">
                        <span className="font-bold text-gray-700">Puntos a gastar:</span>
                        <span className="text-2xl font-bold text-gray-800">{totalPoints}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={handleConfirm} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                            AÑADIR PREMIOS <AddIcon className="w-5 h-5" />
                        </button>
                        <button onClick={handleCancel} className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 flex items-center justify-center gap-2">
                            CANCELAR <CloseIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};