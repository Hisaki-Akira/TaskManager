import React from 'react';
import { User, Task, UserWorkload } from '../types';
import { TaskBlock } from './TaskBlock';
import { getTaskPosition } from '../utils/workloadUtils';

interface UserRowProps {
  user: User;
  tasks: Task[];
  workload: UserWorkload;
  dates: Date[];
  dayWidth: number;
  onTaskClick: (task: Task) => void;
  onEmptyClick: (userId: string, date: Date) => void;
}

export const UserRow: React.FC<UserRowProps> = ({
  user,
  tasks,
  workload,
  dates,
  dayWidth,
  onTaskClick,
  onEmptyClick
}) => {
  const userTasks = tasks.filter(task => task.userId === user.id);
  
  const getUtilizationColor = (utilization: number): string => {
    if (utilization <= 50) return '#10b981';
    if (utilization <= 80) return '#f59e0b';
    return '#ef4444';
  };

  const sortedTasks = [...userTasks].sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  const taskLanes: Task[][] = [];
  sortedTasks.forEach(task => {
    let placed = false;
    for (let lane of taskLanes) {
      const hasConflict = lane.some(existingTask => {
        return task.startDate <= existingTask.endDate && task.endDate >= existingTask.startDate;
      });
      if (!hasConflict) {
        lane.push(task);
        placed = true;
        break;
      }
    }
    if (!placed) {
      taskLanes.push([task]);
    }
  });

  const rowHeight = Math.max(60, taskLanes.length * 40 + 20);

  return (
    <div style={{
      display: 'flex',
      borderBottom: '1px solid #e5e7eb',
      minHeight: `${rowHeight}px`
    }}>
      <div style={{
        width: '200px',
        minWidth: '200px',
        padding: '12px 16px',
        borderRight: '1px solid #e5e7eb',
        backgroundColor: '#ffffff'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px'
        }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: user.color
            }}
          />
          <span style={{ fontWeight: '600', fontSize: '14px' }}>{user.name}</span>
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>稼働率:</span>
            <span
              style={{
                fontWeight: 'bold',
                color: getUtilizationColor(workload.utilization)
              }}
            >
              {workload.utilization}%
            </span>
            {workload.hasOverlap && <span>⚠️</span>}
          </div>
          <div>タスク数: {workload.taskCount}</div>
        </div>
      </div>
      <div style={{
        flex: 1,
        position: 'relative',
        display: 'flex'
      }}>
        {dates.map((date, index) => (
          <div
            key={index}
            onClick={() => onEmptyClick(user.id, date)}
            style={{
              width: `${dayWidth}px`,
              minWidth: `${dayWidth}px`,
              borderRight: '1px solid #e5e7eb',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          />
        ))}
        {taskLanes.map((lane, laneIndex) => 
          lane.map(task => {
            const position = getTaskPosition(task, dates[0], dayWidth);
            return (
              <TaskBlock
                key={task.id}
                task={task}
                left={position.left}
                width={position.width}
                top={laneIndex * 40 + 10}
                onClick={onTaskClick}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
