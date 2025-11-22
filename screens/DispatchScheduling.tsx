
import React, { useState, useMemo } from 'react';
import { ScheduleDispatchIcon } from '../components/icons/IconsTransporte';
import { ProductDetail } from '../types';
import PageHeader from './PageHeader';
import { ArrowLeftIcon } from '../components/icons/IconsTransporte';
import DailyStopsModal from './DailyStopsModal';

interface DispatchSchedulingProps {
  unassignedProducts: ProductDetail[];
  onConfirm: (date: string) => void;
  onBack: () => void;
  onGoHome: () => void;
}

interface CalendarProps {
  pendingOrdersByDate: { [key: string]: number };
  onDayClick: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ pendingOrdersByDate, onDayClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = new Date(year, month, day);
    date.setHours(0,0,0,0);
    const dateString = date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    
    return {
      day,
      dateString,
      isToday: date.getTime() === today.getTime(),
      pendingOrders: pendingOrdersByDate[dateString] || 0,
    };
  });
  
  const leadingEmptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => (
    <div key={`empty-start-${i}`} className="h-24"></div>
  ));

  const dayOfWeekLabels = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];

  return (
    <div className="bg-white rounded-xl shadow-md flex flex-col h-full">
      <div className="p-4 flex justify-between items-center border-b border-slate-200">
        <h2 className="text-lg font-bold text-blue-800 capitalize">
          {new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(currentDate)}
        </h2>
        <div className="flex items-center space-x-2">
          <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800" aria-label="Mes anterior">
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800" aria-label="Mes siguiente">
            <ArrowLeftIcon className="h-5 w-5 rotate-180" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 p-2 flex-grow">
        {dayOfWeekLabels.map(label => (
          <div key={label} className="text-center text-xs font-bold text-slate-500 uppercase py-2">
            {label}
          </div>
        ))}
        {leadingEmptyDays}
        {days.map(({ day, dateString, isToday, pendingOrders }) => (
          <div 
            key={day} 
            className={`h-24 p-1 flex flex-col text-sm border-t border-l border-slate-100 transition-colors ${pendingOrders > 0 ? 'cursor-pointer hover:bg-blue-50' : ''}`}
            onClick={() => onDayClick(dateString)}
            role={pendingOrders > 0 ? "button" : undefined}
            tabIndex={pendingOrders > 0 ? 0 : -1}
            onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') onDayClick(dateString); }}
            aria-label={pendingOrders > 0 ? `${pendingOrders} pedidos pendientes para el ${day}` : `Día ${day}`}
          >
            <span className={`font-semibold ${isToday ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : 'text-slate-700'}`}>
              {day}
            </span>
            {pendingOrders > 0 && (
              <div className="mt-auto bg-blue-100 text-blue-800 text-xs font-bold p-1 rounded-md text-center">
                {pendingOrders} Pedido{pendingOrders > 1 ? 's' : ''}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const DispatchScheduling: React.FC<DispatchSchedulingProps> = ({ unassignedProducts, onBack, onConfirm, onGoHome }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  const todayISO = today.toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [modalDate, setModalDate] = useState<string | null>(null);

  const pendingOrdersByDate = useMemo(() => {
    const ordersMap = new Map<string, Set<string>>(); // date -> Set<orderCode>
    unassignedProducts.forEach(product => {
      const date = product.deliveryDate;
      if (!ordersMap.has(date)) {
        ordersMap.set(date, new Set());
      }
      ordersMap.get(date)!.add(product.orderCode);
    });

    const finalCounts: { [key: string]: number } = {};
    ordersMap.forEach((orders, date) => {
      finalCounts[date] = orders.size;
    });

    return finalCounts;
  }, [unassignedProducts]);

  const stopsByDate = useMemo(() => {
      const stopsByDateMap = new Map<string, Map<string, { origin: string; destination: string }>>();
      unassignedProducts.forEach(product => {
        const date = product.deliveryDate;
        if (!stopsByDateMap.has(date)) {
          stopsByDateMap.set(date, new Map());
        }
        const stopId = `${product.origin}|${product.destination}`;
        if (!stopsByDateMap.get(date)!.has(stopId)) {
          stopsByDateMap.get(date)!.set(stopId, { origin: product.origin, destination: product.destination });
        }
      });

      const finalStops: { [key: string]: { origin: string; destination: string }[] } = {};
      stopsByDateMap.forEach((stopsMap, date) => {
          finalStops[date] = Array.from(stopsMap.values());
      });

      return finalStops;
  }, [unassignedProducts]);

  const handleDayClick = (date: string) => {
    if (pendingOrdersByDate[date] > 0) {
      setModalDate(date);
    }
  };

  return (
    <>
      <main className="flex-1 p-6 md:p-10 flex flex-col" aria-labelledby="page-title">
        <PageHeader
          title="Programar Despachos"
          icon={<ScheduleDispatchIcon className="h-8 w-8 text-blue-600" />}
          onBack={onBack}
        />

        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="w-full max-w-md mx-auto flex flex-col items-center text-center">
            <h2 className="text-xl font-bold text-blue-800 mb-2">Seleccionar Fecha</h2>
            <p className="text-slate-600 mb-6">Elija la fecha para la cual desea programar un nuevo despacho.</p>
            <label htmlFor="dispatch-date" className="text-lg font-bold text-slate-700 mb-2">Fecha de Despacho:</label>
            <input
              id="dispatch-date"
              type="date"
              value={selectedDate}
              min={todayISO}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-slate-300 bg-white h-12 px-4 rounded-lg text-lg text-black font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 w-full shadow-sm mb-8"
            />
            <button
              onClick={() => onConfirm(selectedDate)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 w-full rounded-lg transition-colors duration-200 text-base shadow-md hover:shadow-lg">
              Confirmar y Seleccionar Pedidos
            </button>
          </div>
        </div>
        
        <div className="flex-grow">
          <Calendar pendingOrdersByDate={pendingOrdersByDate} onDayClick={handleDayClick} />
        </div>
      </main>
      
      {modalDate && (
        <DailyStopsModal
          date={modalDate}
          stops={stopsByDate[modalDate] || []}
          onClose={() => setModalDate(null)}
        />
      )}
    </>
  );
};

export default DispatchScheduling;
