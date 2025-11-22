import React from 'react';
import { Screen } from '../types';
import { EditIcon, ClientsIcon, InventoryIcon, SalesIcon, RequestsIcon, CalendarPlusIcon, PurchaseOrderIcon, ClipboardCheckIcon, ClaimsIcon } from '../components/icons/IconsAbastecimiento';

interface MainMenuProps {
  onNavigate: (screen: Screen) => void;
}

interface MenuCardProps {
    icon: React.ReactNode;
    title: string;
    onClick?: () => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ icon, title, onClick }) => {
    const cursorClass = onClick ? "cursor-pointer" : "";
    const hoverClasses = onClick ? "hover:border-sky-500" : "";
    const borderClass = "border border-gray-300";

    return (
        <div className={`flex flex-col items-center justify-center p-4 ${cursorClass}`} onClick={onClick}>
            <div className={`relative flex items-center justify-center bg-sky-100 p-6 w-48 h-28 rounded-lg ${borderClass} ${hoverClasses} transition-colors duration-200`}>
                <div className="w-16 h-16 text-sky-700">
                    {icon}
                </div>
                <div className="absolute top-2 right-2 bg-sky-200 p-1 rounded">
                    <EditIcon className="w-5 h-5 text-gray-700"/>
                </div>
            </div>
            <h3 className="mt-2 text-lg font-bold text-gray-800">{title}</h3>
        </div>
    );
};

const MainMenu: React.FC<MainMenuProps> = ({ onNavigate }) => {
  const menuItems = [
    { id: 1, title: 'Proveedores', icon: <ClientsIcon className="w-full h-full" />, screen: Screen.ProvidersList },
    { id: 2, title: 'Productos', icon: <InventoryIcon className="w-full h-full" />, screen: Screen.ProductsList },
    { id: 3, title: 'Pedidos', icon: <RequestsIcon className="w-full h-full" />, screen: Screen.PedidosList },
    { id: 4, title: 'Cotizaciones', icon: <SalesIcon className="w-full h-full" />, screen: Screen.SolicitudesList },
    { id: 5, title: 'Órdenes de Compra', icon: <PurchaseOrderIcon className="w-full h-full" />, screen: Screen.OrdersList },
    { id: 6, title: 'Programar Recepción', icon: <CalendarPlusIcon className="w-full h-full" />, screen: Screen.ScheduleReceptionsList },
    { id: 7, title: 'Validar Guía de Remisión', icon: <ClipboardCheckIcon className="w-full h-full" />, screen: Screen.RemissionGuideList },
    { id: 8, title: 'Incidencias', icon: <ClaimsIcon className="w-full h-full" />, screen: Screen.IncidentsList },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
      {menuItems.map((item) => (
        <MenuCard
          key={item.id}
          title={item.title}
          icon={item.icon}
          onClick={item.screen ? () => onNavigate(item.screen as Screen) : undefined}
        />
      ))}
    </div>
  );
};

export default MainMenu;