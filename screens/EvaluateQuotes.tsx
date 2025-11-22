

import React, { useState, useMemo } from 'react';
import { SolicitudCotizacion, AdjudicatedItem, CotizacionRecibidaItem } from '../types';
import { BackIcon, SaveIcon, CloseIcon, ChecklistIcon } from '../components/icons/IconsAbastecimiento';

interface EvaluateQuotesProps {
  solicitud: SolicitudCotizacion;
  onGenerateOCs: (adjudicatedItems: Map<string, AdjudicatedItem>, solicitudId: string) => void;
  onCancel: () => void;
}

const EvaluateQuotes: React.FC<EvaluateQuotesProps> = ({ solicitud, onGenerateOCs, onCancel }) => {
  const providersWithQuotes = useMemo(() => solicitud.cotizaciones_recibidas || [], [solicitud]);
  
  const [selectedProviderId, setSelectedProviderId] = useState<string>(providersWithQuotes[0]?.id_proveedor || '');
  const [adjudicatedItems, setAdjudicatedItems] = useState<Map<string, AdjudicatedItem>>(new Map());

  const selectedQuote = useMemo(() => {
    return providersWithQuotes.find(c => c.id_proveedor === selectedProviderId);
  }, [selectedProviderId, providersWithQuotes]);

  const handleAdjudicationChange = (item: CotizacionRecibidaItem, isChecked: boolean) => {
    const newAdjudicatedItems = new Map(adjudicatedItems);
    if (isChecked) {
      const getFirstPaymentOption = (offered: 'Contado' | 'Crédito' | 'Ambos'): 'Contado' | 'Crédito' => {
        if (offered === 'Ambos' || offered === 'Contado') {
          return 'Contado';
        }
        return 'Crédito';
      };

      newAdjudicatedItems.set(item.nombre_producto, {
        providerId: selectedProviderId,
        providerName: selectedQuote?.nombre_proveedor || '',
        finalPaymentMethod: getFirstPaymentOption(item.modalidad_pago_ofrecida),
        itemDetails: item,
        plazo_entrega: selectedQuote?.plazo_entrega || ''
      });
    } else {
      newAdjudicatedItems.delete(item.nombre_producto);
    }
    setAdjudicatedItems(newAdjudicatedItems);
  };
  
  const handlePaymentMethodChange = (itemName: string, method: 'Contado' | 'Crédito') => {
    const newAdjudicatedItems = new Map(adjudicatedItems);
    const currentItem = newAdjudicatedItems.get(itemName);
    if (currentItem) {
      // @FIX: Use object spread with a type assertion to resolve TypeScript errors where properties on `currentItem` were not accessible.
      const updatedItem: AdjudicatedItem = {
        ...(currentItem as AdjudicatedItem),
        finalPaymentMethod: method,
      };
      newAdjudicatedItems.set(itemName, updatedItem);
      setAdjudicatedItems(newAdjudicatedItems);
    }
  };

  const getPaymentOptions = (offered: 'Contado' | 'Crédito' | 'Ambos'): ('Contado' | 'Crédito')[] => {
    if (offered === 'Ambos') return ['Contado', 'Crédito'];
    return [offered];
  };

  const allItemsAdjudicated = adjudicatedItems.size === solicitud.items.length;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={onCancel} className="flex items-center text-sky-700 font-bold py-2 px-4 rounded-lg hover:bg-sky-100 transition-colors duration-200 mr-4">
            <BackIcon className="h-5 w-5 mr-2"/>
            Volver
        </button>
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Adjudicación de Ítems</h1>
            <p className="text-md text-gray-500">Para Solicitud de Cotización con código: <span className="font-bold">{parseInt(solicitud.id_solicitud.split('-')[1], 10)}</span></p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg border-2 border-sky-700 shadow-sm">
                <div className="flex items-center justify-between border-b-2 border-sky-200 pb-2 mb-4">
                    <h2 className="text-xl font-bold text-sky-800">Ítems Ofertados por Proveedor</h2>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mr-2">Seleccionar Oferta:</label>
                        <select 
                            value={selectedProviderId} 
                            onChange={e => setSelectedProviderId(e.target.value)}
                            className="rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                        >
                            {providersWithQuotes.map(c => (
                                <option key={c.id_proveedor} value={c.id_proveedor}>{c.nombre_proveedor}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full bg-white">
                        <thead className="bg-sky-700 text-white">
                            <tr>
                                <th className="py-3 px-4 w-12 text-center">Adjudicar</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Producto</th>
                                <th className="text-right py-3 px-4 uppercase font-semibold text-sm">Precio Ofertado</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Pago Ofrecido</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm w-48">Pago Final</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {selectedQuote?.items.map((item, index) => {
                                const adjudicatedTo = adjudicatedItems.get(item.nombre_producto);
                                const isAdjudicatedToCurrent = adjudicatedTo?.providerId === selectedProviderId;
                                const isAdjudicatedToOther = adjudicatedTo && !isAdjudicatedToCurrent;
                                
                                return (
                                <tr key={index} className={`border-b border-gray-200 ${isAdjudicatedToOther ? 'bg-gray-200 opacity-60' : 'hover:bg-sky-50'} ${isAdjudicatedToCurrent ? 'bg-green-50' : ''}`}>
                                    <td className="py-3 px-4 text-center">
                                        <input 
                                            type="checkbox" 
                                            className="form-checkbox h-5 w-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500 disabled:bg-gray-400"
                                            checked={isAdjudicatedToCurrent}
                                            disabled={isAdjudicatedToOther}
                                            onChange={(e) => handleAdjudicationChange(item, e.target.checked)}
                                        />
                                    </td>
                                    <td className="text-left py-3 px-4 font-medium">
                                        {item.nombre_producto}
                                        {isAdjudicatedToOther && <div className="text-xs text-red-600 font-bold">Adjudicado a: {adjudicatedTo.providerName}</div>}
                                    </td>
                                    <td className="text-right py-3 px-4">S/. {item.monto_total_ofertado.toFixed(2)}</td>
                                    <td className="text-left py-3 px-4">{item.modalidad_pago_ofrecida}</td>
                                    <td className="text-left py-3 px-4">
                                        <select
                                            value={isAdjudicatedToCurrent ? adjudicatedTo.finalPaymentMethod : ''}
                                            onChange={(e) => handlePaymentMethodChange(item.nombre_producto, e.target.value as 'Contado' | 'Crédito')}
                                            disabled={!isAdjudicatedToCurrent}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 disabled:bg-gray-100 bg-white text-gray-900"
                                        >
                                            {getPaymentOptions(item.modalidad_pago_ofrecida).map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <div className="lg:col-span-1">
             <div className="bg-white p-6 rounded-lg border-2 border-green-700 shadow-sm sticky top-8">
                <h2 className="text-xl font-bold text-green-800 border-b-2 border-green-200 pb-2 mb-4">Resumen de Adjudicación</h2>
                {adjudicatedItems.size === 0 ? (
                    <p className="text-gray-500 italic">Seleccione los ítems a adjudicar de las ofertas de los proveedores.</p>
                ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                        {Array.from(adjudicatedItems.entries()).map(([name, details]) => (
                            <div key={name} className="p-3 bg-green-50 rounded border border-green-200">
                                <p className="font-bold text-gray-800">{name}</p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold">{details.providerName}</span> | S/. {details.itemDetails.monto_total_ofertado.toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Pago Final: <span className="font-semibold text-sky-700">{details.finalPaymentMethod}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                )}
             </div>
        </div>

      </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-8 mt-8 border-t">
            <p className="text-gray-600 font-semibold">
                Adjudicados {adjudicatedItems.size} de {solicitud.items.length} ítems.
            </p>
            <div className="flex items-center space-x-4">
                {!allItemsAdjudicated && (
                    <p className="text-sm text-red-600 italic">
                        Debe adjudicar todos los ítems para continuar.
                    </p>
                )}
                <button type="button" onClick={onCancel} className="flex items-center justify-center bg-gray-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-200">
                    Cancelar <CloseIcon className="ml-2 w-5 h-5"/>
                </button>
                <button 
                    type="button" 
                    onClick={() => onGenerateOCs(adjudicatedItems, solicitud.id_solicitud)}
                    disabled={!allItemsAdjudicated} 
                    className="flex items-center justify-center bg-sky-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-sky-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Generar Órdenes de Compra <ChecklistIcon className="ml-2 w-5 h-5"/>
                </button>
            </div>
        </div>
    </div>
  );
};

export default EvaluateQuotes;