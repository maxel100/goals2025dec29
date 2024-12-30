export interface Database {
  public: {
    Tables: {
      goals: {
        Row: {
          id: string;
          title: string;
          category: string;
          type: string;
          completed?: boolean;
          progress?: number;
          target?: number;
          unit?: string;
          items?: Array<{
            id: string;
            title: string;
            completed: boolean;
          }>;
          monthly_progress?: Record<number, boolean>;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['goals']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['goals']['Insert']>;
      };
    };
  };
}