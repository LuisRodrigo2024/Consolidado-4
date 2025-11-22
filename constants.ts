// Importamos todos los tipos unificados desde types.ts
import { 
  // Tipos de Abastecimiento
  Provider, ProductoCatalogo, Pedido, ProductDefinition, SolicitudCotizacion, OrdenCompra, HorarioOcupado, Incidencia,
  // Tipos de Clientes
  Client, Maestro, SaleClientes, SaleVentas, ChartData, Canje, Contact, Address, Premio, Report,
  // Tipos de Clientes
  SaleDetail, SaleStatus, ProductVentas, ClientVentas, ProductCatalogItem, Return, Exchange, Annulment, ProductStatus, DayAvailability,
  //Transporte
  Order, Dispatch, Vehicle, Employee, Location
} from './types';

// ============================================================================
// 1. DATOS DE ABASTECIMIENTO & LOGÍSTICA
// ============================================================================

export const PRODUCT_TYPES: string[] = [
    'Herramientas Manuales',
    'Herramientas Eléctricas',
    'Pinturas y Acabados',
    'Tornillería y Fijaciones',
    'Materiales de Construcción',
    'Electricidad',
    'Gasfitería',
];

export const UNIDADES_DE_MEDIDA: string[] = [
    'UNIDAD', 'PAQUETE', 'SACO', 'CAJA', 'ROLLO', 'LATA', 'BOTELLA', 'm', 'Kg', 'L', 'm²',
];

export const PRODUCTS: ProductDefinition[] = [
    { nombre: 'Fierro Corrugado 1/4" x 9m', rubro: 'Materiales de Construcción', familia: 'Aceros de Construcción', clase: 'Varillas Corrugadas', marca: 'Aceros Arequipa', unidad: 'Unidad' },
    { nombre: 'Fierro Corrugado 3/8" x 9m', rubro: 'Materiales de Construcción', familia: 'Aceros de Construcción', clase: 'Varillas Corrugadas', marca: 'Aceros Arequipa', unidad: 'Unidad' },
    { nombre: 'Fierro Corrugado 1/2" x 9m', rubro: 'Materiales de Construcción', familia: 'Aceros de Construcción', clase: 'Varillas Corrugadas', marca: 'Aceros Arequipa', unidad: 'Unidad' },
    { nombre: 'Alambre Negro Recocido N°16', rubro: 'Materiales de Construcción', familia: 'Aceros de Construcción', clase: 'Alambres', marca: 'Genérico', unidad: 'Rollo 1kg' },
    { nombre: 'Taladro Percutor 500W 220V', rubro: 'Herramientas', familia: 'Herramientas Eléctricas', clase: 'Taladros', marca: 'Bosch', unidad: 'Unidad' },
    { nombre: 'Taladro Inalámbrico 18V', rubro: 'Herramientas', familia: 'Herramientas Eléctricas', clase: 'Taladros', marca: 'Makita', unidad: 'Unidad' },
    { nombre: 'Martillo de Carpintero', rubro: 'Herramientas', familia: 'Herramientas Manuales', clase: 'Martillos', marca: 'Stanley', unidad: 'Unidad' },
    { nombre: 'Grifo Monocomando Cromado Pico Alto', rubro: 'Plomería', familia: 'Grifería', clase: 'Grifos de Cocina', marca: 'Vainsa', unidad: 'Unidad' },
    { nombre: 'Pintura Látex Blanco', rubro: 'Pinturas y Acabados', familia: 'Pinturas', clase: 'Látex', marca: 'CPP', unidad: 'Galón' },
    { nombre: 'Tornillos para Madera 1"', rubro: 'Fijaciones', familia: 'Tornillería', clase: 'Tornillos para Madera', marca: 'Genérico', unidad: 'Caja x 100' },
    { nombre: 'Bolsa de Cemento Sol', rubro: 'Materiales de Construcción', familia: 'Cementos y Morteros', clase: 'Cemento Portland', marca: 'Sol', unidad: 'Bolsa 42.5kg' },
    { nombre: 'Cable Eléctrico Indeco #14', rubro: 'Electricidad', familia: 'Cables Eléctricos', clase: 'Cable THW', marca: 'Indeco', unidad: 'Rollo 100m' },
    { nombre: 'Tubo PVC 1/2 pulg.', rubro: 'Plomería', familia: 'Tuberías y Conexiones', clase: 'Tuberías PVC', marca: 'Matusita', unidad: 'Tira 3m' },
];

export const PRODUCTS_DATA: ProductoCatalogo[] = [
  {
    id_producto: 'PROD-01',
    nombre: 'Martillo de Carpintero',
    rubro: 'Herramientas',
    familia: 'Herramientas Manuales',
    clase: 'Martillos',
    marca: 'Stanley',
    unidad: 'UNIDAD',
    precio_base: '25.00',
  },
  {
    id_producto: 'PROD-02',
    nombre: 'Taladro Percutor 1/2"',
    rubro: 'Herramientas',
    familia: 'Herramientas Eléctricas',
    clase: 'Taladros',
    marca: 'Bosch',
    unidad: 'UNIDAD',
    precio_base: '250.00',
  },
  {
    id_producto: 'PROD-03',
    nombre: 'Pintura Látex Blanco',
    rubro: 'Pinturas y Acabados',
    familia: 'Pinturas',
    clase: 'Látex',
    marca: 'CPP',
    unidad: 'LATA',
    precio_base: '45.00',
  },
  {
    id_producto: 'PROD-04',
    nombre: 'Tornillos para Madera 1"',
    rubro: 'Fijaciones',
    familia: 'Tornillería',
    clase: 'Tornillos para Madera',
    marca: '',
    unidad: 'CAJA',
    precio_base: '8.50',
  },
  {
    id_producto: 'PROD-05',
    nombre: 'Bolsa de Cemento Sol',
    rubro: 'Materiales de Construcción',
    familia: 'Cementos',
    clase: 'Portland',
    marca: 'Sol',
    unidad: 'SACO',
    precio_base: '28.00',
  },
];

export const PROVIDERS_DATA: Provider[] = [
  {
    id: 'PROV-01',
    nombre: 'Aceros Arequipa',
    ruc: '20100035310',
    contacto: '998877665',
    razonSocial: 'Corporación Aceros Arequipa S.A.',
    direccion: 'Av. Enrique Meiggs 297, P.I. de Pisco',
    correo: 'ventas@aasa.com.pe',
    telefono: '998877665',
    whatsapp: '998877665',
    productos: [
      { producto: 'Fierro Corrugado 1/4" x 9m', rubro: 'Materiales de Construcción', familia: 'Aceros de Construcción', clase: 'Varillas Corrugadas', marca: 'Aceros Arequipa', unidad: 'Unidad', precioUnitario: '15.50' },
      { producto: 'Fierro Corrugado 3/8" x 9m', rubro: 'Materiales de Construcción', familia: 'Aceros de Construcción', clase: 'Varillas Corrugadas', marca: 'Aceros Arequipa', unidad: 'Unidad', precioUnitario: '34.80' },
    ],
  },
  {
    id: 'PROV-02',
    nombre: 'Stanley Tools Perú',
    ruc: '20552736125',
    contacto: '911223344',
    razonSocial: 'Black & Decker del Perú S.A.',
    direccion: 'Av. El Derby 254, Santiago de Surco',
    correo: 'contacto@stanleytools.pe',
    telefono: '911223344',
    whatsapp: '911223344',
    productos: [
      { producto: 'Martillo de Carpintero', rubro: 'Herramientas', familia: 'Herramientas Manuales', clase: 'Martillos', marca: 'Stanley', unidad: 'Unidad', precioUnitario: '22.00' },
      { producto: 'Taladro Percutor 500W 220V', rubro: 'Herramientas', familia: 'Herramientas Eléctricas', clase: 'Taladros', marca: 'Stanley', unidad: 'Unidad', precioUnitario: '235.00' },
      { producto: 'Tornillos para Madera 1"', rubro: 'Fijaciones', familia: 'Tornillería', clase: 'Tornillos para Madera', marca: 'Stanley', unidad: 'Caja x 100', precioUnitario: '8.00' },
    ],
  },
  {
    id: 'PROV-03',
    nombre: 'ACEROS DEL NORTE',
    ruc: '20456789123',
    contacto: '987654321',
    razonSocial: 'Aceros del Norte S.A.C.',
    direccion: 'Av. Industrial 123, Trujillo',
    correo: 'contacto@acerosdelnorte.com',
    telefono: '987654321',
    whatsapp: '987654321',
    productos: [
      { producto: 'Cable Eléctrico Indeco #14', rubro: 'Electricidad', familia: 'Cables Eléctricos', clase: 'Cable THW', marca: 'Indeco', unidad: 'Rollo 100m', precioUnitario: '180.00' },
      { producto: 'Tubo PVC 1/2 pulg.', rubro: 'Plomería', familia: 'Tuberías y Conexiones', clase: 'Tuberías PVC', marca: 'Matusita', unidad: 'Tira 3m', precioUnitario: '9.50' },
      { producto: 'Alambre Negro Recocido N°16', rubro: 'Materiales de Construcción', familia: 'Aceros de Construcción', clase: 'Alambres', marca: 'Genérico', unidad: 'Rollo 1kg', precioUnitario: '6.50' },
    ],
  },
   {
    id: 'PROV-04',
    nombre: 'Aceros del Sur',
    ruc: '20123456789',
    contacto: '912345678',
    razonSocial: 'Aceros del Sur S.A.',
    direccion: 'Av. El Sol 456, Arequipa',
    correo: 'ventas@acerosdelsur.com',
    telefono: '912345678',
    whatsapp: '912345678',
    productos: [],
  },
];

export const PEDIDOS_DATA: Pedido[] = [
    {
        id_pedido: 'PA-01',
        fecha_pedido: '28-07-2024',
        hora_pedido: '09:30',
        estado_pedido: 'Atendido',
        empleadoGenerador: {
            nombre: 'Carlos Santana',
            area: 'Almacén',
        },
        productos: [
            {
                nombre_producto: 'Bolsa de Cemento Sol',
                cantidad_requerida: 200,
                fecha_requerida: '01-08-2024',
                unidad_medida: 'Bolsa 42.5kg',
                tipo_destino: 'Interno',
                direccion: '',
            },
            {
                nombre_producto: 'Tubo PVC 1/2 pulg.',
                cantidad_requerida: 50,
                fecha_requerida: '02-08-2024',
                unidad_medida: 'Tira 3m',
                tipo_destino: 'Interno',
                direccion: '',
            },
        ],
    },
    {
        id_pedido: 'PA-02',
        fecha_pedido: '29-07-2024',
        hora_pedido: '11:00',
        estado_pedido: 'En Proceso',
        empleadoGenerador: {
            nombre: 'Ana Jimenez',
            area: 'Ventas',
        },
        productos: [
            {
                nombre_producto: 'Pintura Látex Blanco',
                cantidad_requerida: 25,
                fecha_requerida: '02-08-2024',
                unidad_medida: 'Galón',
                tipo_destino: 'Externo',
                direccion: 'Av. La Marina 2045, San Miguel',
            },
            {
                nombre_producto: 'Martillo de Carpintero',
                cantidad_requerida: 5,
                fecha_requerida: '02-08-2024',
                unidad_medida: 'Unidad',
                tipo_destino: 'Interno',
                direccion: '',
            },
        ],
    },
    {
        id_pedido: 'PA-03',
        fecha_pedido: '29-07-2024',
        hora_pedido: '14:15',
        estado_pedido: 'Pendiente',
        empleadoGenerador: {
            nombre: 'Luis Gonzales',
            area: 'Ventas',
        },
        productos: [
            {
                nombre_producto: 'Taladro Percutor 1/2"',
                cantidad_requerida: 5,
                fecha_requerida: '05-08-2024',
                unidad_medida: 'Unidad',
                tipo_destino: 'Externo',
                direccion: 'Av. El Sol 123, Cusco',
            },
            {
                nombre_producto: 'Tornillos para Madera 1"',
                cantidad_requerida: 10,
                fecha_requerida: '05-08-2024',
                unidad_medida: 'Caja x 100',
                tipo_destino: 'Externo',
                direccion: 'Av. El Sol 123, Cusco',
            },
            {
                nombre_producto: 'Martillo de Carpintero',
                cantidad_requerida: 2,
                fecha_requerida: '06-08-2024',
                unidad_medida: 'Unidad',
                tipo_destino: 'Interno',
                direccion: '',
            },
        ],
    },
    {
        id_pedido: 'PA-04',
        fecha_pedido: '30-07-2024',
        hora_pedido: '10:00',
        estado_pedido: 'Revisado',
        empleadoGenerador: {
            nombre: 'Carlos Santana',
            area: 'Almacén',
        },
        productos: [
            {
                nombre_producto: 'Martillo de Carpintero',
                cantidad_requerida: 15,
                fecha_requerida: '04-08-2024',
                unidad_medida: 'Unidad',
                tipo_destino: 'Interno',
                direccion: '',
                estado_item: 'En Cotización',
            },
            {
                nombre_producto: 'Taladro Percutor 1/2"',
                cantidad_requerida: 3,
                fecha_requerida: '03-08-2024',
                unidad_medida: 'Unidad',
                tipo_destino: 'Interno',
                direccion: '',
                estado_item: 'En Cotización',
            },
        ],
    },
    {
        id_pedido: 'PA-05',
        fecha_pedido: '31-07-2024',
        hora_pedido: '08:45',
        estado_pedido: 'Cancelado',
        empleadoGenerador: {
            nombre: 'Carlos Santana',
            area: 'Almacén',
        },
        productos: [
            {
                nombre_producto: 'Tornillos para Madera 1"',
                cantidad_requerida: 50,
                fecha_requerida: '10-08-2024',
                unidad_medida: 'Caja x 100',
                tipo_destino: 'Interno',
                direccion: '',
            },
            {
                nombre_producto: 'Martillo de Carpintero',
                cantidad_requerida: 10,
                fecha_requerida: '10-08-2024',
                unidad_medida: 'Unidad',
                tipo_destino: 'Interno',
                direccion: '',
            }
        ],
    },
    {
        id_pedido: 'PA-06',
        fecha_pedido: '31-07-2024',
        hora_pedido: '15:20',
        estado_pedido: 'Atendido',
        empleadoGenerador: {
            nombre: 'Ana Jimenez',
            area: 'Ventas',
        },
        productos: [
            {
                nombre_producto: 'Bolsa de Cemento Sol',
                cantidad_requerida: 300,
                fecha_requerida: '08-08-2024',
                unidad_medida: 'Bolsa 42.5kg',
                tipo_destino: 'Externo',
                direccion: 'Av. Arequipa 5040, Miraflores',
            },
            {
                nombre_producto: 'Martillo de Carpintero',
                cantidad_requerida: 10,
                fecha_requerida: '08-08-2024',
                unidad_medida: 'Unidad',
                tipo_destino: 'Externo',
                direccion: 'Av. Arequipa 5040, Miraflores',
            },
        ],
    },
    {
        id_pedido: 'PA-07',
        fecha_pedido: '01-08-2024',
        hora_pedido: '10:00',
        estado_pedido: 'Pendiente',
        empleadoGenerador: {
            nombre: 'Maria Lopez',
            area: 'Proyectos',
        },
        productos: [
            {
                nombre_producto: 'Taladro Inalámbrico 18V',
                cantidad_requerida: 2,
                fecha_requerida: '11-08-2024',
                unidad_medida: 'Unidad',
                tipo_destino: 'Interno',
                direccion: '',
            },
            {
                nombre_producto: 'Martillo de Carpintero',
                cantidad_requerida: 5,
                fecha_requerida: '11-08-2024',
                unidad_medida: 'Unidad',
                tipo_destino: 'Interno',
                direccion: '',
            },
        ],
    },
    {
        id_pedido: 'PA-08',
        fecha_pedido: '02-08-2024',
        hora_pedido: '09:00',
        estado_pedido: 'Revisado',
        empleadoGenerador: {
            nombre: 'Ana Jimenez',
            area: 'Ventas',
        },
        productos: [
            {
                nombre_producto: 'Fierro Corrugado 1/4" x 9m',
                cantidad_requerida: 100,
                fecha_requerida: '10-08-2024',
                unidad_medida: 'Unidad',
                tipo_destino: 'Interno',
                direccion: 'Almacén Central',
            },
            {
                nombre_producto: 'Alambre Negro Recocido N°16',
                cantidad_requerida: 20,
                fecha_requerida: '10-08-2024',
                unidad_medida: 'Rollo 1kg',
                tipo_destino: 'Interno',
                direccion: 'Almacén Central',
            },
        ],
    },
    {
        id_pedido: 'PA-09',
        fecha_pedido: '02-08-2024',
        hora_pedido: '11:30',
        estado_pedido: 'Revisado',
        empleadoGenerador: {
            nombre: 'Carlos Santana',
            area: 'Almacén',
        },
        productos: [
            {
                nombre_producto: 'Grifo Monocomando Cromado Pico Alto',
                cantidad_requerida: 10,
                fecha_requerida: '12-08-2024',
                unidad_medida: 'Unidad',
                tipo_destino: 'Externo',
                direccion: 'Obra Miraflores',
            },
            {
                nombre_producto: 'Taladro Inalámbrico 18V',
                cantidad_requerida: 2,
                fecha_requerida: '11-08-2024',
                unidad_medida: 'Unidad',
                tipo_destino: 'Interno',
                direccion: 'Taller de Mantenimiento',
            },
        ],
    },
];

export const DEFAULT_PROVIDER_FOR_REGISTRATION: Partial<Provider> = {
    nombre: 'Ferretería El Tornillo Feliz',
    razonSocial: 'El Tornillo Feliz S.A.C.',
    ruc: '20504030201',
    direccion: 'Av. La Molina 123, Lima',
    correo: 'ventas@tornillofeliz.com',
    telefono: '987654321',
};

export const SOLICITUDES_COTIZACION_DATA: SolicitudCotizacion[] = [
    {
        id_solicitud: 'SC-001',
        fecha_emision_solicitud: '30-07-2024',
        estado: 'Generada',
        items: [
            {
                origen_pedido_id: 'PA-02',
                nombre_producto: 'Pintura Látex Blanco',
                cantidad_requerida: 10,
                fecha_requerida: '02-08-2024',
                unidad_medida: 'Galón',
                tipo_destino: 'Externo',
                direccion: 'Av. La Marina 2045, San Miguel',
                estado_item: 'En Cotización',
            }
        ]
    },
    {
        id_solicitud: 'SC-002',
        fecha_emision_solicitud: '31-07-2024',
        estado: 'Enviada',
        items: [
            {
                origen_pedido_id: 'PA-04',
                nombre_producto: 'Martillo de Carpintero',
                cantidad_requerida: 15,
                fecha_requerida: '04-08-2024',
                unidad_medida: 'Unidad',
                tipo_destino: 'Interno',
                direccion: 'Almacen Principal',
                estado_item: 'En Cotización',
            },
            {
                origen_pedido_id: 'PA-04',
                nombre_producto: 'Taladro Percutor 1/2"',
                cantidad_requerida: 3,
                fecha_requerida: '03-08-2024',
                unidad_medida: 'Unidad',
                tipo_destino: 'Interno',
                direccion: 'Almacen Secundario',
                estado_item: 'En Cotización',
            },
        ],
        proveedores_enviados_ids: ['PROV-02', 'PROV-03'],
    },
     {
        id_solicitud: 'SC-003',
        fecha_emision_solicitud: '01-08-2024',
        estado: 'Cotizada',
        items: [
            {
                origen_pedido_id: 'PA-05',
                nombre_producto: 'Tornillos para Madera 1"',
                cantidad_requerida: 50,
                fecha_requerida: '10-08-2024',
                unidad_medida: 'Caja x 100',
                tipo_destino: 'Interno',
                direccion: 'Tienda',
                estado_item: 'En Cotización',
            },
            {
                origen_pedido_id: 'PA-05',
                nombre_producto: 'Martillo de Carpintero',
                cantidad_requerida: 10,
                fecha_requerida: '10-08-2024',
                unidad_medida: 'Unidad',
                tipo_destino: 'Interno',
                direccion: 'Tienda',
                estado_item: 'En Cotización'
            }
        ],
        cotizaciones_recibidas: [
            {
                id_proveedor: 'PROV-02',
                nombre_proveedor: 'Stanley Tools Perú',
                fecha_emision_cotizacion: '02-08-2024',
                fecha_garantia: '02-08-2025',
                plazo_entrega: '5 días',
                monto_total: 620.00,
                items: [
                      {
                        nombre_producto: 'Tornillos para Madera 1"',
                        cantidad_requerida: 50,
                        unidad_medida: 'Caja x 100',
                        monto_total_ofertado: 400.00,
                        modalidad_pago_ofrecida: 'Ambos',
                    },
                    {
                        nombre_producto: 'Martillo de Carpintero',
                        cantidad_requerida: 10,
                        unidad_medida: 'Unidad',
                        monto_total_ofertado: 220.00,
                        modalidad_pago_ofrecida: 'Crédito',
                    }
                ]
            },
            {
                id_proveedor: 'PROV-03',
                nombre_proveedor: 'ACEROS DEL NORTE',
                fecha_emision_cotizacion: '02-08-2024',
                fecha_garantia: '31-12-2024',
                plazo_entrega: '7 días',
                monto_total: 410.00,
                items: [
                      {
                        nombre_producto: 'Tornillos para Madera 1"',
                        cantidad_requerida: 50,
                        unidad_medida: 'Caja x 100',
                        monto_total_ofertado: 410.00,
                        modalidad_pago_ofrecida: 'Contado',
                    }
                ]
            }
        ]
    },
    {
        id_solicitud: 'SC-004',
        fecha_emision_solicitud: '02-08-2024',
        estado: 'Cotizada',
        items: [
            {
                origen_pedido_id: 'PA-06',
                nombre_producto: 'Bolsa de Cemento Sol',
                cantidad_requerida: 300,
                fecha_requerida: '08-08-2024',
                unidad_medida: 'Bolsa 42.5kg',
                tipo_destino: 'Externo',
                direccion: 'Av. Arequipa 5040, Miraflores',
                estado_item: 'En Cotización',
            },
            {
                origen_pedido_id: 'PA-06',
                nombre_producto: 'Martillo de Carpintero',
                cantidad_requerida: 10,
                fecha_requerida: '08-08-2024',
                unidad_medida: 'Unidad',
                tipo_destino: 'Externo',
                direccion: 'Av. Arequipa 5040, Miraflores',
                estado_item: 'En Cotización',
            },
            {
                origen_pedido_id: 'PA-01',
                nombre_producto: 'Tubo PVC 1/2 pulg.',
                cantidad_requerida: 50,
                fecha_requerida: '02-08-2024',
                unidad_medida: 'Tira 3m',
                tipo_destino: 'Interno',
                direccion: 'Tienda',
                estado_item: 'En Cotización',
            }
        ],
        cotizaciones_recibidas: [
            {
                id_proveedor: 'PROV-01',
                nombre_proveedor: 'Aceros Arequipa',
                fecha_emision_cotizacion: '03-08-2024',
                fecha_garantia: '03-08-2025',
                plazo_entrega: '10 días',
                monto_total: 8900.00,
                items: [
                    {
                        nombre_producto: 'Bolsa de Cemento Sol',
                        cantidad_requerida: 300,
                        unidad_medida: 'Bolsa 42.5kg',
                        monto_total_ofertado: 8400.00,
                        modalidad_pago_ofrecida: 'Crédito',
                    },
                    {
                        nombre_producto: 'Tubo PVC 1/2 pulg.',
                        cantidad_requerida: 50,
                        unidad_medida: 'Tira 3m',
                        monto_total_ofertado: 500.00,
                        modalidad_pago_ofrecida: 'Contado',
                    }
                ]
            },
            {
                id_proveedor: 'PROV-02',
                nombre_proveedor: 'Stanley Tools Perú',
                fecha_emision_cotizacion: '03-08-2024',
                fecha_garantia: '03-02-2025',
                plazo_entrega: '3 días',
                monto_total: 220.00,
                items: [
                    {
                        nombre_producto: 'Martillo de Carpintero',
                        cantidad_requerida: 10,
                        unidad_medida: 'Unidad',
                        monto_total_ofertado: 220.00,
                        modalidad_pago_ofrecida: 'Ambos',
                    }
                ]
            },
            {
                id_proveedor: 'PROV-03',
                nombre_proveedor: 'ACEROS DEL NORTE',
                fecha_emision_cotizacion: '04-08-2024',
                fecha_garantia: '01-01-2025',
                plazo_entrega: '8 días',
                monto_total: 725.00,
                items: [
                    {
                        nombre_producto: 'Tubo PVC 1/2 pulg.',
                        cantidad_requerida: 50,
                        unidad_medida: 'Tira 3m',
                        monto_total_ofertado: 475.00,
                        modalidad_pago_ofrecida: 'Contado',
                    },
                    {
                        nombre_producto: 'Martillo de Carpintero',
                        cantidad_requerida: 10,
                        unidad_medida: 'Unidad',
                        monto_total_ofertado: 250.00,
                        modalidad_pago_ofrecida: 'Contado',
                    }
                ]
            }
        ]
    }
];

export const ORDENES_COMPRA_DATA: OrdenCompra[] = [
  {
    id_orden: 'OC-001',
    id_solicitud_origen: 'SC-003',
    id_proveedor: 'PROV-02',
    nombre_proveedor: 'Stanley Tools Perú',
    fecha_emision: '03-08-2024',
    modalidad_pago: 'Crédito',
    monto_total_orden: 620.00,
    items: [
      { nombre_producto: 'Tornillos para Madera 1"', cantidad_adjudicada: 50, unidad_medida: 'Caja x 100', monto_total: 400.00 },
      { nombre_producto: 'Martillo de Carpintero', cantidad_adjudicada: 10, unidad_medida: 'Unidad', monto_total: 220.00 }
    ],
    estado: 'En Proceso',
    monitoreo: {
      estado_monitoreo: 'En Progreso',
      fecha_entrega_estimada: '10-08-2024',
      total_recepciones_programadas: 2,
      recepciones_completadas: 1,
    },
    recepciones: [
      { 
        id_recepcion: 'REC-001-1',
        modalidad_logistica: 'Entrega en Almacén',
        fecha_recepcion_programada: '08-08-2024', 
        hora_recepcion_programada: '10:00', 
        estado_recepcion: 'Conforme',
        items: [
          { nombre_producto: 'Tornillos para Madera 1"', unidad_medida: 'Caja x 100', cantidad_programada: 50, cantidad_recibida: 50, estado_calidad: 'Conforme' },
          { nombre_producto: 'Martillo de Carpintero', unidad_medida: 'Unidad', cantidad_programada: 5, cantidad_recibida: 5, estado_calidad: 'Conforme' },
        ]
      },
      { 
        id_recepcion: 'REC-001-2',
        modalidad_logistica: 'Entrega en Almacén',
        fecha_recepcion_programada: '10-08-2024', 
        hora_recepcion_programada: '14:00', 
        estado_recepcion: 'Pendiente',
        items: [
            { nombre_producto: 'Martillo de Carpintero', unidad_medida: 'Unidad', cantidad_programada: 5 },
        ]
      },
    ]
  },
  {
    id_orden: 'OC-002',
    id_solicitud_origen: 'SC-004',
    id_proveedor: 'PROV-01',
    nombre_proveedor: 'Aceros Arequipa',
    fecha_emision: '05-08-2024',
    modalidad_pago: 'Crédito',
    monto_total_orden: 8400.00,
    items: [
      { nombre_producto: 'Bolsa de Cemento Sol', cantidad_adjudicada: 300, unidad_medida: 'Bolsa 42.5kg', monto_total: 8400.00 }
    ],
    estado: 'Programada',
    monitoreo: {
      estado_monitoreo: 'Pendiente',
      fecha_entrega_estimada: '15-08-2024',
      total_recepciones_programadas: 3,
      recepciones_completadas: 0,
    },
    recepciones: [
      { 
        id_recepcion: 'REC-002-1',
        modalidad_logistica: 'Entrega en Almacén',
        fecha_recepcion_programada: '12-08-2024', 
        hora_recepcion_programada: '09:00', 
        estado_recepcion: 'Pendiente',
        items: [{ nombre_producto: 'Bolsa de Cemento Sol', unidad_medida: 'Bolsa 42.5kg', cantidad_programada: 100 }]
      },
      { 
        id_recepcion: 'REC-002-2',
        modalidad_logistica: 'Entrega en Almacén',
        fecha_recepcion_programada: '14-08-2024', 
        hora_recepcion_programada: '09:00', 
        estado_recepcion: 'Pendiente',
        items: [{ nombre_producto: 'Bolsa de Cemento Sol', unidad_medida: 'Bolsa 42.5kg', cantidad_programada: 100 }]
      },
      { 
        id_recepcion: 'REC-002-3',
        modalidad_logistica: 'Entrega en Almacén',
        fecha_recepcion_programada: '15-08-2024', 
        hora_recepcion_programada: '09:00', 
        estado_recepcion: 'Pendiente',
        items: [{ nombre_producto: 'Bolsa de Cemento Sol', unidad_medida: 'Bolsa 42.5kg', cantidad_programada: 100 }]
      },
    ]
  },
  {
    id_orden: 'OC-003',
    id_solicitud_origen: 'SC-004',
    id_proveedor: 'PROV-03',
    nombre_proveedor: 'ACEROS DEL NORTE',
    fecha_emision: '05-08-2024',
    modalidad_pago: 'Contado',
    monto_total_orden: 475.00,
    items: [
      { nombre_producto: 'Tubo PVC 1/2 pulg.', cantidad_adjudicada: 50, unidad_medida: 'Tira 3m', monto_total: 475.00 }
    ],
    estado: 'Emitida',
  },
  {
    id_orden: 'OC-004',
    id_solicitud_origen: 'SC-004',
    id_proveedor: 'PROV-02',
    nombre_proveedor: 'Stanley Tools Perú',
    fecha_emision: '06-08-2024',
    modalidad_pago: 'Contado',
    monto_total_orden: 1615.00,
    items: [
      { nombre_producto: 'Taladro Percutor 1/2"', cantidad_adjudicada: 5, unidad_medida: 'Unidad', monto_total: 1175.00 },
      { nombre_producto: 'Martillo de Carpintero', cantidad_adjudicada: 20, unidad_medida: 'Unidad', monto_total: 440.00 }
    ],
    estado: 'Emitida',
  },
  {
    id_orden: 'OC-005',
    id_solicitud_origen: 'SC-003',
    id_proveedor: 'PROV-03',
    nombre_proveedor: 'ACEROS DEL NORTE',
    fecha_emision: '07-08-2024',
    modalidad_pago: 'Crédito',
    monto_total_orden: 2415.00,
    items: [
      { nombre_producto: 'Tornillos para Madera 1"', cantidad_adjudicada: 100, unidad_medida: 'Caja x 100', monto_total: 820.00 },
      { nombre_producto: 'Martillo de Carpintero', cantidad_adjudicada: 20, unidad_medida: 'Unidad', monto_total: 420.00 },
      { nombre_producto: 'Taladro Percutor 1/2"', cantidad_adjudicada: 5, unidad_medida: 'Unidad', monto_total: 1175.00 }
    ],
    estado: 'Emitida',
    recepciones: [
      { 
        id_recepcion: 'REC-005-1',
        modalidad_logistica: 'Recojo por Transporte Propio',
        fecha_recepcion_programada: '15-08-2024', 
        hora_recepcion_programada: '11:00', 
        estado_recepcion: 'Pendiente',
        items: [
            { nombre_producto: 'Tornillos para Madera 1"', unidad_medida: 'Caja x 100', cantidad_programada: 40 },
            { nombre_producto: 'Martillo de Carpintero', unidad_medida: 'Unidad', cantidad_programada: 10 },
            { nombre_producto: 'Taladro Percutor 1/2"', unidad_medida: 'Unidad', cantidad_programada: 2 },
        ]
      },
    ]
  },
  {
    id_orden: 'OC-006',
    id_solicitud_origen: 'SC-004',
    id_proveedor: 'PROV-02',
    nombre_proveedor: 'Stanley Tools Perú',
    fecha_emision: '08-08-2024',
    modalidad_pago: 'Contado',
    monto_total_orden: 1075.00,
    items: [
      { nombre_producto: 'Martillo de Carpintero', cantidad_adjudicada: 20, unidad_medida: 'Unidad', monto_total: 440.00 },
      { nombre_producto: 'Tornillos para Madera 1"', cantidad_adjudicada: 50, unidad_medida: 'Caja x 100', monto_total: 400.00 },
      { nombre_producto: 'Taladro Percutor 1/2"', cantidad_adjudicada: 1, unidad_medida: 'Unidad', monto_total: 235.00 }
    ],
    estado: 'Cerrada',
    recepciones: [
      { 
        id_recepcion: 'REC-006-1',
        modalidad_logistica: 'Entrega en Almacén',
        fecha_recepcion_programada: '16-08-2024', 
        hora_recepcion_programada: '09:00', 
        estado_recepcion: 'Conforme',
        hora_inicio_recepcion: '09:05',
        items: [
            { nombre_producto: 'Martillo de Carpintero', unidad_medida: 'Unidad', cantidad_programada: 20, cantidad_recibida: 20, estado_calidad: 'Conforme' },
            { nombre_producto: 'Tornillos para Madera 1"', unidad_medida: 'Caja x 100', cantidad_programada: 50, cantidad_recibida: 50, estado_calidad: 'Conforme' },
            { nombre_producto: 'Taladro Percutor 1/2"', unidad_medida: 'Unidad', cantidad_programada: 1, cantidad_recibida: 1, estado_calidad: 'Conforme' },
        ],
        guias_remision: [{
            serie_correlativo: 'T001-456',
            fecha_emision_guia: '15-08-2024',
            fecha_traslado_guia: '16-08-2024',
            items: [
                { nombre_producto: 'Martillo de Carpintero', unidad_medida: 'Unidad', cantidad_en_guia: 20 },
                { nombre_producto: 'Tornillos para Madera 1"', unidad_medida: 'Caja x 100', cantidad_en_guia: 50 },
                { nombre_producto: 'Taladro Percutor 1/2"', unidad_medida: 'Unidad', cantidad_en_guia: 1 },
            ]
        }]
      },
    ]
  },
  {
    id_orden: 'OC-007',
    id_solicitud_origen: 'SC-004',
    id_proveedor: 'PROV-01',
    nombre_proveedor: 'Aceros Arequipa',
    fecha_emision: '09-08-2024',
    modalidad_pago: 'Crédito',
    monto_total_orden: 3275.00,
    items: [
      { nombre_producto: 'Bolsa de Cemento Sol', cantidad_adjudicada: 100, unidad_medida: 'Bolsa 42.5kg', monto_total: 2800.00 },
      { nombre_producto: 'Tubo PVC 1/2 pulg.', cantidad_adjudicada: 50, unidad_medida: 'Tira 3m', monto_total: 475.00 }
    ],
    estado: 'Emitida',
    recepciones: [
      { 
        id_recepcion: 'REC-007-1',
        modalidad_logistica: 'Entrega en Almacén',
        fecha_recepcion_programada: '18-08-2024', 
        hora_recepcion_programada: '11:00', 
        estado_recepcion: 'En Curso',
        hora_inicio_recepcion: '11:03',
        items: [
            { nombre_producto: 'Bolsa de Cemento Sol', unidad_medida: 'Bolsa 42.5kg', cantidad_programada: 100 },
            { nombre_producto: 'Tubo PVC 1/2 pulg.', unidad_medida: 'Tira 3m', cantidad_programada: 50 },
        ],
        guias_remision: [{
            serie_correlativo: 'T001-589',
            fecha_emision_guia: '17-08-2024',
            fecha_traslado_guia: '18-08-2024',
            items: [
                { nombre_producto: 'Bolsa de Cemento Sol', unidad_medida: 'Bolsa 42.5kg', cantidad_en_guia: 100 },
                { nombre_producto: 'Tubo PVC 1/2 pulg.', unidad_medida: 'Tira 3m', cantidad_en_guia: 50 },
            ]
        }]
      },
    ]
  }
];

export const INCIDENCIAS_DATA: Incidencia[] = [
  {
    id_incidencia: 'INC-001',
    id_orden: 'OC-007',
    nombre_proveedor: 'Aceros Arequipa',
    id_recepcion: 'REC-007-1',
    tipo_incidencia: 'CALIDAD',
    estado_incidencia: 'Pendiente',
    producto_nombre: 'Bolsa de Cemento Sol',
    producto_marca: 'Sol',
    descripcion: 'Se encontraron 5 bolsas de cemento rotas y con el contenido expuesto.',
    cantidad_afectada: 5,
    cantidad_programada: 100,
    cantidad_en_guia: 100,
    cantidad_recibida: 100,
  },
  {
    id_incidencia: 'INC-002',
    id_orden: 'OC-006',
    nombre_proveedor: 'Stanley Tools Perú',
    id_recepcion: 'REC-006-1',
    tipo_incidencia: 'CANTIDAD_FALTANTE',
    estado_incidencia: 'Pendiente',
    producto_nombre: 'Martillo de Carpintero',
    producto_marca: 'Stanley',
    descripcion: 'La guía de remisión indicaba 20 unidades, pero solo se recibieron 19 en el conteo físico.',
    cantidad_afectada: 1,
    cantidad_programada: 20,
    cantidad_en_guia: 20,
    cantidad_recibida: 19,
  },
  {
    id_incidencia: 'INC-003',
    id_orden: 'OC-001',
    nombre_proveedor: 'Stanley Tools Perú',
    id_recepcion: 'REC-001-1',
    tipo_incidencia: 'CANTIDAD_GUIA',
    estado_incidencia: 'Pendiente',
    producto_nombre: 'Tornillos para Madera 1"',
    producto_marca: 'Stanley',
    descripcion: 'Se programaron 50 cajas, pero la guía de remisión solo listaba 48.',
    cantidad_afectada: 2,
    cantidad_programada: 50,
    cantidad_en_guia: 48,
    cantidad_recibida: 48,
  },
  {
    id_incidencia: 'INC-004',
    id_orden: 'OC-007',
    nombre_proveedor: 'Aceros Arequipa',
    id_recepcion: 'REC-007-1',
    tipo_incidencia: 'CALIDAD',
    estado_incidencia: 'Pendiente',
    producto_nombre: 'Tubo PVC 1/2 pulg.',
    producto_marca: 'Matusita',
    descripcion: 'Se detectaron 3 tubos de PVC con rajaduras en los extremos.',
    cantidad_afectada: 3,
    cantidad_programada: 50,
    cantidad_en_guia: 50,
    cantidad_recibida: 50,
  },
  {
    id_incidencia: 'INC-005',
    id_orden: 'OC-001',
    nombre_proveedor: 'Stanley Tools Perú',
    id_recepcion: 'REC-001-1',
    tipo_incidencia: 'CANTIDAD_FALTANTE',
    estado_incidencia: 'Pendiente',
    producto_nombre: 'Martillo de Carpintero',
    producto_marca: 'Stanley',
    descripcion: 'Se programaron 5 martillos en esta recepción, pero solo llegaron 4.',
    cantidad_afectada: 1,
    cantidad_programada: 5,
    cantidad_en_guia: 5,
    cantidad_recibida: 4,
  },
  {
    id_incidencia: 'INC-006',
    id_orden: 'OC-001',
    nombre_proveedor: 'Stanley Tools Perú',
    id_recepcion: 'REC-001-2',
    tipo_incidencia: 'CALIDAD',
    estado_incidencia: 'Pendiente',
    producto_nombre: 'Martillo de Carpintero',
    producto_marca: 'Stanley',
    descripcion: 'El mango de uno de los martillos presenta astillas.',
    cantidad_afectada: 1,
    cantidad_programada: 5,
    cantidad_en_guia: 5,
    cantidad_recibida: 5,
  },
  {
    id_incidencia: 'INC-007',
    id_orden: 'OC-002',
    nombre_proveedor: 'Aceros Arequipa',
    id_recepcion: 'REC-002-1',
    tipo_incidencia: 'CALIDAD',
    estado_incidencia: 'Pendiente',
    producto_nombre: 'Bolsa de Cemento Sol',
    producto_marca: 'Sol',
    descripcion: 'Las bolsas de cemento muestran signos de humedad.',
    cantidad_afectada: 10,
    cantidad_programada: 100,
    cantidad_en_guia: 100,
    cantidad_recibida: 100,
  },
  {
    id_incidencia: 'INC-008',
    id_orden: 'OC-002',
    nombre_proveedor: 'Aceros Arequipa',
    id_recepcion: 'REC-002-1',
    tipo_incidencia: 'CANTIDAD_GUIA',
    estado_incidencia: 'Pendiente',
    producto_nombre: 'Bolsa de Cemento Sol',
    producto_marca: 'Sol',
    descripcion: 'La guía indica 100 bolsas, pero se programaron 105 para esta recepción.',
    cantidad_afectada: 5,
    cantidad_programada: 105,
    cantidad_en_guia: 100,
    cantidad_recibida: 100,
  },
  {
    id_incidencia: 'INC-009',
    id_orden: 'OC-002',
    nombre_proveedor: 'Aceros Arequipa',
    id_recepcion: 'REC-002-2',
    tipo_incidencia: 'CANTIDAD_FALTANTE',
    estado_incidencia: 'Pendiente',
    producto_nombre: 'Bolsa de Cemento Sol',
    producto_marca: 'Sol',
    descripcion: 'Faltaron 2 bolsas en el pallet entregado.',
    cantidad_afectada: 2,
    cantidad_programada: 100,
    cantidad_en_guia: 100,
    cantidad_recibida: 98,
  },
];

