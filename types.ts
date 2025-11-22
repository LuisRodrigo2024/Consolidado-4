import React from 'react';

// ============================================================================
// 1. NAVEGACIÓN GLOBAL (Consolidada)
// ============================================================================
export enum Screen {
  // --- Módulo Abastecimiento (Principal) ---
  MainMenu = 'MainMenu',
  ProvidersList = 'ProvidersList',
  ProviderFormStep1 = 'ProviderFormStep1',
  ProviderFormStep2 = 'ProviderForm-Step2',
  ProviderDetails = 'ProviderDetails',
  ProductsList = 'ProductsList',
  ProductForm = 'ProductForm',
  ProductDetails = 'ProductDetails',
  PedidosList = 'PedidosList',
  PedidoDetails = 'PedidoDetails',
  SolicitudesList = 'SolicitudesList',
  GroupItemsForQuotation = 'GroupItemsForQuotation',
  SolicitudDetails = 'SolicitudDetails',
  RegisterQuote = 'RegisterQuote',
  EvaluateQuotes = 'EvaluateQuotes',
  OrdersList = 'OrdersList',
  OrderDetailMonitoring = 'OrderDetailMonitoring',
  ScheduleReceptionsList = 'ScheduleReceptionsList',
  ScheduleReceptionForm = 'ScheduleReceptionForm',
  RemissionGuideList = 'RemissionGuideList',
  RemissionGuideValidation = 'RemissionGuideValidation',
  IncidentsList = 'IncidentsList',
  
  // --- Módulo Clientes (Actualizado y Completo) ---
  Clients = 'Clients',
  ClientDetail = 'ClientDetail',
  RegisterClient = 'RegisterClient',       // <-- Faltaba esto
  
  Maestros = 'Maestros',
  MaestroDetail = 'MaestroDetail',         // <-- Faltaba esto
  SelectClientForMaestro = 'SelectClientForMaestro', // <-- Faltaba esto
  RegisterMaestro = 'RegisterMaestro',     // <-- Faltaba esto
  
  Premios = 'Premios',
  
  Reports = 'Reports',
  ReportDetail = 'ReportDetail',           // <-- Faltaba esto
  
  RegistrationSuccess = 'RegistrationSuccess', // <-- Faltaba esto

  // --- AI Screens ---
  AIHub = 'AIHub',
  AIChat = 'AIChat',
  AIVision = 'AIVision',
  AIEmailGenerator = 'AIEmailGenerator',
  AIProductCataloger = 'AIProductCataloger',
  AIStrategy = 'AIStrategy',

  // --- Módulo Ventas ---
  // --- Módulo Ventas ---
  
  // 1. Dashboard y Principal
  MainContent = 'MainContent',           // MainContent.tsx (Vista Principal)
  
  // 2. Flujo de Venta
  RegisterSale = 'RegisterSale',               // RegisterSale.tsx
  SaleDetail = 'SaleDetail',                   // SaleDetail.tsx
  SalesTable = 'SalesTable',               // SalesTable.tsx (Listado de ventas)
  TransportAvailabilityModal = 'TransportAvailabilityModal', // TransportAvailabilityModal.tsx

  // 3. Gestión de Pagos y Caja
  PaymentsView = 'PaymentsView',    // PaymentsView.tsx (Vista principal de pagos)
  PaymentsTable = 'PaymentsTable',               // PaymentsTable.tsx (Listado simple)
  PaymentsSchedule = 'PaymentsSchedule',       // PaymentsSchedule.tsx (Cronograma)
  PendingPaymentsTable = ' PendingPaymentsTable',         // PendingPaymentsTable.tsx (Pendientes)
  CashRegisterModal = 'CashRegister',               // CashRegisterModal.tsx (Apertura/Cierre caja)
  RegisterPaymentModal = 'RegisterPayment',         // RegisterPaymentModal.tsx (Registrar cobro)

  // 4. Post-Venta: Anulaciones, Cambios y Devoluciones
  AnnulmentsTable = 'AnnulmentsTable',           // AnnulmentsTable.tsx
  AnnulmentModal = 'AnnulmentModal',         // AnnulmentModal.tsx (Modal de anulación)
  ReturnsTable = 'ReturnsTable',                 // ReturnsTable.tsx
  ExchangesTable = 'ExchangesTable',             // ExchangesTable.tsx

