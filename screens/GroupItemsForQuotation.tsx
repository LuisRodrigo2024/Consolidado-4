import React, { useState, useMemo } from 'react';
import { ItemPendiente } from '../types';
import { BackIcon, SaveIcon, CloseIcon } from '../components/icons/IconsAbastecimiento';

interface GroupItemsForQuotationProps {
  pendingItems: ItemPendiente[];
  onGenerate: (selectedItems: ItemPendiente[]) => void;
  onCancel: () => void;
}

type SortDirection = 'asc' | 'desc';

const GroupItemsForQuotation: React.FC<GroupItemsForQuotationProps> = ({ pendingItems, onGenerate, onCancel }) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const getItemId = (item: ItemPendiente) => `${item.origen_pedido_id}-${item.nombre_producto}-${item.cantidad_requerida}-${item.fecha_requerida}`;
  
  const handleSelect = (item: ItemPendiente) => {
    const itemId = getItemId(item);
    const newSelection = new Set(selectedItems);
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId);
    } else {
      newSelection.add(itemId);
    }
    setSelectedItems(newSelection);
  };
  
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(new Set(filteredAndSortedItems.map(getItemId)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const filteredAndSortedItems = useMemo(() => {
    const parseDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split('-');
        return new Date(`${year}-${month}-${day}`);
    };

    let filtered = pendingItems;

    if (startDate) {
        const start = new Date(startDate);
        start.setUTCHours(0,0,0,0);
        filtered = filtered.filter(item => parseDate(item.fecha_requerida) >= start);
    }
    if (endDate) {
        const end = new Date(endDate);
        end.setUTCHours(23,59,59,999);
        filtered = filtered.filter(item => parseDate(item.fecha_requerida) <= end);
    }

    return [...filtered].sort((a, b) => {
      const dateA = parseDate(a.fecha_requerida);
      const dateB = parseDate(b.fecha_requerida);
      if (sortDirection === 'asc') {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });
  }, [pendingItems, sortDirection, startDate, endDate]);

  const handleGenerate = () => {
    const itemsToGenerate = filteredAndSortedItems.filter(item => selectedItems.has(getItemId(item)));
    onGenerate(itemsToGenerate);
  };
  
  const isSelectAllChecked = selectedItems.size > 0 && selectedItems.size === filteredAndSortedItems.length && filteredAndSortedItems.length > 0;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={onCancel} className="flex items-center text-sky-700 font-bold py-2 px-4 rounded-lg hover:bg-sky-100 transition-colors duration-200 mr-4">
            <BackIcon className="h-5 w-5 mr-2"/>
            Volver
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Generar Solicitud de Cotización: Agrupar Ítems Pendientes</h1>
      </div>

      <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-6 flex items-center gap-4">
        <p className="font-semibold text-gray-700">Filtrar por fecha requerida:</p>
        <div className="flex items-center gap-2">
            <label htmlFor="start-date" className="text-sm">Desde:</label>
            <input 
                type="date" 
                id="start-date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:ring-sky-500"
            />
        </div>
        <div className="flex items-center gap-2">
            <label htmlFor="end-date" className="text-sm">Hasta:</label>
            <input 
                type="date" 
                id="end-date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:ring-sky-500"
            />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-300">
        <table className="min-w-full bg-white">
          <thead className="bg-sky-700 text-white">
            <tr>
              <th className="py-3 px-4 w-12">
                <input 
                  type="checkbox" 
                  className="form-checkbox h-5 w-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                  onChange={handleSelectAll}
                  checked={isSelectAllChecked}
                />
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">NOMBRE PRODUCTO</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">CODIGO PEDIDO</th>
              <th className="text-center py-3 px-4 uppercase font-semibold text-sm">CANTIDAD REQUERIDA</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">UNIDAD</th>
              <th 
                className="text-left py-3 px-4 uppercase font-semibold text-sm cursor-pointer hover:bg-sky-800"
                onClick={toggleSortDirection}
              >
                FECHA REQUERIDA {sortDirection === 'asc' ? '▲' : '▼'}
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredAndSortedItems.map((item, index) => {
                const itemId = getItemId(item);
                return (
                    <tr key={itemId} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200 hover:bg-sky-50`}>
                        <td className="py-3 px-4">
                            <input 
                                type="checkbox" 
                                className="form-checkbox h-5 w-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                                checked={selectedItems.has(itemId)}
                                onChange={() => handleSelect(item)}
                            />
                        </td>
                        <td className="text-left py-3 px-4 font-medium">{item.nombre_producto}</td>
                        <td className="text-left py-3 px-4">{parseInt(item.origen_pedido_id.split('-')[1], 10)}</td>
                        <td className="text-center py-3 px-4">{item.cantidad_requerida}</td>
                        <td className="text-left py-3 px-4">{item.unidad_medida}</td>
                        <td className="text-left py-3 px-4">{item.fecha_requerida}</td>
                    </tr>
                );
            })}
             {filteredAndSortedItems.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500 italic">
                  No hay ítems pendientes que coincidan con los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
       <div className="flex justify-between items-center pt-8">
            <p className="text-gray-600">{selectedItems.size} ítem(s) seleccionado(s)</p>
            <div className="flex space-x-4">
                <button onClick={onCancel} className="flex items-center justify-center bg-gray-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-200">
                    Cancelar <CloseIcon className="ml-2 w-5 h-5"/>
                </button>
                <button 
                    onClick={handleGenerate} 
                    disabled={selectedItems.size === 0} 
                    className="flex items-center justify-center bg-sky-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-sky-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Generar Solicitud de Cotización <SaveIcon className="ml-2 w-5 h-5"/>
                </button>
            </div>
        </div>
    </div>
  );
};

export default GroupItemsForQuotation;