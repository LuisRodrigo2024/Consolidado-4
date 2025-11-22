import React, { useState, useMemo } from 'react';
import { HORARIOS_OCUPADOS, ALMACENES } from '../constants';
import { CloseIcon} from './icons/iconsVentas';
import { CalendarDaysIcon,ChevronLeftIcon, ChevronRightIcon  } from './icons/IconsAbastecimiento';
interface AvailabilitySchedulerProps {
  resourceType: 'Almacén' | 'Transporte';
  onSelectSlot: (date: string, time: string, availableResources: string[]) => void;
  onClose: () => void;
}

const getStartOfWeek = (date: Date) => {
    const newDate = new Date(date);
    const day = newDate.getDay();
    const diff = newDate.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(newDate.setDate(diff));
};


const AvailabilityScheduler: React.FC<AvailabilitySchedulerProps> = ({ resourceType, onSelectSlot, onClose }) => {
  const timeSlots = Array.from({ length: 10 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`); // 8:00 to 17:00

  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));

  const workingDays = useMemo(() => {
    const days: Date[] = [];
    let day = new Date(currentWeekStart);
    while (days.length < 5) {
        days.push(new Date(day));
        day.setDate(day.getDate() + 1);
    }
    return days;
  }, [currentWeekStart]);
  
  const weekTitle = useMemo(() => {
    const start = workingDays[0];
    const end = workingDays[4];
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit' };
    return `Semana del ${start.toLocaleDateString('es-ES', options)} al ${end.toLocaleDateString('es-ES', options)}`;
  }, [workingDays]);


  const busySlots = useMemo(() => {
    if (resourceType === 'Almacén') {
        const map = new Map<string, Set<string>>();
        HORARIOS_OCUPADOS
            .filter(h => h.tipo === 'Almacén' && h.recurso_id)
            .forEach(h => {
                const key = `${h.fecha}_${h.hora}`;
                if (!map.has(key)) map.set(key, new Set());
                map.get(key)!.add(h.recurso_id!);
            });
        return map;
    }
    // For 'Transporte'
    return new Set(
      HORARIOS_OCUPADOS.filter(h => h.tipo === resourceType)
                       .map(h => `${h.fecha}_${h.hora}`)
    );
  }, [resourceType]);

  const formatDateToYYYYMMDD = (date: Date) => date.toISOString().split('T')[0];

  const handleNextWeek = () => {
      setCurrentWeekStart(prev => {
          const next = new Date(prev);
          next.setDate(next.getDate() + 7);
          return next;
      });
  };

  const handlePrevWeek = () => {
      setCurrentWeekStart(prev => {
          const prevDate = new Date(prev);
          prevDate.setDate(prevDate.getDate() - 7);
          return prevDate;
      });
  };

  const isPrevDisabled = useMemo(() => {
    const todayStartOfWeek = getStartOfWeek(new Date());
    return currentWeekStart <= todayStartOfWeek;
  }, [currentWeekStart]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-5xl w-full mx-auto animate-fade-in-down">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <div className="flex items-center gap-3">
            <CalendarDaysIcon className="w-8 h-8 text-sky-700" />
            <h2 className="text-2xl font-bold text-gray-800">
              Horario de Disponibilidad - {resourceType}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
            <CloseIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
            <button onClick={handlePrevWeek} disabled={isPrevDisabled} className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
            </button>
            <h3 className="text-lg font-semibold text-sky-800">{weekTitle}</h3>
            <button onClick={handleNextWeek} className="p-2 rounded-full hover:bg-gray-200">
                <ChevronRightIcon className="w-6 h-6 text-gray-600" />
            </button>
        </div>

        <div className="overflow-x-auto">
          <div className="grid gap-px" style={{ gridTemplateColumns: `6rem repeat(5, 1fr)` }}>
            {/* Time column header */}
            <div className="sticky left-0 bg-white z-10"></div>
            {/* Day headers */}
            {workingDays.map((day, index) => (
              <div key={index} className="text-center font-semibold text-gray-700 py-2">
                <div>{day.toLocaleDateString('es-ES', { weekday: 'long' })}</div>
                <div className="text-sm text-gray-500">{day.toLocaleDateString('es-ES', { day: '2-digit' })}</div>
              </div>
            ))}

            {/* Time slots and grid cells */}
            {timeSlots.map(time => (
              <React.Fragment key={time}>
                <div className="sticky left-0 bg-white text-sm text-gray-600 font-medium flex items-center justify-center pr-2 z-10 border-t border-r border-gray-200">
                  {time}
                </div>
                {workingDays.map(day => {
                  const dateStr = formatDateToYYYYMMDD(day);
                  if (resourceType === 'Almacén') {
                    const busy = (busySlots as Map<string, Set<string>>).get(`${dateStr}_${time}`) || new Set();
                    const available = ALMACENES.filter(wh => !busy.has(wh));
                    const isClickable = available.length > 0;
                    return (
                        <div
                            key={`${dateStr}-${time}`}
                            onClick={() => isClickable && onSelectSlot(dateStr, time, available)}
                            className={`p-2 text-center border-t border-l border-gray-200
                                ${isClickable ? 'cursor-pointer hover:bg-gray-100' : 'bg-gray-50 cursor-not-allowed'}
                            `}
                        >
                            <div className="flex flex-col gap-1">
                                {ALMACENES.map(almacen => {
                                    const isAlmacenBusy = busy.has(almacen);
                                    return (
                                        <div key={almacen} className={`text-xs font-semibold p-1 rounded
                                            ${isAlmacenBusy ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}
                                        `}>
                                            {almacen.replace('Almacén ', 'A')}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    );
                  }
                  
                  // Logic for Transporte
                  const isBusy = (busySlots as Set<string>).has(`${dateStr}_${time}`);
                  return (
                    <div
                      key={`${dateStr}-${time}`}
                      onClick={() => !isBusy && onSelectSlot(dateStr, time, [])}
                      className={`
                        p-4 text-center border-t border-l border-gray-200
                        ${isBusy
                          ? 'bg-red-200 text-red-700 cursor-not-allowed'
                          : 'bg-green-100 text-green-800 cursor-pointer hover:bg-green-300 hover:font-bold'
                        }
                        transition-colors duration-200
                      `}
                    >
                      {isBusy ? 'Ocupado' : 'Disponible'}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
       <style>{`
        @keyframes fade-in-down {
            0% {
                opacity: 0;
                transform: translateY(-20px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .animate-fade-in-down {
            animation: fade-in-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AvailabilityScheduler;
