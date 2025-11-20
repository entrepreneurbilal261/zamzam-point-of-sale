import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, ShoppingBag, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSupabaseReceipts, SalesAnalytics } from '@/hooks/useSupabaseReceipts';
import { format } from 'date-fns';

export const DailySales = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [analytics, setAnalytics] = useState<SalesAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { getDailySales } = useSupabaseReceipts();

  const fetchDailySales = async () => {
    setIsLoading(true);
    const data = await getDailySales(selectedDate);
    setAnalytics(data);
    setIsLoading(false);
  };

  // Auto-load today's data on mount
  useEffect(() => {
    fetchDailySales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Calendar className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Daily Sales Report</h2>
        <p className="font-urdu text-lg text-muted-foreground">یومیہ فروخت رپورٹ</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
            <Button 
              onClick={fetchDailySales}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Get Report'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {analytics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">PKR {analytics.totalRevenue}</div>
                <p className="font-urdu text-sm text-muted-foreground">کل آمدن</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{analytics.totalOrders}</div>
                <p className="font-urdu text-sm text-muted-foreground">کل آرڈرز</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Most Sold Item</CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {analytics.mostSoldItem ? (
                  <div>
                    <div className="text-lg font-bold">{analytics.mostSoldItem.name}</div>
                    <p className="font-urdu text-sm text-muted-foreground">{analytics.mostSoldItem.nameUrdu}</p>
                    <Badge variant="secondary" className="mt-1">
                      {analytics.mostSoldItem.quantity} sold
                    </Badge>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No data available</div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Items Sold</CardTitle>
              <p className="font-urdu text-muted-foreground">فروخت شدہ اشیاء</p>
            </CardHeader>
            <CardContent>
              {analytics.items.length > 0 ? (
                <div className="space-y-3">
                  {analytics.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="font-urdu text-sm text-muted-foreground">{item.nameUrdu}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">PKR {item.revenue}</div>
                        <Badge variant="outline">{item.quantity} qty</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No items sold on this date</p>
                  <p className="font-urdu">اس تاریخ میں کوئی فروخت نہیں</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};