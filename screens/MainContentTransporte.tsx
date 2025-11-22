



import React from 'react';
import DashboardCard from './DashboardCard';
import TransportOrders from './TransportOrders';
import TransportOrderDetail from './TransportOrderDetail';
import DispatchScheduling from './DispatchScheduling';
import DispatchOrderSelection from './DispatchOrderSelection';
import DispatchTrackingList from './DispatchTrackingList';
import DispatchStopDetail from './DispatchStopDetail';
import StopProductDetail from './StopProductDetail';
import VehiclesList from './VehiclesList'; 
import EmployeesList from './EmployeesList';
import PermissionsList from './PermissionsList';
import CurrentState from './CurrentState';
import MonthlyReport from './MonthlyReport';
import { TransportOrderIcon } from '../components/icons/IconsTransporte';
import { ScheduleDispatchIcon } from '../components/icons/IconsTransporte';
import { DispatchTrackingIcon } from '../components/icons/IconsTransporte';
import { TruckIcon } from '../components/icons/IconsTransporte';
import { UserGroupIcon } from '../components/icons/IconsTransporte';
import { DocumentReportIcon } from '../components/icons/IconsTransporte';
import { ChartBarIcon } from '../components/icons/IconsTransporte';
import { PermissionIcon } from '../components/icons/IconsTransporte';
import { Order, View, ProductTransporte, Dispatch, Stop, ProductDetail, Vehicle, Employee, DeletedOrder, Permission, PermissionStatus, Location } from '../types';

