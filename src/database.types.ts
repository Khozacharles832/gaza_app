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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      extra_groups: {
        Row: {
          id: string
          multi: boolean | null
          name: string
        }
        Insert: {
          id?: string
          multi?: boolean | null
          name: string
        }
        Update: {
          id?: string
          multi?: boolean | null
          name?: string
        }
        Relationships: []
      }
      extras: {
        Row: {
          group_id: string
          id: string
          in_stock: boolean | null
          name: string
          price: number
        }
        Insert: {
          group_id: string
          id?: string
          in_stock?: boolean | null
          name: string
          price: number
        }
        Update: {
          group_id?: string
          id?: string
          in_stock?: boolean | null
          name?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "extras_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "extra_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      order_item_extras: {
        Row: {
          extra_id: string | null
          id: string
          order_item_id: number | null
          price_at_time: number
        }
        Insert: {
          extra_id?: string | null
          id?: string
          order_item_id?: number | null
          price_at_time: number
        }
        Update: {
          extra_id?: string | null
          id?: string
          order_item_id?: number | null
          price_at_time?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_item_extras_extra_id_fkey"
            columns: ["extra_id"]
            isOneToOne: false
            referencedRelation: "extras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_extras_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          extras: Json | null
          id: number
          order_id: number
          product_id: number
          quantity: number
          size: string
        }
        Insert: {
          created_at?: string
          extras?: Json | null
          id?: number
          order_id: number
          product_id: number
          quantity?: number
          size?: string
        }
        Update: {
          created_at?: string
          extras?: Json | null
          id?: number
          order_id?: number
          product_id?: number
          quantity?: number
          size?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: number
          payment: string | null
          status: string
          total: number
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          payment?: string | null
          status?: string
          total?: number
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          payment?: string | null
          status?: string
          total?: number
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_extra_groups: {
        Row: {
          group_id: string
          product_id: number
        }
        Insert: {
          group_id: string
          product_id: number
        }
        Update: {
          group_id?: string
          product_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_extra_groups_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "extra_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_extra_groups_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          id: number
          image: string | null
          name: string
          price: number
        }
        Insert: {
          created_at?: string
          id?: number
          image?: string | null
          name: string
          price: number
        }
        Update: {
          created_at?: string
          id?: number
          image?: string | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          expo_push_token: string | null
          full_name: string | null
          group: string
          id: string
          paystack_customer_code: string | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          expo_push_token?: string | null
          full_name?: string | null
          group?: string
          id: string
          paystack_customer_code?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          expo_push_token?: string | null
          full_name?: string | null
          group?: string
          id?: string
          paystack_customer_code?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          authorization_url: string | null
          cart_items: Json | null
          created_at: string | null
          currency: string | null
          id: string
          provider: string | null
          provider_reference: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          authorization_url?: string | null
          cart_items?: Json | null
          created_at?: string | null
          currency?: string | null
          id?: string
          provider?: string | null
          provider_reference?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          authorization_url?: string | null
          cart_items?: Json | null
          created_at?: string | null
          currency?: string | null
          id?: string
          provider?: string | null
          provider_reference?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
