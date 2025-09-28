import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Receipt } from '@/types/pos';
import { toast } from '@/hooks/use-toast';

export interface SalesAnalytics {
  totalRevenue: number;
  totalOrders: number;
  mostSoldItem: {
    name: string;
    nameUrdu: string;
    quantity: number;
  } | null;
  items: Array<{
    name: string;
    nameUrdu: string;
    quantity: number;
    revenue: number;
  }>;
}

export const useSupabaseReceipts = () => {
  const [isLoading, setIsLoading] = useState(false);

  const saveReceipt = async (receipt: Receipt) => {
    if (!isSupabaseConfigured || !supabase) {
      console.log('Supabase not configured - receipt saved locally only');
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('receipts')
        .insert({
          receipt_number: receipt.id,
          items: receipt.items,
          total: receipt.total,
          date: receipt.date.toISOString(),
          customer_name: receipt.customerName
        });

      if (error) throw error;

      toast({
        title: "Receipt Saved",
        description: "Receipt saved to database successfully",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error saving receipt:', error);
      toast({
        title: "Error",
        description: "Failed to save receipt to database",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDailySales = async (date: string): Promise<SalesAnalytics> => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase not configured');
    }

    try {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('receipts')
        .select('*')
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      return calculateAnalytics(data || []);
    } catch (error) {
      console.error('Error fetching daily sales:', error);
      return { totalRevenue: 0, totalOrders: 0, mostSoldItem: null, items: [] };
    }
  };

  const getMonthlySales = async (year: number, month: number): Promise<SalesAnalytics> => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase not configured');
    }

    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      const { data, error } = await supabase
        .from('receipts')
        .select('*')
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      return calculateAnalytics(data || []);
    } catch (error) {
      console.error('Error fetching monthly sales:', error);
      return { totalRevenue: 0, totalOrders: 0, mostSoldItem: null, items: [] };
    }
  };

  const calculateAnalytics = (receipts: any[]): SalesAnalytics => {
    const totalRevenue = receipts.reduce((sum, receipt) => sum + receipt.total, 0);
    const totalOrders = receipts.length;

    // Calculate item statistics
    const itemStats: Record<string, { name: string; nameUrdu: string; quantity: number; revenue: number }> = {};

    receipts.forEach(receipt => {
      receipt.items.forEach((item: any) => {
        const key = item.name;
        if (!itemStats[key]) {
          itemStats[key] = {
            name: item.name,
            nameUrdu: item.nameUrdu,
            quantity: 0,
            revenue: 0
          };
        }
        itemStats[key].quantity += item.quantity;
        itemStats[key].revenue += item.price * item.quantity;
      });
    });

    const items = Object.values(itemStats).sort((a, b) => b.quantity - a.quantity);
    const mostSoldItem = items.length > 0 ? items[0] : null;

    return {
      totalRevenue,
      totalOrders,
      mostSoldItem,
      items
    };
  };

  return {
    saveReceipt,
    getDailySales,
    getMonthlySales,
    isLoading,
    isSupabaseConfigured
  };
};