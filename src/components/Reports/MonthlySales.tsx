import { useState, useEffect } from 'react';
import { CalendarDays, TrendingUp, ShoppingBag, Crown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useSupabaseReceipts, SalesAnalytics } from '@/hooks/useSupabaseReceipts';

export const MonthlySales = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [analytics, setAnalytics] = useState<SalesAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { getMonthlySales } = useSupabaseReceipts();

  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const fetchMonthlySales = async () => {
    setIsLoading(true);
    const data = await getMonthlySales(parseInt(selectedYear), parseInt(selectedMonth));
    setAnalytics(data);
    setIsLoading(false);
  };

  // Auto-load current month's data on mount
  useEffect(() => {
    fetchMonthlySales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedMonthLabel = months.find(m => m.value === selectedMonth);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <CalendarDays className="h-6 w-6 text-primary" />
        <h2 className="text-base font-bold">Monthly Sales Report</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Month & Year</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              onClick={fetchMonthlySales}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Get Report'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {analytics && (
        <>
          <div className="mb-4">
            <h3 className="text-sm font-semibold">
              {selectedMonthLabel?.label} {selectedYear} Report
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-base font-bold text-green-600">PKR {analytics.totalRevenue}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-base font-bold text-blue-600">{analytics.totalOrders}</div>
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
                    <div className="text-sm font-bold">{analytics.mostSoldItem.name}</div>
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
              <CardTitle>Items Sold This Month</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.items.length > 0 ? (
                <>
                  <div className="mb-6 h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analytics.items.slice(0, 12).map((i) => ({ name: i.name.length > 15 ? i.name.slice(0, 14) + '…' : i.name, revenue: i.revenue, quantity: i.quantity }))}
                        margin={{ top: 8, right: 8, left: 8, bottom: 24 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-35} textAnchor="end" height={60} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(v: number) => [`PKR ${v}`, 'Revenue']} />
                        <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} name="Revenue" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                  {analytics.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">PKR {item.revenue}</div>
                        <Badge variant="outline">{item.quantity} qty</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No items sold this month</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};