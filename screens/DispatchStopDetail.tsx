

import React, { useState, useEffect } from 'react';
import { Dispatch, Stop } from '../types';
import PageHeader from './PageHeader';
import { DispatchTrackingIcon } from '../components/icons/IconsTransporte';
import InfoCard from './InfoCard';
import { Status } from './StatusBadge';
import { ExclamationTriangleIcon } from '../components/icons/IconsTransporte';

type StopStatus = 'Pendiente' | 'Picking' | 'En Ruta' | 'En Camino' | 'Entregado';

interface DispatchStopDetailProps {
  dispatch: Dispatch;
  onViewStopDetails: (stop: Stop) => void;
  onBack: () => void;
  onUpdateStopStatuses: (dispatchId: string, updatedStatuses: { [stopId: string]: StopStatus }, arrivalTimes: { [stopId: string]: string }) => void;
  onUpdateDispatchTimes: (dispatchId: string, startTime: string, endTime: string) => void;
  onSetDispatchToPicking: (dispatchId: string) => void;
}

const statusOrder: Record<StopStatus, number> = {
  'Pendiente': 0,
  'Picking': 1,
  'En Ruta': 2,
  'En Camino': 2,
  'Entregado': 3,
};

const statusColors: Record<StopStatus, string> = {
  'Pendiente': 'border-yellow-500 text-yellow-800 bg-yellow-50',
  'Picking': 'border-purple-500 text-purple-800 bg-purple-50',
  'En Ruta': 'border-blue-500 text-blue-800 bg-blue-50',
  'En Camino': 'border-blue-500 text-blue-800 bg-blue-50',
  'Entregado': 'border-green-500 text-green-800 bg-green-50',
}

