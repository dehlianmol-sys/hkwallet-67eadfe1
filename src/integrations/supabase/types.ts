export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agent_commissions: {
        Row: {
          agent_code: string
          amount: number
          base_amount: number
          created_at: string
          id: string
          level: number
          rate: number
          status: string
          transaction_id: string
          user_id: string
        }
        Insert: {
          agent_code: string
          amount: number
          base_amount: number
          created_at?: string
          id?: string
          level: number
          rate: number
          status?: string
          transaction_id: string
          user_id: string
        }
        Update: {
          agent_code?: string
          amount?: number
          base_amount?: number
          created_at?: string
          id?: string
          level?: number
          rate?: number
          status?: string
          transaction_id?: string
          user_id?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          id: string
          max_order_size: number
          min_order_size: number
          newbie_required_order_amount: number
          newbie_reward_amount: number
          reward_percentage: number
        }
        Insert: {
          id?: string
          max_order_size?: number
          min_order_size?: number
          newbie_required_order_amount?: number
          newbie_reward_amount?: number
          reward_percentage?: number
        }
        Update: {
          id?: string
          max_order_size?: number
          min_order_size?: number
          newbie_required_order_amount?: number
          newbie_reward_amount?: number
          reward_percentage?: number
        }
        Relationships: []
      }
      banners: {
        Row: {
          created_at: string
          id: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          url?: string
        }
        Relationships: []
      }
      customer_services: {
        Row: {
          created_at: string
          description: string
          icon_url: string
          id: string
          link_url: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string
          icon_url?: string
          id?: string
          link_url: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string
          icon_url?: string
          id?: string
          link_url?: string
          name?: string
        }
        Relationships: []
      }
      payment_configurations: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          qr: string
          upi_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          qr?: string
          upi_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          qr?: string
          upi_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string
          created_at: string
          has_deposited_300: boolean
          id: string
          locked_deposit_id: string | null
          name: string
          phone: string
          referral_code: string
          referred_by: string | null
          updated_at: string
          wallet: number
        }
        Insert: {
          avatar_url?: string
          created_at?: string
          has_deposited_300?: boolean
          id: string
          locked_deposit_id?: string | null
          name?: string
          phone: string
          referral_code: string
          referred_by?: string | null
          updated_at?: string
          wallet?: number
        }
        Update: {
          avatar_url?: string
          created_at?: string
          has_deposited_300?: boolean
          id?: string
          locked_deposit_id?: string | null
          name?: string
          phone?: string
          referral_code?: string
          referred_by?: string | null
          updated_at?: string
          wallet?: number
        }
        Relationships: []
      }
      transaction_records: {
        Row: {
          agent_code: string | null
          amount: number
          created_at: string
          expires_at: string
          id: string
          itoken: number
          payment_method: Json | null
          receipt_base64: string | null
          reward: number
          status: string
          type: string
          user_id: string
          user_name: string
          user_phone: string
          utr: string
        }
        Insert: {
          agent_code?: string | null
          amount: number
          created_at?: string
          expires_at: string
          id?: string
          itoken?: number
          payment_method?: Json | null
          receipt_base64?: string | null
          reward?: number
          status?: string
          type?: string
          user_id: string
          user_name: string
          user_phone: string
          utr?: string
        }
        Update: {
          agent_code?: string | null
          amount?: number
          created_at?: string
          expires_at?: string
          id?: string
          itoken?: number
          payment_method?: Json | null
          receipt_base64?: string | null
          reward?: number
          status?: string
          type?: string
          user_id?: string
          user_name?: string
          user_phone?: string
          utr?: string
        }
        Relationships: []
      }
      upi_accounts: {
        Row: {
          created_at: string
          id: string
          is_selling: boolean
          masked_phone: string
          partner_id: string
          partner_name: string
          tab_type: string
          upi_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_selling?: boolean
          masked_phone?: string
          partner_id?: string
          partner_name?: string
          tab_type?: string
          upi_id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_selling?: boolean
          masked_phone?: string
          partner_id?: string
          partner_name?: string
          tab_type?: string
          upi_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cancel_deposit: { Args: { p_deposit_id: string }; Returns: undefined }
      check_user_exists: { Args: { p_phone: string }; Returns: boolean }
      create_deposit: {
        Args: { p_amount: number }
        Returns: {
          agent_code: string | null
          amount: number
          created_at: string
          expires_at: string
          id: string
          itoken: number
          payment_method: Json | null
          receipt_base64: string | null
          reward: number
          status: string
          type: string
          user_id: string
          user_name: string
          user_phone: string
          utr: string
        }
        SetofOptions: {
          from: "*"
          to: "transaction_records"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      review_deposit: {
        Args: { p_approve: boolean; p_deposit_id: string }
        Returns: undefined
      }
      submit_deposit_proof: {
        Args: { p_deposit_id: string; p_receipt: string; p_utr: string }
        Returns: undefined
      }
      team_summary: {
        Args: never
        Returns: {
          referral_code: string
          today_commission: number
          today_members: number
          total_commission: number
          total_members: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
