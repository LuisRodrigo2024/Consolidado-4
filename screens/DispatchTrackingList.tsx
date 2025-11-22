import React, { useState } from 'react';
import { DispatchTrackingIcon } from '../components/icons/IconsTransporte';
import { Dispatch, Vehicle, Employee, Permission } from '../types';
import PageHeader from './PageHeader';
import StatusBadge from './StatusBadge';
import { SearchIcon } from '../components/icons/IconsTransporte';
import EditDispatchModal from './EditDispatchModal';
import DeleteDispatchConfirmationModal from './DeleteDispatchConfirmationModal';

interface DispatchTrackingListProps {
  dispatches: Dispatch[];
  vehicles: Vehicle[];
  employees: Employee[];
  permissions: Permission[];
  onViewDetails: (dispatch: Dispatch) => void;
  onBack: () => void;
  onUpdateDispatch: (dispatchId: string, vehicle: string, operator: string) => void;
  onDeleteDispatch: (dispatchId: string) => void;
}

const DispatchTrackingList: React.FC<DispatchTrackingListProps> = ({ dispatches, vehicles, employees, permissions, onViewDetails, onBack, onUpdateDispatch, onDeleteDispatch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [dispatchToEdit, setDispatchToEdit] = useState<Dispatch | null>(null);
  const [dispatchToDelete, setDispatchToDelete] = useState<Dispatch | null>(null);

  const filteredDispatches = dispatches.filter(d => {
    const query = searchQuery.toLowerCase();
    const [day, month, year] = d.date.split('/');
    const isoDate = `${year}-${month}-${day}`;

    return (
      d.operator?.toLowerCase().includes(query) ||
      d.vehicle?.toLowerCase().includes(query) ||
      d.date.includes(query) ||
      isoDate.includes(query)
    );
  });
  
  const handleEdit = (dispatch: Dispatch) => {
    setDispatchToEdit(dispatch);
    setEditModalOpen(true);
  };

  const handleConfirmEdit = (dispatchId: string, vehicle: string, operator: string) => {
    onUpdateDispatch(dispatchId, vehicle, operator);
    setEditModalOpen(false);
    setDispatchToEdit(null);
  };

  const handleDelete = (dispatch: Dispatch) => {
    setDispatchToDelete(dispatch);
  };

  const handleConfirmDelete = () => {
    if (dispatchToDelete) {
      onDeleteDispatch(dispatchToDelete.id);
      setDispatchToDelete(null);
    }
  };


  return (
    <>
      <main className="flex-1 p-6 md:p-10 flex flex-col" aria-labelledby="page-title">
        <PageHeader
          title="Seguimiento de Despachos"
          icon={<DispatchTrackingIcon className="h-8 w-8 text-blue-600" />}
          onBack={onBack}
        />
        
        <div className="bg-white rounded-xl shadow-md flex-grow flex flex-col">
          <div className="p-6 flex justify-start items-center border-b border-slate-200">
            <div className="relative">
              <label htmlFor="search-dispatches" className="sr-only">Buscar despachos</label>
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                id="search-dispatches"
                type="search"
                className="border border-slate-300 bg-white h-11 px-4 pl-11 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-80"
                placeholder="Buscar por fecha, operador o vehículo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto flex-grow">
              <table className="min-w-full">
              <thead className="bg-blue-800 text-white">
                  <tr>
                    <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider rounded-tl-xl">Código</th>
                    <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Fecha</th>
                    <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Operador</th>
                    <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Ayudantes</th>
                    <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Vehiculo</th>
                    <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Hora Salida (Est.)</th>
                    <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Hora Regreso (Est.)</th>
                    <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Estado</th>
                    <th scope="col" className="py-3 px-6 text-center font-semibold text-sm uppercase tracking-wider rounded-tr-xl">Acciones</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                  {filteredDispatches.length > 0 ? filteredDispatches.map((dispatch) => (
                  <tr key={dispatch.id} className="text-slate-800 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-600">{dispatch.id}</td>
                      <td className="py-4 px-6">{dispatch.date}</td>
                      <td className="py-4 px-6">{dispatch.operator}</td>
                      <td className="py-4 px-6 text-xs">{(dispatch.assistants && dispatch.assistants.length > 0) ? dispatch.assistants.join(', ') : 'N/A'}</td>
                      <td className="py-4 px-6">{dispatch.vehicle}</td>
                      <td className="py-4 px-6">{dispatch.startTime}</td>
                      <td className="py-4 px-6">{dispatch.endTime}</td>
                      <td className="py-4 px-6"><StatusBadge status={dispatch.status} /></td>
                      <td className="py-4 px-6 text-center whitespace-nowrap space-x-2">
                        <button 
                          onClick={() => handleEdit(dispatch)}
                          disabled={dispatch.status === 'En Ruta' || dispatch.status === 'Completado'}
                          className="bg-white hover:bg-slate-100 text-slate-700 font-bold py-1.5 px-3 rounded-md transition-colors duration-200 text-xs shadow-sm border border-slate-300 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed">
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(dispatch)}
                          disabled={dispatch.status === 'En Ruta' || dispatch.status === 'Completado'}
                          className="bg-red-50 hover:bg-red-100 text-red-700 font-bold py-1.5 px-3 rounded-md transition-colors duration-200 text-xs shadow-sm border border-red-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed">
                          Eliminar
                        </button>
                        <button 
                            onClick={() => onViewDetails(dispatch)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-md transition-colors duration-200 text-xs shadow-sm hover:shadow-md">
                            VER DETALLE
                        </button>
                      </td>
                  </tr>
                  )) : (
                    <tr>
                      <td colSpan={9} className="text-center py-16 text-slate-500 font-semibold">
                        No hay despachos para mostrar.
                      </td>
                    </tr>
                  )}
              </tbody>
              </table>
          </div>
        </div>
      </main>
      
      {isEditModalOpen && dispatchToEdit && (
        <EditDispatchModal
          dispatch={dispatchToEdit}
          vehicles={vehicles}
          employees={employees}
          permissions={permissions}
          onClose={() => setEditModalOpen(false)}
          onConfirm={handleConfirmEdit}
        />
      )}

      {dispatchToDelete && (
        <DeleteDispatchConfirmationModal
          dispatch={dispatchToDelete}
          onClose={() => setDispatchToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
};

export default DispatchTrackingList;