  // 5. Reclamos (Claims)
  ClaimsView = 'ClaimsView',                // ClaimsView.tsx
  ClaimModal = 'ClaimModal',             // ClaimModal.tsx
  ClaimsChart = 'ClaimsChart',         // ClaimsChart.tsx (Gráficos de reclamos)

  // 6. Reportes
  VentasReportsView = 'VentasReportsView',

    
  
  
}

// ============================================================================
// 2. TIPOS DE ABASTECIMIENTO & LOGÍSTICA
// ============================================================================

// Product-related types
export interface ProductDefinition {
  nombre: string;
  rubro: string;
  familia: string;
  clase: string;
  marca: string;
  unidad: string;
}

export type UnidadMedida = 'UNIDAD' | 'PAQUETE' | 'SACO' | 'CAJA' | 'ROLLO' | 'LATA' | 'BOTELLA' | 'm' | 'Kg' | 'L' | 'm²' | '';

export interface ProductoCatalogo {
  id_producto: string;
  nombre: string;
  rubro: string;
  familia: string;
  clase: string;
  marca?: string;
  unidad: UnidadMedida;
  precio_base: string;
}

export interface OfferedProduct {
  producto: string;
  rubro: string;
  familia: string;
  clase: string;
  marca: string;
  unidad: string;
  precioUnitario: string;
}

// Provider-related types
export interface Provider {
  id: string;
  nombre: string;
  ruc: string;
  contacto: string;
  razonSocial: string;
  direccion: string;
  correo: string;
  telefono: string;
  whatsapp: string;
  productos: OfferedProduct[];
}

// Pedido (Internal Request) types
export interface PedidoProducto {
  nombre_producto: string;
  cantidad_requerida: number;
  unidad_medida: string;
  fecha_requerida: string;
  tipo_destino: 'Interno' | 'Externo';
  direccion: string;
  estado_item?: 'En Cotización' | 'Adjudicado' | 'Pendiente';
}

export interface Pedido {
  id_pedido: string;
  fecha_pedido: string;
  hora_pedido: string;
  estado_pedido: 'Pendiente' | 'Revisado' | 'En Proceso' | 'Atendido' | 'Cancelado';
  empleadoGenerador: {
    nombre: string;
    area: string;
  };
  productos: PedidoProducto[];
}

// Solicitud de Cotización (Quotation Request) types
export interface ItemPendiente extends PedidoProducto {
  origen_pedido_id: string;
}

export interface CotizacionRecibidaItem {
  nombre_producto: string;
  cantidad_requerida: number;
  unidad_medida: string;
  monto_total_ofertado: number;
  modalidad_pago_ofrecida: 'Contado' | 'Crédito' | 'Ambos';
}

export interface CotizacionRecibida {
  id_proveedor: string;
  nombre_proveedor: string;
  fecha_emision_cotizacion: string;
  fecha_garantia: string;
  plazo_entrega: string;
  monto_total: number;
  items: CotizacionRecibidaItem[];
}

export interface SolicitudCotizacion {
  id_solicitud: string;
  fecha_emision_solicitud: string;
  estado: 'Generada' | 'Enviada' | 'Cotizada' | 'Adjudicada';
  items: ItemPendiente[];
  proveedores_enviados_ids?: string[];
  cotizaciones_recibidas?: CotizacionRecibida[];
}

// Orden de Compra (Purchase Order) types
export interface OrdenCompraItem {
  nombre_producto: string;
  cantidad_adjudicada: number;
  unidad_medida: string;
  monto_total: number;
}

export interface GuiaRemisionItem {
  nombre_producto: string;
  unidad_medida: string;
  cantidad_en_guia: number;
}

export interface GuiaRemision {
  serie_correlativo: string;
  fecha_emision_guia: string;
  fecha_traslado_guia: string;
  items?: GuiaRemisionItem[];
}

export interface DetalleRecepcionItem {
    nombre_producto: string;
    unidad_medida: string;
    cantidad_programada: number;
    cantidad_recibida?: number;
    estado_calidad?: 'Conforme' | 'No Conforme' | 'Pendiente';
    observacion?: string;
}