export const ALMACENES: string[] = ['Almacén 1', 'Almacén 2', 'Almacén 3'];

// Data for simulating busy schedules for the new scheduler component
function getNextWorkingDay(date: Date, daysToAdd: number): string {
    let newDate = new Date(date);
    let addedDays = 0;
    while (addedDays < daysToAdd) {
        newDate.setDate(newDate.getDate() + 1);
        const dayOfWeek = newDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0 = Sunday, 6 = Saturday
            addedDays++;
        }
    }
    return newDate.toISOString().split('T')[0];
}

const today = new Date();
const tomorrow = getNextWorkingDay(today, 1);
const dayAfterTomorrow = getNextWorkingDay(today, 2);

export const HORARIOS_OCUPADOS: HorarioOcupado[] = [
    // Almacén
    { fecha: tomorrow, hora: '09:00', tipo: 'Almacén', recurso_id: 'Almacén 1' },
    { fecha: tomorrow, hora: '10:00', tipo: 'Almacén', recurso_id: 'Almacén 1' },
    { fecha: tomorrow, hora: '10:00', tipo: 'Almacén', recurso_id: 'Almacén 2' },
    { fecha: dayAfterTomorrow, hora: '14:00', tipo: 'Almacén', recurso_id: 'Almacén 3' },
    { fecha: dayAfterTomorrow, hora: '15:00', tipo: 'Almacén', recurso_id: 'Almacén 2' },
    { fecha: dayAfterTomorrow, hora: '15:00', tipo: 'Almacén', recurso_id: 'Almacén 3' },
    // Transporte
    { fecha: tomorrow, hora: '11:00', tipo: 'Transporte' },
    { fecha: dayAfterTomorrow, hora: '08:00', tipo: 'Transporte' },
];


// ============================================================================
// 2. DATOS DEL MÓDULO DE CLIENTES (CRM)
// ============================================================================

export const CLIENT_DATA: Client[] = [
  { id: 1, nombre: 'Luis', apellidos: 'Garcia Morales', ruc: '987654321', distrito: 'San Isidro', telefono: '987-654-321', correo: 'luis.garcia@email.com', fechaRegistro: '2024-05-10', direccion: 'Av. Javier Prado 123' },
  { id: 2, nombre: 'Ana', apellidos: 'Perez Lopez', ruc: '123456789', distrito: 'Miraflores', telefono: '998-765-432', correo: 'ana.perez@email.com', fechaRegistro: '2023-11-25', direccion: 'Calle Las Begonias 456' },
  { id: 3, nombre: 'Carlos', apellidos: 'Sanchez Vargas', ruc: '1090123456', distrito: 'Santiago de Surco', telefono: '976-543-210', correo: 'c.sanchez@email.com', fechaRegistro: '2025-01-15', direccion: 'Jr. Monte Rosa 789' },
  { id: 4, nombre: 'Maria', apellidos: 'Ramirez Ortiz', ruc: '1034567890', distrito: 'La Molina', telefono: '965-432-109', correo: 'maria.ramirez@email.com', fechaRegistro: '2024-08-01', direccion: 'Av. La Molina 1011' },
  { id: 5, nombre: 'Jorge', apellidos: 'Castro Medina', ruc: '1023456789', distrito: 'Barranco', telefono: '954-321-098', correo: 'jorge.castro@email.com', fechaRegistro: '2023-04-12', direccion: 'Psj. Saenz Peña 1213' },
  { id: 6, nombre: 'Sofia', apellidos: 'Mendoza Rojas', ruc: '943210987', distrito: 'Lince', telefono: '943-210-987', correo: 'sofia.mendoza@email.com', fechaRegistro: '2025-03-20', direccion: 'Av. Arequipa 1415' },
  { id: 7, nombre: 'Roberto', apellidos: 'Torres Rios', ruc: '932109876', distrito: 'Pueblo Libre', telefono: '932-109-876', correo: 'roberto.torres@email.com', fechaRegistro: '2024-09-05', direccion: 'Av. Brasil 1617' },
  { id: 8, nombre: 'Lucia', apellidos: 'Diaz Fernandez', ruc: '921098765', distrito: 'San Miguel', telefono: '921-098-765', correo: 'lucia.diaz@email.com', fechaRegistro: '2023-07-30', direccion: 'Av. La Marina 1819' },
  { id: 9, nombre: 'Fernando', apellidos: 'Gomez Silva', ruc: '910987654', distrito: 'San Borja', telefono: '910-987-654', correo: 'f.gomez@email.com', fechaRegistro: '2024-02-18', direccion: 'Av. Aviación 2021' },
  { id: 10, nombre: 'Valeria', apellidos: 'Salazar Nieto', ruc: '909876543', distrito: 'San Miguel', telefono: '909-876-543', correo: 'valeria.salazar@email.com', fechaRegistro: '2025-04-03', direccion: 'Calle Manco Capac 2223' },
  { id: 11, nombre: 'Pedro', apellidos: 'Vilchez Cardenas', ruc: '10123456788', distrito: 'Barranco', telefono: '904-321-098', correo: 'p.vilchez@email.com', fechaRegistro: '12-09-2024', direccion: 'Jirón 28 de Julio 123, Lima' },
];

export const MAESTRO_DATA: Maestro[] = [
  { id: 1, nombre: 'Luis', apellidos: 'Garcia Morales', ruc: '1012345678', distrito: 'San Isidro', telefono: '987-654-321', correo: 'luis.garcia@email.com', especialidad: 'Albañilería', fechaRegistro: '2024-05-10', direccion: 'Av. Javier Prado 123' },
  { id: 2, nombre: 'Ana', apellidos: 'Perez Lopez', ruc: '1045678901', distrito: 'Miraflores', telefono: '998-765-432', correo: 'ana.perez@email.com', especialidad: 'Gasfitería', fechaRegistro: '2023-11-25', direccion: 'Calle Las Begonias 456' },
  { id: 3, nombre: 'Jorge', apellidos: 'Castro Medina', ruc: '1023456789', distrito: 'Barranco', telefono: '954-321-098', correo: 'jorge.castro@email.com', especialidad: 'Electricidad', fechaRegistro: '2023-04-12', direccion: 'Psj. Saenz Peña 1213' },
  { id: 4, nombre: 'Pedro', apellidos: 'Vilchez Cardenas', ruc: '10123456788', distrito: 'Barranco', telefono: '904-321-098', correo: 'p.vilchez@email.com', especialidad: 'GASFITERIA', fechaRegistro: '12-09-2024', direccion: 'Jirón 28 de Julio 123, Lima' },
];

export const SALES_HISTORY_DATA: SaleClientes[] = [
    { fecha: '2025-04-26', monto: 'S/ 80.00', tipoPago: 'Tarjeta de Crédito', nroComprobante: 'F001-000459' },
    { fecha: '2025-04-27', monto: 'S/ 40.00', tipoPago: 'Plin', nroComprobante: 'B001-001237' },
    { fecha: '2025-05-28', monto: 'S/ 35.00', tipoPago: 'Efectivo', nroComprobante: 'F001-000460' },
    { fecha: '2025-05-29', monto: 'S/ 50.00', tipoPago: 'Transferencia Bancaria', nroComprobante: 'B001-001238' },
];

export const CHART_DATA: ChartData[] = [
    { name: '2024-09', value: 300 },
    { name: '2024-10', value: 500 },
    { name: '2024-11', value: 800 },
    { name: '2024-12', value: 250 },
    { name: '2025-1', value: 2500 },
    { name: '2025-2', value: 350 },
    { name: '2025-3', value: 200 },
    { name: '2025-4', value: 150 },
    { name: '2025-5', value: 100 },
];

export const CANJES_HISTORY_DATA: Canje[] = [
    { fecha: '2025-05-01', idPremio: 'PREM-05', cantidad: 1, puntos: 500, estado: 'Entregado' },
    { fecha: '2025-05-02', idPremio: 'PREM-12', cantidad: 2, puntos: 250, estado: 'Entregado' },
    { fecha: '2025-05-03', idPremio: 'PREM-08', cantidad: 1, puntos: 1500, estado: 'Pendiente' },
    { fecha: '2025-05-04', idPremio: 'PREM-03', cantidad: 1, puntos: 800, estado: 'Entregado' },
];

export const CONTACTS_DATA: Contact[] = [
  { id: 1, tipo: 'Telefono Celular', valor: '123-456-789' },
  { id: 2, tipo: 'Whatsapp', valor: '123-456-789' },
  { id: 3, tipo: 'Correo', valor: 'ejemplo.correo@gmail.com' },
  { id: 4, tipo: 'Telefono Celular', valor: '456-789-132' },
];

export const DIRECCIONES_DATA: Address[] = [
  { id: 1, ciudad: 'Lima', distrito: 'Ate', via: 'Jiron Paracas', numero: '954' },
  { id: 2, ciudad: 'Lima', distrito: 'Ate', via: 'Avenida Hermes', numero: '256' },
  { id: 3, ciudad: 'Lima', distrito: 'Barranco', via: 'Jiron 28 de julio', numero: '123' },
  { id: 4, ciudad: 'Lima', distrito: 'Santa Anita', via: 'Avenida Moro solar', numero: '455' },
];

export const PREMIOS_CATALOG_DATA: Premio[] = [
    { id: 'PREM-01', nombre: 'Taladro Inalámbrico', descripcion: 'Modelo: SCD-123...', costo: 30, categoria: 'Herramienta, ...' },
    { id: 'PREM-02', nombre: 'Batidora', descripcion: 'Mod. V2...', costo: 200, categoria: 'Electrodomes...' },
    { id: 'PREM-03', nombre: 'Tornillos', descripcion: 'Tornillos 3cm', costo: 30, categoria: 'Carpintería, ...' },
    { id: 'PREM-04', nombre: 'Cemento', descripcion: 'Saco 50kg', costo: 25, categoria: 'Construcción, ...' },
    { id: 'PREM-05', nombre: 'Pintura Acrílica', descripcion: 'Galón azul', costo: 45, categoria: 'Acabados, ...' },
    { id: 'PR-006', nombre: 'Vales de compra', descripcion: 'S/ 20 en Sodimac', costo: 20, categoria: 'Vales' },
    { id: 'PR-014', nombre: 'Pala', descripcion: 'Pala de jardín', costo: 35, categoria: 'Herramienta' },
    { id: 'PR-035', nombre: 'Televisor', descripcion: 'Smart TV 32"', costo: 270, categoria: 'Electrodomes...' },
];

export const REPORTS_DATA: Report[] = [
  { id: 'REP-001', fechaGeneracion: '2025-03-01', periodoAnalisis: 'Último mes', idUsuarioGenerador: 'USR-005' },
  { id: 'REP-002', fechaGeneracion: '2025-03-05', periodoAnalisis: 'Semanal', idUsuarioGenerador: 'USR-012' },
  { id: 'REP-003', fechaGeneracion: '2025-03-10', periodoAnalisis: 'Trimestre', idUsuarioGenerador: 'USR-003' },
  { id: 'REP-004', fechaGeneracion: '2025-03-15', periodoAnalisis: 'Semanal', idUsuarioGenerador: 'USR-003' },
  { id: 'REP-005', fechaGeneracion: '2025-03-20', periodoAnalisis: 'Anual', idUsuarioGenerador: 'USR-012' },
  { id: 'REP-006', fechaGeneracion: '2025-03-25', periodoAnalisis: 'Semanal', idUsuarioGenerador: 'USR-003' },
  { id: 'REP-007', fechaGeneracion: '2025-04-01', periodoAnalisis: 'Último mes', idUsuarioGenerador: 'USR-005' },
  { id: 'REP-008', fechaGeneracion: '2025-04-05', periodoAnalisis: 'Semanal', idUsuarioGenerador: 'USR-001' },
  { id: 'REP-009', fechaGeneracion: '2025-04-10', periodoAnalisis: 'Trimestre', idUsuarioGenerador: 'USR-005' },
  { id: 'REP-010', fechaGeneracion: '2025-04-15', periodoAnalisis: 'Último mes', idUsuarioGenerador: 'USR-012' },
  { id: 'REP-011', fechaGeneracion: '2025-04-20', periodoAnalisis: 'Semanal', idUsuarioGenerador: 'USR-003' },
];


export const dispatchTimeSlotMap: { [key in 'Mañana' | 'Tarde' | 'Noche']: string } = {
  'Mañana': '07:00 - 12:00',
  'Tarde': '12:00 - 18:00',
  'Noche': '18:00 - 22:00',
};

