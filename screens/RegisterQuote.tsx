import React, { useState, useMemo, useEffect } from 'react';
import { SolicitudCotizacion, Provider, CotizacionRecibida, CotizacionRecibidaItem } from '../types';
import { BackIcon, SaveIcon, CloseIcon, BanIcon } from '../components/icons/IconsAbastecimiento';

interface RegisterQuoteProps {
  solicitud: SolicitudCotizacion;
  providers: Provider[];
  onSave: (quoteData: CotizacionRecibida) => void;
  onCancel: () => void;
}

const RegisterQuote: React.FC<RegisterQuoteProps> = ({ solicitud, providers, onSave, onCancel }) => {
  const [providerId, setProviderId] = useState<string>('');
  const [fechaEmision, setFechaEmision] = useState('');
  const [fechaGarantia, setFechaGarantia] = useState('');
  const [plazoEntrega, setPlazoEntrega] = useState('');
  const [itemLineTotals, setItemLineTotals] = useState<Record<string, string>>({});
  const [notQuotedItems, setNotQuotedItems] = useState<Set<number>>(new Set());
  const [itemPaymentMethods, setItemPaymentMethods] = useState<Record<number, 'Contado' | 'Crédito' | 'Ambos'>>({});

  useEffect(() => {
    setProviderId('');
    setFechaEmision('');
    setFechaGarantia('');
    setPlazoEntrega('');
    
    const initialTotals: Record<string, string> = {};
    const initialPayments: Record<number, 'Contado' | 'Crédito' | 'Ambos'> = {};
    solicitud.items.forEach((_, index) => {
      initialTotals[index] = '';
      initialPayments[index] = 'Contado';
    });
    setItemLineTotals(initialTotals);
    setItemPaymentMethods(initialPayments);
    setNotQuotedItems(new Set());
  }, [solicitud]);

  const availableProviders = useMemo(() => {
    const quotedProviderIds = new Set(solicitud.cotizaciones_recibidas?.map(c => c.id_proveedor) || []);
    
    if (solicitud.proveedores_enviados_ids && solicitud.proveedores_enviados_ids.length > 0) {
        return providers.filter(p => 
            solicitud.proveedores_enviados_ids.includes(p.id) && !quotedProviderIds.has(p.id)
        );
    }
    
    return providers.filter(p => !quotedProviderIds.has(p.id));
  }, [providers, solicitud]);


  const handleLineTotalChange = (index: number, value: string) => {
    setItemLineTotals(prev => ({ ...prev, [index]: value }));
  };

  const handlePaymentMethodChange = (index: number, value: 'Contado' | 'Crédito' | 'Ambos') => {
    setItemPaymentMethods(prev => ({ ...prev, [index]: value }));
  };
  
  const handleToggleNotQuoted = (index: number) => {
    const newNotQuotedItems = new Set(notQuotedItems);
    if (newNotQuotedItems.has(index)) {
        newNotQuotedItems.delete(index);
    } else {
        newNotQuotedItems.add(index);
        handleLineTotalChange(index, '');
    }
    setNotQuotedItems(newNotQuotedItems);
  };

  const montoTotal = useMemo(() => {
    return Object.entries(itemLineTotals).reduce((total: number, [indexStr, price]) => {
      const index = parseInt(indexStr, 10);
      if (notQuotedItems.has(index)) {
        return total;
      }
      return total + (parseFloat(String(price)) || 0);
    }, 0);
  }, [itemLineTotals, notQuotedItems]);

  const isFormValid = useMemo(() => {
    if (!providerId || !fechaEmision || !fechaGarantia || !plazoEntrega) {
      return false;
    }
    
    const atLeastOneItemQuoted = solicitud.items.some((_, index) => !notQuotedItems.has(index));
    if (!atLeastOneItemQuoted) return false;

    return solicitud.items.every((_, index) => {
      if (notQuotedItems.has(index)) {
        return true;
      }
      const price = itemLineTotals[index];
      const paymentMethod = itemPaymentMethods[index];
      return price && !isNaN(parseFloat(price)) && parseFloat(price) >= 0 && paymentMethod;
    });
  }, [providerId, fechaEmision, fechaGarantia, plazoEntrega, itemLineTotals, itemPaymentMethods, notQuotedItems, solicitud.items]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const selectedProvider = providers.find(p => p.id === providerId);
    if (!selectedProvider) return;

    const quoteItems: CotizacionRecibidaItem[] = solicitud.items
      .map((item, index) => ({ item, index }))
      .filter(({ index }) => !notQuotedItems.has(index))
      .map(({ item, index }) => ({
        nombre_producto: item.nombre_producto,
        cantidad_requerida: item.cantidad_requerida,
        unidad_medida: item.unidad_medida,
        monto_total_ofertado: parseFloat(itemLineTotals[index]),
        modalidad_pago_ofrecida: itemPaymentMethods[index],
      }));

    const finalMontoTotal = quoteItems.reduce((total, item) => total + item.monto_total_ofertado, 0);

    const quoteData: CotizacionRecibida = {
      id_proveedor: selectedProvider.id,
      nombre_proveedor: selectedProvider.nombre,
      fecha_emision_cotizacion: fechaEmision,
      fecha_garantia: fechaGarantia,
      plazo_entrega: plazoEntrega,
      monto_total: finalMontoTotal,
      items: quoteItems,
    };

    onSave(quoteData);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={onCancel} className="flex items-center text-sky-700 font-bold py-2 px-4 rounded-lg hover:bg-sky-100 transition-colors duration-200 mr-4">
            <BackIcon className="h-5 w-5 mr-2"/>
            Volver
        </button>
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Registrar Cotización</h1>
            <p className="text-md text-gray-500">Para Solicitud de Cotización con código: <span className="font-bold">{parseInt(solicitud.id_solicitud.split('-')[1], 10)}</span></p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg border-2 border-sky-700 shadow-sm">
            <h2 className="text-xl font-bold text-sky-800 border-b-2 border-sky-200 pb-2 mb-4">Datos de la Cotización</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">*Proveedor:</label>
                    <select value={providerId} onChange={e => setProviderId(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 bg-white text-gray-900">
                        <option value="" disabled>
                            {availableProviders.length > 0 ? 'Seleccione un proveedor' : 'No hay proveedores disponibles'}
                        </option>
                        {availableProviders.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">*Fecha Emisión Cotización:</label>
                    <input type="date" value={fechaEmision} onChange={e => setFechaEmision(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">*Fecha Garantía:</label>
                    <input type="date" value={fechaGarantia} onChange={e => setFechaGarantia(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">*Plazo de Entrega:</label>
                    <input type="text" placeholder="Ej: 7 días hábiles" value={plazoEntrega} onChange={e => setPlazoEntrega(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Monto Total:</label>
                    <p className="text-2xl font-bold text-gray-800 mt-2">S/. {montoTotal.toFixed(2)}</p>
                </div>
            </div>
        </div>

        {/* Details Table */}
        <div className="bg-white p-6 rounded-lg border-2 border-sky-700 shadow-sm">
            <h2 className="text-xl font-bold text-sky-800 border-b-2 border-sky-200 pb-2 mb-4">Detalle de Precios Ofertados</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full bg-white">
                    <thead className="bg-sky-700 text-white">
                        <tr>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Producto</th>
                            <th className="text-center py-3 px-4 uppercase font-semibold text-sm">Cantidad Req.</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Unidad</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm w-52">*Monto Total por Producto</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm w-48">*Modalidad de Pago</th>
                            <th className="text-center py-3 px-4 uppercase font-semibold text-sm">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {solicitud.items.map((item, index) => {
                            const isNotQuoted = notQuotedItems.has(index);
                            const lineTotal = parseFloat(itemLineTotals[index]) || 0;
                            const unitPrice = item.cantidad_requerida > 0 ? lineTotal / item.cantidad_requerida : 0;
                            return (
                                <tr key={index} className={`border-b border-gray-200 ${isNotQuoted ? 'bg-gray-100' : 'hover:bg-sky-50'}`}>
                                    <td className="text-left py-2 px-4 font-medium">{item.nombre_producto}</td>
                                    <td className="text-center py-2 px-4">{item.cantidad_requerida}</td>
                                    <td className="text-left py-2 px-4">{item.unidad_medida}</td>
                                    <td className="text-left py-2 px-4">
                                        {isNotQuoted ? (
                                            <div className="text-center text-gray-500 font-semibold italic py-2">
                                                No Cotizado
                                            </div>
                                        ) : (
                                            <>
                                                <div className="relative">
                                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">S/.</span>
                                                    <input 
                                                        type="number" 
                                                        step="0.01" 
                                                        value={itemLineTotals[index] || ''} 
                                                        onChange={e => handleLineTotalChange(index, e.target.value)}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm pl-9 focus:border-sky-500 focus:ring-sky-500 bg-white text-gray-900"
                                                        required={!isNotQuoted}
                                                        disabled={isNotQuoted}
                                                    />
                                                </div>
                                                {lineTotal > 0 && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        (S/. {unitPrice.toFixed(2)} por {item.unidad_medida})
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </td>
                                    <td className="text-left py-2 px-4">
                                         <select 
                                            value={itemPaymentMethods[index]} 
                                            onChange={e => handlePaymentMethodChange(index, e.target.value as 'Contado' | 'Crédito' | 'Ambos')} 
                                            disabled={isNotQuoted}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 disabled:bg-gray-100 bg-white text-gray-900"
                                         >
                                            <option value="Contado">Contado</option>
                                            <option value="Crédito">Crédito</option>
                                            <option value="Ambos">Ambos</option>
                                        </select>
                                    </td>
                                    <td className="text-center py-2 px-4">
                                        <button 
                                            type="button" 
                                            onClick={() => handleToggleNotQuoted(index)}
                                            className={`p-2 rounded-full transition-colors ${
                                                isNotQuoted 
                                                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                            }`}
                                            title={isNotQuoted ? "Reactivar cotización para este producto" : "Marcar como no cotizado"}
                                        >
                                            <BanIcon className="w-5 h-5"/>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4">
            <p className="text-gray-600">(*) Es un campo obligatorio</p>
            <div className="flex space-x-4">
                <button type="button" onClick={onCancel} className="flex items-center justify-center bg-gray-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-200">
                    Cancelar <CloseIcon className="ml-2 w-5 h-5"/>
                </button>
                <button type="submit" disabled={!isFormValid} className="flex items-center justify-center bg-sky-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-sky-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed">
                    Guardar Cotización <SaveIcon className="ml-2 w-5 h-5"/>
                </button>
            </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterQuote;