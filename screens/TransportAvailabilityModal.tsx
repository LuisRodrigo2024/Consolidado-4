import React, { useState, useMemo } from 'react';
import { transportAvailabilityData } from '../constants';
import { DayAvailability } from '../types';
import {CloseIcon} from '../components/icons/iconsVentas';
import {ChevronDownIcon} from '../components/icons/iconsVentas';
import {ChevronUpIcon} from '../components/icons/iconsVentas';

interface TransportAvailabilityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectDate: (date: string) => void;
}

const MONTH_NAMES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const WEEK_DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const TransportAvailabilityModal: React.FC<TransportAvailabilityModalProps> = ({ isOpen, onClose, onSelectDate }) => {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1)); // Default to Nov 2025
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const { daysInMonth, startDayOfMonth, today } = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        return {
            daysInMonth: new Date(year, month + 1, 0).getDate(),
            startDayOfMonth: new Date(year, month, 1).getDay(),
            today: new Date()
        };
    }, [currentDate]);
    
    const getAvailabilityLevel = (day: DayAvailability | undefined) => {
        if (!day) return 'none';
        const totalAvailable = day.morning.available + day.afternoon.available + day.evening.available;
        const totalSlots = day.morning.total + day.afternoon.total + day.evening.total;
        const percentage = totalAvailable / totalSlots;

        if (totalAvailable === 0) return 'none';
        if (percentage > 0.5) return 'high';
        if (percentage > 0.1) return 'medium';
        return 'low';
    };

    const handleDateClick = (day: number) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(date);
    };
    
    const handleSelectClick = () => {
        if (selectedDate) {
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            onSelectDate(`${year}-${month}-${day}`);
        }
    };
    
    const changeMonth = (delta: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
        setSelectedDate(null);
    };

    const selectedDayInfo = useMemo(() => {
        if (!selectedDate) return null;
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        return transportAvailabilityData[`${year}-${month}-${day}`];
    }, [selectedDate]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in" role="dialog" aria-modal="true">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl animate-fade-in-up flex">
                {/* Calendar Side */}
                <div className="w-1/2 p-6 border-r">
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100">&lt;</button>
                        <h3 className="text-lg font-bold text-gray-800">{`${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`}</h3>
                        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100">&gt;</button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 mb-2">
                        {WEEK_DAYS.map(day => <div key={day}>{day}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: startDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
                        {Array.from({ length: daysInMonth }).map((_, day) => {
                            const dayNumber = day + 1;
                            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
                            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
                            const availability = transportAvailabilityData[dateStr];
                            const level = getAvailabilityLevel(availability);
                            
                            const isSelected = selectedDate?.toDateString() === date.toDateString();
                            const isPast = date < today && date.toDateString() !== today.toDateString();
                            const isDisabled = isPast || level === 'none';

                            let levelClass = '';
                            if (!isDisabled) {
                                switch (level) {
                                    case 'high': levelClass = 'bg-green-100 text-green-800 hover:bg-green-200'; break;
                                    case 'medium': levelClass = 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'; break;
                                    case 'low': levelClass = 'bg-red-100 text-red-800 hover:bg-red-200'; break;
                                }
                            }

                            return (
                                <button
                                    key={dayNumber}
                                    onClick={() => handleDateClick(dayNumber)}
                                    disabled={isDisabled}
                                    className={`h-10 w-10 rounded-full text-sm font-semibold transition-colors ${
                                        isDisabled ? 'text-gray-300 cursor-not-allowed' : levelClass
                                    } ${isSelected ? '!bg-blue-600 text-white' : ''}`}
                                >
                                    {dayNumber}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Details Side */}
                <div className="w-1/2 p-6 flex flex-col">
                     <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Disponibilidad de Transporte</h2>
                             <div className="flex items-center space-x-4 my-4 text-xs">
                                <span className="font-semibold">Leyenda:</span>
                                <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-green-200 mr-1.5"></span>Alta</span>
                                <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-yellow-200 mr-1.5"></span>Media</span>
                                <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-200 mr-1.5"></span>Baja</span>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseIcon /></button>
                    </div>

                    <div className="flex-grow bg-gray-50 p-4 rounded-lg mt-2">
                        {selectedDate ? (
                            <div>
                                <h4 className="font-bold text-gray-700 mb-4">
                                    {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </h4>
                                {selectedDayInfo ? (
                                    <div className="space-y-3">
                                        <SlotInfo slot="Mañana" details={selectedDayInfo.morning} />
                                        <SlotInfo slot="Tarde" details={selectedDayInfo.afternoon} />
                                        <SlotInfo slot="Noche" details={selectedDayInfo.evening} />
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 pt-8">No hay despachos programados para este día.</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 pt-8">Seleccione una fecha del calendario para ver los detalles de disponibilidad.</p>
                        )}
                    </div>
                     <div className="flex justify-end space-x-4 mt-6">
                        <button onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button 
                            onClick={handleSelectClick}
                            disabled={!selectedDate || !selectedDayInfo || getAvailabilityLevel(selectedDayInfo) === 'none'}
                            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Seleccionar Fecha
                        </button>
                    </div>
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
             `}</style>
        </div>
    );
};

const SlotInfo: React.FC<{ slot: string; details: { total: number; available: number } }> = ({ slot, details }) => {
    const percentage = details.total > 0 ? (details.available / details.total) * 100 : 0;
    
    let barColor = 'bg-gray-300';
    if (details.available > 0) {
        if (percentage > 50) barColor = 'bg-green-500';
        else if (percentage > 20) barColor = 'bg-yellow-500';
        else barColor = 'bg-red-500';
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-1 text-sm">
                <span className="font-semibold text-gray-600">{slot}</span>
                <span className="text-gray-500">{details.available} de {details.total} cupos</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2.5">
                <div className={`${barColor} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

export default TransportAvailabilityModal;
