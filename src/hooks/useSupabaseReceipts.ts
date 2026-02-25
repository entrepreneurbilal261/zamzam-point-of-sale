import { useEffect, useState } from 'react';
import { localDatabase } from '@/lib/localDatabase';
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

export const useLocalReceipts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize database on mount
    localDatabase.init()
      .then(() => setIsInitialized(true))
      .catch((error) => {
        console.error('Failed to initialize database:', error);
        toast({
          title: "Database Error",
          description: "Failed to initialize local database",
          variant: "destructive",
          duration: 3000,
        });
      });
  }, []);

  const saveReceipt = async (receipt: Receipt) => {
    if (!isInitialized) {
      await localDatabase.init();
      setIsInitialized(true);
    }

    try {
      setIsLoading(true);
      await localDatabase.saveReceipt({
        id: receipt.id,
        items: receipt.items,
        total: receipt.total,
        date: receipt.date,
        customerName: receipt.customerName
      });

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
    if (!isInitialized) {
      await localDatabase.init();
      setIsInitialized(true);
    }

    try {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      const receipts = await localDatabase.getReceiptsByDateRange(startDate, endDate);
      return calculateAnalytics(receipts);
    } catch (error) {
      console.error('Error fetching daily sales:', error);
      return { totalRevenue: 0, totalOrders: 0, mostSoldItem: null, items: [] };
    }
  };

  const getMonthlySales = async (year: number, month: number): Promise<SalesAnalytics> => {
    if (!isInitialized) {
      await localDatabase.init();
      setIsInitialized(true);
    }

    try {
      const receipts = await localDatabase.getMonthlyReceipts(year, month);
      return calculateAnalytics(receipts);
    } catch (error) {
      console.error('Error fetching monthly sales:', error);
      return { totalRevenue: 0, totalOrders: 0, mostSoldItem: null, items: [] };
    }
  };

  const getTodayReceipts = async () => {
    if (!isInitialized) {
      await localDatabase.init();
      setIsInitialized(true);
    }

    try {
      return await localDatabase.getTodayReceipts();
    } catch (error) {
      console.error('Error fetching today receipts:', error);
      return [];
    }
  };

  const getReceiptsByDateRange = async (start: Date, end: Date) => {
    if (!isInitialized) {
      await localDatabase.init();
      setIsInitialized(true);
    }
    try {
      return await localDatabase.getReceiptsByDateRange(start, end);
    } catch (error) {
      console.error('Error fetching receipts by date range:', error);
      return [];
    }
  };

  const calculateAnalytics = (receipts: any[]): SalesAnalytics => {
    const totalRevenue = receipts.reduce((sum, receipt) => sum + receipt.total, 0);
    const totalOrders = receipts.length;

    // Calculate item statistics
    const itemStats: Record<string, { name: string; nameUrdu: string; quantity: number; revenue: number }> = {};

    receipts.forEach(receipt => {
      const items = typeof receipt.items === 'string' ? JSON.parse(receipt.items) : receipt.items;
      items.forEach((item: any) => {
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
    getTodayReceipts,
    getReceiptsByDateRange,
    isLoading,
    isInitialized
  };
};

// Keep the old export name for backward compatibility
export const useSupabaseReceipts = useLocalReceipts;