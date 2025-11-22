import React, { useState, useMemo, useEffect } from 'react';
import { OrdenCompra, Recepcion, DetalleRecepcionItem } from '../types';
import { BackIcon, SaveIcon, PurchaseOrderIcon, ClientsIcon, ClockIcon, FilePlusIcon, CheckCircleIcon, EditIcon, CloseIcon } from '../components/icons/IconsAbastecimiento';

interface ReceptionCountFormProps {
  order: OrdenCompra;
  recepcion: Recepcion;
  onConfirm: (data: { 
    orderId: string; 
    recepcionId: string;
    items: {
      nombre_producto: string;
      cantidad_recibida: number;
      observacion: string;
    }[];
  }) => void;
  onCancel: () => void;
}

const DetailCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex items-center p-4 bg-sky-50 border border-sky-200 rounded-lg">
        <div className="mr-4 text-sky-600">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-600 font-medium">{label}</p>
            <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const DiscrepancyReportModal: React.FC<{
    item: DetalleRecepcionItem;
    receivedQty: number;
    initialObservation: string;
    onSave: (observation: string) => void;
    onClose: () => void;
}> = ({ item, receivedQty, initialObservation, onSave, onClose }) => {
    const [reportText, setReportText] = useState(initialObservation);

    const handleSave = () => {
        if (reportText.trim()) {
            onSave(reportText);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full mx-auto animate-fade-in-down">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Generar Reporte de Discrepancia</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <CloseIcon className="w-6 h-6 text-gray-600" />
                    </button>
                </div>
                <div className="space-y-4">
                    <p><strong className="font-semibold">Producto:</strong> {item.nombre_producto}</p>
                    <div className="flex gap-4">
                        <p><strong>Cantidad Programada:</strong> <span className="font-bold text-blue-600">{item.cantidad_programada}</span></p>
                        <p><strong>Cantidad Recibida:</strong> <span className="font-bold text-red-600">{receivedQty}</span></p>
                    </div>
                    <div>
                        <label htmlFor="report-text" className="block text-sm font-medium text-gray-700 mb-1">Motivo de la No Conformidad:</label>
                        <textarea
                            id="report-text"
                            rows={4}
                            value={reportText}
                            onChange={(e) => setReportText(e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                            placeholder="Describa el motivo de la diferencia (ej: embalaje dañado, faltante, producto incorrecto, etc.)"
                        ></textarea>
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={onClose} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-gray-600 transition-colors">Cancelar</button>
                    <button onClick={handleSave} disabled={!reportText.trim()} className="bg-sky-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-sky-700 transition-colors disabled:bg-gray-400">Guardar Reporte</button>
                </div>
            </div>
             <style>{`
                @keyframes fade-in-down {
                    0% { opacity: 0; transform: translateY(-20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down { animation: fade-in-down 0.3s ease-out; }
            `}</style>
        </div>
    );
};


const ReceptionCountForm: React.FC<ReceptionCountFormProps> = ({ order, recepcion, onConfirm, onCancel }) => {
    
    const [receivedData, setReceivedData] = useState<Record<string, { cantidad_recibida: string; observacion: string }>>(() => {
        const initialState: Record<string, { cantidad_recibida: string; observacion: string }> = {};
        recepcion.items.forEach(item => {
            initialState[item.nombre_producto] = { cantidad_recibida: '', observacion: '' };
        });
        return initialState;
    });

    const [reportingItem, setReportingItem] = useState<DetalleRecepcionItem | null>(null);

    const handleDataChange = (productName: string, field: 'cantidad_recibida' | 'observacion', value: string) => {
        setReceivedData(prev => ({
            ...prev,
            [productName]: {
                ...prev[productName],
                [field]: value,
            }
        }));
    };

    const isFormValid = useMemo(() => {
        return recepcion.items.every(item => {
            const data = receivedData[item.nombre_producto];
            if (!data) return false;
            
            const qtyStr = data.cantidad_recibida;
            if (qtyStr === '' || isNaN(parseInt(qtyStr, 10)) || parseInt(qtyStr, 10) < 0) {
                return false;
            }
            
            const isDiscrepancy = parseInt(qtyStr, 10) !== item.cantidad_programada;
            if (isDiscrepancy && !data.observacion.trim()) {
                return false;
            }

            return true;
        });
    }, [receivedData, recepcion.items]);

    const handleSubmit = () => {
        if (!isFormValid) return;
        
        const itemsToConfirm = recepcion.items.map(item => ({
            nombre_producto: item.nombre_producto,
            cantidad_recibida: parseInt(receivedData[item.nombre_producto].cantidad_recibida, 10),
            observacion: receivedData[item.nombre_producto].observacion,
        }));
        
        onConfirm({
            orderId: order.id_orden,
            recepcionId: recepcion.id_recepcion,
            items: itemsToConfirm,
        });
    };

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="flex items-center mb-6">
                <button onClick={onCancel} className="flex items-center text-sky-700 font-bold py-2 px-4 rounded-lg hover:bg-sky-100 transition-colors duration-200 mr-4">
                    <BackIcon className="h-5 w-5 mr-2"/>
                    Volver a la Lista
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Registrar Resultado de Conteo para Recepción <span className="text-sky-700">{recepcion.id_recepcion}</span></h1>
                </div>
            </div>

            <div className="space-y-8">
                {/* Section A */}
                <div className="bg-white p-6 rounded-lg border-2 border-sky-700 shadow-sm">
                    <h2 className="text-xl font-bold text-sky-800 border-b-2 border-sky-200 pb-2 mb-4">Sección A: Resumen</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <DetailCard icon={<PurchaseOrderIcon className="w-8 h-8"/>} label="Orden de Compra" value={order.id_orden} />
                       <DetailCard icon={<ClientsIcon className="w-8 h-8"/>} label="Proveedor" value={order.nombre_proveedor} />
                       <DetailCard icon={<ClockIcon className="w-8 h-8"/>} label="Hora de Inicio" value={recepcion.hora_inicio_recepcion || 'N/A'} />
                    </div>
                </div>

                {/* Section B */}
                <div className="bg-white p-6 rounded-lg border-2 border-sky-700 shadow-sm">
                    <h2 className="text-xl font-bold text-sky-800 border-b-2 border-sky-200 pb-2 mb-4">Sección B: Tabla de Conteo</h2>
                     <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-700 text-white">
                                <tr>
                                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm w-1/3">Producto</th>
                                    <th className="text-center py-3 px-4 uppercase font-semibold text-sm">Unidad</th>
                                    <th className="text-center py-3 px-4 uppercase font-semibold text-sm">Cant. Programada</th>
                                    <th className="text-center py-3 px-4 uppercase font-semibold text-sm">Cantidad Recibida*</th>
                                    <th className="text-center py-3 px-4 uppercase font-semibold text-sm w-1/3">Acciones / Reporte</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-900">
                                {recepcion.items.map((item, index) => {
                                    const receivedQtyStr = receivedData[item.nombre_producto]?.cantidad_recibida || '';
                                    const hasInput = receivedQtyStr !== '';
                                    const receivedQty = parseInt(receivedQtyStr, 10);
                                    const isDiscrepancy = hasInput && !isNaN(receivedQty) && receivedQty !== item.cantidad_programada;
                                    const observation = receivedData[item.nombre_producto]?.observacion || '';

                                    return (
                                        <tr key={index} className="border-b border-gray-200">
                                            <td className="text-left py-2 px-4 font-medium">{item.nombre_producto}</td>
                                            <td className="text-center py-2 px-4">{item.unidad_medida}</td>
                                            <td className="text-center py-2 px-4 font-semibold bg-gray-100">{item.cantidad_programada}</td>
                                            <td className="py-2 px-4">
                                                <input 
                                                    type="number" 
                                                    value={receivedQtyStr}
                                                    onChange={e => handleDataChange(item.nombre_producto, 'cantidad_recibida', e.target.value)}
                                                    min="0"
                                                    className={`w-full text-center rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 ${isDiscrepancy ? 'border-red-500 ring-red-500' : ''}`}
                                                    placeholder="0"
                                                    required
                                                />
                                            </td>
                                            <td className="py-2 px-4 text-center">
                                                {isDiscrepancy ? (
                                                    observation ? (
                                                        <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                                                            <CheckCircleIcon className="w-5 h-5"/>
                                                            <span>Reporte Guardado</span>
                                                            <button onClick={() => setReportingItem(item)} className="text-sky-600 hover:text-sky-800 ml-2"><EditIcon className="w-4 h-4" /></button>
                                                        </div>
                                                    ) : (
                                                        <button onClick={() => setReportingItem(item)} className="flex items-center justify-center w-full gap-1 bg-red-500 text-white text-xs font-bold py-2 px-2 rounded-md hover:bg-red-600 transition-colors">
                                                            <FilePlusIcon className="w-4 h-4"/>
                                                            <span>Generar Reporte</span>
                                                        </button>
                                                    )
                                                ) : (
                                                    <span className="text-gray-400">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                 <div className="flex justify-between items-center pt-4">
                    <p className="text-gray-600">(*) Campo obligatorio.</p>
                    <button onClick={handleSubmit} disabled={!isFormValid} className="flex items-center justify-center bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                        Confirmar Resultados y Finalizar Conteo <SaveIcon className="ml-2 w-5 h-5"/>
                    </button>
                </div>
            </div>
            
            {reportingItem && (
                <DiscrepancyReportModal
                    item={reportingItem}
                    receivedQty={parseInt(receivedData[reportingItem.nombre_producto]?.cantidad_recibida || '0', 10)}
                    initialObservation={receivedData[reportingItem.nombre_producto]?.observacion || ''}
                    onClose={() => setReportingItem(null)}
                    onSave={(observation) => {
                        handleDataChange(reportingItem.nombre_producto, 'observacion', observation);
                        setReportingItem(null);
                    }}
                />
            )}
        </div>
    );
};

export default ReceptionCountForm;