// Add to existing types
export interface WeeklyPriority {
  id: string;
  weekOf: string; // ISO date string for the start of the week
  priorities: {
    id: string;
    text: string;
    completed: boolean;
  }[];
  userId: string;
}