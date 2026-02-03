import { Task, UserWorkload } from '../types';
import { getDaysBetween } from './dateUtils';

export const calculateWorkload = (
  userId: string,
  tasks: Task[],
  startDate: Date,
  endDate: Date
): UserWorkload => {
  const userTasks = tasks.filter(task => task.userId === userId);
  
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  const rangeStart = formatDate(startDate);
  const rangeEnd = formatDate(endDate);
  const totalDays = getDaysBetween(rangeStart, rangeEnd);
  
  if (totalDays === 0) {
    return {
      userId,
      utilization: 0,
      taskCount: userTasks.length,
      hasOverlap: detectOverlap(userTasks)
    };
  }
  
  let workDays = 0;
  const hasOverlap = detectOverlap(userTasks);
  
  userTasks.forEach(task => {
    const taskStart = task.startDate > rangeStart ? task.startDate : rangeStart;
    const taskEnd = task.endDate < rangeEnd ? task.endDate : rangeEnd;
    
    if (taskStart <= taskEnd) {
      workDays += getDaysBetween(taskStart, taskEnd);
    }
  });
  
  const utilization = Math.min(100, Math.round((workDays / totalDays) * 100));
  
  return {
    userId,
    utilization,
    taskCount: userTasks.length,
    hasOverlap
  };
};

export const detectOverlap = (tasks: Task[]): boolean => {
  for (let i = 0; i < tasks.length; i++) {
    for (let j = i + 1; j < tasks.length; j++) {
      const task1 = tasks[i];
      const task2 = tasks[j];
      
      if (
        (task1.startDate <= task2.endDate && task1.endDate >= task2.startDate)
      ) {
        return true;
      }
    }
  }
  return false;
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const getTaskPosition = (
  task: Task,
  startDate: Date,
  dayWidth: number
): { left: number; width: number } => {
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  const timelineStart = formatDate(startDate);
  const taskStartDate = new Date(task.startDate);
  const taskEndDate = new Date(task.endDate);
  const timelineStartDate = new Date(timelineStart);
  
  const daysFromStart = Math.max(0, Math.floor((taskStartDate.getTime() - timelineStartDate.getTime()) / MS_PER_DAY));
  const taskDuration = getDaysBetween(task.startDate, task.endDate);
  
  return {
    left: daysFromStart * dayWidth,
    width: taskDuration * dayWidth
  };
};
