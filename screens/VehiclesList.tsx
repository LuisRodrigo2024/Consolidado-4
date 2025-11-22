
import React, { useState } from 'react';
import { SearchIcon } from '../components/icons/IconsTransporte';
import { TruckIcon } from '../components/icons/IconsTransporte';
import { PlusIcon } from '../components/icons/IconsTransporte';
import { PencilIcon } from '../components/icons/IconsTransporte';
import { TrashIcon } from '../components/icons/IconsTransporte';
import { Vehicle } from '../types';
import PageHeader from './PageHeader';
import StatusBadge from './StatusBadge';
import VehicleFormModal from './VehicleFormModal';
import PromptModal from './PromptModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';


interface VehiclesListProps {
  vehicles: Vehicle[];
  onBack: () => void;
  onAddVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  onUpdateVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (placa: string) => void;
}

const VehiclesList: React.FC<VehiclesListProps> = ({ vehicles, onBack, onAddVehicle, onUpdateVehicle, onDeleteVehicle }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [promptAction, setPromptAction] = useState<'edit' | 'delete' | null>(null);
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

  const existingPlacas = vehicles.map(v => v.placa);

  const handlePromptConfirm = (placa: string) => {
    const vehicle = vehicles.find(v => v.placa.toLowerCase() === placa.toLowerCase());
    if (vehicle) {
        if (promptAction === 'edit') {
            setVehicleToEdit(vehicle);
        } else if (promptAction === 'delete') {
            setVehicleToDelete(vehicle);
        }
    }
    setPromptAction(null);
  };
  
  const handleSaveVehicle = (vehicleData: Omit<Vehicle, 'id'> | Vehicle) => {
    if ('id' in vehicleData) {
      onUpdateVehicle(vehicleData as Vehicle);
    } else {
      onAddVehicle(vehicleData);
    }
    setAddModalOpen(false);
    setVehicleToEdit(null);
  };

  const handleDeleteConfirm = () => {
    if (vehicleToDelete) {
      onDeleteVehicle(vehicleToDelete.placa);
    }
    setVehicleToDelete(null);
  };


  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.placa.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.marca.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.tipo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <main className="flex-1 p-6 md:p-10 flex flex-col" aria-labelledby="page-title">
        <PageHeader
          title="Gestión de Vehículos"
          icon={<TruckIcon className="h-8 w-8 text-violet-800" />}
          onBack={onBack}
        />

        <div className="bg-white rounded-xl shadow-md flex-grow flex flex-col">
          <div className="p-6 flex flex-wrap justify-between items-center gap-4 border-b border-slate-200">
            <div className="relative">
              <label htmlFor="search-vehicles" className="sr-only">Buscar Vehículos</label>
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                id="search-vehicles"
                type="search"
                className="border border-slate-300 bg-white h-11 px-4 pl-11 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-80 text-black"
                placeholder="Buscar por placa, marca o tipo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={() => setAddModalOpen(true)} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-200 shadow-sm">
                <PlusIcon className="h-5 w-5 mr-2" />
                Añadir Vehículo
              </button>
              <button onClick={() => setPromptAction('edit')} className="flex items-center bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-4 rounded-lg transition-colors duration-200 border border-slate-300 shadow-sm">
                <PencilIcon className="h-5 w-5 mr-2 text-slate-600" />
                Editar
              </button>
              <button onClick={() => setPromptAction('delete')} className="flex items-center bg-red-50 hover:bg-red-100 text-red-700 font-bold py-2.5 px-4 rounded-lg transition-colors duration-200 border border-red-200 shadow-sm">
                <TrashIcon className="h-5 w-5 mr-2" />
                Eliminar
              </button>
            </div>
          </div>

          <div className="overflow-x-auto flex-grow">
            <table className="min-w-full">
              <thead className="bg-blue-800 text-white">
                <tr>
                  <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider rounded-tl-xl">Placa</th>
                  <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Tipo de Vehículo</th>
                  <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Marca</th>
                  <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Capacidad de Carga</th>
                  <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Volumen de Carga</th>
                  <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Categoría Licencia</th>
                  <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider rounded-tr-xl">Estado Físico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredVehicles.length > 0 ? (
                  filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="text-slate-800 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-600">{vehicle.placa}</td>
                      <td className="py-4 px-6">{vehicle.tipo}</td>
                      <td className="py-4 px-6">{vehicle.marca}</td>
                      <td className="py-4 px-6">{vehicle.capacidadCarga} ton</td>
                      <td className="py-4 px-6">{vehicle.volumenCarga} m³</td>
                      <td className="py-4 px-6">{vehicle.licenciaRequerida}</td>
                      <td className="py-4 px-6"><StatusBadge status={vehicle.estado} /></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                      <td colSpan={7} className="text-center py-16 text-slate-500 font-semibold">
                        No se encontraron vehículos.
                      </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {(isAddModalOpen || vehicleToEdit) && (
        <VehicleFormModal 
          onClose={() => { setAddModalOpen(false); setVehicleToEdit(null); }}
          onSave={handleSaveVehicle}
          initialData={vehicleToEdit}
          existingPlacas={existingPlacas}
        />
      )}

      {promptAction && (
        <PromptModal
          action={promptAction}
          itemType="Vehículo"
          identifierName="placa"
          placeholder="Ej: ABC-123"
          onClose={() => setPromptAction(null)}
          onConfirm={handlePromptConfirm}
          existingIdentifiers={existingPlacas}
        />
      )}
      
      {vehicleToDelete && (
        <DeleteConfirmationModal
            vehicle={vehicleToDelete}
            onClose={() => setVehicleToDelete(null)}
            onConfirm={handleDeleteConfirm}
        />
      )}

    </>
  );
};

export default VehiclesList;