const DispatchStopDetail: React.FC<DispatchStopDetailProps> = ({ dispatch, onViewStopDetails, onBack, onUpdateStopStatuses, onUpdateDispatchTimes, onSetDispatchToPicking }) => {
  const [stopStatuses, setStopStatuses] = useState<{ [key: string]: StopStatus }>({});
  const [arrivalTimes, setArrivalTimes] = useState<{ [key: string]: string }>({});
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [actualStartTime, setActualStartTime] = useState(dispatch.actualStartTime || '');
  const [actualEndTime, setActualEndTime] = useState(dispatch.actualEndTime || '');
  const [timeChanges, setTimeChanges] = useState(false);

  useEffect(() => {
    const initialStatuses = dispatch.stops.reduce((acc, stop) => {
      acc[stop.id] = stop.status;
      return acc;
    }, {} as { [key: string]: StopStatus });
    setStopStatuses(initialStatuses);

    const initialArrivalTimes = dispatch.stops.reduce((acc, stop) => {
        acc[stop.id] = stop.arrivalTime || '';
        return acc;
    }, {} as { [key: string]: string });
    setArrivalTimes(initialArrivalTimes);

    setActualStartTime(dispatch.actualStartTime || '');
    setActualEndTime(dispatch.actualEndTime || '');
    setTimeChanges(false);
    setHasChanges(false);
    setValidationErrors({});
  }, [dispatch]);

  const handleStatusChange = (stopId: string, newStatus: StopStatus) => {
    setStopStatuses(prev => ({ ...prev, [stopId]: newStatus }));
    setHasChanges(true);
  };

  const handleArrivalTimeChange = (stopId: string, time: string) => {
    setArrivalTimes(prev => ({ ...prev, [stopId]: time }));
    setHasChanges(true);
    if (validationErrors[stopId]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[stopId];
        return newErrors;
      });
    }
  };

  const validateChanges = () => {
    const newErrors: { [key: string]: string } = {};
    for (const stop of dispatch.stops) {
      const status = stopStatuses[stop.id];
      const time = arrivalTimes[stop.id];

      if (status === 'Entregado' && !time) {
        newErrors[stop.id] = 'La hora es obligatoria para el estado "Entregado".';
      } else if (time) {
        const [hours] = time.split(':').map(Number);
        if (hours < 7 || hours >= 22) {
            newErrors[stop.id] = 'La hora debe estar entre las 07:00 y las 22:00.';
        }
      }
    }
    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = () => {
    if (validateChanges()) {
      onUpdateStopStatuses(dispatch.id, stopStatuses, arrivalTimes);
      setHasChanges(false);
    }
  };
  
  const handleSaveTimes = () => {
    onUpdateDispatchTimes(dispatch.id, actualStartTime, actualEndTime);
    setTimeChanges(false);
  };

  const allStatusOptions: StopStatus[] = ['Pendiente', 'Picking', 'En Ruta', 'En Camino', 'Entregado'];

  return (
    <main className="flex-1 p-6 md:p-10 flex flex-col" aria-labelledby="page-title">
      <PageHeader
        title="Detalle de Despacho"
        subtitle={dispatch.id}
        icon={<DispatchTrackingIcon className="h-8 w-8 text-blue-600" />}
        onBack={onBack}
      />
      
      <div className="space-y-8">
        <InfoCard title="Información del Despacho">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
              <div>
                <p className="text-sm text-slate-500">Fecha</p>
                <p className="font-semibold text-slate-800 text-base">{dispatch.date}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Operador</p>
                <p className="font-semibold text-slate-800 text-base">{dispatch.operator}</p>
              </div>
               <div>
                <p className="text-sm text-slate-500">Ayudantes</p>
                <p className="font-semibold text-slate-800 text-base">{(dispatch.assistants && dispatch.assistants.length > 0) ? dispatch.assistants.join(', ') : 'Ninguno'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Vehiculo</p>
                <p className="font-semibold text-slate-800 text-base">{dispatch.vehicle}</p>
              </div>
           </div>
        </InfoCard>

        <InfoCard title="Tiempos">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 items-end">
              <div>
                  <p className="text-sm text-slate-500">Hora Salida (Est.)</p>
                  <p className="font-semibold text-slate-800 text-base">{dispatch.startTime}</p>
              </div>
              <div>
                  <label htmlFor="actual-start-time" className="block text-sm text-slate-500 mb-1">Hora Salida (Real)</label>
                  <input id="actual-start-time" type="time" value={actualStartTime} onChange={(e) => { setActualStartTime(e.target.value); setTimeChanges(true); }}
                         className="border rounded-lg p-2 text-sm w-full focus:outline-none bg-white text-black border-slate-300"/>
              </div>
              <div>
                  <p className="text-sm text-slate-500">Hora Regreso (Est.)</p>
                  <p className="font-semibold text-slate-800 text-base">{dispatch.endTime}</p>
              </div>
              <div>
                  <label htmlFor="actual-end-time" className="block text-sm text-slate-500 mb-1">Hora Regreso (Real)</label>
                  <input id="actual-end-time" type="time" value={actualEndTime} onChange={(e) => { setActualEndTime(e.target.value); setTimeChanges(true); }}
                         className="border rounded-lg p-2 text-sm w-full focus:outline-none bg-white text-black border-slate-300"/>
              </div>
          </div>
          {timeChanges && (
              <div className="mt-4 flex justify-end">
                  <button onClick={handleSaveTimes} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-md transition-colors duration-200 text-xs shadow-sm hover:shadow-md">
                      Guardar Tiempos
                  </button>
              </div>
          )}
        </InfoCard>

        <div className="bg-white rounded-xl shadow-md flex-grow flex flex-col">
          <div className="p-6 flex justify-between items-center border-b border-slate-200">
            <h2 className="text-lg font-bold text-blue-800">Paradas</h2>
            <button
              onClick={() => onSetDispatchToPicking(dispatch.id)}
              disabled={dispatch.status !== 'Programado'}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 text-xs shadow-sm hover:shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              Iniciar Picking
            </button>
          </div>
          <div className="overflow-x-auto flex-grow">
              <table className="min-w-full">
              <thead className="bg-blue-800 text-white">
                  <tr>
                    <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Secuencia</th>
                    <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Origen</th>
                    <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Destino</th>
                    <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Hora de Llegada</th>
                    <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">Estado</th>
                    <th scope="col" className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider rounded-tr-xl"><span className="sr-only">Actions</span></th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                  {dispatch.stops.map((stop) => {
                    const originalStatusValue = statusOrder[stop.status];
                    return (
                      <tr key={stop.id} className="text-slate-800 hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-6 font-bold text-slate-500 text-center">{stop.sequence}</td>
                          <td className="py-3 px-6">{stop.origin}</td>
                          <td className="py-3 px-6">{stop.destination}</td>
                          <td className="py-3 px-6">
                            <input
                                type="time"
                                value={arrivalTimes[stop.id] || ''}
                                onChange={(e) => handleArrivalTimeChange(stop.id, e.target.value)}
                                disabled={stopStatuses[stop.id] === 'Pendiente'}
                                className={`border rounded-lg p-2 text-sm w-full focus:outline-none bg-white text-black disabled:bg-slate-100 disabled:cursor-not-allowed ${validationErrors[stop.id] ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'}`}
                                aria-label={`Hora de llegada para la parada ${stop.id}`}
                            />
                            {validationErrors[stop.id] && (
                              <div className="flex items-start text-red-600 text-xs mt-1">
                                  <ExclamationTriangleIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                                  <span>{validationErrors[stop.id]}</span>
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-6 font-medium">
                            <select
                                value={stopStatuses[stop.id] || stop.status}
                                onChange={(e) => handleStatusChange(stop.id, e.target.value as StopStatus)}
                                className={`border-2 rounded-lg p-2 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm w-full ${statusColors[stopStatuses[stop.id] || stop.status]}`}
                                aria-label={`Estado de la parada ${stop.id}`}
                            >
                                {allStatusOptions.map(option => (
                                  <option
                                    key={option}
                                    value={option}
                                    disabled={statusOrder[option] < originalStatusValue}
                                  >
                                    {option}
                                  </option>
                                ))}
                            </select>
                          </td>
                          <td className="py-3 px-6 text-center">
                              <button 
                              onClick={() => onViewStopDetails(stop)}
                               className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-md transition-colors duration-200 text-xs shadow-sm hover:shadow-md">
                                VER ARTÍCULOS
                              </button>
                          </td>
                      </tr>
                    );
                  })}
              </tbody>
              </table>
          </div>
           {hasChanges && (
            <div className="p-4 bg-yellow-50 border-t border-yellow-200 flex justify-end items-center">
              <p className="text-sm font-semibold text-yellow-800 mr-4">Tiene cambios sin guardar.</p>
              <button
                onClick={handleSaveChanges}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors duration-200 text-sm shadow-sm hover:shadow-md">
                Guardar Cambios
              </button>
            </div>
           )}
        </div>
      </div>
    </main>
  );
};

export default DispatchStopDetail;