interface MainContentProps {
  view: View;
  orders: Order[];
  dispatches: Dispatch[];
  vehicles: Vehicle[];
  employees: Employee[];
  permissions: Permission[];
  locations: Location[];
  deletedOrders: DeletedOrder[];
  selectedOrder: Order | null;
  selectedDispatch: Dispatch | null;
  selectedStop: Stop | null;
  dispatchDate: string;
  nextDispatchCode: string;
  nextEmployeeCode: string;
  onNavigate: (view: View) => void;
  onViewOrder: (order: Order) => void;
  onBackToOrders: () => void;
  onGoHome: () => void;
  onConfirmDispatchDate: (date: string) => void;
  onBackToDispatchScheduling: () => void;
  onCreateDispatch: (details: {
    products: ProductTransporte[];
    sequences: { [key: string]: string };
    operator: string;
    vehicle: string;
    startTime: string;
    endTime: string;
    assistants: string[];
  }) => void;
  onViewDispatchStops: (dispatch: Dispatch) => void;
  onViewStopProducts: (stop: Stop) => void;
  onBackToDispatchList: () => void;
  onBackToDispatchStops: () => void;
  onUpdateStopStatuses: (dispatchId: string, updatedStatuses: { [stopId: string]: 'Pendiente' | 'Picking' | 'En Ruta' | 'En Camino' | 'Entregado' }, arrivalTimes: { [stopId: string]: string }) => void;
  onUpdateDispatchTimes: (dispatchId: string, startTime: string, endTime: string) => void;
  onCancelOrderItems: (orderCode: string, productIds: number[], reason: string) => void;
  onRescheduleOrder: (orderCode: string, updates: { productId: number, newDate: string, newDestination: string }[]) => void;
  onAddVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  onUpdateVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (placa: string) => void;
  onAddEmployee: (employee: Omit<Employee, 'id'>) => void;
  onUpdateEmployee: (employee: Employee) => void;
  onUpdatePermission: (permissionId: string, newStatus: PermissionStatus, reason: string) => void;
  onSetDispatchToPicking: (dispatchId: string) => void;
  onUpdateDispatch: (dispatchId: string, vehicle: string, operator: string) => void;
  onDeleteDispatch: (dispatchId: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({ 
  view, 
  orders,
  dispatches,
  vehicles,
  employees,
  permissions,
  locations,
  deletedOrders,
  selectedOrder, 
  selectedDispatch,
  selectedStop,
  dispatchDate,
  nextDispatchCode,
  nextEmployeeCode,
  onNavigate,
  onViewOrder,
  onBackToOrders,
  onGoHome,
  onConfirmDispatchDate,
  onBackToDispatchScheduling,
  onCreateDispatch,
  onViewDispatchStops,
  onViewStopProducts,
  onBackToDispatchList,
  onBackToDispatchStops,
  onUpdateStopStatuses,
  onUpdateDispatchTimes,
  onCancelOrderItems,
  onRescheduleOrder,
  onAddVehicle,
  onUpdateVehicle,
  onDeleteVehicle,
  onAddEmployee,
  onUpdateEmployee,
  onUpdatePermission,
  onSetDispatchToPicking,
  onUpdateDispatch,
  onDeleteDispatch,
}) => {
  
  const handleGoToDispatchScheduling = () => {
    onNavigate('dispatchScheduling');
  };

  const scheduledProductIds = dispatches.flatMap(d => d.stops.flatMap(s => s.products.map(p => p.id)));
  
  // Simple list for components that don't need enriched data
  const unassignedProducts = orders.flatMap(order => order.products).filter(p => !scheduledProductIds.includes(p.id));

  // Enriched list for components that need more context (like DispatchOrderSelection)
  const unassignedProductDetails: ProductDetail[] = orders.flatMap(order => 
    order.products
        .map((product, index): ProductDetail => ({
            ...product,
            clientName: order.name,
            orderCode: order.code,
            originalIndex: index
        }))
        .filter(product => !scheduledProductIds.includes(product.id))
  );

  // --- View Rendering Logic ---

  if (view === 'monthlyReport') {
    return <MonthlyReport
              orders={orders}
              dispatches={dispatches}
              deletedOrders={deletedOrders}
              onBack={onGoHome}
            />;
  }

  if (view === 'currentState') {
    return <CurrentState 
              orders={orders}
              dispatches={dispatches}
              deletedOrders={deletedOrders}
              onBack={onGoHome}
            />;
  }

  if (view === 'vehicles') {
    return <VehiclesList 
              vehicles={vehicles} 
              onBack={onGoHome}
              onAddVehicle={onAddVehicle}
              onUpdateVehicle={onUpdateVehicle}
              onDeleteVehicle={onDeleteVehicle}
            />;
  }
  
  if (view === 'employees') {
    return <EmployeesList 
              employees={employees} 
              onBack={onGoHome}
              onAddEmployee={onAddEmployee}
              onUpdateEmployee={onUpdateEmployee}
              nextEmployeeCode={nextEmployeeCode}
            />;
  }

  if (view === 'permissions') {
    return <PermissionsList
              permissions={permissions}
              employees={employees}
              vehicles={vehicles}
              onUpdatePermission={onUpdatePermission}
              onBack={onGoHome}
            />;
  }

  if (view === 'transportOrders') {
    return <TransportOrders 
              orders={orders}
              dispatches={dispatches}
              onViewOrder={onViewOrder} 
              onGoHome={onGoHome}
            />;
  }

  if (view === 'transportOrderDetail' && selectedOrder) {
    return <TransportOrderDetail 
              order={selectedOrder}
              dispatches={dispatches}
              deletedOrders={deletedOrders}
              onBack={onBackToOrders} 
              onCancelOrderItems={onCancelOrderItems}
              onRescheduleOrder={onRescheduleOrder}
            />;
  }

  if (view === 'dispatchScheduling') {
    return <DispatchScheduling 
              unassignedProducts={unassignedProductDetails}
              onConfirm={onConfirmDispatchDate} 
              onBack={onBackToOrders} 
              onGoHome={onGoHome} 
            />;
  }

  if (view === 'dispatchOrderSelection') {
    return <DispatchOrderSelection 
              date={dispatchDate} 
              unassignedProducts={unassignedProductDetails}
              vehicles={vehicles}
              employees={employees}
              permissions={permissions}
              locations={locations}
              onBack={onBackToDispatchScheduling} 
              onGoHome={onGoHome}
              onCreateDispatch={onCreateDispatch} 
              nextDispatchCode={nextDispatchCode}
            />;
  }
  
  if (view === 'dispatchTrackingList') {
    return <DispatchTrackingList 
              dispatches={dispatches}
              vehicles={vehicles}
              employees={employees}
              permissions={permissions}
              onViewDetails={onViewDispatchStops}
              onBack={onGoHome}
              onUpdateDispatch={onUpdateDispatch}
              onDeleteDispatch={onDeleteDispatch}
            />
  }
  
  if (view === 'dispatchStopDetail' && selectedDispatch) {
    return <DispatchStopDetail 
              dispatch={selectedDispatch}
              onViewStopDetails={onViewStopProducts}
              onBack={onBackToDispatchList}
              onUpdateStopStatuses={onUpdateStopStatuses}
              onUpdateDispatchTimes={onUpdateDispatchTimes}
              onSetDispatchToPicking={onSetDispatchToPicking}
            />
  }

  if (view === 'stopProductDetail' && selectedStop) {
    return <StopProductDetail 
              stop={selectedStop}
              orders={orders}
              onBack={onBackToDispatchStops}
            />
  }

  // Default to dashboard view
  return (
    <main className="flex-1 p-6 md:p-10">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Panel de Control Principal</h1>

        {/* Gestion de Recursos Section */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-slate-700 mb-4 pb-2 border-b border-slate-200">Gestion de Recursos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <DashboardCard
              label="Vehiculos"
              icon={<TruckIcon />}
              colorClassName="bg-violet-100 text-violet-800"
              onClick={() => onNavigate('vehicles')}
            />
            <DashboardCard
              label="Empleados"
              icon={<UserGroupIcon />}
              colorClassName="bg-violet-100 text-violet-800"
              onClick={() => onNavigate('employees')}
            />
            <DashboardCard
              label="Permisos"
              icon={<PermissionIcon />}
              colorClassName="bg-violet-100 text-violet-800"
              onClick={() => onNavigate('permissions')}
            />
          </div>
        </section>

        {/* Proceso de Transporte Section */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-slate-700 mb-4 pb-2 border-b border-slate-200">Proceso de Transporte</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <DashboardCard
              label="Pedidos de Transporte"
              icon={<TransportOrderIcon />}
              colorClassName="bg-sky-100 text-sky-800"
              onClick={() => onNavigate('transportOrders')}
            />
            <DashboardCard
              label="Programar Despachos"
              icon={<ScheduleDispatchIcon />}
              colorClassName="bg-sky-100 text-sky-800"
              onClick={handleGoToDispatchScheduling}
            />
            <DashboardCard
              label="Seguimiento de Despachos"
              icon={<DispatchTrackingIcon />}
              colorClassName="bg-sky-100 text-sky-800"
              onClick={() => onNavigate('dispatchTrackingList')}
            />
          </div>
        </section>

        {/* Reporte Section */}
        <section>
          <h2 className="text-xl font-semibold text-slate-700 mb-4 pb-2 border-b border-slate-200">Reporte</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <DashboardCard
              label="Vista General"
              icon={<DocumentReportIcon />}
              colorClassName="bg-emerald-100 text-emerald-800"
              onClick={() => onNavigate('monthlyReport')}
            />
            <DashboardCard
              label="Estado Actual"
              icon={<ChartBarIcon />}
              colorClassName="bg-emerald-100 text-emerald-800"
              onClick={() => onNavigate('currentState')}
            />
          </div>
        </section>
      </div>
    </main>
  );
};

export default MainContent;