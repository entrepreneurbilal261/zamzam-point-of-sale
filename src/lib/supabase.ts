import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      receipts: {
        Row: {
          id: string;
          receipt_number: string;
          items: any[];
          total: number;
          date: string;
          customer_name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          receipt_number: string;
          items: any[];
          total: number;
          date: string;
          customer_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          receipt_number?: string;
          items?: any[];
          total?: number;
          date?: string;
          customer_name?: string | null;
          created_at?: string;
        };
      };
    };
  };
};