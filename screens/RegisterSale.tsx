import React, { useState, useEffect } from 'react';
import { SaleDetail, PaymentCondition, VoucherType, Product, Client, Sale, PaymentRecord, SaleStatus, ProductStatus } from '../types';
import { clientsData, productCatalogData, dispatchTimeSlotMap } from '../constants';
import {SortIcon} from '../components/icons/iconsVentas';
import {BigAddIcon} from '../components/icons/iconsVentas';
import {ChevronDownIcon} from '../components/icons/iconsVentas';
import {TrashIcon} from '../components/icons/iconsVentas';
import {ChevronUpIcon} from '../components/icons/iconsVentas';
import {SmallChevronDownIcon} from '../components/icons/iconsVentas';
import {CheckIcon} from '../components/icons/iconsVentas';
import {CalendarIcon} from '../components/icons/iconsVentas';
import TransportAvailabilityModal from './TransportAvailabilityModal';
import {SupplyRequestIcon} from '../components/icons/iconsVentas';


interface RegisterSaleProps {
  sales: Sale[];
  onCancel: () => void;
  onRegister: (newSale: SaleDetail) => void;
}

type DispatchTimeSlot = 'Mañana' | 'Tarde' | 'Noche';

const parseCurrency = (value: string): number => {
    if (typeof value !== 'string' || value.trim() === '-' || value.trim() === '') {
        return 0;
    }
    const numberValue = parseFloat(value.replace(/S\/\s*/, ''));
    return isNaN(numberValue) ? 0 : numberValue;
};

const getNextSaleId = (sales: Sale[]) => {
  const lastSaleIdNumber = sales.reduce((maxId, sale) => {
    const currentIdNumber = parseInt(sale.id.replace('V-', ''), 10);
    return currentIdNumber > maxId ? currentIdNumber : maxId;
  }, 0);

  const nextIdNumber = lastSaleIdNumber + 1;
  return `V-${String(nextIdNumber).padStart(3, '0')}`;
};


