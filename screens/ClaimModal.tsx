import React, { useState, useMemo } from 'react';
import { SaleDetail, Product, ProductCatalogItem, ProductStatus } from '../types';
import { productCatalogData, returnReasons, exchangeReasons } from '../constants';
import {loseIcon} from '../components/icons/iconsVentas';
import {ChevronDownIcon} from '../components/icons/iconsVentas';
import {CheckIcon} from '../components/icons/iconsVentas';

interface ClaimModalProps {
  sale: SaleDetail;
  type: 'return' | 'exchange';
  onClose: () => void;
  onConfirm: (details: {
    saleId: string;
    type: 'return' | 'exchange';
    claimedItems: { [productId: string]: { product: Product; quantity: number } };
    newItem?: { product: ProductCatalogItem; quantity: number };
    reason: string;
  }) => void;
}

const parseCurrency = (value: string): number => {
    if (typeof value !== 'string' || value.trim() === '-' || value.trim() === '') return 0;
    const numberValue = parseFloat(value.replace(/S\/\s*/, ''));
    return isNaN(numberValue) ? 0 : numberValue;
};

const ClaimModal: React.FC<ClaimModalProps> = ({ sale, type, onClose, onConfirm }) => {
  const [claimedItems, setClaimedItems] = useState<{ [productId: string]: { product: Product; quantity: number } }>({});
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isCertified, setIsCertified] = useState(false);
  const [newItem, setNewItem] = useState<{ product: ProductCatalogItem; quantity: number } | undefined>(undefined);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const eligibleProducts = useMemo(() => {
    return sale.products.filter(p => 
        p.status === ProductStatus.Entregado || p.status === ProductStatus.PorEntregar
    );
  }, [sale.products]);


  const handleItemToggle = (product: Product, checked: boolean) => {
    setClaimedItems(prev => {
      const newItems = { ...prev };
      if (checked) {
        newItems[product.id] = { product, quantity: 1 };
      } else {
        delete newItems[product.id];
      }
      return newItems;
    });
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const originalQuantity = sale.products.find(p => p.id === productId)?.quantity || 0;
    if (newQuantity < 1 || newQuantity > originalQuantity) return;
    setClaimedItems(prev => ({
      ...prev,
      [productId]: { ...prev[productId], quantity: newQuantity },
    }));
  };

  const handleNewProductSelect = (productId: string) => {
    const product = productCatalogData.find(p => p.id === productId);
    if (product) {
        setNewItem({ product, quantity: 1 });
    } else {
        setNewItem(undefined);
    }
  };

   const handleNewProductQuantityChange = (newQuantity: number) => {
    if (newItem && newQuantity >= 1) {
        setNewItem(prev => prev ? { ...prev, quantity: newQuantity } : undefined);
    }
  };

  const { totalReturnAmount, priceDifference } = useMemo(() => {
    // FIX: Cast the result of Object.values to ensure correct type inference within the reduce function.
    const totalReturnAmount = (Object.values(claimedItems) as { product: Product; quantity: number }[]).reduce((sum, item) => {
      return sum + parseCurrency(item.product.unitPrice) * item.quantity;
    }, 0);

    let priceDifference = 0;
    if (type === 'exchange' && newItem) {
        const newProductTotal = newItem.product.unitPrice * newItem.quantity;
        priceDifference = newProductTotal - totalReturnAmount;
    }

    return { totalReturnAmount, priceDifference };
  }, [claimedItems, newItem, type]);

  const isConfirmDisabled = useMemo(() => {
    const finalReason = reason === 'Otro' ? customReason : reason;
    if (Object.keys(claimedItems).length === 0 || !finalReason.trim() || !isCertified) {
        return true;
    }
    if (type === 'exchange' && !newItem) {
        return true;
    }
    return false;
  }, [claimedItems, reason, customReason, isCertified, type, newItem]);

  const handleConfirmClick = () => {
    if (isConfirmDisabled) return;
    
    setShowConfirmation(true);
    const finalReason = reason === 'Otro' ? customReason : reason;
    
    setTimeout(() => {
        onConfirm({ saleId: sale.id, type, claimedItems, newItem, reason: finalReason });
    }, 1500);
  };
  
  const title = type === 'return' ? 'Registrar Devolución de Productos' : 'Registrar Cambio de Productos';
  const reasonOptions = type === 'return' ? returnReasons : exchangeReasons;
  const confirmationText = type === 'return' ? 'Devolución Registrada' : 'Cambio Registrado';


  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-lg p-8 shadow-2xl w-full max-w-4xl relative animate-fade-in-up">
        {showConfirmation && (
            <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col justify-center items-center rounded-lg animate-fade-in z-10">
                <div className="animate-scale-in">
                    <CheckIcon />
                </div>
                <p className="text-2xl font-bold text-green-600 mt-4">{confirmationText}</p>
            </div>
        )}
        <button onClick={onClose} disabled={showConfirmation} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed">
          <CloseIcon />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">Venta: <span className="font-semibold text-blue-600">{sale.id}</span> | Cliente: <span className="font-semibold">{sale.client}</span></p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left side: Product selection */}
            <div>
                <h3 className="font-semibold text-gray-700 mb-2">1. Seleccione los productos a procesar</h3>
                <div className="border rounded-lg max-h-80 overflow-y-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[#60a5fa] text-white sticky top-0">
                            <tr>
                                <th className="p-3 text-left w-8"></th>
                                <th className="p-3 text-left font-semibold">Producto</th>
                                <th className="p-3 text-center font-semibold w-28">Cantidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {eligibleProducts.length > 0 ? (
                                eligibleProducts.map(p => (
                                    <tr key={p.id} className="border-t hover:bg-gray-50">
                                        <td className="p-3 text-center">
                                            <input type="checkbox" className="h-5 w-5 rounded" onChange={(e) => handleItemToggle(p, e.target.checked)} />
                                        </td>
                                        <td className="p-3">
                                            <p className="font-medium text-gray-800">{p.description}</p>
                                            <p className="text-xs text-gray-500">{p.id} - Cant. Original: {p.quantity}</p>
                                        </td>
                                        <td className="p-3">
                                            <input 
                                                type="number" 
                                                className="w-20 p-1 border rounded text-center" 
                                                value={claimedItems[p.id]?.quantity || 1}
                                                onChange={(e) => handleQuantityChange(p.id, parseInt(e.target.value, 10))}
                                                min="1"
                                                max={p.quantity}
                                                disabled={!claimedItems[p.id]}
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="p-6 text-center text-gray-500">
                                        No hay productos elegibles para un reclamo en esta venta.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Right side: Details and Actions */}
            <div className="space-y-6">
                {type === 'exchange' && (
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-2">2. Seleccione el nuevo producto</h3>
                        <div className="grid grid-cols-[1fr_auto] gap-4">
                             <div className="relative">
                                <select 
                                    className="w-full appearance-none bg-white p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-black"
                                    onChange={(e) => handleNewProductSelect(e.target.value)}
                                    value={newItem?.product.id || ""}
                                >
                                    <option value="">Seleccione un producto...</option>
                                    {productCatalogData.map(p => <option key={p.id} value={p.id}>{p.description}</option>)}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700"><ChevronDownIcon /></div>
                            </div>
                            <input 
                                type="number" 
                                className="w-24 p-3 border rounded-lg text-center" 
                                value={newItem?.quantity || 1}
                                onChange={(e) => handleNewProductQuantityChange(parseInt(e.target.value, 10))}
                                min="1"
                                disabled={!newItem}
                            />
                        </div>
                       
                    </div>
                )}
                <div>
                    <h3 className="font-semibold text-gray-700 mb-2">{type === 'return' ? '2.' : '3.'} Motivo del reclamo</h3>
                    <div className="relative">
                        <select
                            className="w-full appearance-none bg-white p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        >
                            <option value="">Seleccione un motivo...</option>
                            {reasonOptions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700"><ChevronDownIcon /></div>
                    </div>
                    {reason === 'Otro' && (
                        <textarea 
                            className="w-full p-2 border border-gray-300 rounded-lg mt-2 animate-fade-in bg-white text-black" 
                            rows={2} 
                            placeholder="Especifique el motivo..."
                            value={customReason}
                            onChange={(e) => setCustomReason(e.target.value)}
                        ></textarea>
                    )}
                </div>
                <div>
                     <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="h-5 w-5 rounded" checked={isCertified} onChange={(e) => setIsCertified(e.target.checked)}/>
                        <span className="text-sm text-gray-700">Certifico que el producto devuelto ha sido recibido en buen estado.</span>
                    </label>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-right">
                    {type === 'return' ? (
                        <>
                            <p className="text-gray-600">Monto total a devolver al cliente:</p>
                            <p className="text-2xl font-bold text-blue-800">S/{totalReturnAmount.toFixed(2)}</p>
                        </>
                    ) : (
                        <>
                             <p className="text-gray-600">Diferencia de precio:</p>
                            <p className={`text-2xl font-bold ${priceDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>S/{Math.abs(priceDifference).toFixed(2)}</p>
                            <p className="text-sm font-medium text-gray-500">{priceDifference >= 0 ? 'A favor de la tienda' : 'A favor del cliente'}</p>
                        </>
                    )}
                </div>

            </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8 pt-4 border-t">
          <button onClick={onClose} disabled={showConfirmation} className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 disabled:bg-gray-300 disabled:cursor-not-allowed">Cancelar</button>
          <button 
            onClick={handleConfirmClick}
            disabled={isConfirmDisabled || showConfirmation}
            className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Confirmar {type === 'return' ? 'Devolución' : 'Cambio'}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
        @keyframes scale-in {
            from { transform: scale(0.5); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in { animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>
    </div>
  );
};

export default ClaimModal;