export const initialSaleDetailsData: SaleDetail[] = [
  {
    id: 'V-022',
    status: SaleStatus.Paid,
    client: 'Carlos Sanchez Vargas',
    dateTime: '11/11/2025 10:15:00h',
    seller: 'Mónica Pereira',
    paymentCondition: 'CONTADO',
    totalInstallments: 1,
    paidInstallments: 1,
    points: 40,
    total: 'S/40.00',
    products: [
      { id: 'P-011', description: 'Caja de tornillos x 500', quantity: 1, unitPrice: 'S/40.00', discount: '-', points: 40, amount: 'S/40.00', status: ProductStatus.Entregado },
    ],
    payments: [
      { installmentNumber: 1, amount: 'S/40.00', paymentDate: '11/11/2025', paymentMethod: 'Efectivo' }
    ]
  },
  {
    id: 'V-021',
    status: SaleStatus.Pending,
    client: 'Sebastián Núñez',
    dateTime: '10/11/2025 18:00:12h',
    seller: 'María Cáceres',
    paymentCondition: 'CRÉDITO',
    totalInstallments: 2,
    paidInstallments: 0,
    points: 85,
    total: 'S/85.00',
    products: [
      { id: 'P-045', description: 'Tubo de PVC 1/2" x 3m', quantity: 10, unitPrice: 'S/8.50', discount: '-', points: 85, amount: 'S/85.00', status: ProductStatus.PorEntregar },
    ],
    payments: []
  },
  {
    id: 'V-020',
    status: SaleStatus.Paid,
    client: 'Camila Espinoza',
    dateTime: '09/11/2025 14:20:45h',
    seller: 'Julián Alvarado',
    paymentCondition: 'CONTADO',
    totalInstallments: 1,
    paidInstallments: 1,
    points: 12,
    total: 'S/12.50',
    products: [
      { id: 'P-050', description: 'Foco LED 12W luz cálida', quantity: 1, unitPrice: 'S/12.50', discount: '-', points: 12, amount: 'S/12.50', status: ProductStatus.Entregado },
    ],
    payments: [
      { installmentNumber: 1, amount: 'S/12.50', paymentDate: '09/11/2025', paymentMethod: 'Yape/Plin' }
    ]
  },
  {
    id: 'V-019',
    status: SaleStatus.Annulled,
    client: 'Diego Rivera',
    dateTime: '08/11/2025 11:30:00h',
    seller: 'Mónica Pereira',
    paymentCondition: 'CRÉDITO',
    totalInstallments: 2,
    paidInstallments: 0,
    points: 56,
    total: 'S/56.80',
    products: [
      { id: 'P-085', description: 'Sierra de mano', quantity: 1, unitPrice: 'S/56.80', discount: '-', points: 56, amount: 'S/56.80', status: ProductStatus.PorEntregar },
    ],
    payments: []
  },
  {
    id: 'V-018',
    status: SaleStatus.Paid,
    client: 'Valeria Chávez',
    dateTime: '07/11/2025 16:45:10h',
    seller: 'René Olivares',
    paymentCondition: 'CONTADO',
    totalInstallments: 1,
    paidInstallments: 1,
    points: 30,
    total: 'S/30.00',
    products: [
      { id: 'P-089', description: 'Rodillo para pintar 9"', quantity: 2, unitPrice: 'S/15.00', discount: '-', points: 30, amount: 'S/30.00', status: ProductStatus.Cambiado },
    ],
    payments: [
      { installmentNumber: 1, amount: 'S/30.00', paymentDate: '07/11/2025', paymentMethod: 'Efectivo' }
    ]
  },
  {
    id: 'V-017',
    status: SaleStatus.Pending,
    client: 'Mateo Castillo',
    dateTime: '06/11/2025 09:10:20h',
    seller: 'María Cáceres',
    paymentCondition: 'CRÉDITO',
    totalInstallments: 4,
    paidInstallments: 2,
    points: 103,
    total: 'S/103.10',
    products: [
      { id: 'P-070', description: 'Martillo de uña 16oz', quantity: 1, unitPrice: 'S/35.00', discount: '-', points: 35, amount: 'S/35.00', status: ProductStatus.PorEntregar, deliveryAddress: 'Av. La Marina 2231, San Miguel', dispatchDate: '07/11/2025', dispatchTimeSlot: 'Tarde' },
      { id: 'P-071', description: 'Clavos de acero 2"', quantity: 2, unitPrice: 'S/11.30', discount: '-', points: 22, amount: 'S/22.60', status: ProductStatus.PorEntregar, deliveryAddress: 'Av. La Marina 2231, San Miguel', dispatchDate: '07/11/2025', dispatchTimeSlot: 'Tarde' },
      { id: 'P-085', description: 'Sierra de mano', quantity: 1, unitPrice: 'S/45.50', discount: '-', points: 45, amount: 'S/45.50', status: ProductStatus.PorEntregar, deliveryAddress: 'Av. La Marina 2231, San Miguel', dispatchDate: '07/11/2025', dispatchTimeSlot: 'Tarde' },
    ],
    payments: [
      { installmentNumber: 1, amount: 'S/25.78', paymentDate: '06/11/2025', paymentMethod: 'Efectivo' },
      { installmentNumber: 2, amount: 'S/25.78', paymentDate: '06/12/2025', paymentMethod: 'Transferencia bancaria' }
    ]
  },
  {
    id: 'V-016',
    status: SaleStatus.Paid,
    client: 'Gabriela Soto',
    dateTime: '05/11/2025 15:05:55h',
    seller: 'Julián Alvarado',
    paymentCondition: 'CRÉDITO',
    totalInstallments: 2,
    paidInstallments: 2,
    points: 120,
    total: 'S/120.00',
    products: [
      { id: 'P-119', description: 'Puerta Decor 40mm 80x207cm', quantity: 2, unitPrice: 'S/60.00', discount: '-', points: 120, amount: 'S/120.00', status: ProductStatus.Entregado },
    ],
    payments: [
      { installmentNumber: 1, amount: 'S/60.00', paymentDate: '05/11/2025', paymentMethod: 'Efectivo' },
      { installmentNumber: 2, amount: 'S/60.00', paymentDate: '05/12/2025', paymentMethod: 'Yape/Plin' }
    ]
  },
  {
    id: 'V-015',
    status: SaleStatus.Paid,
    client: 'Fernando Arias',
    dateTime: '04/11/2025 12:00:00h',
    seller: 'Mónica Pereira',
    paymentCondition: 'CONTADO',
    totalInstallments: 1,
    paidInstallments: 1,
    points: 49,
    total: 'S/49.90',
    products: [
      { id: 'P-046', description: 'Pegamento para PVC 1/4 galón', quantity: 1, unitPrice: 'S/49.90', discount: '-', points: 49, amount: 'S/49.90', status: ProductStatus.Devuelto },
    ],
    payments: [
      { installmentNumber: 1, amount: 'S/49.90', paymentDate: '04/11/2025', paymentMethod: 'Efectivo' }
    ]
  },
  {
    id: 'V-014',
    status: SaleStatus.Paid,
    client: 'Beatriz Miranda',
    dateTime: '03/11/2025 19:25:30h',
    seller: 'René Olivares',
    paymentCondition: 'CONTADO',
    totalInstallments: 1,
    paidInstallments: 1,
    points: 80,
    total: 'S/80.00',
    products: [
      { id: 'P-088', description: 'Pintura satinada galón blanco', quantity: 1, unitPrice: 'S/80.00', discount: '-', points: 80, amount: 'S/80.00', status: ProductStatus.Entregado },
    ],
    payments: [
      { installmentNumber: 1, amount: 'S/80.00', paymentDate: '03/11/2025', paymentMethod: 'Tarjeta débito/crédito' }
    ]
  },
  {
    id: 'V-013',
    status: SaleStatus.Pending,
    client: 'Ricardo Solano',
    dateTime: '02/11/2025 17:55:00h',
    seller: 'María Cáceres',
    paymentCondition: 'CRÉDITO',
    totalInstallments: 3,
    paidInstallments: 1,
    points: 200,
    total: 'S/200.00',
    products: [
      { id: 'P-151', description: 'Guantes de seguridad', quantity: 2, unitPrice: 'S/12.00', discount: '-', points: 24, amount: 'S/24.00', status: ProductStatus.PorEntregar, deliveryAddress: 'Jirón de la Unión 550, Lima', dispatchDate: '03/11/2025', dispatchTimeSlot: 'Mañana' },
      { id: 'P-152', description: 'Lentes de seguridad', quantity: 2, unitPrice: 'S/8.00', discount: '-', points: 16, amount: 'S/16.00', status: ProductStatus.PorEntregar, deliveryAddress: 'Jirón de la Unión 550, Lima', dispatchDate: '03/11/2025', dispatchTimeSlot: 'Mañana' },
      { id: 'P-091', description: 'Escalera de aluminio 6 pasos', quantity: 1, unitPrice: 'S/160.00', discount: '-', points: 160, amount: 'S/160.00', status: ProductStatus.PorEntregar, deliveryAddress: 'Jirón de la Unión 550, Lima', dispatchDate: '03/11/2025', dispatchTimeSlot: 'Mañana' },
    ],
    payments: [
      { installmentNumber: 1, amount: 'S/66.67', paymentDate: '02/11/2025', paymentMethod: 'Efectivo' }
    ]
  },
  {
    id: 'V-012',
    status: SaleStatus.Paid,
    client: 'Elena Quispe',
    dateTime: '01/11/2025 13:13:13h',
    seller: 'Julián Alvarado',
    paymentCondition: 'CONTADO',
    totalInstallments: 1,
    paidInstallments: 1,
    points: 25,
    total: 'S/25.00',
    products: [
      { id: 'P-150', description: 'Wincha 5m', quantity: 1, unitPrice: 'S/25.00', discount: '-', points: 25, amount: 'S/25.00', status: ProductStatus.Entregado },
    ],
    payments: [
      { installmentNumber: 1, amount: 'S/25.00', paymentDate: '01/11/2025', paymentMethod: 'Efectivo' }
    ]
  },
  {
    id: 'V-011',
    status: SaleStatus.Pending,
    client: 'Carlos Sanchez Vargas',
    dateTime: '30/10/2025 19:30:51h',
    seller: 'Mónica Pereira',
    paymentCondition: 'CRÉDITO',
    totalInstallments: 4,
    paidInstallments: 2,
    points: 623,
    total: 'S/623.50',
    products: [
      { id: 'P-006', description: 'Bolsa de cemento SOL 42.5kg', quantity: 5, unitPrice: 'S/30.90', discount: '-', points: 154, amount: 'S/154.50', status: ProductStatus.PorEntregar, deliveryAddress: 'Av. Tomás Marsano 254 - 2do Piso Dpto 201', dispatchDate: '31/10/2025' },
      { id: 'P-014', description: 'Ladrillo Techo Hueco 12x30x30 Pirámide', quantity: 20, unitPrice: 'S/2.60', discount: '-', points: 52, amount: 'S/52.00', status: ProductStatus.PorEntregar, deliveryAddress: 'Av. Tomás Marsano 254 - 2do Piso Dpto 201', dispatchDate: '31/10/2025' },
      { id: 'P-035', description: 'Bloque de vidrio Cuadriculado 19x19cm', quantity: 30, unitPrice: 'S/5.90', discount: '-', points: 177, amount: 'S/177.00', status: ProductStatus.PorEntregar, deliveryAddress: 'Av. Tomás Marsano 254 - 2do Piso Dpto 201', dispatchDate: '31/10/2025' },
      { id: 'P-119', description: 'Puerta Decor 40mm 80x207cm', quantity: 4, unitPrice: 'S/60.00', discount: '-', points: 240, amount: 'S/240.00', status: ProductStatus.PorEntregar, deliveryAddress: 'Av. Tomás Marsano 254 - 2do Piso Dpto 201', dispatchDate: '31/10/2025' },
    ],
    payments: [
      { installmentNumber: 1, amount: 'S/155.88', paymentDate: '30/10/2025', paymentMethod: 'Efectivo' },
      { installmentNumber: 2, amount: 'S/155.88', paymentDate: '30/11/2025', paymentMethod: 'Transferencia bancaria' }
    ]
  },
  {
    id: 'V-010',
    status: SaleStatus.Paid,
    client: 'Ana Gomez',
    dateTime: '20/09/2025 09:17:48h',
    seller: 'Julián Alvarado',
    paymentCondition: 'CONTADO',
    totalInstallments: 1,
    paidInstallments: 1,
    points: 100,
    total: 'S/100.00',
    products: [
      { id: 'P-021', description: 'Taladro percutor 1/2" 650W', quantity: 1, unitPrice: 'S/100.00', discount: '-', points: 100, amount: 'S/100.00', status: ProductStatus.Entregado },
    ],
    payments: [
      { installmentNumber: 1, amount: 'S/100.00', paymentDate: '20/09/2025', paymentMethod: 'Efectivo' }
    ]
  },
  {
    id: 'V-009',
    status: SaleStatus.Pending,
    client: 'Luis Fernandez',
    dateTime: '19/09/2025 20:25:46h',
    seller: 'María Cáceres',
    paymentCondition: 'CRÉDITO',
    totalInstallments: 3,
    paidInstallments: 1,
    points: 523,
    total: 'S/523.50',
    products: [
        { id: 'P-088', description: 'Pintura satinada galón blanco', quantity: 4, unitPrice: 'S/80.00', discount: 'S/20.00', points: 300, amount: 'S/300.00', status: ProductStatus.PorEntregar, deliveryAddress: 'Calle Los Pinos 123, Surco', dispatchDate: '20/09/2025' },
        { id: 'P-089', description: 'Rodillo para pintar 9"', quantity: 2, unitPrice: 'S/15.00', discount: '-', points: 30, amount: 'S/30.00', status: ProductStatus.PorEntregar, deliveryAddress: 'Calle Los Pinos 123, Surco', dispatchDate: '20/09/2025' },
        { id: 'P-090', description: 'Lija para madera #120', quantity: 10, unitPrice: 'S/1.35', discount: '-', points: 13, amount: 'S/13.50', status: ProductStatus.PorEntregar, deliveryAddress: 'Calle Los Pinos 123, Surco', dispatchDate: '20/09/2025' },
        { id: 'P-091', description: 'Escalera de aluminio 6 pasos', quantity: 1, unitPrice: 'S/180.00', discount: '-', points: 180, amount: 'S/180.00', status: ProductStatus.PorEntregar, deliveryAddress: 'Calle Los Pinos 123, Surco', dispatchDate: '20/09/2025' },
    ],
    payments: [
      { installmentNumber: 1, amount: 'S/174.50', paymentDate: '19/09/2025', paymentMethod: 'Efectivo' }
    ]
  },
  {
    id: 'V-008',
    status: SaleStatus.Paid,
    client: 'Laura Torres',
    dateTime: '19/09/2025 13:36:33h',
    seller: 'René Olivares',
    paymentCondition: 'CONTADO',
    totalInstallments: 1,
    paidInstallments: 1,
    points: 20,
    total: 'S/20.00',
    products: [
      { id: 'P-033', description: 'Cinta aislante negra', quantity: 4, unitPrice: 'S/5.00', discount: '-', points: 20, amount: 'S/20.00', status: ProductStatus.Cambiado },
    ],
    payments: [
      { installmentNumber: 1, amount: 'S/20.00', paymentDate: '19/09/2025', paymentMethod: 'Efectivo' }
    ]
  },
  {
    id: 'V-007',
    status: SaleStatus.Annulled,
    client: 'Jorge Salas',
    dateTime: '19/09/2025 11:58:19h',
    seller: 'Mónica Pereira',
    paymentCondition: 'CRÉDITO',
    totalInstallments: 3,
    paidInstallments: 0,
    points: 234,
    total: 'S/234.40',
    products: [
      { id: 'P-045', description: 'Tubo de PVC 1/2" x 3m', quantity: 10, unitPrice: 'S/8.50', discount: '-', points: 85, amount: 'S/85.00', status: ProductStatus.PorEntregar },
      { id: 'P-046', description: 'Pegamento para PVC 1/4 galón', quantity: 1, unitPrice: 'S/49.90', discount: '-', points: 49, amount: 'S/49.90', status: ProductStatus.PorEntregar },
      { id: 'P-047', description: 'Codo de PVC 1/2"', quantity: 20, unitPrice: 'S/1.20', discount: '-', points: 24, amount: 'S/24.00', status: ProductStatus.PorEntregar },
      { id: 'P-048', description: 'Llave de paso esférica 1/2"', quantity: 2, unitPrice: 'S/37.75', discount: '-', points: 75, amount: 'S/75.50', status: ProductStatus.PorEntregar },
    ],
    payments: []
  },
  {
    id: 'V-006',
    status: SaleStatus.Pending,
    client: 'Pedro Ramirez',
    dateTime: '19/09/2025 10:45:56h',
    seller: 'Julián Alvarado',
    paymentCondition: 'CRÉDITO',
    totalInstallments: 2,
    paidInstallments: 1,
    points: 135,
    total: 'S/135.50',
    products: [
      { id: 'P-050', description: 'Foco LED 12W luz cálida', quantity: 5, unitPrice: 'S/12.50', discount: '-', points: 62, amount: 'S/62.50', status: ProductStatus.Entregado },
      { id: 'P-051', description: 'Tomacorriente doble', quantity: 10, unitPrice: 'S/7.30', discount: '-', points: 73, amount: 'S/73.00', status: ProductStatus.Entregado },
    ],
    payments: [
        { installmentNumber: 1, amount: 'S/67.75', paymentDate: '19/09/2025', paymentMethod: 'Efectivo' }
    ]
  },
  {
    id: 'V-005',
    status: SaleStatus.Paid,
    client: 'Sofia Mendoza Rojas',
    dateTime: '18/09/2025 20:53:32h',
    seller: 'René Olivares',
    paymentCondition: 'CONTADO',
    totalInstallments: 1,
    paidInstallments: 1,
    points: 4,
    total: 'S/4.20',
    products: [
      { id: 'P-060', description: 'Tornillo autorroscante 1"', quantity: 20, unitPrice: 'S/0.21', discount: '-', points: 4, amount: 'S/4.20', status: ProductStatus.Entregado },
    ],
    payments: [
      { installmentNumber: 1, amount: 'S/4.20', paymentDate: '18/09/2025', paymentMethod: 'Efectivo' }
    ]
  },
  {
    id: 'V-004',
    status: SaleStatus.Paid,
    client: 'Sofía Mendoza Rojas',
    dateTime: '18/09/2025 19:30:51h',
    seller: 'René Olivares',
    paymentCondition: 'CONTADO',
    totalInstallments: 1,
    paidInstallments: 1,
    points: 101,
    total: 'S/101.00',
    products: [
      { id: 'P-011', description: 'Caja de tornillos x 500', quantity: 1, unitPrice: 'S/40.00', discount: '-', points: 40, amount: 'S/40.00', status: ProductStatus.Entregado },
      { id: 'P-018', description: 'Destornillador estrella BOSCH', quantity: 2, unitPrice: 'S/20.30', discount: 'S/10.00', points: 30, amount: 'S/30.60', status: ProductStatus.Entregado },
      { id: 'P-057', description: 'Alicate universal 200mm', quantity: 1, unitPrice: 'S/10.50', discount: '-', points: 10, amount: 'S/10.50', status: ProductStatus.Entregado },
      { id: 'P-068', description: 'Cerradura para dormitorio bronce', quantity: 1, unitPrice: 'S/19.90', discount: '-', points: 19, amount: 'S/19.90', status: ProductStatus.Entregado },
    ],
    payments: [
      { installmentNumber: 1, amount: 'S/101.00', paymentDate: '18/09/2025', paymentMethod: 'Efectivo' }
    ]
  },
  {
    id: 'V-003',
    status: SaleStatus.Paid,
    client: 'David Flores',
    dateTime: '18/09/2025 17:18:28h',
    seller: 'Julián Alvarado',
    paymentCondition: 'CONTADO',
    totalInstallments: 1,
    paidInstallments: 1,
    points: 46,
    total: 'S/46.30',
    products: [
      { id: 'P-070', description: 'Martillo de uña 16oz', quantity: 1, unitPrice: 'S/35.00', discount: '-', points: 35, amount: 'S/35.00', status: ProductStatus.Entregado },
      { id: 'P-071', description: 'Clavos de acero 2"', quantity: 1, unitPrice: 'S/11.30', discount: '-', points: 11, amount: 'S/11.30', status: ProductStatus.Entregado },
    ],
    payments: [
      { installmentNumber: 1, amount: 'S/46.30', paymentDate: '18/09/2025', paymentMethod: 'Efectivo' }
    ]
  },
  {
    id: 'V-002',
    status: SaleStatus.Paid,
    client: 'Rosa Paredes',
    dateTime: '18/09/2025 16:57:49h',
    seller: 'María Cáceres',
    paymentCondition: 'CONTADO',
    totalInstallments: 1,
    paidInstallments: 1,
    points: 17,
    total: 'S/17.70',
    products: [
      { id: 'P-080', description: 'Brocha 3"', quantity: 1, unitPrice: 'S/17.70', discount: '-', points: 17, amount: 'S/17.70', status: ProductStatus.Devuelto },
    ],
    payments: [
      { installmentNumber: 1, amount: 'S/17.70', paymentDate: '18/09/2025', paymentMethod: 'Efectivo' }
    ]
  },
  {
    id: 'V-001',
    status: SaleStatus.Paid,
    client: 'Miguel Castro',
    dateTime: '18/09/2025 16:41:33h',
    seller: 'Mónica Pereira',
    paymentCondition: 'CONTADO',
    totalInstallments: 1,
    paidInstallments: 1,
    points: 56,
    total: 'S/56.80',
    products: [
      { id: 'P-085', description: 'Sierra de mano', quantity: 1, unitPrice: 'S/56.80', discount: '-', points: 56, amount: 'S/56.80', status: ProductStatus.Entregado },
    ],
    payments: [
      { installmentNumber: 1, amount: 'S/56.80', paymentDate: '18/09/2025', paymentMethod: 'Efectivo' }
    ]
  }
];

