import React, { useState, useMemo, useEffect } from 'react';
import { OrdenCompra, Recepcion, GuiaRemision, DetalleRecepcionItem, GuiaRemisionItem } from '../types';
import { BackIcon, SaveIcon, PaperclipIcon, PlusIcon, TrashIcon, ClockIcon, FilePlusIcon, CalendarDaysIcon, ClientsIcon, PurchaseOrderIcon, CheckCircleIcon, EditIcon } from '../components/icons/IconsAbastecimiento';

interface RemissionGuideValidationProps {
  order: OrdenCompra;
  recepcion: Recepcion;
  receptionSerial?: number;
  onConfirm: (data: { orderId: string; recepcionId: string; guias: GuiaRemision[] }) => void;
  onCancel: () => void;
}

const RemissionGuideValidation: React.FC<RemissionGuideValidationProps> = ({ order, recepcion, receptionSerial, onConfirm, onCancel }) => {
    const [guides, setGuides] = useState<GuiaRemision[]>([]);
    const [currentGuide, setCurrentGuide] = useState<Partial<GuiaRemision>>({ serie_correlativo: '', fecha_emision_guia: '', fecha_traslado_guia: '' });
    
    // State for the new workflow
    const [productAssignments, setProductAssignments] = useState<Record<string, string | null>>({});
    const [guideQuantities, setGuideQuantities] = useState<Record<string, string>>({});
    const [discrepancyReports, setDiscrepancyReports] = useState<Record<string, boolean>>({});

    const [selectedGuideForAssignment, setSelectedGuideForAssignment] = useState<string>('');
    const [stagedForAssignment, setStagedForAssignment] = useState<Set<string>>(new Set());
    
    useEffect(() => {
        const initialAssignments: Record<string, null> = {};
        const initialQuantities: Record<string, string> = {};
        recepcion.items.forEach(item => {
            initialAssignments[item.nombre_producto] = null;
            initialQuantities[item.nombre_producto] = '';
        });
        setProductAssignments(initialAssignments);
        setGuideQuantities(initialQuantities);
    }, [recepcion]);


    const unassignedProducts = useMemo(() => {
        return recepcion.items.filter(item => productAssignments[item.nombre_producto] === null);
    }, [recepcion.items, productAssignments]);

    const productsByGuide = useMemo(() => {
        const grouped: Record<string, DetalleRecepcionItem[]> = {};
        recepcion.items.forEach(item => {
            const guideSerial = productAssignments[item.nombre_producto];
            if (guideSerial) {
                if (!grouped[guideSerial]) {
                    grouped[guideSerial] = [];
                }
                grouped[guideSerial].push(item);
            }
        });
        return grouped;
    }, [recepcion.items, productAssignments]);

    const handleAddGuide = () => {
        const isGuideValid = currentGuide.serie_correlativo && currentGuide.fecha_emision_guia && currentGuide.fecha_traslado_guia;
        const isDuplicate = guides.some(g => g.serie_correlativo === currentGuide.serie_correlativo);

        if (isGuideValid && !isDuplicate) {
            setGuides(prev => [...prev, currentGuide as GuiaRemision]);
            if (!selectedGuideForAssignment) {
                setSelectedGuideForAssignment(currentGuide.serie_correlativo!);
            }
            setCurrentGuide({ serie_correlativo: '', fecha_emision_guia: '', fecha_traslado_guia: '' });
        }
    };
    
    const handleRemoveGuide = (serieToRemove: string) => {
        setGuides(prev => prev.filter(g => g.serie_correlativo !== serieToRemove));
        
        const newAssignments = { ...productAssignments };
        const newQuantities = { ...guideQuantities };
        
        Object.keys(newAssignments).forEach(productName => {
            if (newAssignments[productName] === serieToRemove) {
                newAssignments[productName] = null;
                newQuantities[productName] = '';
            }
        });
        setProductAssignments(newAssignments);
        setGuideQuantities(newQuantities);

        if (selectedGuideForAssignment === serieToRemove) {
          setSelectedGuideForAssignment(guides.length > 1 ? guides.find(g => g.serie_correlativo !== serieToRemove)!.serie_correlativo : '');
        }
    };
    
    const handleStagedToggle = (productName: string) => {
        const newStaged = new Set(stagedForAssignment);
        if (newStaged.has(productName)) {
            newStaged.delete(productName);
        } else {
            newStaged.add(productName);
        }
        setStagedForAssignment(newStaged);
    };

    const handleAssociateProducts = () => {
        if (!selectedGuideForAssignment || stagedForAssignment.size === 0) return;

        const newAssignments = { ...productAssignments };
        const newQuantities = { ...guideQuantities };

        stagedForAssignment.forEach(productName => {
            newAssignments[productName] = selectedGuideForAssignment;
            const item = recepcion.items.find(i => i.nombre_producto === productName);
            if (item) {
                newQuantities[productName] = String(item.cantidad_programada);
            }
        });

        setProductAssignments(newAssignments);
        setGuideQuantities(newQuantities);
        setStagedForAssignment(new Set());
    };

    const handleQuantityChange = (productName: string, value: string) => {
        setGuideQuantities(prev => ({ ...prev, [productName]: value }));
        // If user modifies quantity, reset report status so they must report again
        if (discrepancyReports[productName]) {
            setDiscrepancyReports(prev => ({...prev, [productName]: false}));
        }
    };

    const handleReportDiscrepancy = (productName: string) => {
        setDiscrepancyReports(prev => ({ ...prev, [productName]: true }));
    };

    const allItemsAssigned = useMemo(() => {
        return recepcion.items.every(item => productAssignments[item.nombre_producto] !== null);
    }, [productAssignments, recepcion.items]);

    const hasDiscrepancies = useMemo(() => {
        if (!allItemsAssigned) return false;
        return recepcion.items.some(item => {
            const programmed = item.cantidad_programada;
            const guided = parseInt(guideQuantities[item.nombre_producto] || '0', 10);
            return programmed !== guided;
        });
    }, [allItemsAssigned, guideQuantities, recepcion.items]);

    const isConfirmEnabled = useMemo(() => {
        if (!allItemsAssigned) return false;
        return recepcion.items.every(item => {
            const programmed = item.cantidad_programada;
            const guidedStr = guideQuantities[item.nombre_producto];
            if (guidedStr === undefined || guidedStr === '') return false;
            const guided = parseInt(guidedStr, 10);
            if (programmed !== guided) {
                return discrepancyReports[item.nombre_producto] === true;
            }
            return true;
        });
    }, [allItemsAssigned, guideQuantities, discrepancyReports, recepcion.items]);
    
    const handleSubmit = () => {
        if (!isConfirmEnabled) return;

        const guiasConItems: GuiaRemision[] = guides.map(guide => ({
            ...guide,
            items: (productsByGuide[guide.serie_correlativo] || []).map((item): GuiaRemisionItem => ({
                nombre_producto: item.nombre_producto,
                unidad_medida: item.unidad_medida,
                cantidad_en_guia: parseInt(guideQuantities[item.nombre_producto] || '0', 10),
            }))
        }));

        onConfirm({
            orderId: order.id_orden,
            recepcionId: recepcion.id_recepcion,
            guias: guiasConItems,
        });
    };
    
    const InfoCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
        <div className="flex items-center">
            <div className="mr-3 text-sky-700">{icon}</div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-lg font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="p-4 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center mb-6">
                <button onClick={onCancel} className="flex items-center text-sky-700 font-bold py-2 px-4 rounded-lg hover:bg-sky-100 transition-colors duration-200 mr-4">
                    <BackIcon className="h-5 w-5 mr-2"/>Volver a la Lista
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Validar Guía de Remisión para Recepción: <span className="text-sky-700">{receptionSerial ?? recepcion.id_recepcion}</span></h1>
                    <p className="text-md text-gray-500">Orden de Compra: {parseInt(order.id_orden.split('-')[1], 10)} | Proveedor: {order.nombre_proveedor}</p>
                </div>
            </div>

            <div className="space-y-8">
                {/* Section A */}
                <div className="bg-white p-6 rounded-lg border-2 border-sky-700 shadow-sm">
                    <h2 className="text-xl font-bold text-sky-800 border-b-2 border-sky-200 pb-2 mb-4">Sección A: Datos de la Guía de Remisión</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                       <div className="md:col-span-1"><label className="block text-sm font-medium text-gray-700">*Serie y Correlativo:</label><input type="text" value={currentGuide.serie_correlativo} onChange={e => setCurrentGuide(p => ({...p, serie_correlativo: e.target.value}))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/></div>
                       <div className="md:col-span-1"><label className="block text-sm font-medium text-gray-700">*Fecha de Emisión (Guía):</label><input type="date" value={currentGuide.fecha_emision_guia} onChange={e => setCurrentGuide(p => ({...p, fecha_emision_guia: e.target.value}))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/></div>
                       <div className="md:col-span-1"><label className="block text-sm font-medium text-gray-700">*Fecha de Traslado (Guía):</label><input type="date" value={currentGuide.fecha_traslado_guia} onChange={e => setCurrentGuide(p => ({...p, fecha_traslado_guia: e.target.value}))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/></div>
                       <div className="md:col-span-1"><button onClick={handleAddGuide} className="flex items-center justify-center w-full bg-sky-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-sky-700"><PlusIcon className="w-5 h-5 mr-2"/>Agregar Guía</button></div>
                    </div>
                    {guides.length > 0 && (
                        <div className="mt-6"><h3 className="font-semibold text-gray-700 mb-2">Guías Agregadas:</h3><ul className="space-y-2">{guides.map(g => (<li key={g.serie_correlativo} className="flex justify-between items-center p-2 bg-gray-100 rounded-md"><p className="text-sm font-medium text-gray-800"><strong className="text-sky-700">{g.serie_correlativo}</strong></p><button onClick={() => handleRemoveGuide(g.serie_correlativo)} className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100"><TrashIcon className="w-4 h-4" /></button></li>))}</ul></div>
                    )}
                </div>

                {/* Section B */}
                <div className="bg-white p-6 rounded-lg border-2 border-sky-700 shadow-sm">
                    <h2 className="text-xl font-bold text-sky-800 border-b-2 border-sky-200 pb-2 mb-4">Sección B: Resumen de la Recepción Programada</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <InfoCard icon={<PurchaseOrderIcon className="w-8 h-8"/>} label="Orden de Compra" value={parseInt(order.id_orden.split('-')[1], 10).toString()} />
                        <InfoCard icon={<ClientsIcon className="w-8 h-8"/>} label="Proveedor" value={order.nombre_proveedor} />
                        <InfoCard icon={<CalendarDaysIcon className="w-8 h-8"/>} label="Fecha Programada" value={recepcion.fecha_recepcion_programada} />
                        <InfoCard icon={<ClockIcon className="w-8 h-8"/>} label="Hora Programada" value={recepcion.hora_recepcion_programada} />
                    </div>
                </div>

                {/* Section C */}
                {guides.length > 0 && (
                    <div className="bg-white p-6 rounded-lg border-2 border-sky-700 shadow-sm">
                        <h2 className="text-xl font-bold text-sky-800 border-b-2 border-sky-200 pb-2 mb-4">Sección C: Asociación de Productos por Guía</h2>
                        <div className="flex gap-4 items-end">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">1. Seleccione Guía para asociar productos:</label>
                                <select value={selectedGuideForAssignment} onChange={e => setSelectedGuideForAssignment(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500">
                                    {guides.map(g => <option key={g.serie_correlativo} value={g.serie_correlativo}>{g.serie_correlativo}</option>)}
                                </select>
                            </div>
                            <button onClick={handleAssociateProducts} disabled={stagedForAssignment.size === 0} className="flex items-center bg-sky-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-sky-700 disabled:bg-gray-400">Asociar ({stagedForAssignment.size})</button>
                        </div>
                        <div className="mt-4">
                            <p className="block text-sm font-medium text-gray-700 mb-2">2. Marque los productos pendientes que pertenecen a la guía seleccionada:</p>
                            {unassignedProducts.length > 0 ? (
                                <ul className="max-h-40 overflow-y-auto border rounded-md p-2 space-y-1 bg-gray-50">{unassignedProducts.map(item => (<li key={item.nombre_producto}><label className="flex items-center p-2 hover:bg-sky-100 rounded-md cursor-pointer text-gray-700 font-medium"><input type="checkbox" checked={stagedForAssignment.has(item.nombre_producto)} onChange={() => handleStagedToggle(item.nombre_producto)} className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500 mr-3"/>{item.nombre_producto}</label></li>))}</ul>
                            ) : (<p className="text-center p-4 bg-gray-100 rounded-md text-gray-600 italic">Todos los productos han sido asociados a una guía.</p>)}
                        </div>
                    </div>
                )}
                
                {/* Section D */}
                {Object.keys(productsByGuide).length > 0 && (
                     <div className="bg-white p-6 rounded-lg border-2 border-green-700 shadow-sm">
                        <h2 className="text-xl font-bold text-green-800 border-b-2 border-green-200 pb-2 mb-4">Sección D: Detalle y Verificación de Productos por Guía</h2>
                        <div className="space-y-6">
                            {guides.map(guide => productsByGuide[guide.serie_correlativo] && (
                                <div key={guide.serie_correlativo}>
                                    <h3 className="font-bold text-lg text-gray-800 mb-2">Guía de Remisión: <span className="text-sky-700">{guide.serie_correlativo}</span></h3>
                                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                                        <table className="min-w-full bg-white">
                                            <thead className="bg-gray-700 text-white"><tr><th className="text-left py-2 px-3 uppercase font-semibold text-sm">Producto</th><th className="text-center py-2 px-3 uppercase font-semibold text-sm">Unidad</th><th className="text-center py-2 px-3 uppercase font-semibold text-sm">Cant. Programada</th><th className="text-center py-2 px-3 uppercase font-semibold text-sm w-40">Cantidad en Guía*</th><th className="text-center py-2 px-3 uppercase font-semibold text-sm w-56">Acciones/Reportes</th></tr></thead>
                                            <tbody>
                                                {productsByGuide[guide.serie_correlativo].map(item => {
                                                    const programmed = item.cantidad_programada;
                                                    const guidedStr = guideQuantities[item.nombre_producto] || '';
                                                    const guided = parseInt(guidedStr, 10);
                                                    const isDiscrepancy = guidedStr !== '' && !isNaN(guided) && guided !== programmed;
                                                    const reportSaved = discrepancyReports[item.nombre_producto];

                                                    return (
                                                        <tr key={item.nombre_producto} className="border-b border-gray-200">
                                                            <td className="text-left py-2 px-3 font-semibold text-gray-800">{item.nombre_producto}</td>
                                                            <td className="text-center py-2 px-3 text-gray-600">{item.unidad_medida}</td>
                                                            <td className="text-center py-2 px-3 font-bold text-sky-800 bg-gray-100">{programmed}</td>
                                                            <td className="py-2 px-3"><input type="number" min="0" value={guidedStr} onChange={e => handleQuantityChange(item.nombre_producto, e.target.value)} className={`w-full text-center rounded-md border-gray-300 shadow-sm ${isDiscrepancy ? 'border-red-500' : 'focus:border-sky-500'}`} /></td>
                                                            <td className="py-2 px-3 text-center">
                                                                {!isDiscrepancy && guidedStr !== '' ? <span className="font-semibold text-green-600">Conforme</span> : null}
                                                                {isDiscrepancy && (
                                                                    reportSaved ? <div className="flex items-center justify-center gap-2 text-green-600 font-semibold"><CheckCircleIcon className="w-5 h-5"/><span>Reporte Guardado</span><button onClick={() => handleReportDiscrepancy(item.nombre_producto)} className="text-sky-600 hover:text-sky-800 ml-2"><EditIcon className="w-4 h-4" /></button></div> 
                                                                    : <button onClick={() => handleReportDiscrepancy(item.nombre_producto)} className="bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-md hover:bg-red-600">Reportar Incidencia</button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <div className="flex justify-between items-center pt-4">
                    <p className="text-gray-600">(*) Campo obligatorio.</p>
                    <button onClick={handleSubmit} disabled={!isConfirmEnabled} className="flex items-center justify-center bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {hasDiscrepancies ? 'Confirmar con Incidencias' : 'Confirmar e Iniciar Recepción'} <SaveIcon className="ml-2 w-5 h-5"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RemissionGuideValidation;