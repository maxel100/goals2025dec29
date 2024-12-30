export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_coach_goals: {
        Row: {
          created_at: string | null
          goals: Json | null
          id: string
          importance: string | null
          period: string | null
          timeframe: string
          updated_at: string | null
          user_id: string
          year: number | null
        }
        Insert: {
          created_at?: string | null
          goals?: Json | null
          id?: string
          importance?: string | null
          period?: string | null
          timeframe: string
          updated_at?: string | null
          user_id: string
          year?: number | null
        }
        Update: {
          created_at?: string | null
          goals?: Json | null
          id?: string
          importance?: string | null
          period?: string | null
          timeframe?: string
          updated_at?: string | null
          user_id?: string
          year?: number | null
        }
        Relationships: []
      }
      daily_priorities: {
        Row: {
          created_at: string | null
          date_of: string
          id: string
          priorities: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date_of: string
          id?: string
          priorities?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date_of?: string
          id?: string
          priorities?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          category: string
          completed: boolean | null
          created_at: string | null
          hidden: boolean | null
          id: string
          items: Json | null
          monthly_progress: Json | null
          progress: number | null
          target: number | null
          title: string
          tracking_type: string | null
          type: string
          unit: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          completed?: boolean | null
          created_at?: string | null
          hidden?: boolean | null
          id?: string
          items?: Json | null
          monthly_progress?: Json | null
          progress?: number | null
          target?: number | null
          title: string
          tracking_type?: string | null
          type: string
          unit?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          completed?: boolean | null
          created_at?: string | null
          hidden?: boolean | null
          id?: string
          items?: Json | null
          monthly_progress?: Json | null
          progress?: number | null
          target?: number | null
          title?: string
          tracking_type?: string | null
          type?: string
          unit?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      life_mission: {
        Row: {
          created_at: string | null
          id: string
          importance: string | null
          updated_at: string | null
          user_id: string
          vision: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          importance?: string | null
          updated_at?: string | null
          user_id: string
          vision?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          importance?: string | null
          updated_at?: string | null
          user_id?: string
          vision?: string | null
        }
        Relationships: []
      }
      monthly_goals: {
        Row: {
          created_at: string | null
          goals: Json | null
          id: string
          month_of: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          goals?: Json | null
          id?: string
          month_of: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          goals?: Json | null
          id?: string
          month_of?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sharing_requests: {
        Row: {
          created_at: string | null
          from_user_id: string
          id: string
          read: boolean | null
          status: string
          to_user_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          from_user_id: string
          id?: string
          read?: boolean | null
          status?: string
          to_user_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          from_user_id?: string
          id?: string
          read?: boolean | null
          status?: string
          to_user_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sharing_requests_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sharing_requests_to_user_id_fkey"
            columns: ["to_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string | null
          email: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_rules: {
        Row: {
          created_at: string | null
          id: string
          rules: Json | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          rules?: Json | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          rules?: Json | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      weekly_motivation: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
          week_of: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
          week_of: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
          week_of?: string
        }
        Relationships: []
      }
      weekly_priorities: {
        Row: {
          created_at: string | null
          id: string
          priorities: Json | null
          updated_at: string | null
          user_id: string
          week_of: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          priorities?: Json | null
          updated_at?: string | null
          user_id: string
          week_of: string
        }
        Update: {
          created_at?: string | null
          id?: string
          priorities?: Json | null
          updated_at?: string | null
          user_id?: string
          week_of?: string
        }
        Relationships: []
      }
      wizard_completion: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      year_name: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string
          year: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id: string
          year?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string
          year?: number
        }
        Relationships: []
      }
      yearly_debrief: {
        Row: {
          challenges: string | null
          created_at: string | null
          id: string
          lessons: string | null
          updated_at: string | null
          user_id: string
          wins: string | null
        }
        Insert: {
          challenges?: string | null
          created_at?: string | null
          id?: string
          lessons?: string | null
          updated_at?: string | null
          user_id: string
          wins?: string | null
        }
        Update: {
          challenges?: string | null
          created_at?: string | null
          id?: string
          lessons?: string | null
          updated_at?: string | null
          user_id?: string
          wins?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bytea_to_text: {
        Args: {
          data: string
        }
        Returns: string
      }
      delete_user_account: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      http: {
        Args: {
          request: Database["public"]["CompositeTypes"]["http_request"]
        }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_delete:
        | {
            Args: {
              uri: string
            }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
          }
        | {
            Args: {
              uri: string
              content: string
              content_type: string
            }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
          }
      http_get:
        | {
            Args: {
              uri: string
            }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
          }
        | {
            Args: {
              uri: string
              data: Json
            }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
          }
      http_head: {
        Args: {
          uri: string
        }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_header: {
        Args: {
          field: string
          value: string
        }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
      }
      http_list_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: {
          uri: string
          content: string
          content_type: string
        }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_post:
        | {
            Args: {
              uri: string
              content: string
              content_type: string
            }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
          }
        | {
            Args: {
              uri: string
              data: Json
            }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
          }
      http_put: {
        Args: {
          uri: string
          content: string
          content_type: string
        }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_reset_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      http_set_curlopt: {
        Args: {
          curlopt: string
          value: string
        }
        Returns: boolean
      }
      text_to_bytea: {
        Args: {
          data: string
        }
        Returns: string
      }
      urlencode:
        | {
            Args: {
              data: Json
            }
            Returns: string
          }
        | {
            Args: {
              string: string
            }
            Returns: string
          }
        | {
            Args: {
              string: string
            }
            Returns: string
          }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown | null
        uri: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content: string | null
      }
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
