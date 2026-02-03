import React, { useState } from 'react';
import { Task } from '../types.ts';

interface TaskBlockProps {
  task: Task;
  left: number;
  width: number;
  top: number;
  onClick: (task: Task) => void;
}

export const TaskBlock: React.FC<TaskBlockProps> = ({ task, left, width, top, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div
        onClick={() => onClick(task)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'absolute',
          left: `${left}px`,
          top: `${top}px`,
          width: `${width - 4}px`,
          height: '32px',
          backgroundColor: task.color || '#3b82f6',
          borderRadius: '4px',
          padding: '4px 8px',
          cursor: 'pointer',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          fontSize: '12px',
          color: 'white',
          fontWeight: '500',
          boxShadow: isHovered ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.2)',
          transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
          transition: 'all 0.2s ease',
          zIndex: isHovered ? 15 : 10
        }}
      >
        {task.title}
      </div>
      {isHovered && (
        <div
          style={{
            position: 'fixed',
            left: `${left + 10}px`,
            top: `${top + 40}px`,
            backgroundColor: '#1f2937',
            color: '#f3f4f6',
            padding: '8px 12px',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
            zIndex: 50,
            fontSize: '12px',
            pointerEvents: 'none',
            maxWidth: '250px'
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{task.title}</div>
          <div>開始: {task.startDate}</div>
          <div>終了: {task.endDate}</div>
        </div>
      )}
    </>
  );
};
