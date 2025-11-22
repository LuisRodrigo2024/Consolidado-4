import React, { useState, useMemo, useEffect } from 'react';
import { OrdenCompra, DetalleRecepcionItem } from '../types';
import { BackIcon, SaveIcon } from '../components/icons/IconsAbastecimiento';
import AvailabilityScheduler from '../components/AvailabilityScheduler';

type LogisticsMode = 'Entrega en Almacén' | 'Recojo por Transporte Propio' | '';
type AvailabilityStatus = 'idle' | 'ok';

interface ScheduleReceptionFormProps {
  order: OrdenCompra;
  onConfirm: (data: { logisticsMode: LogisticsMode; finalDate: string; finalTime: string; recursoAsignado?: string; items: DetalleRecepcionItem[] }) => void;
  onCancel: () => void;
}

const ScheduleReceptionForm: React.FC<ScheduleReceptionFormProps> = ({ order, onConfirm, onCancel }) => {
  const [logisticsMode, setLogisticsMode] = useState<LogisticsMode>('');
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>('idle');
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  
  const [finalDate, setFinalDate] = useState('');
  const [finalTime, setFinalTime] = useState('');
  const [programmedQuantities, setProgrammedQuantities] = useState<Record<string, string>>({});

  const [availableWarehouses, setAvailableWarehouses] = useState<string[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');


  const pendingItems = useMemo(() => {
    return order.items.map(item => {
      const totalProgramado = order.recepciones?.reduce((sum, recepcion) => {
        const recepcionItem = recepcion.items.find(ri => ri.nombre_producto === item.nombre_producto);
        return sum + (recepcionItem?.cantidad_programada || 0);
      }, 0) || 0;
      const pendiente = item.cantidad_adjudicada - totalProgramado;
      return { ...item, cantidad_pendiente: pendiente };
    }).filter(item => item.cantidad_pendiente > 0);
  }, [order]);

  // Reset state when logistics mode changes
  useEffect(() => {
    setAvailabilityStatus('idle');
    setAvailabilityMessage('');
    setFinalDate('');
    setFinalTime('');
    setAvailableWarehouses([]);
    setSelectedWarehouse('');
  }, [logisticsMode]);
  
  const handleSlotSelect = (date: string, time: string, available: string[]) => {
    const formattedDate = new Date(date + 'T00:00:00Z').toLocaleDateString('es-ES', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' });
    setFinalDate(date);
    setFinalTime(time);
    setAvailabilityStatus('ok');
    if (logisticsMode === 'Entrega en Almacén') {
        setAvailableWarehouses(available);
        setAvailabilityMessage(`✅ Horario seleccionado: ${formattedDate} a las ${time}. Almacenes disponibles: ${available.join(', ')}. Proceda a la programación final.`);
    } else {
        setAvailabilityMessage(`✅ Horario seleccionado: ${formattedDate} a las ${time}. Puede proceder a la programación final.`);
    }
    setIsSchedulerOpen(false);
  };

  const handleQuantityChange = (productName: string, value: string, max: number) => {
    const numValue = parseInt(value, 10);
    if (value === '' || (numValue >= 0 && numValue <= max)) {
        setProgrammedQuantities(prev => ({ ...prev, [productName]: value }));
    }
  };
  
  const resourceType = logisticsMode === 'Entrega en Almacén' ? 'Almacén' : 'Transporte';

  const isFormValid = useMemo(() => {
    if (availabilityStatus !== 'ok' || !finalDate || !finalTime) {
        return false;
    }
    if (logisticsMode === 'Entrega en Almacén' && !selectedWarehouse) {
        return false;
    }
    const hasAtLeastOneItem = Object.values(programmedQuantities).some(qty => parseInt(qty as string, 10) > 0);
    return hasAtLeastOneItem;
  }, [availabilityStatus, finalDate, finalTime, programmedQuantities, selectedWarehouse, logisticsMode]);

  const handleSubmit = () => {
    if (!isFormValid || !logisticsMode) return;
    const itemsToConfirm: DetalleRecepcionItem[] = pendingItems
      .map(item => ({
        ...item,
        cantidad_programada: parseInt(programmedQuantities[item.nombre_producto] || '0', 10)
      }))
      .filter(item => item.cantidad_programada > 0)
      .map(({ nombre_producto, unidad_medida, cantidad_programada }) => ({
        nombre_producto,
        unidad_medida,
        cantidad_programada,
      }));

    onConfirm({
        logisticsMode,
        finalDate: finalDate.split('-').reverse().join('-'),
        finalTime,
        recursoAsignado: selectedWarehouse,
        items: itemsToConfirm
    });
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
            <button onClick={onCancel} className="flex items-center text-sky-700 font-bold py-2 px-4 rounded-lg hover:bg-sky-100 transition-colors duration-200 mr-4">
                <BackIcon className="h-5 w-5 mr-2"/>
                Volver
            </button>
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Programar Recepción para OC: {parseInt(order.id_orden.split('-')[1], 10)}</h1>
                <p className="text-md text-gray-500">Proveedor: {order.nombre_proveedor}</p>
            </div>
        </div>

        <div className="space-y-8">
            {/* Section A */}
            <div className="bg-white p-6 rounded-lg border-2 border-sky-700 shadow-sm">
                <h2 className="text-xl font-bold text-sky-800 border-b-2 border-sky-200 pb-2 mb-4">Sección A: Modalidad Logística</h2>
                <div className="max-w-md">
                     <label className="block text-sm font-medium text-gray-700">*Modalidad Logística:</label>
                     <select value={logisticsMode} onChange={e => setLogisticsMode(e.target.value as LogisticsMode)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500">
                        <option value="" disabled>Seleccione una modalidad...</option>
                        <option>Entrega en Almacén</option>
                        <option>Recojo por Transporte Propio</option>
                     </select>
                </div>
            </div>

            {/* Section B */}
            <div className="bg-white p-6 rounded-lg border-2 border-sky-700 shadow-sm">
                <h2 className="text-xl font-bold text-sky-800 border-b-2 border-sky-200 pb-2 mb-4">Sección B: Verificación de Disponibilidad</h2>
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsSchedulerOpen(true)} disabled={!logisticsMode} className="bg-sky-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-sky-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                        Ver Horario de Disponibilidad
                    </button>
                     {!logisticsMode && <p className="text-sm text-gray-500 italic">Por favor, seleccione una modalidad logística primero.</p>}
                </div>
                {availabilityMessage && (
                    <div className={`mt-4 p-4 rounded-lg text-sm font-medium ${availabilityStatus === 'ok' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                        {availabilityMessage}
                    </div>
                )}
            </div>
            
            {/* Section C & D */}
            <div className={`bg-white p-6 rounded-lg border-2 shadow-sm transition-opacity duration-500 ${availabilityStatus === 'ok' ? 'border-green-700 opacity-100' : 'border-gray-300 opacity-50'}`}>
                <fieldset disabled={availabilityStatus !== 'ok'}>
                    {/* Section C */}
                    <h2 className="text-xl font-bold text-green-800 border-b-2 border-green-200 pb-2 mb-4">Sección C: Programación Final</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        <div>
                           <label className="block text-sm font-medium text-gray-700">*Fecha Programada:</label>
                           <input type="text" value={finalDate ? finalDate.split('-').reverse().join('/') : ''} readOnly className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed text-gray-700 font-medium"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">*Hora Programada:</label>
                            <input type="text" value={finalTime} readOnly className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed text-gray-700 font-medium"/>
                        </div>
                        {logisticsMode === 'Entrega en Almacén' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">*Almacén Asignado:</label>
                                <select value={selectedWarehouse} onChange={e => setSelectedWarehouse(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                                    <option value="" disabled>Seleccione...</option>
                                    {availableWarehouses.map(wh => <option key={wh} value={wh}>{wh}</option>)}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Section D */}
                    <h2 className="text-xl font-bold text-green-800 border-b-2 border-green-200 pb-2 mb-4">Sección D: Detalle de Ítems a Recibir</h2>
                     <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-700 text-white">
                                <tr>
                                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Producto</th>
                                    <th className="text-center py-3 px-4 uppercase font-semibold text-sm">Unidad de Medida</th>
                                    <th className="text-center py-3 px-4 uppercase font-semibold text-sm">Cantidad Pendiente</th>
                                    <th className="text-center py-3 px-4 uppercase font-semibold text-sm w-48">Cantidad a Programar</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-900">
                                {pendingItems.map((item, index) => (
                                    <tr key={item.nombre_producto} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200`}>
                                        <td className="text-left py-3 px-4 font-medium">{item.nombre_producto}</td>
                                        <td className="text-center py-3 px-4">{item.unidad_medida}</td>
                                        <td className="text-center py-3 px-4 font-semibold">{item.cantidad_pendiente}</td>
                                        <td className="py-2 px-4">
                                            <input 
                                                type="number" 
                                                value={programmedQuantities[item.nombre_producto] || ''}
                                                onChange={e => handleQuantityChange(item.nombre_producto, e.target.value, item.cantidad_pendiente)}
                                                min="0"
                                                max={item.cantidad_pendiente}
                                                className="w-full text-center rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                placeholder="0"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </fieldset>
            </div>
            
             <div className="flex justify-end pt-4">
                 <button onClick={handleSubmit} disabled={!isFormValid} className="flex items-center justify-center bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-green-700 transition-colors disabled:bg-gray-400">
                    Confirmar Programación <SaveIcon className="ml-2 w-5 h-5"/>
                </button>
            </div>
        </div>

        {isSchedulerOpen && (
            <AvailabilityScheduler
                resourceType={resourceType}
                onSelectSlot={handleSlotSelect}
                onClose={() => setIsSchedulerOpen(false)}
            />
        )}
    </div>
  );
};

export default ScheduleReceptionForm;