export interface Recepcion {
    id_recepcion: string;
    modalidad_logistica: 'Entrega en Almacén' | 'Recojo por Transporte Propio';
    fecha_recepcion_programada: string;
    hora_recepcion_programada: string;
    recurso_asignado?: string;
    estado_recepcion: 'Pendiente' | 'En Curso' | 'Recibida Parcial' | 'Conforme' | 'No Conforme' | 'Pendiente de Calidad';
    items: DetalleRecepcionItem[];
    guias_remision?: GuiaRemision[];
    hora_inicio_recepcion?: string;
    hora_fin_recepcion?: string;
}

export interface OrdenCompra {
  id_orden: string;
  id_solicitud_origen: string;
  id_proveedor: string;
  nombre_proveedor: string;
  fecha_emision: string;
  modalidad_pago: 'Contado' | 'Crédito';
  monto_total_orden: number;
  items: OrdenCompraItem[];
  estado: 'Emitida' | 'En Proceso' | 'Programada' | 'Cerrada';
  monitoreo?: {
    estado_monitoreo: 'Pendiente' | 'En Progreso' | 'Completado';
    fecha_entrega_estimada: string;
    total_recepciones_programadas: number;
    recepciones_completadas: number;
  };
  recepciones?: Recepcion[];
}

// Incidents and Claims types
export interface Incidencia {
  id_incidencia: string;
  id_orden: string;
  nombre_proveedor: string;
  id_recepcion: string;
  tipo_incidencia: 'CALIDAD' | 'CANTIDAD_GUIA' | 'CANTIDAD_FALTANTE';
  estado_incidencia: 'Pendiente' | 'En Reclamo' | 'Resuelta';
  // Details for modal
  producto_nombre: string;
  producto_marca: string;
  descripcion: string;
  cantidad_afectada: number;
  // Evidence for modal
  cantidad_programada: number;
  cantidad_en_guia: number;
  cantidad_recibida: number;
}

export interface Reclamo {
    id_reclamo: string;
    fecha_reclamo: string;
    incidencias_ids: string[];
    observacion_reclamo?: string;
    accion_correctiva: 'Nota de Crédito' | 'Reemplazo de Producto' | 'Otro';
    estado_reclamo: 'Enviado' | 'En Revision' | 'Resuelto';
}


// Adjudication type
export interface AdjudicatedItem {
    providerId: string;
    providerName: string;
    finalPaymentMethod: 'Contado' | 'Crédito';
    itemDetails: CotizacionRecibidaItem;
    plazo_entrega: string;
}

// Transport types
export interface PedidoTransporte {
    id_pedido_transporte: string;
    id_recepcion_origen: string;
    id_orden_compra: string;
    proveedor: string;
    fecha_recojo: string;
    hora_recojo: string;
    estado: 'Pendiente' | 'En Curso' | 'Completado';
}

// Scheduler types
export interface HorarioOcupado {
    fecha: string;
    hora: string;
    tipo: 'Almacén' | 'Transporte';
    recurso_id?: string;
}

// Modal types
export interface ConfirmationModalData {
    isOpen: boolean;
    title: string;
    message: React.ReactNode;
    onClose?: (...args: any[]) => void;
}

export interface PostQuoteModalData {
    isOpen: boolean;
    title: string;
    message: React.ReactNode;
    onAddAnother: () => void;
    onFinish: () => void;
}

// ============================================================================
// 3. TIPOS DEL MÓDULO DE CLIENTES (CRM)
// ============================================================================

export interface Client {
  id: number;
  nombre: string;
  apellidos: string;
  ruc: string;
  distrito: string;
  telefono: string;
  correo: string;
  fechaRegistro: string;
  direccion: string;
}

export interface Maestro {
  id: number;
  nombre: string;
  apellidos: string;
  ruc: string;
  distrito: string;
  telefono: string;
  correo: string;
  especialidad: string;
  fechaRegistro: string;
  direccion: string;
}

