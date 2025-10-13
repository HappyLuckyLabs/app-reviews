export interface Database {
  public: {
    Tables: {
      case_studies: {
        Row: {
          id: string
          slug: string
          title: string
          category: string
          revenue: string
          downloads: string
          founder_type: string
          business_model: string
          is_free: boolean
          published_at: string
          description: string | null
          app_icon: string | null
          rating: number | null
          onboarding_steps: number | null
          developer: string | null
          content: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          category: string
          revenue: string
          downloads: string
          founder_type: string
          business_model: string
          is_free?: boolean
          published_at?: string
          description?: string | null
          app_icon?: string | null
          rating?: number | null
          onboarding_steps?: number | null
          developer?: string | null
          content?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          category?: string
          revenue?: string
          downloads?: string
          founder_type?: string
          business_model?: string
          is_free?: boolean
          published_at?: string
          description?: string | null
          app_icon?: string | null
          rating?: number | null
          onboarding_steps?: number | null
          developer?: string | null
          content?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      case_study_sections: {
        Row: {
          id: string
          case_study_id: string
          section_id: string
          section_label: string
          intro_text: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          case_study_id: string
          section_id: string
          section_label: string
          intro_text?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          case_study_id?: string
          section_id?: string
          section_label?: string
          intro_text?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      section_accordions: {
        Row: {
          id: string
          section_id: string
          title: string
          content: string
          default_open: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          section_id: string
          title: string
          content: string
          default_open?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          section_id?: string
          title?: string
          content?: string
          default_open?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      case_study_screenshots: {
        Row: {
          id: string
          section_id: string
          url: string
          title: string
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          section_id: string
          url: string
          title: string
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          section_id?: string
          url?: string
          title?: string
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          subscription_status: 'free' | 'paid_lifetime' | 'paid_monthly'
          stripe_customer_id: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          subscription_status?: 'free' | 'paid_lifetime' | 'paid_monthly'
          stripe_customer_id?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          subscription_status?: 'free' | 'paid_lifetime' | 'paid_monthly'
          stripe_customer_id?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Helper types for joined queries
export type CaseStudyWithSections = Database['public']['Tables']['case_studies']['Row'] & {
  sections: (Database['public']['Tables']['case_study_sections']['Row'] & {
    accordions: Database['public']['Tables']['section_accordions']['Row'][]
    screenshots: Database['public']['Tables']['case_study_screenshots']['Row'][]
  })[]
}
