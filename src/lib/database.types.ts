export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            books: {
                Row: {
                    id: string
                    title: string
                    author: string
                    total_pages: number
                    current_page: number
                    cover_url: string | null
                    status: 'to-read' | 'reading' | 'completed' | 'on-hold'
                    notes: string | null
                    start_date: string
                    created_at: string
                    updated_at: string
                    user_id: string
                }
                Insert: {
                    id?: string
                    title: string
                    author: string
                    total_pages: number
                    current_page?: number
                    cover_url?: string | null
                    status?: 'to-read' | 'reading' | 'completed' | 'on-hold'
                    notes?: string | null
                    start_date: string
                    created_at?: string
                    updated_at?: string
                    user_id: string
                }
                Update: {
                    id?: string
                    title?: string
                    author?: string
                    total_pages?: number
                    current_page?: number
                    cover_url?: string | null
                    status?: 'to-read' | 'reading' | 'completed' | 'on-hold'
                    notes?: string | null
                    start_date?: string
                    created_at?: string
                    updated_at?: string
                    user_id?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            book_status: 'to-read' | 'reading' | 'completed' | 'on-hold'
        }
    }
} 