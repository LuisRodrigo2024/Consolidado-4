import React, { useState } from 'react';
import { ScheduleDispatchIcon } from '../components/icons/IconsTransporte';
import { ProductTransporte, ProductDetail, Vehicle, Employee, Permission, Location } from '../types';
import DispatchSequenceModal from './DispatchSequenceModal';
import ConfirmationModal from '../components/ConfirmationModal';
import PageHeader from './PageHeader';
import TurnoBadge from './TurnoBadge';

interface DispatchOrderSelectionProps {
  date: string;
  unassignedProducts: ProductDetail[];
  vehicles: Vehicle[];
  employees: Employee[];
  permissions: Permission[];
  locations: Location[];
  onBack: () => void;
  onGoHome: () => void;
  onCreateDispatch: (details: {
    products: ProductTransporte[];
    sequences: { [key: string]: string };
    operator: string;
    vehicle: string;
    startTime: string;
    endTime: string;
    assistants: string[];
  }) => void;
  nextDispatchCode: string;
}

const DispatchOrderSelection: React.FC<DispatchOrderSelectionProps> = ({ date, unassignedProducts, vehicles, employees, permissions, locations, onBack, onGoHome, onCreateDispatch, nextDispatchCode }) => {
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSelectProduct = (productId: number) => {
    setSelectedProductIds(prevSelected =>
      prevSelected.includes(productId)
        ? prevSelected.filter(id => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const formattedDisplayDate = date ? new Date(date + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
  const [year, month, day] = date.split('-');
  const filterDate = `${day}/${month}/${year}`;
  const filteredProducts = unassignedProducts.filter(p => p.deliveryDate === filterDate);
  const selectedProducts = filteredProducts.filter(p => selectedProductIds.includes(p.id));

  const handleCreateDispatch = () => {
    if (selectedProductIds.length > 0) {
      setIsModalOpen(true);
    }
  };

  const handleConfirmSequence = (details: {
    sequences: { [key: string]: string };
    operator: string;
    vehicle: string;
    startTime: string;
    endTime: string;
    assistants: string[];
  }) => {
    onCreateDispatch({
      products: selectedProducts,
      sequences: details.sequences,
      operator: details.operator,
      vehicle: details.vehicle,
      startTime: details.startTime,
      endTime: details.endTime,
      assistants: details.assistants,
    });
    setIsModalOpen(false);
    setShowConfirmation(true);
    setSelectedProductIds([]);
  };

  return (
    <>
      <main className="flex-1 p-6 md:p-10 flex flex-col" aria-labelledby="page-title">
        <PageHeader
          title="Seleccionar Pedidos para Despacho"
          subtitle={`Fecha: ${formattedDisplayDate}`}
          icon={<ScheduleDispatchIcon className="h-8 w-8 text-blue-600" />}
          onBack={onBack}
        />

        <div className="bg-white rounded-xl shadow-md flex-grow flex flex-col">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-bold text-blue-800">Artículos Pendientes</h3>
            <p className="text-sm text-slate-600">Seleccione los artículos que formarán parte de este despacho.</p>
          </div>
          <div className="overflow-x-auto flex-grow">
            <table className="min-w-full">
              <thead className="bg-blue-800 text-white">
                <tr>
                  <th scope="col" className="py-3 px-6 text-center font-semibold text-sm uppercase tracking-wider rounded-tl-xl w-12"><span className="sr-only">Select</span></th>
                  <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Pedido</th>
                  <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Producto</th>
                  <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Cantidad</th>
                  <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Unidad</th>
                  <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Origen</th>
                  <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Destino</th>
                  <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider rounded-tr-xl">Turno</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className={`hover:bg-slate-50 transition-colors ${selectedProductIds.includes(product.id) ? 'bg-blue-50' : ''}`}>
                       <td className="py-4 px-6 text-center">
                        <input
                          type="checkbox"
                          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          checked={selectedProductIds.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                          aria-label={`Seleccionar ${product.name}`}
                        />
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-600">{product.orderCode}</td>
                      <td className="py-4 px-6 text-slate-800">{product.name}</td>
                      <td className="py-4 px-6 text-slate-800">{product.quantity}</td>
                      <td className="py-4 px-6 text-slate-800">{product.unit}</td>
                      <td className="py-4 px-6 text-slate-800">{product.origin}</td>
                      <td className="py-4 px-6 text-slate-800">{product.destination}</td>
                      <td className="py-4 px-6">
                        <TurnoBadge turno={product.turno} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-slate-500 font-semibold">
                      No hay pedidos pendientes para la fecha seleccionada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
             <button 
                onClick={handleCreateDispatch}
                disabled={selectedProductIds.length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors duration-200 text-sm shadow-sm hover:shadow-md disabled:bg-slate-400 disabled:cursor-not-allowed disabled:shadow-none">
                Crear Despacho ({selectedProductIds.length} seleccionados)
            </button>
          </div>
        </div>
      </main>
      
      {isModalOpen && (
        <DispatchSequenceModal
          selectedProducts={selectedProducts}
          vehicles={vehicles}
          employees={employees}
          permissions={permissions}
          locations={locations}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmSequence}
          nextDispatchCode={nextDispatchCode}
        />
      )}

      {showConfirmation && (
        <ConfirmationModal 
          onClose={() => setShowConfirmation(false)} 
          dispatchCode={nextDispatchCode}
        />
      )}
    </>
  );
};

export default DispatchOrderSelection;