export const initialReturnsData: Return[] = [
  {
    id: 'D-001',
    saleId: 'V-002',
    date: '19/09/2025',
    client: 'Rosa Paredes',
    returnedProducts: [
      {
        productId: 'P-080',
        description: 'Brocha 3"',
        quantity: 1,
        amount: 'S/17.70',
      },
    ],
    totalReturnedAmount: 'S/17.70',
    reason: 'Producto defectuoso',
  },
  {
    id: 'D-002',
    saleId: 'V-015',
    date: '05/11/2025',
    client: 'Fernando Arias',
    returnedProducts: [
      {
        productId: 'P-046',
        description: 'Pegamento para PVC 1/4 galón',
        quantity: 1,
        amount: 'S/49.90',
      },
    ],
    totalReturnedAmount: 'S/49.90',
    reason: 'No cumple con las expectativas',
  },
];

export const initialExchangesData: Exchange[] = [
  {
    id: 'E-001',
    saleId: 'V-008',
    date: '20/09/2025',
    client: 'Laura Torres',
    returnedProduct: {
      productId: 'P-033',
      description: 'Cinta aislante negra',
      quantity: 4,
      amount: 'S/20.00',
    },
    newProduct: {
      productId: 'P-151',
      description: 'Guantes de seguridad',
      quantity: 1,
      amount: 'S/12.00',
    },
    priceDifference: 'S/-8.00 (a favor del cliente)',
    reason: 'Cliente se equivocó de producto',
  },
  {
    id: 'E-002',
    saleId: 'V-018',
    date: '08/11/2025',
    client: 'Valeria Chávez',
    returnedProduct: {
      productId: 'P-089',
      description: 'Rodillo para pintar 9"',
      quantity: 2,
      amount: 'S/30.00',
    },
    newProduct: {
      productId: 'P-150',
      description: 'Wincha 5m',
      quantity: 1,
      amount: 'S/25.00',
    },
    priceDifference: 'S/-5.00 (a favor del cliente)',
    reason: 'Prefiere otro modelo',
  },
];

export const initialAnnulmentsData: Annulment[] = [
  {
    id: 'A-001',
    saleId: 'V-007',
    date: '19/09/2025',
    client: 'Jorge Salas',
    seller: 'Mónica Pereira',
    amount: 'S/234.40',
    reason: 'Cliente desistió de la compra.',
  },
  {
    id: 'A-002',
    saleId: 'V-019',
    date: '08/11/2025',
    client: 'Diego Rivera',
    seller: 'Mónica Pereira',
    amount: 'S/56.80',
    reason: 'Cliente desistió de la compra.',
  },
];


export const clientsData: ClientVentas[] = [
  { id: 'C-001', name: 'Carlos Sanchez Vargas' },
  { id: 'C-002', name: 'Ana Gomez' },
  { id: 'C-003', name: 'Luis Fernandez' },
  { id: 'C-004', name: 'Laura Torres' },
  { id: 'C-005', name: 'Jorge Salas' },
  { id: 'C-006', name: 'Pedro Ramirez' },
  { id: 'C-007', name: 'Sofía Mendoza Rojas' },
  { id: 'C-008', name: 'David Flores' },
  { id: 'C-009', name: 'Rosa Paredes' },
  { id: 'C-010', name: 'Miguel Castro' },
  { id: 'C-011', name: 'Elena Quispe' },
  { id: 'C-012', name: 'Ricardo Solano' },
  { id: 'C-013', name: 'Beatriz Miranda' },
  { id: 'C-014', name: 'Fernando Arias' },
  { id: 'C-015', name: 'Gabriela Soto' },
  { id: 'C-016', name: 'Mateo Castillo' },
  { id: 'C-017', name: 'Valeria Chávez' },
  { id: 'C-018', name: 'Diego Rivera' },
  { id: 'C-019', name: 'Camila Espinoza' },
  { id: 'C-020', name: 'Sebastián Núñez' },
];

export const productCatalogData: ProductCatalogItem[] = [
  { id: 'P-006', description: 'Bolsa de cemento SOL 42.5kg', unitPrice: 30.90, stock: 50, minimumStock: 5 },
  { id: 'P-014', description: 'Ladrillo Techo Hueco 12x30x30 Pirámide', unitPrice: 2.60, stock: 2500, minimumStock: 250 },
  { id: 'P-035', description: 'Bloque de vidrio Cuadriculado 19x19cm', unitPrice: 5.90, stock: 300, minimumStock: 30 },
  { id: 'P-119', description: 'Puerta Decor 40mm 80x207cm', unitPrice: 60.00, stock: 20, minimumStock: 2 },
  { id: 'P-021', description: 'Taladro percutor 1/2" 650W', unitPrice: 100.00, stock: 8, minimumStock: 2 },
  { id: 'P-088', description: 'Pintura satinada galón blanco', unitPrice: 80.00, stock: 40, minimumStock: 4 },
  { id: 'P-089', description: 'Rodillo para pintar 9"', unitPrice: 15.00, stock: 150, minimumStock: 15 },
  { id: 'P-090', description: 'Lija para madera #120', unitPrice: 1.35, stock: 500, minimumStock: 50 },
  { id: 'P-091', description: 'Escalera de aluminio 6 pasos', unitPrice: 180.00, stock: 3, minimumStock: 1 },
  { id: 'P-033', description: 'Cinta aislante negra', unitPrice: 5.00, stock: 200, minimumStock: 20 },
  { id: 'P-045', description: 'Tubo de PVC 1/2" x 3m', unitPrice: 8.50, stock: 120, minimumStock: 12 },
  { id: 'P-046', description: 'Pegamento para PVC 1/4 galón', unitPrice: 49.90, stock: 30, minimumStock: 3 },
  { id: 'P-047', description: 'Codo de PVC 1/2"', unitPrice: 1.20, stock: 1000, minimumStock: 100 },
  { id: 'P-048', description: 'Llave de paso esférica 1/2"', unitPrice: 37.75, stock: 60, minimumStock: 6 },
  { id: 'P-050', description: 'Foco LED 12W luz cálida', unitPrice: 12.50, stock: 300, minimumStock: 30 },
  { id: 'P-051', description: 'Tomacorriente doble', unitPrice: 7.30, stock: 450, minimumStock: 45 },
  { id: 'P-060', description: 'Tornillo autorroscante 1"', unitPrice: 0.21, stock: 10000, minimumStock: 1000 },
  { id: 'P-011', description: 'Caja de tornillos x 500', unitPrice: 40.00, stock: 90, minimumStock: 9 },
  { id: 'P-018', description: 'Destornillador estrella BOSCH', unitPrice: 20.30, stock: 75, minimumStock: 8 },
  { id: 'P-057', description: 'Alicate universal 200mm', unitPrice: 10.50, stock: 80, minimumStock: 8 },
  { id: 'P-068', description: 'Cerradura para dormitorio bronce', unitPrice: 19.90, stock: 55, minimumStock: 6 },
  { id: 'P-070', description: 'Martillo de uña 16oz', unitPrice: 35.00, stock: 40, minimumStock: 4 },
  { id: 'P-071', description: 'Clavos de acero 2"', unitPrice: 11.30, stock: 200, minimumStock: 20 },
  { id: 'P-080', description: 'Brocha 3"', unitPrice: 17.70, stock: 110, minimumStock: 11 },
  { id: 'P-085', description: 'Sierra de mano', unitPrice: 56.80, stock: 25, minimumStock: 3 },
  { id: 'P-150', description: 'Wincha 5m', unitPrice: 25.00, stock: 60, minimumStock: 6 },
  { id: 'P-151', description: 'Guantes de seguridad', unitPrice: 12.00, stock: 0, minimumStock: 5 },
  { id: 'P-152', description: 'Lentes de seguridad', unitPrice: 8.00, stock: 180, minimumStock: 18 },
];