const RegisterSale: React.FC<RegisterSaleProps> = ({ sales, onCancel, onRegister }) => {
  const [sale, setSale] = useState<Partial<SaleDetail>>({
    id: getNextSaleId(sales),
    client: clientsData[0].name,
    seller: 'Mónica Pereira',
    points: 0,
    total: 'S/0.00',
    products: [],
    payments: [],
  });
  const [paymentCondition, setPaymentCondition] = useState<PaymentCondition>('CONTADO');
  const [voucher, setVoucher] = useState<VoucherType>('BOLETA');
  const [currentDateTime, setCurrentDateTime] = useState({ date: '', time: '' });
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [numberOfInstallments, setNumberOfInstallments] = useState<string>('2');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [availabilityModal, setAvailabilityModal] = useState<{isOpen: boolean, productId: string | null}>({isOpen: false, productId: null});
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [selectedProductStock, setSelectedProductStock] = useState<number | null>(null);

  // New states for casual client
  const [selectedClientId, setSelectedClientId] = useState<string>(clientsData[0].id);
  const [casualClientName, setCasualClientName] = useState('');


  useEffect(() => {
    const now = new Date();
    const date = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const time = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    setCurrentDateTime({ date, time: `${time}h` });
    setSale(prev => ({...prev, dateTime: `${date} ${time}h`}));
  }, []);

  useEffect(() => {
    const totalAmount = (sale.products || []).reduce((acc, product) => {
        return acc + parseCurrency(product.amount);
    }, 0);

    setSale(prev => ({
        ...prev,
        total: `S/${totalAmount.toFixed(2)}`,
        points: Math.floor(totalAmount)
    }));
  }, [sale.products]);

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedClientId(value);
    
    if (value === 'OTROS') {
        setSale(prev => ({ ...prev, client: '' }));
    } else {
        const selectedClient = clientsData.find(c => c.id === value);
        if (selectedClient) {
            setSale(prev => ({ ...prev, client: selectedClient.name }));
            setCasualClientName(''); // Clear casual name when a registered client is selected
        }
    }
  };

  const handleAddProduct = () => {
    if(!selectedProductId) return;

    const productToAdd = productCatalogData.find(p => p.id === selectedProductId);
    if(!productToAdd) return;

    const existingProduct = (sale.products || []).find(p => p.id === productToAdd.id);

    if (existingProduct) {
        handleQuantityChange(existingProduct.id, existingProduct.quantity + 1);
    } else {
        const stock = productToAdd.stock;
        const minimumStock = productToAdd.minimumStock || 0;
        const isSupplyRequestMandatory = (stock - 1) < minimumStock;

        const newProduct: Product = {
            id: productToAdd.id,
            description: productToAdd.description,
            quantity: 1,
            unitPrice: `S/${productToAdd.unitPrice.toFixed(2)}`,
            discount: '-',
            points: Math.floor(productToAdd.unitPrice),
            amount: `S/${productToAdd.unitPrice.toFixed(2)}`,
            status: ProductStatus.Entregado,
            supplyRequested: isSupplyRequestMandatory,
        };
        setSale(prev => ({...prev, products: [...(prev.products || []), newProduct]}));
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setSale(prev => ({...prev, products: (prev.products || []).filter(p => p.id !== productId)}));
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleDeleteProduct(productId);
      return;
    }

    const catalogItem = productCatalogData.find(p => p.id === productId);
    if (!catalogItem) return;
    const stock = catalogItem.stock;
    const minimumStock = catalogItem.minimumStock || 0;


    setSale(prev => {
      const updatedProducts = (prev.products || []).map(p => {
        if (p.id === productId) {
          const unitPrice = parseCurrency(p.unitPrice);
          let discount = parseCurrency(p.discount);
          const newLineTotal = newQuantity * unitPrice;

          if (discount > newLineTotal) {
              discount = newLineTotal;
          }
          
          const finalAmount = newLineTotal - discount;
          const isSupplyRequestMandatory = (stock - newQuantity) < minimumStock;

          return {
            ...p,
            quantity: newQuantity,
            amount: `S/${finalAmount.toFixed(2)}`,
            discount: `S/${discount.toFixed(2)}`,
            points: Math.floor(finalAmount),
            supplyRequested: p.supplyRequested || isSupplyRequestMandatory,
          };
        }
        return p;
      });
      return { ...prev, products: updatedProducts };
    });
  };
  
  const handleProductDeliveryChange = (productId: string, field: keyof Product, value: string | undefined) => {
    setSale(prev => {
        const newProducts = (prev.products || []).map(p => {
            if (p.id === productId) {
                const updatedProduct = { ...p, [field]: value };

                if (field === 'dispatchDate' && !value) {
                    delete updatedProduct.dispatchDate;
                    delete updatedProduct.deliveryAddress;
                    delete updatedProduct.dispatchTimeSlot;
                }
                
                if (field === 'dispatchDate' && value && !p.dispatchTimeSlot && !p.supplyRequested) {
                    updatedProduct.dispatchTimeSlot = 'Mañana';
                }
                return updatedProduct;
            }
            return p;
        });
        return { ...prev, products: newProducts };
    });
  };

  const handleOpenAvailabilityModal = (productId: string) => {
    setAvailabilityModal({ isOpen: true, productId: productId });
  };

  const handleSelectDate = (date: string) => {
      if (availabilityModal.productId) {
          handleProductDeliveryChange(availabilityModal.productId, 'dispatchDate', date);
      }
      setAvailabilityModal({ isOpen: false, productId: null });
  };
  
  const handleSupplyRequestToggle = (productId: string, isChecked: boolean) => {
    setSale(prev => ({
        ...prev,
        products: (prev.products || []).map(p => {
            if (p.id === productId) {
                return { ...p, supplyRequested: isChecked };
            }
            return p;
        })
    }));
  };

  const handleDiscountChange = (productId: string, newDiscountValue: string) => {
    setSale(prev => {
        const updatedProducts = (prev.products || []).map(p => {
            if (p.id === productId) {
                const unitPrice = parseCurrency(p.unitPrice);
                const quantity = p.quantity;
                const lineTotal = unitPrice * quantity;
                let newDiscount = parseFloat(newDiscountValue);
                if (isNaN(newDiscount) || newDiscount < 0) newDiscount = 0;
                if (newDiscount > lineTotal) newDiscount = lineTotal;

                const newAmount = lineTotal - newDiscount;
                
                return {
                    ...p,
                    discount: `S/${newDiscount.toFixed(2)}`,
                    amount: `S/${newAmount.toFixed(2)}`,
                    points: Math.floor(newAmount),
                };
            }
            return p;
        });
        return { ...prev, products: updatedProducts };
    });
  };

  const handlePaymentConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCondition = e.target.value as PaymentCondition;
    setPaymentCondition(newCondition);
    if (newCondition === 'CONTADO') {
        setNumberOfInstallments('');
    } else {
        setNumberOfInstallments('2');
    }
  };

  const handleRegister = () => {
    if (selectedClientId === 'OTROS' && !casualClientName.trim()) {
        alert("Por favor, ingrese el nombre del cliente casual.");
        return;
    }
    if (!sale.products || sale.products.length === 0) {
        alert("Debe agregar al menos un producto a la venta.");
        return;
    }

    for (const product of (sale.products || [])) {
      if (product.supplyRequested && (!product.deliveryAddress?.trim() || !product.dispatchDate)) {
          alert(`Por favor, programe el despacho para "${product.description}" ya que se ha solicitado a abastecimiento.`);
          setExpandedProductId(product.id);
          return;
      }
      if (product.dispatchDate && !product.deliveryAddress?.trim()) {
          alert(`Por favor, ingrese la dirección de entrega para "${product.description}".`);
          setExpandedProductId(product.id);
          return;
      }
    }

    setShowConfirmation(true);

    let finalSale: SaleDetail = { ...sale } as SaleDetail;
    
    if (selectedClientId === 'OTROS') {
        finalSale.client = casualClientName.trim();
    }
    
    finalSale.paymentCondition = paymentCondition;
    finalSale.status = paymentCondition === 'CONTADO' ? SaleStatus.Paid : SaleStatus.Pending;
    finalSale.payments = [];
    
    finalSale.products = (sale.products || []).map(p => {
        const [year, month, day] = p.dispatchDate?.split('-') || [];
        const formattedDate = year ? `${day}/${month}/${year}` : undefined;
        return {
          ...p,
          dispatchDate: formattedDate,
          status: p.dispatchDate ? ProductStatus.PorEntregar : ProductStatus.Entregado,
        }
    });

    const totalAmount = parseCurrency(finalSale.total);

    if (paymentCondition === 'CRÉDITO') {
        const installments = parseInt(numberOfInstallments, 10);
        if (isNaN(installments) || installments < 2) {
            alert("Para ventas a crédito, el número de cuotas debe ser 2 o más.");
            setShowConfirmation(false);
            return;
        }
        finalSale.totalInstallments = installments;
        finalSale.paidInstallments = 1;

        const standardInstallment = parseFloat((totalAmount / installments).toFixed(2));
        const firstInstallmentAmount = totalAmount - (standardInstallment * (installments - 1));

        const firstPayment: PaymentRecord = {
          installmentNumber: 1,
          amount: `S/${firstInstallmentAmount.toFixed(2)}`,
          paymentDate: currentDateTime.date,
          paymentMethod: 'Efectivo', // Default for down payment
        };
        finalSale.payments.push(firstPayment);

    } else { // CONTADO
        finalSale.totalInstallments = 1;
        finalSale.paidInstallments = 1;
        const singlePayment: PaymentRecord = {
            installmentNumber: 1,
            amount: `S/${totalAmount.toFixed(2)}`,
            paymentDate: currentDateTime.date,
            paymentMethod: 'Efectivo', // Default for cash payment
        };
        finalSale.payments.push(singlePayment);
    }
    
    setTimeout(() => {
        onRegister(finalSale);
    }, 1500);

  };

  const productHeaders = ['Producto', 'Descripción', 'Stock', 'Cantidad', 'P. Unitario', 'Descuento', 'Puntos', 'Monto', 'Despacho', ''];
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg relative">
        {availabilityModal.isOpen && (
            <TransportAvailabilityModal
                isOpen={availabilityModal.isOpen}
                onClose={() => setAvailabilityModal({isOpen: false, productId: null})}
                onSelectDate={handleSelectDate}
            />
        )}
        {showConfirmation && (
            <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col justify-center items-center rounded-lg animate-fade-in z-10">
                <div className="animate-scale-in">
                    <CheckIcon />
                </div>
                <p className="text-2xl font-bold text-green-600 mt-4">Venta Registrada</p>
            </div>
        )}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
            <h2 className="text-2xl font-semibold text-gray-700">Nueva Venta:</h2>
            <span className="ml-3 bg-blue-500 text-white font-bold text-lg px-4 py-1 rounded-md">{sale.id}</span>
        </div>
        <div className="text-right">
            <p className="font-semibold text-gray-600">Fecha: <span className="font-normal text-gray-800">{currentDateTime.date}</span></p>
            <p className="font-semibold text-gray-600">Hora: <span className="font-normal text-gray-800">{currentDateTime.time}</span></p>
        </div>
      </div>

       <div className="border p-4 rounded-md mb-6 bg-gray-50">
        <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-3 text-sm items-center">
          <label className="font-semibold text-gray-600" htmlFor="seller">Vendedor(a):</label>
          <p id="seller" className="text-gray-800">{sale.seller}</p>
          
          <label className="font-semibold text-gray-600 self-start pt-3" htmlFor="client-select">Cliente:</label>
           <div className="grid gap-y-3">
            <div className="relative">
                <select 
                id="client-select" 
                className="w-full appearance-none bg-white p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-gray-900"
                onChange={handleClientChange}
                value={selectedClientId}
                >
                {clientsData.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                ))}
                <option value="OTROS">Otro (cliente casual)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                    <ChevronDownIcon />
                </div>
            </div>
            {selectedClientId === 'OTROS' && (
                <div className="animate-fade-in">
                    <input
                        type="text"
                        placeholder="Nombre del cliente casual"
                        value={casualClientName}
                        onChange={(e) => setCasualClientName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        aria-label="Nombre del cliente casual"
                    />
                </div>
            )}
           </div>
        </div>
      </div>

      <div className="overflow-x-auto mb-4">
        <table className="min-w-full text-sm text-left text-gray-500 border">
          <thead className="text-xs text-white uppercase bg-[#60a5fa]">
            <tr>
              {productHeaders.map((header) => (
                <th key={header} scope="col" className={`px-4 py-3 border-r border-blue-400 last:border-r-0 ${header === '' || header === 'Despacho' ? 'w-24' : ''}`}>
                  <div className="flex items-center justify-between">
                    {header}
                    {header && <SortIcon />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(!sale.products || sale.products.length === 0) ? (
                <tr>
                    <td colSpan={productHeaders.length} className="text-center py-8 text-gray-500">No hay productos agregados.</td>
                </tr>
            ) : (
                sale.products.map((product, index) => {
                  const catalogItem = productCatalogData.find(p => p.id === product.id);
                  const stock = catalogItem ? catalogItem.stock : 0;
                  const minimumStock = catalogItem ? (catalogItem.minimumStock || 0) : 0;
                  const requiresSupply = (stock - product.quantity) < minimumStock;
                  const isStockBelowMinimum = stock <= minimumStock;

                  return (
                    <React.Fragment key={product.id}>
                        <tr className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/50'}`}>
                            <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap border-r">{product.id}</td>
                            <td className="px-4 py-2 border-r text-gray-900">{product.description}</td>
                            <td className={`px-4 py-2 border-r text-center font-bold ${isStockBelowMinimum ? 'text-red-600' : 'text-gray-900'}`}>{stock}</td>
                            <td className="px-4 py-2 border-r text-center">
                            <div className="flex items-center justify-center space-x-2">
                                <span className={`font-semibold text-base w-8 text-center text-gray-900`}>{product.quantity}</span>
                                <div className="flex flex-col items-center justify-center">
                                    <button
                                        onClick={() => handleQuantityChange(product.id, product.quantity + 1)}
                                        className="text-gray-500 hover:text-gray-800"
                                        aria-label={`Aumentar cantidad de ${product.description}`}
                                    >
                                        <ChevronUpIcon />
                                    </button>
                                    <button
                                        onClick={() => handleQuantityChange(product.id, product.quantity - 1)}
                                        className="text-gray-500 hover:text-gray-800"
                                        aria-label={`Disminuir cantidad de ${product.description}`}
                                    >
                                        <SmallChevronDownIcon />
                                    </button>
                                </div>
                            </div>
                            </td>
                            <td className="px-4 py-2 border-r text-gray-900">{product.unitPrice}</td>
                            <td className="px-4 py-2 border-r">
                            <div className="flex items-center">
                                <span className="text-gray-500 mr-1">S/</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="w-24 bg-gray-50 focus:bg-white p-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right text-gray-900"
                                    value={parseCurrency(product.discount) === 0 ? '' : parseCurrency(product.discount).toFixed(2)}
                                    placeholder="0.00"
                                    onChange={(e) => handleDiscountChange(product.id, e.target.value)}
                                    onBlur={(e) => {
                                        if (e.target.value === '') {
                                            handleDiscountChange(product.id, '0');
                                        }
                                    }}
                                />
                            </div>
                            </td>
                            <td className="px-4 py-2 border-r text-center font-medium text-blue-600">{product.points}</td>
                            <td className="px-4 py-2 border-r text-gray-900">{product.amount}</td>
                            <td className="px-4 py-2 text-center border-r">
                                <button 
                                    onClick={() => setExpandedProductId(prev => prev === product.id ? null : product.id)}
                                    className={`flex items-center justify-center space-x-2 w-full text-xs font-semibold py-1 px-2 rounded ${product.dispatchDate || product.supplyRequested ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                >
                                    <CalendarIcon />
                                    <span>{expandedProductId === product.id ? 'Ocultar' : 'Gestionar'}</span>
                                </button>
                            </td>
                            <td className="px-4 py-2 text-center">
                                <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:text-red-700">
                                    <TrashIcon />
                                </button>
                            </td>
                        </tr>
                        {expandedProductId === product.id && (
                            <tr className="bg-blue-50/50 animate-fade-in">
                                <td colSpan={productHeaders.length} className="p-4 border-b">
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                      {/* Dispatch details on the left */}
                                      <div>
                                          <h4 className="font-bold text-sm text-blue-800 mb-2">Detalles del Despacho</h4>
                                           <div className="space-y-3">
                                              <div>
                                                  <label className="block text-xs font-semibold text-gray-600 mb-1">Dirección de entrega:</label>
                                                  <input
                                                      type="text"
                                                      value={product.deliveryAddress || ''}
                                                      onChange={(e) => handleProductDeliveryChange(product.id, 'deliveryAddress', e.target.value)}
                                                      placeholder="Ingrese la dirección"
                                                      className="w-full p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm"
                                                  />
                                              </div>
                                              <div className="flex items-end gap-2">
                                                  <div className="flex-grow">
                                                      <label className="block text-xs font-semibold text-gray-600 mb-1">Fecha de Entrega:</label>
                                                      <input
                                                          type="text"
                                                          readOnly
                                                          value={product.dispatchDate ? new Date(product.dispatchDate + 'T00:00:00').toLocaleDateString('es-ES') : 'No programada'}
                                                          className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-900 text-sm"
                                                      />
                                                  </div>
                                                  <button onClick={() => handleOpenAvailabilityModal(product.id)} className="bg-blue-500 text-white text-sm font-semibold p-2 rounded-lg hover:bg-blue-600">
                                                      {product.dispatchDate ? 'Cambiar' : 'Programar'}
                                                  </button>
                                                  {product.dispatchDate && <button onClick={() => handleProductDeliveryChange(product.id, 'dispatchDate', undefined)} className="text-xs text-red-600 hover:text-red-800 font-semibold">Quitar</button>}
                                              </div>
                                              {product.dispatchDate && (
                                                  <div>
                                                      <label className="block text-xs font-semibold text-gray-600 mb-1">Horario:</label>
                                                      <p className="text-gray-800 text-sm">{product.dispatchTimeSlot} ({dispatchTimeSlotMap[product.dispatchTimeSlot!]})</p>
                                                  </div>
                                              )}
                                          </div>
                                      </div>

                                      {/* Supply request on the right */}
                                      <div>
                                          <h4 className="font-bold text-sm text-yellow-800 mb-2">Solicitud a Abastecimiento</h4>
                                          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                              <div className="flex items-center">
                                                  <input
                                                      type="checkbox"
                                                      id={`supply-${product.id}`}
                                                      className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                                                      checked={product.supplyRequested}
                                                      disabled={requiresSupply}
                                                      onChange={(e) => handleSupplyRequestToggle(product.id, e.target.checked)}
                                                  />
                                                  <label htmlFor={`supply-${product.id}`} className="ml-3 font-semibold text-gray-700">
                                                      Solicitar a Abastecimiento
                                                  </label>
                                              </div>
                                              {requiresSupply && (
                                                  <p className="text-xs text-yellow-900 mt-2 ml-8">
                                                      Requerido porque el stock con esta venta queda por debajo del mínimo permitido.
                                                  </p>
                                              )}
                                          </div>
                                          {product.supplyRequested && (
                                              <div className="mt-3 bg-green-50 p-3 rounded-lg border border-green-200 text-sm text-green-800 font-semibold animate-fade-in">
                                                ✓ El despacho es obligatorio. Por favor, complete los detalles de entrega.
                                              </div>
                                          )}
                                      </div>
                                  </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                  )
                })
            )}
          </tbody>
          <tfoot>
            <tr className="font-semibold text-gray-900">
                <td colSpan={8} className="text-right px-6 py-3 text-lg">Total:</td>
                <td colSpan={2} className="bg-blue-200 px-6 py-3 text-lg">{sale.total}</td>
            </tr>
          </tfoot>
        </table>
      </div>

       <div className="bg-gray-50 p-4 rounded-lg mb-6 flex items-center space-x-4">
            <label htmlFor="product-catalog" className="font-semibold text-gray-700">Añadir Producto:</label>
            <div className="relative flex-grow">
              <select 
                  id="product-catalog"
                  value={selectedProductId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedProductId(id);
                    const product = productCatalogData.find(p => p.id === id);
                    setSelectedProductStock(product ? product.stock : null);
                  }}
                  className="w-full appearance-none bg-white p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-gray-900"
              >
                  <option value="">Seleccione un producto del catálogo...</option>
                  {productCatalogData.map(p => (
                      <option key={p.id} value={p.id}>{p.description} - S/{p.unitPrice.toFixed(2)}</option>
                  ))}
              </select>
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <ChevronDownIcon />
              </div>
            </div>
            {selectedProductStock !== null && (
                <span className="text-sm font-bold text-gray-600 bg-gray-200 px-3 py-1 rounded-full">Stock: {selectedProductStock}</span>
            )}
            <button onClick={handleAddProduct} className="bg-orange-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-orange-600 transition-colors">
                Añadir
            </button>
       </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block font-bold text-gray-600 mb-2" htmlFor="payment-condition">Condición de pago:</label>
          <div className="relative">
            <select
              id="payment-condition"
              value={paymentCondition}
              onChange={handlePaymentConditionChange}
              className="w-full appearance-none bg-white p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-gray-900"
            >
              <option value="CONTADO">Contado</option>
              <option value="CRÉDITO">Crédito</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
              <ChevronDownIcon />
            </div>
          </div>
           {paymentCondition === 'CRÉDITO' && (
            <div className="mt-4">
              <label className="block font-bold text-gray-600 mb-2" htmlFor="installments">Número de cuotas:</label>
              <input
                type="number"
                id="installments"
                value={numberOfInstallments}
                onChange={(e) => setNumberOfInstallments(e.target.value)}
                onBlur={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (!isNaN(value) && value < 2) {
                    setNumberOfInstallments('2');
                  }
                }}
                min="2"
                step="1"
                placeholder="Mínimo 2 cuotas"
                className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                aria-label="Número de cuotas"
              />
            </div>
          )}
        </div>
        <div>
           <label className="block font-bold text-gray-600 mb-2" htmlFor="voucher-type">Comprobante:</label>
           <div className="relative">
            <select
              id="voucher-type"
              value={voucher}
              onChange={(e) => setVoucher(e.target.value as VoucherType)}
              className="w-full appearance-none bg-white p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-gray-900"
            >
              <option value="BOLETA">Boleta</option>
              <option value="FACTURA">Factura</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
              <ChevronDownIcon />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-8">
        <div className="flex items-center space-x-4">
            <span className="font-bold text-gray-600">Puntos a Obtener:</span>
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md font-bold text-lg">{sale.points}</span>
        </div>
         <div className="flex space-x-4">
            <button 
                onClick={onCancel} 
                disabled={showConfirmation}
                className="bg-gray-500 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-gray-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
                CANCELAR
            </button>
            <button 
                onClick={handleRegister} 
                disabled={showConfirmation}
                className="bg-[#2b5977] text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-[#3b82f6] transition-colors flex items-center text-lg disabled:bg-gray-400 disabled:cursor-not-allowed">
                <span className="mr-2">Registrar</span>
                <BigAddIcon />
            </button>
        </div>
      </div>
       <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
         @keyframes scale-in {
            from { transform: scale(0.5); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in { animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>
    </div>
  );
};

export default RegisterSale;