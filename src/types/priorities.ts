export interface Priority {
  id: string;
  text: string;
  completed: boolean;
}

export interface DailyPriorities {
  id: string;
  dateOf: string;
  priorities: Priority[];
  userId: string;
}

export interface WeeklyPriorities {
  id: string;
  weekOf: string;
  priorities: Priority[];
  userId: string;
}

export interface QuarterlyGoals {
  id: string;
  quarterStart: string;
  goals: Priority[];
  userId: string;
  is_visible: boolean;
}