export interface SaleClientes {
  fecha: string;
  monto: string;
  tipoPago: string;
  nroComprobante: string;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface Canje {
    fecha: string;
    idPremio: string;
    cantidad: number;
    puntos: number;
    estado: string;
}

export interface Contact {
  id: number;
  tipo: string;
  valor: string;
}

export interface Address {
  id: number;
  ciudad: string;
  distrito: string;
  via: string;
  numero: string;
}

export interface Premio {
  id: string;
  nombre: string;
  descripcion: string;
  costo: number;
  categoria: string;
}

export interface Report {
  id: string;
  fechaGeneracion: string;
  periodoAnalisis: string;
  idUsuarioGenerador: string;
}

export enum ProductStatus {
  Entregado = 'Entregado',
  PorEntregar = 'Por entregar',
  Devuelto = 'Devuelto',
  Cambiado = 'Cambiado',
}

export interface SaleVentas {
  id: string;
  seller: string;
  date: string;
  time: string;
  amount: string;
  status: SaleStatus;
}

export interface User {
  name: string;
  role: string;
}

export interface ProductVentas {
  id: string;
  description: string;
  quantity: number;
  unitPrice: string;
  discount: string;
  points?: number;
  amount: string;
  status: ProductStatus;
  deliveryAddress?: string;
  dispatchDate?: string;
  dispatchTimeSlot?: 'Mañana' | 'Tarde' | 'Noche';
  supplyRequested?: boolean;
}

export interface PaymentRecord {
  installmentNumber: number;
  amount: string;
  paymentDate: string;
  paymentMethod: string;
  payerName?: string;
}

export interface SaleDetail {
  id: string;
  status: SaleStatus;
  client: string;
  dateTime: string;
  seller: string;
  paymentCondition?: PaymentCondition;
  totalInstallments?: number;
  paidInstallments?: number;
  points: number;
  total: string;
  products: ProductVentas[];
  payments?: PaymentRecord[];
}

export interface Installment {
  dueDate: string;
  amount: string;
  paymentMethod: string;
  isPaid: boolean;
  paymentDate?: string;
  installmentNumber: number;
  totalInstallments: number;
  saleId: string;
  payerName?: string;
}

export interface Payment {
  id: string; // e.g., PG-001
  saleId: string;
  installment: Installment;
}

export interface PendingPayment {
  saleId: string;
  clientName: string;
  installment: Installment;
}

export interface Return {
  id: string; // D-001
  saleId: string;
  date: string;
  client: string;
  returnedProducts: {
    productId: string;
    description: string;
    quantity: number;
    amount: string;
  }[];
  totalReturnedAmount: string;
  reason: string;
}

export interface Exchange {
  id: string; // E-001
  saleId: string;
  date: string;
  client: string;
  returnedProduct: {
    productId: string;
    description: string;
    quantity: number;
    amount:string;
  };
  newProduct: {
    productId: string;
    description: string;
    quantity: number;
    amount: string;
  };
  priceDifference: string;
  reason: string;
}

export interface Annulment {
  id: string; // A-001
  saleId: string;
  date: string;
  client: string;
  seller: string;
  amount: string;
  reason: string;
}

export interface DayAvailability {
  morning: { total: number; available: number };
  afternoon: { total: number; available: number };
  evening: { total: number; available: number };
}

export enum SaleStatus {
  Paid = 'Pagado',
  Pending = 'Por pagar',
  Annulled = 'Anulada',
}

export interface Sale {
  id: string;
  seller: string;
  date: string;
  time: string;
  amount: string;
  status: SaleStatus;
}

export interface User {
  name: string;
  role: string;
}

export interface Product {
  id: string;
  description: string;
  quantity: number;
  unitPrice: string;
  discount: string;
  points?: number;
  amount: string;
  status: ProductStatus;
  deliveryAddress?: string;
  dispatchDate?: string;
  dispatchTimeSlot?: 'Mañana' | 'Tarde' | 'Noche';
  supplyRequested?: boolean;
}

export interface PaymentRecord {
  installmentNumber: number;
  amount: string;
  paymentDate: string;
  paymentMethod: string;
  payerName?: string;
}

export interface SaleDetail {
  id: string;
  status: SaleStatus;
  client: string;
  dateTime: string;
  seller: string;
  paymentCondition?: PaymentCondition;
  totalInstallments?: number;
  paidInstallments?: number;
  points: number;
  total: string;
  products: Product[];
  payments?: PaymentRecord[];
}

export type ModalType = 'open' | 'close' | null;

// FIX: Corrected typo in PaymentCondition from 'CRÉdito' to 'CRÉDITO' for consistency.
export type PaymentCondition = 'CONTADO' | 'CRÉDITO';

export type VoucherType = 'BOLETA' | 'FACTURA';

export interface ClientVentas {
  id: string;
  name: string;
}

export interface ProductCatalogItem {
  id: string;
  description: string;
  unitPrice: number;
  stock: number;
  minimumStock?: number;
}

export interface Installment {
  dueDate: string;
  amount: string;
  paymentMethod: string;
  isPaid: boolean;
  paymentDate?: string;
  installmentNumber: number;
  totalInstallments: number;
  saleId: string;
  payerName?: string;
}

export interface Payment {
  id: string; // e.g., PG-001
  saleId: string;
  installment: Installment;
}

export interface PendingPayment {
  saleId: string;
  clientName: string;
  installment: Installment;
}

export interface Return {
  id: string; // D-001
  saleId: string;
  date: string;
  client: string;
  returnedProducts: {
    productId: string;
    description: string;
    quantity: number;
    amount: string;
  }[];
  totalReturnedAmount: string;
  reason: string;
}

export interface Exchange {
  id: string; // E-001
  saleId: string;
  date: string;
  client: string;
  returnedProduct: {
    productId: string;
    description: string;
    quantity: number;
    amount:string;
  };
  newProduct: {
    productId: string;
    description: string;
    quantity: number;
    amount: string;
  };
  priceDifference: string;
  reason: string;
}

export interface Annulment {
  id: string; // A-001
  saleId: string;
  date: string;
  client: string;
  seller: string;
  amount: string;
  reason: string;
}

export interface DayAvailability {
  morning: { total: number; available: number };
  afternoon: { total: number; available: number };
  evening: { total: number; available: number };
}

export type Turno = 'Mañana' | 'Tarde' | 'Noche';

export interface ProductTransporte {
    id: number;
    quantity: number;
    name: string;
    unit: string;
    origin: string;
    destination: string;
    deliveryDate: string;
    deliveryTime?: string;
    turno: Turno;
}

export interface ProductWithClient extends ProductTransporte {
    clientName: string;
}

export interface ProductDetail extends ProductTransporte {
    clientName: string;
    orderCode: string;
    originalIndex: number;
}

export interface Order {
    code: string;
    name: string;
    phone: string;
    products: ProductTransporte[];
}

export interface DeletedOrder extends Order {
  reason: string;
  isPartial?: boolean;
}

export interface Stop {
    id: string;
    origin: string;
    destination: string;
    status: 'Pendiente' | 'Picking' | 'En Ruta' | 'En Camino' | 'Entregado';
    sequence: number;
    products: ProductTransporte[];
    clientName: string; // Assuming one client per stop for simplicity
    arrivalTime?: string;
}

export interface Dispatch {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    status: 'Programado' | 'Picking' | 'En Ruta' | 'Completado';
    stops: Stop[];
    operator?: string;
    vehicle?: string;
    actualStartTime?: string;
    actualEndTime?: string;
    assistants?: string[];
}

export type VehicleStatus = 'Operativo' | 'En Mantenimiento';

export interface Vehicle {
    id: string;
    placa: string;
    tipo: string;
    marca: string;
    capacidadCarga: number;
    volumenCarga: number;
    licenciaRequerida: string;
    estado: VehicleStatus;
}

export type EmployeeStatus = 'Activo' | 'Inactivo' | 'Con Licencia' | 'De Vacaciones';

export interface Employee {
    id: string;
    codigo: string;
    nombre: string;
    telefono: string;
    brevete: string;
    fechaVencimiento: string; // YYYY-MM-DD
    estado: EmployeeStatus;
}

export type PermissionStatus = 'Habilitado' | 'No Habilitado' | 'Suspendido';

export interface Permission {
  id: string; // e.g., 'E001-V001'
  employeeId: string;
  vehicleId: string;
  status: PermissionStatus;
  lastChangeDate: string | null;
  changeReason: string | null;
}

export type StopType = 'Ferreteria' | 'Proveedor' | 'Cliente';

export interface Location {
    name: string;
    stopType: StopType;
}


export type View = 
  | 'dashboard' 
  | 'transportOrders' 
  | 'transportOrderDetail' 
  | 'dispatchScheduling'
  | 'dispatchOrderSelection'
  | 'dispatchTrackingList'
  | 'dispatchStopDetail'
  | 'stopProductDetail'
  | 'vehicles'
  | 'employees'
  | 'permissions'
  | 'clientes'
  | 'inventario'
  | 'abastecimiento'
  | 'ventas'
  | 'monthlyReport'
  | 'currentState';