import React, { useState, useEffect, useMemo } from 'react';
import { ProductTransporte, Vehicle, Employee, Permission, Location, StopType } from '../types';

interface DispatchSequenceModalProps {
  selectedProducts: ProductTransporte[];
  vehicles: Vehicle[];
  employees: Employee[];
  permissions: Permission[];
  locations: Location[];
  onClose: () => void;
  onConfirm: (details: {
    sequences: { [key: string]: string };
    operator: string;
    vehicle: string;
    startTime: string;
    endTime: string;
    assistants: string[];
  }) => void;
  nextDispatchCode: string;
}

const StopTypeBadge: React.FC<{ type: StopType }> = ({ type }) => {
    const typeInfo = {
        Ferreteria: { char: 'F', color: 'bg-blue-500' },
        Proveedor: { char: 'P', color: 'bg-green-500' },
        Cliente: { char: 'C', color: 'bg-orange-500' },
    };

    const info = typeInfo[type];
    if (!info) return null;

    const { char, color } = info;

    return (
        <div className={`w-6 h-6 rounded-full ${color} flex items-center justify-center text-white font-bold text-xs mr-3 flex-shrink-0`}>
            {char}
        </div>
    );
};

const DispatchSequenceModal: React.FC<DispatchSequenceModalProps> = ({ selectedProducts, vehicles, employees, permissions, locations, onClose, onConfirm, nextDispatchCode }) => {
  const [step, setStep] = useState(1);
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [isVehicleDropdownOpen, setVehicleDropdownOpen] = useState(false);
  const [selectedOperatorName, setSelectedOperatorName] = useState('');
  const [locationSequences, setLocationSequences] = useState<{ [key: string]: string }>({});
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [assistantCount, setAssistantCount] = useState('0');
  const [selectedAssistants, setSelectedAssistants] = useState<string[]>([]);

  // --- Step 2 Logic ---
  const availableVehicles = useMemo(() => vehicles.filter(v => v.estado === 'Operativo'), [vehicles]);
  
  const selectedVehicle = useMemo(() => {
    return availableVehicles.find(v => v.placa.toLowerCase() === vehicleSearch.toLowerCase());
  }, [availableVehicles, vehicleSearch]);
  
  const filteredVehicles = useMemo(() => {
    if (!vehicleSearch) return availableVehicles;
    return availableVehicles.filter(v => v.placa.toLowerCase().includes(vehicleSearch.toLowerCase()));
  }, [vehicleSearch, availableVehicles]);

  const availableOperators = useMemo(() => {
    if (!selectedVehicle) return [];
    return employees.filter(e => {
      const hasCorrectLicense = e.brevete === selectedVehicle.licenciaRequerida;
      const hasPermission = permissions.find(p => p.employeeId === e.id && p.vehicleId === selectedVehicle.id)?.status === 'Habilitado';
      return hasCorrectLicense && hasPermission;
    });
  }, [selectedVehicle, employees, permissions]);

  useEffect(() => {
    setSelectedOperatorName('');
  }, [selectedVehicle]);

  const handleVehicleSelect = (placa: string) => {
    setVehicleSearch(placa);
    setVehicleDropdownOpen(false);
  };

  const handleVehicleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setVehicleSearch(e.target.value);
      setVehicleDropdownOpen(true);
  };

  // --- Step 3 Logic ---
  const locationTypeMap = useMemo(() => {
    const map = new Map<string, StopType>();
    locations.forEach(loc => map.set(loc.name, loc.stopType));
    return map;
  }, [locations]);

  const { uniqueOrigins, uniqueDestinations, totalUniqueLocations } = useMemo(() => {
    const origins = new Set<string>();
    const destinations = new Set<string>();
    selectedProducts.forEach(product => {
      origins.add(product.origin);
      destinations.add(product.destination);
    });
    const allLocations = new Set([...origins, ...destinations]);
    return { 
        uniqueOrigins: Array.from(origins), 
        uniqueDestinations: Array.from(destinations),
        totalUniqueLocations: allLocations.size
    };
  }, [selectedProducts]);

  const uniqueJourneys = useMemo(() => {
    const journeys = new Map<string, { origin: string; destination: string }>();
    selectedProducts.forEach(product => {
        const key = `${product.origin}|${product.destination}`;
        if (!journeys.has(key)) {
            journeys.set(key, { origin: product.origin, destination: product.destination });
        }
    });
    return Array.from(journeys.values());
  }, [selectedProducts]);

  const handleSequenceChange = (location: string, value: string) => {
    const numValue = value.replace(/[^0-9]/g, '');
    setLocationSequences(prev => ({
        ...prev,
        [location]: numValue,
    }));
  };

  const isSequenceValid = useMemo(() => {
    const sequences = Object.values(locationSequences).filter(val => typeof val === 'string' && val.trim() !== '');
    if (sequences.length !== totalUniqueLocations) return false;

    const sequenceNumbers = sequences.map(Number);
    const uniqueSequences = new Set(sequenceNumbers);
    if (uniqueSequences.size !== totalUniqueLocations) return false;

    const sorted = sequenceNumbers.sort((a, b) => a - b);
    for (let i = 0; i < sorted.length; i++) {
        if (sorted[i] !== i + 1) return false;
    }

    return true;
  }, [locationSequences, totalUniqueLocations]);


  // --- Step 5 Logic ---
  const handleAssistantCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const count = parseInt(value, 10);
    if (value === '' || (!isNaN(count) && count >= 0)) {
        setAssistantCount(value);
        const newCount = value === '' ? 0 : count;
        const newSelected = Array(newCount).fill('');
        for(let i = 0; i < Math.min(newCount, selectedAssistants.length); i++) {
            newSelected[i] = selectedAssistants[i];
        }
        setSelectedAssistants(newSelected);
    }
  };

  const handleAssistantChange = (index: number, value: string) => {
    const newAssistants = [...selectedAssistants];
    newAssistants[index] = value;
    setSelectedAssistants(newAssistants);
  };
  
  const availableAssistants = useMemo(() => {
    return employees.filter(e => e.estado === 'Activo' && e.nombre !== selectedOperatorName);
  }, [employees, selectedOperatorName]);
  
  const isAssistantConfirmDisabled = useMemo(() => {
    const count = parseInt(assistantCount, 10);
    if (isNaN(count) || count === 0) return false;
    const filledAssistants = selectedAssistants.filter(Boolean);
    if (filledAssistants.length !== count) return true;
    const uniqueAssistants = new Set(filledAssistants);
    return uniqueAssistants.size !== count;
  }, [assistantCount, selectedAssistants]);


  const renderStep1 = () => (
    <>
      <div className="bg-white shadow-md rounded-xl p-4 mb-4 text-center">
        <h2 id="modal-title" className="text-xl font-bold text-slate-800">PROGRAMACIÓN DE DESPACHO</h2>
      </div>
      <div className="bg-white shadow-md rounded-xl p-4 mb-6">
        <div className="flex items-center text-lg">
          <span className="font-bold text-slate-600 mr-2">Codigo Despacho:</span>
          <span className="bg-slate-100 border border-slate-300 rounded-full px-3 py-1 font-bold text-slate-700">{nextDispatchCode}</span>
        </div>
      </div>
      <div className="w-full bg-white shadow-md rounded-xl flex-grow overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full">
            <thead className="bg-slate-50 text-slate-600">
                <tr>
                <th scope="col" className="py-3 px-4 text-left font-semibold">Cantidad</th>
                <th scope="col" className="py-3 px-4 text-left font-semibold">Producto</th>
                <th scope="col" className="py-3 px-4 text-left font-semibold">Unidad</th>
                <th scope="col" className="py-3 px-4 text-left font-semibold">Origen</th>
                <th scope="col" className="py-3 px-4 text-left font-semibold">Destino</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
                {selectedProducts.map((product) => (
                <tr key={product.id} className="text-slate-800 hover:bg-slate-50">
                    <td className="py-2 px-4">{product.quantity}</td>
                    <td className="py-2 px-4">{product.name}</td>
                    <td className="py-2 px-4">{product.unit}</td>
                    <td className="py-2 px-4">{product.origin}</td>
                    <td className="py-2 px-4">{product.destination}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
      <div className="flex justify-center items-center mt-8 space-x-6">
        <button onClick={onClose} className="bg-white hover:bg-slate-100 text-slate-700 font-bold py-3 px-10 rounded-lg transition-colors duration-200 text-lg shadow-md border border-slate-300">
          Cancelar
        </button>
        <button onClick={() => setStep(2)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-10 rounded-lg transition-colors duration-200 text-lg shadow-lg">
          Siguiente
        </button>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="bg-white shadow-md rounded-xl p-4 mb-6 text-center">
        <h2 id="modal-title" className="text-xl font-bold text-slate-800">ASIGNACION DE RECURSOS</h2>
      </div>
      <div className="flex flex-col space-y-6 p-8 bg-white shadow-md rounded-xl">
         <div className="flex items-center text-lg">
            <label htmlFor="dispatch-code" className="font-bold text-slate-600 mr-4 w-32 shrink-0">Codigo Despacho:</label>
            <span id="dispatch-code" className="bg-slate-100 border border-slate-300 rounded-full px-3 py-1 font-bold text-slate-700">{nextDispatchCode}</span>
         </div>
         <div className="flex items-center text-lg">
            <label className="font-bold text-slate-600 mr-4 w-32 shrink-0">Vehículo:</label>
            <div className="flex items-center gap-4 w-full">
                <div className="relative w-full">
                    <input
                        type="text"
                        value={vehicleSearch}
                        onChange={handleVehicleInputChange}
                        onFocus={() => setVehicleDropdownOpen(true)}
                        onBlur={() => setTimeout(() => setVehicleDropdownOpen(false), 200)}
                        placeholder="Escriba o seleccione una placa"
                        className="border border-slate-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-black"
                    />
                    {isVehicleDropdownOpen && filteredVehicles.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-slate-300 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                            {filteredVehicles.map(v => (
                                <li 
                                    key={v.id}
                                    onMouseDown={() => handleVehicleSelect(v.placa)}
                                    className="px-3 py-2 cursor-pointer hover:bg-blue-50 text-black"
                                >
                                    {v.placa}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {selectedVehicle && (
                    <span className="bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 whitespace-nowrap">
                        {selectedVehicle.tipo}
                    </span>
                )}
            </div>
         </div>
         <div className="flex items-center text-lg">
            <label htmlFor="operator-select" className="font-bold text-slate-600 mr-4 w-32 shrink-0">Operador:</label>
             <select
                id="operator-select"
                value={selectedOperatorName}
                onChange={(e) => setSelectedOperatorName(e.target.value)}
                disabled={!selectedVehicle}
                className="border border-slate-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-slate-100 disabled:cursor-not-allowed bg-white text-black"
            >
                <option value="">{selectedVehicle ? 'Seleccione un operador' : 'Seleccione un vehículo válido'}</option>
                {availableOperators.map(e => (
                    <option key={e.id} value={e.nombre}>{e.nombre}</option>
                ))}
            </select>
         </div>
      </div>
       <div className="flex justify-center items-center mt-8 space-x-6">
        <button onClick={() => setStep(1)} className="bg-white hover:bg-slate-100 text-slate-700 font-bold py-3 px-10 rounded-lg transition-colors duration-200 text-lg shadow-md border border-slate-300">
          Atras
        </button>
        <button onClick={() => setStep(3)} disabled={!selectedVehicle || !selectedOperatorName} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-10 rounded-lg transition-colors duration-200 text-lg shadow-lg disabled:bg-slate-400 disabled:cursor-not-allowed">
          Siguiente
        </button>
      </div>
    </>
  );

  const renderStep3 = () => {
    return (
     <>
      <div className="bg-white shadow-md rounded-xl p-4 mb-4 text-center">
        <h2 id="modal-title" className="text-xl font-bold text-slate-800">SECUENCIA DE UBICACIONES</h2>
        <p className="text-slate-500 text-sm">Asigne un número de secuencia a cada ubicación. Deben ser únicos y consecutivos.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-grow min-h-[300px]">
        {/* Left Panel: Sequencing Inputs */}
        <div className="lg:col-span-3 bg-white shadow-md rounded-xl p-6 flex flex-col">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6">
                
                <div className="space-y-3">
                    <h3 className="text-base font-bold text-slate-700 border-b-2 border-slate-200 pb-2">Orígenes (Puntos de Carga)</h3>
                    <ul className="space-y-3">
                        {uniqueOrigins.map(origin => {
                            const stopType = locationTypeMap.get(origin);
                            return (
                                <li key={`origin-${origin}`} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                                    <div className="flex items-center flex-1 pr-4">
                                        {stopType && <StopTypeBadge type={stopType} />}
                                        <label htmlFor={`seq-${origin}`} className="font-semibold text-slate-800 text-sm">{origin}</label>
                                    </div>
                                    <input
                                        id={`seq-${origin}`}
                                        type="text"
                                        pattern="[0-9]*"
                                        value={locationSequences[origin] || ''}
                                        onChange={(e) => handleSequenceChange(origin, e.target.value)}
                                        className="w-14 h-9 text-center text-base font-bold border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="space-y-3">
                    <h3 className="text-base font-bold text-slate-700 border-b-2 border-slate-200 pb-2">Destinos (Puntos de Entrega)</h3>
                    <ul className="space-y-3">
                        {uniqueDestinations.map(dest => {
                            const stopType = locationTypeMap.get(dest);
                            return (
                                <li key={`dest-${dest}`} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                                    <div className="flex items-center flex-1 pr-4">
                                        {stopType && <StopTypeBadge type={stopType} />}
                                        <label htmlFor={`seq-${dest}`} className="font-semibold text-slate-800 text-sm">{dest}</label>
                                    </div>
                                    <input
                                        id={`seq-${dest}`}
                                        type="text"
                                        pattern="[0-9]*"
                                        value={locationSequences[dest] || ''}
                                        onChange={(e) => handleSequenceChange(dest, e.target.value)}
                                        className="w-14 h-9 text-center text-base font-bold border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>

        {/* Right Panel: Journey Summary */}
        <div className="lg:col-span-2 bg-white shadow-md rounded-xl p-6 flex flex-col">
            <h3 className="text-base font-bold text-slate-700 mb-3 border-b-2 border-slate-200 pb-2">Resumen de Trayectos</h3>
            <div className="overflow-y-auto flex-grow">
                <table className="min-w-full">
                    <thead className="bg-slate-100 sticky top-0">
                        <tr>
                            <th className="py-2 px-3 text-left font-semibold text-xs text-slate-600 uppercase">Origen</th>
                            <th className="py-2 px-3 text-left font-semibold text-xs text-slate-600 uppercase">Destino</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {uniqueJourneys.map((journey, index) => (
                            <tr key={index} className="text-sm">
                                <td className="py-2 px-3 text-slate-800">{journey.origin}</td>
                                <td className="py-2 px-3 text-slate-600">{journey.destination}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>


       <div className="flex justify-between items-center mt-8">
        <button onClick={() => setStep(2)} className="bg-white hover:bg-slate-100 text-slate-700 font-bold py-3 px-10 rounded-lg transition-colors duration-200 text-lg shadow-md border border-slate-300">
          Atrás
        </button>
        <button
          onClick={() => setStep(4)}
          disabled={!isSequenceValid}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-10 rounded-lg transition-colors duration-200 text-lg shadow-lg disabled:bg-slate-400 disabled:cursor-not-allowed">
          Confirmar Secuencia
        </button>
      </div>
     </>
    );
  };

  const renderStep4 = () => {
    const canConfirmTimings = startTime && endTime;
    return (
        <>
            <div className="bg-white shadow-md rounded-xl p-4 mb-6 text-center">
                <h2 id="modal-title" className="text-xl font-bold text-slate-800">HORARIOS ESTIMADOS</h2>
            </div>
            <div className="flex flex-col space-y-6 p-8 bg-white shadow-md rounded-xl">
                <div className="flex items-center text-lg">
                    <label htmlFor="start-time" className="font-bold text-slate-600 mr-4 w-48 shrink-0">Hora Estimada de Salida:</label>
                    <input
                        id="start-time"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="border border-slate-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-black"
                    />
                </div>
                <div className="flex items-center text-lg">
                    <label htmlFor="end-time" className="font-bold text-slate-600 mr-4 w-48 shrink-0">Hora Estimada de Regreso:</label>
                    <input
                        id="end-time"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="border border-slate-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-black"
                    />
                </div>
            </div>
            <div className="flex justify-center items-center mt-8 space-x-6">
                <button onClick={() => setStep(3)} className="bg-white hover:bg-slate-100 text-slate-700 font-bold py-3 px-10 rounded-lg transition-colors duration-200 text-lg shadow-md border border-slate-300">
                    Atras
                </button>
                <button
                    onClick={() => setStep(5)}
                    disabled={!canConfirmTimings}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-10 rounded-lg transition-colors duration-200 text-lg shadow-lg disabled:bg-slate-400 disabled:cursor-not-allowed">
                    Siguiente
                </button>
            </div>
        </>
    );
  };
  
  const renderStep5 = () => {
    const finalAssistantCount = parseInt(assistantCount, 10) || 0;
    return (
        <>
            <div className="bg-white shadow-md rounded-xl p-4 mb-4 text-center">
                <h2 id="modal-title" className="text-xl font-bold text-slate-800">ASIGNACIÓN DE AYUDANTES</h2>
            </div>
            <div className="flex flex-col space-y-4 p-8 bg-white shadow-md rounded-xl">
                <div>
                    <label htmlFor="assistant-count" className="block text-lg font-bold text-slate-600 mb-2">Cantidad de Ayudantes:</label>
                    <input
                        id="assistant-count"
                        type="number"
                        min="0"
                        value={assistantCount}
                        onChange={handleAssistantCountChange}
                        className="border border-slate-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-black"
                    />
                </div>

                {Array.from({ length: finalAssistantCount }).map((_, index) => (
                    <div key={index}>
                        <label htmlFor={`assistant-${index}`} className="block text-sm font-medium text-slate-700 mb-1">Ayudante {index + 1}:</label>
                        <select
                            id={`assistant-${index}`}
                            value={selectedAssistants[index] || ''}
                            onChange={(e) => handleAssistantChange(index, e.target.value)}
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="">Seleccione un ayudante</option>
                            {availableAssistants.map(assistant => {
                                const isSelectedElsewhere = selectedAssistants.includes(assistant.nombre) && selectedAssistants[index] !== assistant.nombre;
                                return (
                                    <option key={assistant.id} value={assistant.nombre} disabled={isSelectedElsewhere}>
                                        {assistant.nombre}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                ))}
            </div>
            <div className="flex justify-center items-center mt-8 space-x-6">
                <button onClick={() => setStep(4)} className="bg-white hover:bg-slate-100 text-slate-700 font-bold py-3 px-10 rounded-lg transition-colors duration-200 text-lg shadow-md border border-slate-300">
                    Atras
                </button>
                <button
                    onClick={() => onConfirm({
                        sequences: locationSequences,
                        operator: selectedOperatorName,
                        vehicle: selectedVehicle?.placa || '',
                        startTime,
                        endTime,
                        assistants: selectedAssistants.filter(Boolean)
                    })}
                    disabled={isAssistantConfirmDisabled}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-12 rounded-lg transition-colors duration-200 text-lg shadow-lg disabled:bg-slate-400 disabled:cursor-not-allowed disabled:shadow-none">
                    Confirmar Despacho
                </button>
            </div>
        </>
    );
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" role="dialog" aria-modal="true">
      <div className={`bg-slate-50 rounded-2xl shadow-2xl p-8 w-full ${step === 3 ? 'max-w-6xl' : 'max-w-4xl'} flex flex-col animate-fade-in-up max-h-[90vh] overflow-y-auto`}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}
      </div>
    </div>
  );
};

export default DispatchSequenceModal;