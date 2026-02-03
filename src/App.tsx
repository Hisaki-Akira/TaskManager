import React, { useState } from 'react';
import { Task, ViewMode } from './types';
import { users as initialUsers, tasks as initialTasks } from './mockData';
import { TimelineHeader } from './components/TimelineHeader';
import { UserRow } from './components/UserRow';
import { AddTaskModal } from './components/AddTaskModal';
import { getDateRange, formatDate } from './utils/dateUtils';
import { calculateWorkload } from './utils/workloadUtils';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prefillUserId, setPrefillUserId] = useState<string | undefined>();
  const [prefillDate, setPrefillDate] = useState<Date | undefined>();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const getViewDays = (): number => {
    switch (viewMode) {
      case 'week': return 14;
      case 'month': return 30;
      case 'quarter': return 90;
      default: return 14;
    }
  };

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 3);
  
  const dates = getDateRange(startDate, getViewDays());
  const dayWidth = 60;

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const id = tasks.length === 0 ? '1' : (Math.max(...tasks.map(t => parseInt(t.id) || 0)) + 1).toString();
    setTasks([...tasks, { ...newTask, id }]);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleEmptyClick = (userId: string, date: Date) => {
    setPrefillUserId(userId);
    setPrefillDate(date);
    setIsModalOpen(true);
  };

  const handleDeleteTask = () => {
    if (selectedTask) {
      setTasks(tasks.filter(t => t.id !== selectedTask.id));
      setSelectedTask(null);
    }
  };

  const handleCloseTaskDetail = () => {
    setSelectedTask(null);
  };

  const endDate = dates[dates.length - 1];

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <div style={{
        backgroundColor: '#111827',
        color: 'white',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '2px solid #374151'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          リソーススケジューラー
        </h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '4px', backgroundColor: '#1f2937', borderRadius: '6px', padding: '4px' }}>
            {(['week', 'month', 'quarter'] as ViewMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  padding: '6px 12px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: viewMode === mode ? '#3b82f6' : 'transparent',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
              >
                {mode === 'week' ? '2週間' : mode === 'month' ? '1ヶ月' : '3ヶ月'}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              setPrefillUserId(undefined);
              setPrefillDate(undefined);
              setIsModalOpen(true);
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#3b82f6',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6';
            }}
          >
            + タスク追加
          </button>
        </div>
      </div>

      <div style={{
        flex: 1,
        overflow: 'auto',
        backgroundColor: '#f9fafb'
      }}>
        <TimelineHeader dates={dates} dayWidth={dayWidth} />
        {initialUsers.map(user => {
          const workload = calculateWorkload(user.id, tasks, startDate, endDate);
          return (
            <UserRow
              key={user.id}
              user={user}
              tasks={tasks}
              workload={workload}
              dates={dates}
              dayWidth={dayWidth}
              onTaskClick={handleTaskClick}
              onEmptyClick={handleEmptyClick}
            />
          );
        })}
      </div>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPrefillUserId(undefined);
          setPrefillDate(undefined);
        }}
        onAdd={handleAddTask}
        users={initialUsers}
        prefillUserId={prefillUserId}
        prefillDate={prefillDate}
      />

      {selectedTask && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100
          }}
          onClick={handleCloseTaskDetail}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '24px',
              width: '400px',
              maxWidth: '90%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
            }}
          >
            <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: 'bold' }}>
              タスク詳細
            </h2>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>タスク名</div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>{selectedTask.title}</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>担当者</div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>
                {initialUsers.find(u => u.id === selectedTask.userId)?.name}
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>期間</div>
              <div style={{ fontSize: '16px' }}>
                {selectedTask.startDate} 〜 {selectedTask.endDate}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={handleDeleteTask}
                style={{
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                削除
              </button>
              <button
                onClick={handleCloseTaskDetail}
                style={{
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