export const returnReasons: string[] = [
  'Producto defectuoso',
  'No cumple con las expectativas',
  'Tamaño/color incorrecto',
  'Recibió producto equivocado',
  'Ya no lo necesita',
  'Otro',
];

export const exchangeReasons: string[] = [
  'Cliente se equivocó de producto',
  'Producto defectuoso',
  'Tamaño/color incorrecto',
  'Prefiere otro modelo',
  'Otro',
];

export const annulmentReasons: string[] = [
  'Error de digitación en el pedido',
  'Cliente desistió de la compra',
  'Falta de stock',
  'Problema con el pago',
  'Otro',
];


// --- MOCK DATA FOR TRANSPORT AVAILABILITY ---

const generateAvailability = (year: number, month: number): Record<string, DayAvailability> => {
  const data: Record<string, DayAvailability> = {};
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayOfWeek = new Date(year, month, day).getDay();
    if (dayOfWeek === 0) continue; // No deliveries on Sundays

    const morningTotal = 3;
    const afternoonTotal = 4;
    const eveningTotal = 2;

    let morningAvailable, afternoonAvailable, eveningAvailable;

    if (dayOfWeek === 6) { // Saturday
        morningAvailable = Math.floor(Math.random() * 2); // 0-1
        afternoonAvailable = Math.floor(Math.random() * 2); // 0-1
        eveningAvailable = 0;
    } else {
        morningAvailable = Math.floor(Math.random() * (morningTotal + 1));
        afternoonAvailable = Math.floor(Math.random() * (afternoonTotal + 1));
        eveningAvailable = Math.floor(Math.random() * (eveningTotal + 1));
    }

    data[dateStr] = {
      morning: { total: morningTotal, available: morningAvailable },
      afternoon: { total: afternoonTotal, available: afternoonAvailable },
      evening: { total: eveningTotal, available: eveningAvailable }
    };
  }
  return data;
}

export const transportAvailabilityData: Record<string, DayAvailability> = {
  ...generateAvailability(2025, 10), // Nov 2025
  ...generateAvailability(2025, 11), // Dec 2025
  ...generateAvailability(2026, 0),  // Jan 2026
};

export const ordersData: Order[] = [
  // --- Batch for 15/10/2025 ---
  {
    code: 'PD001', name: 'Constructora G&M S.A.C.', phone: '987654321',
    products: [
      { id: 1, quantity: 100, name: 'Cemento Sol', unit: 'bolsas', origin: 'Almacen', destination: 'Los Rosales Mz C Lote 24', deliveryDate: '15/10/2025', deliveryTime: '14:00', turno: 'Tarde' },
      { id: 2, quantity: 50, name: 'Cemento Andino', unit: 'bolsas', origin: 'Almacen', destination: 'Los Rosales Mz C Lote 24', deliveryDate: '15/10/2025', turno: 'Tarde' },
      { id: 3, quantity: 40, name: 'Arena Fina', unit: 'm3', origin: 'Almacen', destination: 'Mercado Inkamay', deliveryDate: '15/10/2025', deliveryTime: '09:00', turno: 'Mañana' },
    ]
  },
  {
    code: 'PD002', name: 'Sofía Hernández', phone: '934567890',
    products: [
      { id: 4, quantity: 75, name: 'Tubos PVC 4"', unit: 'unidades', origin: 'Almacen', destination: 'Condominio El Roble', deliveryDate: '15/10/2025', turno: 'Mañana' },
      { id: 5, quantity: 100, name: 'Pegamento PVC', unit: 'latas', origin: 'Almacen', destination: 'Condominio El Roble', deliveryDate: '15/10/2025', turno: 'Mañana' },
    ]
  },
  // --- Batch for 20/10/2025 ---
  {
    code: 'PD003', name: 'Juan Pérez Medina Flores', phone: '956874586',
    products: [
      { id: 6, quantity: 120, name: 'Ladrillo King Kong', unit: 'unidades', origin: 'Almacen', destination: 'Obra Av. El Sol', deliveryDate: '20/10/2025', turno: 'Tarde' },
      { id: 7, quantity: 80, name: 'Bolsa de Cemento', unit: 'bolsas', origin: 'Almacen', destination: 'Obra Av. El Sol', deliveryDate: '20/10/2025', turno: 'Tarde' },
      { id: 8, quantity: 50, name: 'Fierro 1/2"', unit: 'varillas', origin: 'Almacen', destination: 'Obra Av. El Sol', deliveryDate: '20/10/2025', turno: 'Tarde' },
    ]
  },
  {
    code: 'PD004', name: 'Maria Luz Rocio Perez', phone: '926435871',
    products: [
      { id: 9, quantity: 30, name: 'Pintura Látex Blanca', unit: 'galones', origin: 'Tienda Principal', destination: 'Residencial Las Palmeras', deliveryDate: '20/10/2025', turno: 'Noche' },
      { id: 10, quantity: 10, name: 'Brochas de 4"', unit: 'unidades', origin: 'Tienda Principal', destination: 'Residencial Las Palmeras', deliveryDate: '20/10/2025', turno: 'Noche' },
      { id: 11, quantity: 5, name: 'Thinner Acrílico', unit: 'galones', origin: 'Tienda Principal', destination: 'Residencial Las Palmeras', deliveryDate: '20/10/2025', turno: 'Noche' },
    ]
  },
  // --- Batch for 30/10/2025 ---
  {
    code: 'PD005', name: 'Carlos Rodríguez Martínez', phone: '923456789',
    products: [
      { id: 12, quantity: 300, name: 'Ladrillo Pandereta', unit: 'unidades', origin: 'Almacen', destination: 'Edificio Central', deliveryDate: '30/10/2025', turno: 'Mañana' },
      { id: 13, quantity: 150, name: 'Cemento Sol', unit: 'bolsas', origin: 'Almacen', destination: 'Edificio Central', deliveryDate: '30/10/2025', deliveryTime: '11:30', turno: 'Mañana' },
    ]
  },
  {
    code: 'PD006', name: 'Luis Fernando Alsides Jaramillo', phone: '94687136',
    products: [
      { id: 14, quantity: 60, name: 'Alambre N°16', unit: 'rollos', origin: 'Almacen', destination: 'Ferretería Principal', deliveryDate: '30/10/2025', turno: 'Tarde' },
      { id: 15, quantity: 100, name: 'Clavos de 3"', unit: 'kg', origin: 'Almacen', destination: 'Ferretería Principal', deliveryDate: '30/10/2025', turno: 'Tarde' },
      { id: 16, quantity: 20, name: 'Discos de corte', unit: 'unidades', origin: 'Almacen', destination: 'Ferretería Principal', deliveryDate: '30/10/2025', turno: 'Tarde' },
    ]
  },
  // --- Rest of the orders with varied dates ---
  {
    code: 'PD007', name: 'Ana García López', phone: '912345678',
    products: [
      { id: 17, quantity: 120, name: 'Arena Gruesa', unit: 'm3', origin: 'Cantera Norte', destination: 'Proyecto Las Lomas', deliveryDate: '18/10/2025', deliveryTime: '09:30', turno: 'Mañana' },
      { id: 18, quantity: 200, name: 'Piedra Chancada', unit: 'm3', origin: 'Cantera Norte', destination: 'Proyecto Las Lomas', deliveryDate: '18/10/2025', turno: 'Mañana' },
      { id: 19, quantity: 50, name: 'Hormigón', unit: 'm3', origin: 'Cantera Norte', destination: 'Proyecto Las Lomas', deliveryDate: '18/10/2025', turno: 'Mañana' },
    ]
  },
  {
    code: 'PD008', name: 'Inversiones R&G', phone: '945678901',
    products: [
      { id: 20, quantity: 25, name: 'Saco de Yeso', unit: 'bolsas', origin: 'Almacen', destination: 'Remodelación Centro', deliveryDate: '19/10/2025', turno: 'Noche' },
      { id: 21, quantity: 15, name: 'Plancha de Drywall', unit: 'planchas', origin: 'Almacen', destination: 'Remodelación Centro', deliveryDate: '19/10/2025', turno: 'Noche' },
      { id: 22, quantity: 10, name: 'Cinta para Drywall', unit: 'rollos', origin: 'Almacen', destination: 'Remodelación Centro', deliveryDate: '19/10/2025', turno: 'Noche' },
    ]
  },
  {
    code: 'PD009', name: 'David Gómez', phone: '956789012',
    products: [
      { id: 23, quantity: 500, name: 'Teja Andina', unit: 'unidades', origin: 'Fabrica Tejas', destination: 'Residencial Los Pinos', deliveryDate: '01/11/2025', turno: 'Mañana' },
      { id: 24, quantity: 50, name: 'Cumbrera', unit: 'unidades', origin: 'Fabrica Tejas', destination: 'Residencial Los Pinos', deliveryDate: '01/11/2025', turno: 'Mañana' },
      { id: 25, quantity: 20, name: 'Ganchos para Teja', unit: 'cajas', origin: 'Fabrica Tejas', destination: 'Residencial Los Pinos', deliveryDate: '01/11/2025', turno: 'Mañana' },
    ]
  },
  {
    code: 'PD010', name: 'Lucía Fernández', phone: '967890123',
    products: [
      { id: 26, quantity: 10, name: 'Puerta de Madera', unit: 'unidades', origin: 'Carpinteria Don José', destination: 'Casa de Campo', deliveryDate: '05/11/2025', turno: 'Tarde' },
      { id: 27, quantity: 10, name: 'Marco de Puerta', unit: 'unidades', origin: 'Carpinteria Don José', destination: 'Casa de Campo', deliveryDate: '05/11/2025', turno: 'Tarde' },
      { id: 28, quantity: 20, name: 'Bisagras', unit: 'pares', origin: 'Carpinteria Don José', destination: 'Casa de Campo', deliveryDate: '05/11/2025', turno: 'Tarde' },
    ]
  },
  {
    code: 'PD011', name: 'Constructora El Sol', phone: '988776655',
    products: [
      { id: 29, quantity: 150, name: 'Cemento Andino', unit: 'bolsas', origin: 'Almacen', destination: 'Edificio Los Girasoles', deliveryDate: '10/11/2025', turno: 'Noche' },
      { id: 30, quantity: 200, name: 'Arena Fina', unit: 'm3', origin: 'Cantera Norte', destination: 'Edificio Los Girasoles', deliveryDate: '10/11/2025', turno: 'Noche' },
      { id: 31, quantity: 100, name: 'Ladrillo Corriente', unit: 'unidades', origin: 'Almacen', destination: 'Edificio Los Girasoles', deliveryDate: '10/11/2025', turno: 'Noche' },
    ]
  },
  {
    code: 'PD012', name: 'Ricardo Vargas', phone: '977665544',
    products: [
      { id: 32, quantity: 10, name: 'Pintura Látex Blanca', unit: 'galones', origin: 'Tienda Principal', destination: 'Calle Las Begonias 456', deliveryDate: '11/11/2025', turno: 'Mañana' },
      { id: 33, quantity: 5, name: 'Lija de pared', unit: 'pliegos', origin: 'Tienda Principal', destination: 'Calle Las Begonias 456', deliveryDate: '11/11/2025', turno: 'Mañana' },
    ]
  },
  {
    code: 'PD013', name: 'Inmobiliaria Futuro', phone: '966554433',
    products: [
      { id: 34, quantity: 50, name: 'Plancha de Drywall', unit: 'planchas', origin: 'Almacen', destination: 'Condominio El Prado', deliveryDate: '12/11/2025', turno: 'Tarde' },
      { id: 35, quantity: 20, name: 'Masilla para Drywall', unit: 'cajas', origin: 'Almacen', destination: 'Condominio El Prado', deliveryDate: '12/11/2025', turno: 'Tarde' },
      { id: 36, quantity: 30, name: 'Rieles Metálicos', unit: 'unidades', origin: 'Almacen', destination: 'Condominio El Prado', deliveryDate: '12/11/2025', turno: 'Tarde' },
    ]
  },
  {
    code: 'PD014', name: 'Elena Mendoza', phone: '955443322',
    products: [
      { id: 37, quantity: 30, name: 'Mayólica Blanca 30x30', unit: 'cajas', origin: 'Tienda de Acabados', destination: 'Av. Aviación 2310', deliveryDate: '14/11/2025', deliveryTime: '18:00', turno: 'Tarde' },
      { id: 38, quantity: 5, name: 'Crucetas para mayólica', unit: 'bolsas', origin: 'Tienda de Acabados', destination: 'Av. Aviación 2310', deliveryDate: '14/11/2025', turno: 'Tarde' },
      { id: 39, quantity: 10, name: 'Pegamento Blanco', unit: 'bolsas', origin: 'Tienda de Acabados', destination: 'Av. Aviación 2310', deliveryDate: '14/11/2025', turno: 'Tarde' },
    ]
  },
  {
    code: 'PD015', name: 'Comercializadora San Juan', phone: '944332211',
    products: [
      { id: 40, quantity: 50, name: 'Fierro de Construcción 3/8"', unit: 'varillas', origin: 'Almacen', destination: 'Ferretería San Juan', deliveryDate: '15/11/2025', turno: 'Noche' },
      { id: 41, quantity: 10, name: 'Alambre N°8', unit: 'rollos', origin: 'Almacen', destination: 'Ferretería San Juan', deliveryDate: '15/11/2025', turno: 'Noche' },
    ]
  },
  {
    code: 'PD016', name: 'Mario Castillo', phone: '933221100',
    products: [
      { id: 42, quantity: 25, name: 'Tubería de Cobre 1/2"', unit: 'metros', origin: 'Almacen', destination: 'Instalaciones Sanitarias S.A.', deliveryDate: '16/11/2025', turno: 'Mañana' },
      { id: 43, quantity: 50, name: 'Codos de Cobre', unit: 'unidades', origin: 'Almacen', destination: 'Instalaciones Sanitarias S.A.', deliveryDate: '16/11/2025', turno: 'Mañana' },
    ]
  },
  {
    code: 'PD017', name: 'Proyectos Integrales S.A.', phone: '922110099',
    products: [
      { id: 44, quantity: 1000, name: 'Ladrillo King Kong', unit: 'unidades', origin: 'Almacen', destination: 'Centro Comercial El Mirador', deliveryDate: '18/11/2025', turno: 'Tarde' },
      { id: 45, quantity: 500, name: 'Cemento Andino', unit: 'bolsas', origin: 'Almacen', destination: 'Centro Comercial El Mirador', deliveryDate: '18/11/2025', turno: 'Tarde' },
    ]
  },
  {
    code: 'PD018', name: 'Decoraciones Modernas', phone: '911009988',
    products: [
      { id: 46, quantity: 20, name: 'Porcelanato 60x60', unit: 'cajas', origin: 'Tienda de Acabados', destination: 'Showroom Principal', deliveryDate: '20/11/2025', turno: 'Mañana' },
      { id: 47, quantity: 5, name: 'Fragüa', unit: 'bolsas', origin: 'Tienda de Acabados', destination: 'Showroom Principal', deliveryDate: '20/11/2025', turno: 'Mañana' },
    ]
  },
  {
    code: 'PD019', name: 'Ferretería El Progreso', phone: '900998877',
    products: [
      { id: 48, quantity: 150, name: 'Clavos de 4"', unit: 'kg', origin: 'Almacen', destination: 'Ferretería El Progreso', deliveryDate: '21/11/2025', turno: 'Tarde' },
    ]
  },
  {
    code: 'PD020', name: 'Ferreteria Central SAC', phone: '987123456',
    products: [
      { id: 49, quantity: 200, name: 'Bolsa de Cemento', unit: 'bolsas', origin: 'Almacen', destination: 'Av. Los Constructores 123', deliveryDate: '01/11/2025', turno: 'Tarde' },
      { id: 50, quantity: 100, name: 'Fierro 5/8"', unit: 'varillas', origin: 'Almacen', destination: 'Av. Los Constructores 123', deliveryDate: '01/11/2025', turno: 'Tarde' },
    ]
  },
  {
    code: 'PD021', name: 'Constructora Los Andes', phone: '911223344',
    products: [
      { id: 51, quantity: 80, name: 'Tubos PVC 6"', unit: 'unidades', origin: 'Almacen', destination: 'Condominio El Sol', deliveryDate: '01/11/2025', turno: 'Mañana' },
    ]
  },
  {
    code: 'PD022', name: 'Constructora El Roble S.A.C.', phone: '998877665',
    products: [
      { id: 52, quantity: 200, name: 'Bolsa de Cemento', unit: 'bolsas', origin: 'Almacen', destination: 'Obra Residencial El Roble', deliveryDate: '05/11/2025', turno: 'Tarde' },
      { id: 53, quantity: 150, name: 'Arena Gruesa', unit: 'm3', origin: 'Cantera Norte', destination: 'Obra Residencial El Roble', deliveryDate: '05/11/2025', turno: 'Tarde' },
    ]
  }
];

