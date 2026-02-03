import React from 'react';
import { formatDate, isToday, isWeekend, getWeekday } from '../utils/dateUtils.ts';

interface TimelineHeaderProps {
  dates: Date[];
  dayWidth: number;
}

export const TimelineHeader: React.FC<TimelineHeaderProps> = ({ dates, dayWidth }) => {
  return (
    <div style={{
      display: 'flex',
      position: 'sticky',
      top: 0,
      zIndex: 20,
      backgroundColor: '#111827',
      borderBottom: '2px solid #374151'
    }}>
      <div style={{
        width: '200px',
        minWidth: '200px',
        padding: '12px 16px',
        fontWeight: 'bold',
        color: '#f3f4f6',
        borderRight: '1px solid #374151'
      }}>
        ユーザー
      </div>
      <div style={{ display: 'flex', flex: 1 }}>
        {dates.map((date, index) => {
          const isTodayDate = isToday(date);
          const isWeekendDate = isWeekend(date);
          
          return (
            <div
              key={index}
              style={{
                width: `${dayWidth}px`,
                minWidth: `${dayWidth}px`,
                padding: '12px 4px',
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: isTodayDate ? 'bold' : 'normal',
                color: isTodayDate ? '#fbbf24' : isWeekendDate ? '#9ca3af' : '#f3f4f6',
                backgroundColor: isTodayDate ? '#1f2937' : 'transparent',
                borderRight: '1px solid #374151'
              }}
            >
              <div>{formatDate(date)}</div>
              <div style={{ fontSize: '10px', marginTop: '2px' }}>
                {getWeekday(date)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
