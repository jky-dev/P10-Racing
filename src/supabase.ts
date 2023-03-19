export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      constructor: {
        Row: {
          constructor_id: string
          created_at: string | null
          id: number
          name: string
        }
        Insert: {
          constructor_id: string
          created_at?: string | null
          id?: number
          name: string
        }
        Update: {
          constructor_id?: string
          created_at?: string | null
          id?: number
          name?: string
        }
      }
      drivers: {
        Row: {
          constructor: string | null
          created_at: string | null
          driver_id: string
          given_name: string | null
          id: number
          last_name: string | null
        }
        Insert: {
          constructor?: string | null
          created_at?: string | null
          driver_id: string
          given_name?: string | null
          id?: number
          last_name?: string | null
        }
        Update: {
          constructor?: string | null
          created_at?: string | null
          driver_id?: string
          given_name?: string | null
          id?: number
          last_name?: string | null
        }
      }
      invite_codes: {
        Row: {
          created_at: string | null
          invite_code: string
          league_id: number
        }
        Insert: {
          created_at?: string | null
          invite_code: string
          league_id: number
        }
        Update: {
          created_at?: string | null
          invite_code?: string
          league_id?: number
        }
      }
      league_members: {
        Row: {
          created_at: string | null
          id: number
          index: string | null
          league_id: number | null
          user_uuid: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          index?: string | null
          league_id?: number | null
          user_uuid: string
        }
        Update: {
          created_at?: string | null
          id?: number
          index?: string | null
          league_id?: number | null
          user_uuid?: string
        }
      }
      league_results: {
        Row: {
          created_at: string | null
          driver_id: number | null
          id: number
          index: string | null
          league_id: number
          points_gained: number | null
          race_id: number | null
          user_uuid: string
        }
        Insert: {
          created_at?: string | null
          driver_id?: number | null
          id?: number
          index?: string | null
          league_id: number
          points_gained?: number | null
          race_id?: number | null
          user_uuid: string
        }
        Update: {
          created_at?: string | null
          driver_id?: number | null
          id?: number
          index?: string | null
          league_id?: number
          points_gained?: number | null
          race_id?: number | null
          user_uuid?: string
        }
      }
      leagues: {
        Row: {
          created_at: string | null
          created_by_uuid: string
          id: number
          invite_code: string
          name: string
        }
        Insert: {
          created_at?: string | null
          created_by_uuid: string
          id?: number
          invite_code: string
          name: string
        }
        Update: {
          created_at?: string | null
          created_by_uuid?: string
          id?: number
          invite_code?: string
          name?: string
        }
      }
      race_results: {
        Row: {
          created_at: string | null
          driver_id: string | null
          id: number
          position: number | null
          race_id: number
          status: string | null
          unique_index: string | null
        }
        Insert: {
          created_at?: string | null
          driver_id?: string | null
          id?: number
          position?: number | null
          race_id: number
          status?: string | null
          unique_index?: string | null
        }
        Update: {
          created_at?: string | null
          driver_id?: string | null
          id?: number
          position?: number | null
          race_id?: number
          status?: string | null
          unique_index?: string | null
        }
      }
      races: {
        Row: {
          created_at: string | null
          date: string
          id: number
          race_name: string
          round_number: number
          time: string
          year: number
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: number
          race_name: string
          round_number: number
          time: string
          year: number
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: number
          race_name?: string
          round_number?: number
          time?: string
          year?: number
        }
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          name: string | null
          uuid: string
        }
        Insert: {
          created_at?: string | null
          email: string
          name?: string | null
          uuid: string
        }
        Update: {
          created_at?: string | null
          email?: string
          name?: string | null
          uuid?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_member_of:
        | {
            Args: {
              user_id: string
              league_id: number
            }
            Returns: undefined
          }
        | {
            Args: {
              user_id: string
              league_id: number
            }
            Returns: boolean
          }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
