import { User, Task } from './types.ts';

export const users: User[] = [
  { id: '1', name: '田中', color: '#3b82f6' },
  { id: '2', name: '佐藤', color: '#10b981' },
  { id: '3', name: '鈴木', color: '#f59e0b' },
  { id: '4', name: '高橋', color: '#ef4444' }
];

const today = new Date();
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const tasks: Task[] = [
  {
    id: '1',
    title: 'プロジェクトA設計',
    userId: '1',
    startDate: formatDate(addDays(today, -2)),
    endDate: formatDate(addDays(today, 5)),
    color: '#3b82f6'
  },
  {
    id: '2',
    title: 'レビュー対応',
    userId: '1',
    startDate: formatDate(addDays(today, 6)),
    endDate: formatDate(addDays(today, 8)),
    color: '#3b82f6'
  },
  {
    id: '3',
    title: 'バグ修正',
    userId: '2',
    startDate: formatDate(addDays(today, 0)),
    endDate: formatDate(addDays(today, 3)),
    color: '#10b981'
  },
  {
    id: '4',
    title: 'テスト実施',
    userId: '2',
    startDate: formatDate(addDays(today, 1)),
    endDate: formatDate(addDays(today, 6)),
    color: '#10b981'
  },
  {
    id: '5',
    title: 'ドキュメント作成',
    userId: '2',
    startDate: formatDate(addDays(today, 4)),
    endDate: formatDate(addDays(today, 7)),
    color: '#10b981'
  },
  {
    id: '6',
    title: '要件定義',
    userId: '3',
    startDate: formatDate(addDays(today, 10)),
    endDate: formatDate(addDays(today, 12)),
    color: '#f59e0b'
  },
  {
    id: '7',
    title: 'プロジェクトB実装',
    userId: '4',
    startDate: formatDate(addDays(today, -3)),
    endDate: formatDate(addDays(today, 4)),
    color: '#ef4444'
  },
  {
    id: '8',
    title: 'プロジェクトC実装',
    userId: '4',
    startDate: formatDate(addDays(today, 5)),
    endDate: formatDate(addDays(today, 11)),
    color: '#ef4444'
  }
];
