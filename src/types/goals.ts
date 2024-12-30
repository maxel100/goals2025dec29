export interface Goal {
  id: string;
  title: string;
  category: string;
  type: 'simple' | 'quantifiable' | 'monthly';
  completed?: boolean;
  progress?: number;
  target?: number;
  unit?: string;
  items?: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
  monthlyProgress?: Record<number, boolean>;
  userId?: string;
  user_id?: string;
  trackingType?: 'slider' | 'subgoals';
  createdAt?: string;
  updatedAt?: string;
  hidden?: boolean;
}

export interface GoalInput {
  title: string;
  category: string;
  type: 'simple' | 'quantifiable' | 'monthly';
  target?: number;
  unit?: string;
  trackingType?: 'slider' | 'subgoals';
  hidden?: boolean;
}