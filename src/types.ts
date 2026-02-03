export interface User {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  userId: string;
  startDate: string;  // YYYY-MM-DD
  endDate: string;
  color?: string;
}

export interface UserWorkload {
  userId: string;
  utilization: number;
  taskCount: number;
  hasOverlap: boolean;
}

export type ViewMode = 'week' | 'month' | 'quarter';
