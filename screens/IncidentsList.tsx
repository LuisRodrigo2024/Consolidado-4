
import React, { useState, useMemo } from 'react';
import { Screen, Incidencia } from '../types';
import { BackIcon, ClaimsIcon, ViewIcon, CloseIcon, PaperclipIcon } from '../components/icons/IconsAbastecimiento';

interface IncidentDetailsModalProps {
    incident: Incidencia;
    onClose: () => void;
}

const IncidentDetailsModal: React.FC<IncidentDetailsModalProps> = ({ incident, onClose }) => {
    if (!incident) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-3xl w-full mx-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Detalle de Incidencia ({parseInt(incident.id_incidencia.split('-')[1], 10)})</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <CloseIcon className="w-6 h-6 text-gray-600" />
                    </button>
                </div>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div><p className="text-sm text-gray-500">Producto</p><p className="text-lg font-semibold text-gray-900">{incident.producto_nombre}</p></div>
                        <div><p className="text-sm text-gray-500">Marca</p><p className="text-lg font-semibold text-gray-900">{incident.producto_marca}</p></div>
                        <div><p className="text-sm text-gray-500">Tipo de Incidencia</p><p className="text-lg font-semibold text-red-600">{incident.tipo_incidencia.replace(/_/g, ' ')}</p></div>
                        <div><p className="text-sm text-gray-500">Cantidad Afectada</p><p className="text-lg font-semibold text-gray-900">{incident.cantidad_afectada}</p></div>
                    </div>
                    <div className="col-span-2">
                        <p className="text-sm text-gray-500">Descripción</p>
                        <div className="p-3 bg-gray-100 border border-gray-200 rounded-md mt-1 text-gray-800 min-h-[60px]">
                            {incident.descripcion}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-800 mt-4 border-t pt-4">Evidencia de Recepción</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                           <div className="p-3 rounded-lg text-center bg-blue-100 shadow-sm">
                                <p className="text-sm font-medium text-blue-600">Cant. Programada</p>
                                <p className="text-3xl font-bold text-blue-800">{incident.cantidad_programada}</p>
                            </div>
                            <div className="p-3 rounded-lg text-center bg-yellow-100 shadow-sm">
                                <p className="text-sm font-medium text-yellow-600">Cant. en Guía</p>
                                <p className="text-3xl font-bold text-yellow-800">{incident.cantidad_en_guia}</p>
                            </div>
                            <div className="p-3 rounded-lg text-center bg-green-100 shadow-sm">
                                <p className="text-sm font-medium text-green-600">Cant. Recibida</p>
                                <p className="text-3xl font-bold text-green-800">{incident.cantidad_recibida}</p>
                            </div>
                            <div className="p-3 rounded-lg text-center bg-red-100 shadow-sm">
                                <p className="text-sm font-medium text-red-600">Cant. Defectuosa</p>
                                <p className="text-3xl font-bold text-red-800">{incident.cantidad_afectada}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface GenerateClaimModalProps {
    incidentIds: string[];
    onConfirm: (data: { observation: string, correctiveAction: 'Nota de Crédito' | 'Reemplazo de Producto' | 'Otro' }) => void;
    onClose: () => void;
}

const GenerateClaimModal: React.FC<GenerateClaimModalProps> = ({ incidentIds, onConfirm, onClose }) => {
    const [observation, setObservation] = useState('');
    const [correctiveAction, setCorrectiveAction] = useState<'Nota de Crédito' | 'Reemplazo de Producto' | 'Otro' | ''>('');

    const handleConfirm = () => {
        if (correctiveAction) {
            onConfirm({ observation, correctiveAction });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Generar Reclamo</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <CloseIcon className="w-6 h-6 text-gray-600" />
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <p className="font-semibold text-gray-700">Resumen de Incidencias:</p>
                        <p className="text-sm text-gray-600">Agrupando las siguientes incidencias: <strong className="font-mono text-sky-700">{incidentIds.join(', ')}</strong></p>
                    </div>
                    <div>
                        <label htmlFor="observation" className="block text-sm font-medium text-gray-700">Observación (Opcional):</label>
                        <textarea id="observation" value={observation} onChange={(e) => setObservation(e.target.value)} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"></textarea>
                    </div>
                    <div>
                        <label htmlFor="correctiveAction" className="block text-sm font-medium text-gray-700">*Acción Correctiva:</label>
                        <select 
                            id="correctiveAction" 
                            value={correctiveAction} 
                            onChange={(e) => setCorrectiveAction(e.target.value as 'Nota de Crédito' | 'Reemplazo de Producto' | 'Otro')} 
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500" 
                            required
                        >
                            <option value="" disabled>Seleccione una opción...</option>
                            <option value="Nota de Crédito">Nota de Crédito</option>
                            <option value="Reemplazo de Producto">Reemplazo de Producto</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700">Pruebas:</label>
                         <button className="mt-1 flex items-center bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                            <PaperclipIcon className="w-5 h-5 mr-2" />
                            Adjuntar Archivos
                        </button>
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-6 border-t pt-4">
                    <button onClick={onClose} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-gray-600 transition-colors">Cancelar</button>
                    <button onClick={handleConfirm} disabled={!correctiveAction} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition-colors disabled:bg-gray-400">Confirmar y Enviar Reclamo</button>
                </div>
            </div>
        </div>
    );
};

interface IncidentsListProps {
  onNavigate: (screen: Screen) => void;
  incidencias: Incidencia[];
  onGenerateClaim: (data: { selectedIncidentIds: string[], observation: string, correctiveAction: 'Nota de Crédito' | 'Reemplazo de Producto' | 'Otro' }) => void;
}

const IncidentsList: React.FC<IncidentsListProps> = ({ onNavigate, incidencias, onGenerateClaim }) => {
    const [selectedIncidents, setSelectedIncidents] = useState<Set<string>>(new Set());
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
    const [viewingIncident, setViewingIncident] = useState<Incidencia | null>(null);

    const pendingIncidents = useMemo(() => incidencias.filter(i => i.estado_incidencia === 'Pendiente'), [incidencias]);

    const receptionSerialMap = useMemo(() => {
        const map = new Map<string, number>();
        let serial = 1;
        const uniqueReceptionIds = [...new Set(incidencias.map(i => i.id_recepcion))].sort();
        uniqueReceptionIds.forEach(id => {
            map.set(id, serial++);
        });
        return map;
    }, [incidencias]);

    const handleSelect = (id: string) => {
        const newSelection = new Set(selectedIncidents);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedIncidents(newSelection);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIncidents(new Set(pendingIncidents.map(i => i.id_incidencia)));
        } else {
            setSelectedIncidents(new Set());
        }
    };

    const handleViewDetails = (incident: Incidencia) => {
        setViewingIncident(incident);
        setIsDetailsModalOpen(true);
    };

    const handleOpenClaimModal = () => {
        if (selectedIncidents.size > 0) {
            setIsClaimModalOpen(true);
        }
    };

    const handleConfirmClaim = (data: { observation: string, correctiveAction: 'Nota de Crédito' | 'Reemplazo de Producto' | 'Otro' }) => {
        onGenerateClaim({
            selectedIncidentIds: Array.from(selectedIncidents),
            ...data
        });
        setIsClaimModalOpen(false);
        setSelectedIncidents(new Set());
    };

    const isAllSelected = selectedIncidents.size > 0 && selectedIncidents.size === pendingIncidents.length;

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => onNavigate(Screen.MainMenu)} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Volver al menú principal">
                        <BackIcon className="h-6 w-6 text-gray-600"/>
                    </button>
                    <div className="flex items-center">
                        <div className="w-16 h-16 mr-4 p-2 bg-sky-100 rounded-lg flex items-center justify-center">
                            <ClaimsIcon className="w-12 h-12 text-sky-700"/>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">Gestión de Incidencias</h1>
                    </div>
                </div>
                <button 
                    onClick={handleOpenClaimModal}
                    disabled={selectedIncidents.size === 0}
                    className="flex items-center bg-sky-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-sky-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Realizar un Reclamo
                </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-300">
                <table className="min-w-full bg-white">
                    <thead className="bg-sky-700 text-white">
                        <tr>
                            <th className="py-3 px-4 w-12"><input type="checkbox" onChange={handleSelectAll} checked={isAllSelected} className="form-checkbox h-5 w-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500" /></th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">COD. INCIDENCIA</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">COD. ORDEN</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">PROVEEDOR</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">COD. RECEPCION</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">TIPO INCIDENCIA</th>
                            <th className="py-3 px-4 uppercase font-semibold text-sm text-center">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {pendingIncidents.map((incidencia, index) => (
                            <tr key={incidencia.id_incidencia} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200 hover:bg-sky-50`}>
                                <td className="py-3 px-4"><input type="checkbox" checked={selectedIncidents.has(incidencia.id_incidencia)} onChange={() => handleSelect(incidencia.id_incidencia)} className="form-checkbox h-5 w-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500" /></td>
                                <td className="text-left py-3 px-4 font-medium">{parseInt(incidencia.id_incidencia.split('-')[1], 10)}</td>
                                <td className="text-left py-3 px-4">{parseInt(incidencia.id_orden.split('-')[1], 10)}</td>
                                <td className="text-left py-3 px-4">{incidencia.nombre_proveedor}</td>
                                <td className="text-left py-3 px-4">{receptionSerialMap.get(incidencia.id_recepcion)}</td>
                                <td className="text-left py-3 px-4"><span className="px-2 py-1 font-semibold leading-tight rounded-full text-red-700 bg-red-100">{incidencia.tipo_incidencia.replace(/_/g, ' ')}</span></td>
                                <td className="text-center py-3 px-4">
                                    <button onClick={() => handleViewDetails(incidencia)} className="text-sky-600 hover:text-sky-800" aria-label={`Ver detalle de ${incidencia.id_incidencia}`}><ViewIcon className="w-5 h-5"/></button>
                                </td>
                            </tr>
                        ))}
                         {pendingIncidents.length === 0 && (
                            <tr><td colSpan={7} className="text-center py-10 text-gray-500 italic">No hay incidencias pendientes.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isDetailsModalOpen && <IncidentDetailsModal incident={viewingIncident!} onClose={() => setIsDetailsModalOpen(false)} />}
            {isClaimModalOpen && <GenerateClaimModal incidentIds={Array.from(selectedIncidents).map(id => String(parseInt(String(id).split('-')[1] || '0', 10)))} onConfirm={handleConfirmClaim} onClose={() => setIsClaimModalOpen(false)} />}
        </div>
    );
};

export default IncidentsList;
