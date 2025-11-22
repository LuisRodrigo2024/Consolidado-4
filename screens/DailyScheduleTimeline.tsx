import React from 'react';
import { Dispatch } from '../types';

interface DailyScheduleTimelineProps {
    dispatches: Dispatch[];
    onHourClick: (hour: number) => void;
}

const DailyScheduleTimeline: React.FC<DailyScheduleTimelineProps> = ({ dispatches, onHourClick }) => {
    const hours = Array.from({ length: 15 }, (_, i) => i + 7); // 7 AM to 9 PM (slot for 9-10pm is 21)
    
    const getActiveDispatchesCount = (hour: number) => {
        return dispatches.filter(d => {
            if (!d.startTime || !d.endTime) return false;
            const startHour = parseInt(d.startTime.split(':')[0], 10);
            const endHour = parseInt(d.endTime.split(':')[0], 10);
            // Dispatch is active if it starts at or before this hour, and ends after this hour starts.
            return startHour <= hour && endHour > hour;
        }).length;
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6 h-full flex flex-col">
            <h3 className="text-lg font-bold text-blue-800 mb-4 border-b border-slate-200 pb-2">Horario del Día</h3>
            <div className="overflow-y-auto flex-grow -mr-4 pr-4">
                <ul className="space-y-2">
                    {hours.map(hour => {
                        const count = getActiveDispatchesCount(hour);
                        const isClickable = count > 0;
                        return (
                            <li key={hour}>
                                <div
                                    onClick={() => isClickable && onHourClick(hour)}
                                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${isClickable ? 'cursor-pointer hover:bg-blue-50 border-slate-300' : 'bg-slate-50 border-slate-200'}`}
                                    role={isClickable ? 'button' : undefined}
                                >
                                    <span className="font-semibold text-slate-700">
                                        {String(hour).padStart(2, '0')}:00 - {String(hour + 1).padStart(2, '0')}:00
                                    </span>
                                    <span className={`font-bold py-1 px-3 rounded-full text-sm ${
                                        count > 0 ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-600'
                                    }`}>
                                        {count} {count === 1 ? 'despacho' : 'despachos'}
                                    </span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default DailyScheduleTimeline;
