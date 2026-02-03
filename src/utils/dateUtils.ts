export const getDateRange = (startDate: Date, days: number): Date[] => {
  const dates: Date[] = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(date);
  }
  return dates;
};

export const formatDate = (date: Date, format: 'short' | 'long' = 'short'): string => {
  if (format === 'long') {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const getDaysBetween = (start: string, end: string): number => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = endDate.getTime() - startDate.getTime();
  return Math.ceil(diffTime / MS_PER_DAY) + 1;
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.getFullYear() === today.getFullYear() &&
         date.getMonth() === today.getMonth() &&
         date.getDate() === today.getDate();
};

export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

export const getWeekday = (date: Date): string => {
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  return weekdays[date.getDay()];
};