export const dispatchesData: Dispatch[] = [
    {
        id: 'DP001', date: '30/10/2025', startTime: '08:00', endTime: '12:00', status: 'Programado', operator: 'Carlos Sanchez', vehicle: 'ABC-123',
        assistants: ['Ana Torres'],
        stops: [
            { id: 'ST001', origin: 'Almacen', destination: 'Edificio Central', status: 'Pendiente', sequence: 1, clientName: 'Carlos Rodríguez Martínez', products: [{ id: 12, quantity: 300, name: 'Ladrillo Pandereta', unit: 'unidades', origin: 'Almacen', destination: 'Edificio Central', deliveryDate: '30/10/2025', turno: 'Mañana' }] },
            { id: 'ST002', origin: 'Almacen', destination: 'Ferretería Principal', status: 'Pendiente', sequence: 2, clientName: 'Luis Fernando Alsides Jaramillo', products: [{ id: 14, quantity: 60, name: 'Alambre N°16', unit: 'rollos', origin: 'Almacen', destination: 'Ferretería Principal', deliveryDate: '30/10/2025', turno: 'Tarde' }] }
        ]
    },
    {
        id: 'DP002', date: '01/11/2025', startTime: '09:00', endTime: '11:00', status: 'Programado', operator: 'Ana Torres', vehicle: 'XYZ-789',
        assistants: [],
        stops: [
            { id: 'ST003', origin: 'Fabrica Tejas', destination: 'Residencial Los Pinos', status: 'Pendiente', sequence: 1, clientName: 'David Gómez', products: [{ id: 23, quantity: 500, name: 'Teja Andina', unit: 'unidades', origin: 'Fabrica Tejas', destination: 'Residencial Los Pinos', deliveryDate: '01/11/2025', turno: 'Mañana' }, { id: 24, quantity: 50, name: 'Cumbrera', unit: 'unidades', origin: 'Fabrica Tejas', destination: 'Residencial Los Pinos', deliveryDate: '01/11/2025', turno: 'Mañana' }] }
        ]
    },
     {
        id: 'DP003', date: '15/10/2025', startTime: '13:00', endTime: '16:00', status: 'En Ruta', operator: 'Carlos Sanchez', vehicle: 'GHI-789', actualStartTime: '13:10',
        assistants: ['Miguel Castro'],
        stops: [
            { id: 'ST004', origin: 'Almacen', destination: 'Los Rosales Mz C Lote 24', status: 'En Camino', sequence: 1, clientName: 'Constructora G&M S.A.C.', products: [{ id: 1, quantity: 100, name: 'Cemento Sol', unit: 'bolsas', origin: 'Almacen', destination: 'Los Rosales Mz C Lote 24', deliveryDate: '15/10/2025', turno: 'Tarde' }], arrivalTime: '13:45' },
            { id: 'ST005', origin: 'Almacen', destination: 'Mercado Inkamay', status: 'Pendiente', sequence: 2, clientName: 'Constructora G&M S.A.C.', products: [{ id: 3, quantity: 40, name: 'Arena Fina', unit: 'm3', origin: 'Almacen', destination: 'Mercado Inkamay', deliveryDate: '15/10/2025', turno: 'Mañana' }] }
        ]
    },
    {
        id: 'DP004', date: '20/10/2025', startTime: '15:00', endTime: '18:00', status: 'Completado', operator: 'Miguel Castro', vehicle: 'JKL-012', actualStartTime: '15:05', actualEndTime: '17:50',
        assistants: [],
        stops: [
            { id: 'ST006', origin: 'Almacen', destination: 'Obra Av. El Sol', status: 'Entregado', sequence: 1, clientName: 'Juan Pérez Medina Flores', products: [{ id: 6, quantity: 120, name: 'Ladrillo King Kong', unit: 'unidades', origin: 'Almacen', destination: 'Obra Av. El Sol', deliveryDate: '20/10/2025', turno: 'Tarde' }], arrivalTime: '15:40' },
            { id: 'ST007', origin: 'Tienda Principal', destination: 'Residencial Las Palmeras', status: 'Entregado', sequence: 2, clientName: 'Maria Luz Rocio Perez', products: [{ id: 9, quantity: 30, name: 'Pintura Látex Blanca', unit: 'galones', origin: 'Tienda Principal', destination: 'Residencial Las Palmeras', deliveryDate: '20/10/2025', turno: 'Noche' }], arrivalTime: '17:15' }
        ]
    }
];

export const vehiclesData: Vehicle[] = [
  { id: 'V001', placa: 'ABC-123', tipo: 'Camión', marca: 'Volvo', capacidadCarga: 15, volumenCarga: 50, licenciaRequerida: 'A3C', estado: 'Operativo' },
  { id: 'V002', placa: 'DEF-456', tipo: 'Furgoneta', marca: 'Mercedes-Benz', capacidadCarga: 5, volumenCarga: 20, licenciaRequerida: 'A2B', estado: 'Operativo' },
  { id: 'V003', placa: 'GHI-789', tipo: 'Camión', marca: 'Scania', capacidadCarga: 20, volumenCarga: 60, licenciaRequerida: 'A3C', estado: 'En Mantenimiento' },
  { id: 'V004', placa: 'JKL-012', tipo: 'Camioneta', marca: 'Toyota', capacidadCarga: 1.5, volumenCarga: 5, licenciaRequerida: 'A2B', estado: 'Operativo' },
  { id: 'V005', placa: 'MNO-345', tipo: 'Trailer', marca: 'Kenworth', capacidadCarga: 30, volumenCarga: 90, licenciaRequerida: 'A3C', estado: 'Operativo' },
  { id: 'V006', placa: 'PQR-678', tipo: 'Furgoneta', marca: 'Hyundai', capacidadCarga: 3.5, volumenCarga: 15, licenciaRequerida: 'A2B', estado: 'Operativo' },
];

export const employeesData: Employee[] = [
  { id: 'E001', codigo: 'EMP001', nombre: 'Carlos Sanchez', telefono: '987654321', brevete: 'A3C', fechaVencimiento: '2026-05-20', estado: 'Activo' },
  { id: 'E002', codigo: 'EMP002', nombre: 'Ana Torres', telefono: '912345678', brevete: 'A2B', fechaVencimiento: '2025-11-10', estado: 'Activo' },
  { id: 'E003', codigo: 'EMP003', nombre: 'Miguel Castro', telefono: '955555555', brevete: 'A2B', fechaVencimiento: '2027-01-30', estado: 'De Vacaciones' },
  { id: 'E004', codigo: 'EMP004', nombre: 'Lucia Fernandez', telefono: '944444444', brevete: 'A3C', fechaVencimiento: '2025-09-15', estado: 'Con Licencia' },
  { id: 'E005', codigo: 'EMP005', nombre: 'Jorge Mendoza', telefono: '933333333', brevete: 'A3C', fechaVencimiento: '2028-03-22', estado: 'Inactivo' },
];

export const locationsData: Location[] = [
    { name: 'Almacen', stopType: 'Ferreteria' },
    { name: 'Los Rosales Mz C Lote 24', stopType: 'Cliente' },
    { name: 'Mercado Inkamay', stopType: 'Cliente' },
    { name: 'Condominio El Roble', stopType: 'Cliente' },
    { name: 'Obra Av. El Sol', stopType: 'Cliente' },
    { name: 'Tienda Principal', stopType: 'Proveedor' },
    { name: 'Residencial Las Palmeras', stopType: 'Cliente' },
    { name: 'Edificio Central', stopType: 'Cliente' },
    { name: 'Ferretería Principal', stopType: 'Ferreteria' },
    { name: 'Cantera Norte', stopType: 'Proveedor' },
    { name: 'Proyecto Las Lomas', stopType: 'Cliente' },
    { name: 'Remodelación Centro', stopType: 'Cliente' },
    { name: 'Fabrica Tejas', stopType: 'Proveedor' },
    { name: 'Residencial Los Pinos', stopType: 'Cliente' },
    { name: 'Carpinteria Don José', stopType: 'Proveedor' },
    { name: 'Casa de Campo', stopType: 'Cliente' },
    { name: 'Edificio Los Girasoles', stopType: 'Cliente' },
    { name: 'Calle Las Begonias 456', stopType: 'Cliente' },
    { name: 'Condominio El Prado', stopType: 'Cliente' },
    { name: 'Tienda de Acabados', stopType: 'Proveedor' },
    { name: 'Av. Aviación 2310', stopType: 'Cliente' },
    { name: 'Ferretería San Juan', stopType: 'Ferreteria' },
    { name: 'Instalaciones Sanitarias S.A.', stopType: 'Cliente' },
    { name: 'Centro Comercial El Mirador', stopType: 'Cliente' },
    { name: 'Showroom Principal', stopType: 'Cliente' },
    { name: 'Ferretería El Progreso', stopType: 'Ferreteria' },
    { name: 'Av. Los Constructores 123', stopType: 'Cliente' },
    { name: 'Condominio El Sol', stopType: 'Cliente' },
    { name: 'Obra Residencial El Roble', stopType: 'Cliente' },
];

