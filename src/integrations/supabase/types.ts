export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          author_id: string | null
          content: string | null
          created_at: string
          id: string
          image_file_size: number | null
          image_height: number | null
          image_url: string | null
          image_width: number | null
          is_featured: boolean | null
          is_published: boolean | null
          partnership_id: string | null
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          created_at?: string
          id?: string
          image_file_size?: number | null
          image_height?: number | null
          image_url?: string | null
          image_width?: number | null
          is_featured?: boolean | null
          is_published?: boolean | null
          partnership_id?: string | null
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string | null
          created_at?: string
          id?: string
          image_file_size?: number | null
          image_height?: number | null
          image_url?: string | null
          image_width?: number | null
          is_featured?: boolean | null
          is_published?: boolean | null
          partnership_id?: string | null
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "articles_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "contributors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_partnership_id_fkey"
            columns: ["partnership_id"]
            isOneToOne: false
            referencedRelation: "partnerships"
            referencedColumns: ["id"]
          },
        ]
      }
      contributors: {
        Row: {
          bio: string | null
          created_at: string
          email: string | null
          featured_until: string | null
          headshot_url: string | null
          id: string
          institution: string | null
          is_featured: boolean | null
          is_published: boolean | null
          linkedin_url: string | null
          name: string
          organization: string | null
          twitter_url: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email?: string | null
          featured_until?: string | null
          headshot_url?: string | null
          id?: string
          institution?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          linkedin_url?: string | null
          name: string
          organization?: string | null
          twitter_url?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string | null
          featured_until?: string | null
          headshot_url?: string | null
          id?: string
          institution?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          linkedin_url?: string | null
          name?: string
          organization?: string | null
          twitter_url?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      datasets: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          external_url: string | null
          file_url: string | null
          format: string | null
          id: string
          is_public: boolean | null
          source_organization: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          external_url?: string | null
          file_url?: string | null
          format?: string | null
          id?: string
          is_public?: boolean | null
          source_organization?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          external_url?: string | null
          file_url?: string | null
          format?: string | null
          id?: string
          is_public?: boolean | null
          source_organization?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      fellows: {
        Row: {
          contributor_id: string | null
          created_at: string
          end_date: string | null
          id: string
          is_current: boolean | null
          program_description: string | null
          start_date: string | null
        }
        Insert: {
          contributor_id?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          program_description?: string | null
          start_date?: string | null
        }
        Update: {
          contributor_id?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          program_description?: string | null
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fellows_contributor_id_fkey"
            columns: ["contributor_id"]
            isOneToOne: false
            referencedRelation: "contributors"
            referencedColumns: ["id"]
          },
        ]
      }
      letter_campaigns: {
        Row: {
          body_md: string
          created_at: string
          id: string
          is_active: boolean
          scope: string
          send_instructions: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          body_md: string
          created_at?: string
          id?: string
          is_active?: boolean
          scope?: string
          send_instructions?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          body_md?: string
          created_at?: string
          id?: string
          is_active?: boolean
          scope?: string
          send_instructions?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      letter_supports: {
        Row: {
          campaign_id: string
          comment: string
          created_at: string
          display_name: string | null
          id: string
          is_public: boolean
          mp_id: string
        }
        Insert: {
          campaign_id: string
          comment: string
          created_at?: string
          display_name?: string | null
          id?: string
          is_public?: boolean
          mp_id: string
        }
        Update: {
          campaign_id?: string
          comment?: string
          created_at?: string
          display_name?: string | null
          id?: string
          is_public?: boolean
          mp_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "letter_supports_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "letter_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "letter_supports_mp_id_fkey"
            columns: ["mp_id"]
            isOneToOne: false
            referencedRelation: "mps"
            referencedColumns: ["id"]
          },
        ]
      }
      meetups: {
        Row: {
          category: string | null
          created_at: string
          date_time: string
          description: string
          external_link_text: string | null
          external_url: string | null
          homepage_featured: boolean | null
          id: string
          image_file_size: number | null
          image_height: number | null
          image_url: string | null
          image_width: number | null
          is_published: boolean | null
          is_virtual: boolean | null
          location: string
          meeting_link: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          date_time: string
          description: string
          external_link_text?: string | null
          external_url?: string | null
          homepage_featured?: boolean | null
          id?: string
          image_file_size?: number | null
          image_height?: number | null
          image_url?: string | null
          image_width?: number | null
          is_published?: boolean | null
          is_virtual?: boolean | null
          location: string
          meeting_link?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          date_time?: string
          description?: string
          external_link_text?: string | null
          external_url?: string | null
          homepage_featured?: boolean | null
          id?: string
          image_file_size?: number | null
          image_height?: number | null
          image_url?: string | null
          image_width?: number | null
          is_published?: boolean | null
          is_virtual?: boolean | null
          location?: string
          meeting_link?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      mps: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          is_current: boolean
          parliament: string
          population: number
          province: string
          riding_name: string
          source_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          is_current?: boolean
          parliament?: string
          population: number
          province: string
          riding_name: string
          source_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          is_current?: boolean
          parliament?: string
          population?: number
          province?: string
          riding_name?: string
          source_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_settings: {
        Row: {
          beehiv_publication_id: string | null
          created_at: string | null
          id: string
          popup_delay_seconds: number | null
          popup_enabled: boolean | null
          popup_frequency_days: number | null
          updated_at: string | null
        }
        Insert: {
          beehiv_publication_id?: string | null
          created_at?: string | null
          id?: string
          popup_delay_seconds?: number | null
          popup_enabled?: boolean | null
          popup_frequency_days?: number | null
          updated_at?: string | null
        }
        Update: {
          beehiv_publication_id?: string | null
          created_at?: string | null
          id?: string
          popup_delay_seconds?: number | null
          popup_enabled?: boolean | null
          popup_frequency_days?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          beehiv_id: string | null
          created_at: string | null
          email: string
          id: string
          source: string | null
          status: string | null
          subscribed_at: string | null
          unsubscribed_at: string | null
          updated_at: string | null
        }
        Insert: {
          beehiv_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          source?: string | null
          status?: string | null
          subscribed_at?: string | null
          unsubscribed_at?: string | null
          updated_at?: string | null
        }
        Update: {
          beehiv_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          source?: string | null
          status?: string | null
          subscribed_at?: string | null
          unsubscribed_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      partnership_inquiries: {
        Row: {
          contact_name: string
          created_at: string
          email: string
          id: string
          message: string
          organization_name: string
          organization_type: string
          phone: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          contact_name: string
          created_at?: string
          email: string
          id?: string
          message: string
          organization_name: string
          organization_type: string
          phone?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          contact_name?: string
          created_at?: string
          email?: string
          id?: string
          message?: string
          organization_name?: string
          organization_type?: string
          phone?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      partnerships: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          organization_name: string
          organization_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          organization_name: string
          organization_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          organization_name?: string
          organization_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          location: string | null
          updated_at: string
          user_role: Database["public"]["Enums"]["app_role"] | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          location?: string | null
          updated_at?: string
          user_role?: Database["public"]["Enums"]["app_role"] | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          updated_at?: string
          user_role?: Database["public"]["Enums"]["app_role"] | null
        }
        Relationships: []
      }
      thoughts_submissions: {
        Row: {
          category: string
          created_at: string
          email: string
          featured: boolean
          id: string
          message: string
          name: string
          province: string
          region: string | null
          source: string
          source_participant_id: string | null
          status: string | null
          subject: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          email: string
          featured?: boolean
          id?: string
          message: string
          name: string
          province: string
          region?: string | null
          source?: string
          source_participant_id?: string | null
          status?: string | null
          subject: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          email?: string
          featured?: boolean
          id?: string
          message?: string
          name?: string
          province?: string
          region?: string | null
          source?: string
          source_participant_id?: string | null
          status?: string | null
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_role_history: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          change_reason: string | null
          change_type: string
          id: string
          new_role: Database["public"]["Enums"]["app_role"] | null
          previous_role: Database["public"]["Enums"]["app_role"] | null
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          change_reason?: string | null
          change_type: string
          id?: string
          new_role?: Database["public"]["Enums"]["app_role"] | null
          previous_role?: Database["public"]["Enums"]["app_role"] | null
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          change_reason?: string | null
          change_type?: string
          id?: string
          new_role?: Database["public"]["Enums"]["app_role"] | null
          previous_role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string
        }
        Relationships: []
      }
      user_section_permissions: {
        Row: {
          created_at: string | null
          has_access: boolean
          id: string
          section: Database["public"]["Enums"]["admin_section"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          has_access?: boolean
          id?: string
          section: Database["public"]["Enums"]["admin_section"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          has_access?: boolean
          id?: string
          section?: Database["public"]["Enums"]["admin_section"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_section_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_total_thoughts_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_user_permissions: {
        Args: { user_id_param: string }
        Returns: {
          section: string
          has_access: boolean
        }[]
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      has_section_permission: {
        Args: { _user_id: string; _section: string }
        Returns: boolean
      }
      is_admin_or_has_section: {
        Args: { _user_id: string; _section: string }
        Returns: boolean
      }
    }
    Enums: {
      admin_section:
        | "dashboard"
        | "articles"
        | "contributors"
        | "events"
        | "thoughts"
        | "partnerships"
        | "newsletter"
        | "users"
        | "settings"
      app_role: "public" | "employee" | "admin"
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
    Enums: {
      admin_section: [
        "dashboard",
        "articles",
        "contributors",
        "events",
        "thoughts",
        "partnerships",
        "newsletter",
        "users",
        "settings",
      ],
      app_role: ["public", "employee", "admin"],
    },
  },
} as const
