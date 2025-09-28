import { useState } from 'react';
import { CalendarDays, TrendingUp, ShoppingBag, Crown } from 'lucide-react';
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
    { value: '1', label: 'January', urdu: 'جنوری' },
    { value: '2', label: 'February', urdu: 'فروری' },
    { value: '3', label: 'March', urdu: 'مارچ' },
    { value: '4', label: 'April', urdu: 'اپریل' },
    { value: '5', label: 'May', urdu: 'مئی' },
    { value: '6', label: 'June', urdu: 'جون' },
    { value: '7', label: 'July', urdu: 'جولائی' },
    { value: '8', label: 'August', urdu: 'اگست' },
    { value: '9', label: 'September', urdu: 'ستمبر' },
    { value: '10', label: 'October', urdu: 'اکتوبر' },
    { value: '11', label: 'November', urdu: 'نومبر' },
    { value: '12', label: 'December', urdu: 'دسمبر' }
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const fetchMonthlySales = async () => {
    setIsLoading(true);
    const data = await getMonthlySales(parseInt(selectedYear), parseInt(selectedMonth));
    setAnalytics(data);
    setIsLoading(false);
  };

  const selectedMonthLabel = months.find(m => m.value === selectedMonth);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <CalendarDays className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Monthly Sales Report</h2>
        <p className="font-urdu text-lg text-muted-foreground">ماہانہ فروخت رپورٹ</p>
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
            <h3 className="text-xl font-semibold">
              {selectedMonthLabel?.label} {selectedYear} Report
            </h3>
            <p className="font-urdu text-muted-foreground">
              {selectedMonthLabel?.urdu} {selectedYear} کی رپورٹ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">₹{analytics.totalRevenue}</div>
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
              <CardTitle>Items Sold This Month</CardTitle>
              <p className="font-urdu text-muted-foreground">اس مہینے فروخت شدہ اشیاء</p>
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
                        <div className="font-bold">₹{item.revenue}</div>
                        <Badge variant="outline">{item.quantity} qty</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No items sold this month</p>
                  <p className="font-urdu">اس مہینے کوئی فروخت نہیں</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};