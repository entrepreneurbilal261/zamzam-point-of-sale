import { useState, useEffect, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { localDatabase } from '@/lib/localDatabase';
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
} from 'date-fns';
import { toast } from '@/hooks/use-toast';

const EXPENSE_CATEGORIES = ['Rent', 'Utilities', 'Supplies', 'Salaries', 'Other', 'Inventory'];

type PnLPeriod = 'daily' | 'weekly' | 'monthly';

const pad = (n: number) => String(n).padStart(2, '0');
const dateToKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const ProfitLoss = () => {
  const today = new Date();
  const [period, setPeriod] = useState<PnLPeriod>('daily');
  const [selectedDate, setSelectedDate] = useState(format(today, 'yyyy-MM-dd'));
  const [expenseForm, setExpenseForm] = useState({
    date: format(today, 'yyyy-MM-dd'),
    amount: '',
    description: '',
    category: 'Other',
  });
  const [revenue, setRevenue] = useState(0);
  const [expenses, setExpenses] = useState<{ id: string; date: string; amount: number; description: string; category: string }[]>([]);
  const [chartData, setChartData] = useState<{ name: string; revenue: number; expenses: number; profit: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getRange = useCallback(() => {
    const d = new Date(selectedDate + 'T12:00:00');
    if (period === 'daily') {
      const start = new Date(d);
      start.setHours(0, 0, 0, 0);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    if (period === 'weekly') {
      const start = startOfWeek(d, { weekStartsOn: 1 });
      const end = endOfWeek(d, { weekStartsOn: 1 });
      return { start, end };
    }
    const start = startOfMonth(d);
    const end = endOfMonth(d);
    return { start, end };
  }, [period, selectedDate]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      await localDatabase.init();
      const { start, end } = getRange();

      const [receipts, inventoryLogs, inventoryItems, expenseList] = await Promise.all([
        localDatabase.getReceiptsByDateRange(start, end),
        localDatabase.getInventoryLogByDateRange(start, end),
        localDatabase.getInventoryItems(),
        localDatabase.getExpensesByDateRange(start, end),
      ]);

      const revTotal = receipts.reduce((s, r: any) => s + (r.total ?? 0), 0);
      setRevenue(revTotal);

      const days = eachDayOfInterval({ start, end });
      const revenueByDay: Record<string, number> = {};
      const expenseByDay: Record<string, number> = {};
      days.forEach((day) => {
        const key = dateToKey(day);
        revenueByDay[key] = 0;
        expenseByDay[key] = 0;
      });

      // Map inventory for cost lookup
      const itemCostMap = new Map<string, { name: string; cost_price: number }>();
      (inventoryItems as any[]).forEach((item) => {
        itemCostMap.set(item.id, { name: item.name, cost_price: item.cost_price ?? 0 });
      });

      // Inventory-based expenses (stock purchased)
      const inventoryExpenses: { id: string; date: string; amount: number; description: string; category: string }[] = [];
      (inventoryLogs as any[]).forEach((log) => {
        if (log.type !== 'in' || log.quantity_change <= 0) return;
        const item = itemCostMap.get(log.item_id);
        const cost = item?.cost_price ?? 0;
        if (!cost) return;
        const amount = cost * log.quantity_change;
        const dateStr = (log.created_at || '').slice(0, 10);
        if (expenseByDay[dateStr] !== undefined) {
          expenseByDay[dateStr] += amount;
        }
        inventoryExpenses.push({
          id: log.id,
          date: dateStr,
          amount,
          description: item ? item.name : log.reason ?? 'Inventory',
          category: 'Inventory',
        });
      });

      // Manual expenses
      expenseList.forEach((e) => {
        if (expenseByDay[e.date] !== undefined) {
          expenseByDay[e.date] += e.amount;
        }
      });

      const combinedExpenses = [...expenseList, ...inventoryExpenses];
      setExpenses(combinedExpenses);

      // Revenue per day from receipts
      receipts.forEach((r: any) => {
        const dateStr = r.date ? r.date.slice(0, 10) : dateToKey(new Date());
        if (revenueByDay[dateStr] !== undefined) {
          revenueByDay[dateStr] += r.total ?? 0;
        }
      });

      const dayData = days.map((day) => {
        const key = dateToKey(day);
        const dayRev = revenueByDay[key] ?? 0;
        const dayExp = expenseByDay[key] ?? 0;
        return {
          name: format(day, period === 'monthly' ? 'd' : 'EEE d'),
          revenue: dayRev,
          expenses: dayExp,
          profit: dayRev - dayExp,
        };
      });

      setChartData(dayData);
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Failed to load P&L data', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [getRange, period]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const profit = revenue - totalExpenses;

  const goPrev = () => {
    const d = new Date(selectedDate + 'T12:00:00');
    if (period === 'daily') setSelectedDate(format(new Date(d.setDate(d.getDate() - 1)), 'yyyy-MM-dd'));
    else if (period === 'weekly') setSelectedDate(format(subWeeks(d, 1), 'yyyy-MM-dd'));
    else setSelectedDate(format(subMonths(d, 1), 'yyyy-MM-dd'));
  };

  const goNext = () => {
    const d = new Date(selectedDate + 'T12:00:00');
    if (period === 'daily') setSelectedDate(format(new Date(d.setDate(d.getDate() + 1)), 'yyyy-MM-dd'));
    else if (period === 'weekly') setSelectedDate(format(addWeeks(d, 1), 'yyyy-MM-dd'));
    else setSelectedDate(format(addMonths(d, 1), 'yyyy-MM-dd'));
  };

  const summaryForChart = [
    { name: 'Revenue', value: revenue, color: '#22c55e' },
    { name: 'Expenses', value: totalExpenses, color: '#ef4444' },
  ].filter((d) => d.value > 0);

  const handleAddExpense = async () => {
    const amount = parseFloat(expenseForm.amount);
    if (!expenseForm.date || isNaN(amount) || amount <= 0) {
      toast({ title: 'Invalid', description: 'Enter date and a positive amount', variant: 'destructive' });
      return;
    }
    try {
      await localDatabase.saveExpense({
        date: expenseForm.date,
        amount,
        description: expenseForm.description,
        category: expenseForm.category,
      });
      toast({ title: 'Expense added' });
      setExpenseForm((f) => ({ ...f, amount: '', description: '' }));
      loadData();
    } catch {
      toast({ title: 'Error', description: 'Failed to save expense', variant: 'destructive' });
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await localDatabase.deleteExpense(id);
      loadData();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete expense', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Wallet className="h-6 w-6 text-primary" />
        <h2 className="text-base font-bold">Profit &amp; Loss</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Period</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <Select value={period} onValueChange={(v) => setPeriod(v as PnLPeriod)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            {period === 'daily' && (
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-[160px]"
              />
            )}
            {period === 'weekly' && (
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-[160px]"
              />
            )}
            {period === 'monthly' && (
              <Input
                type="month"
                value={selectedDate.slice(0, 7)}
                onChange={(e) => setSelectedDate(e.target.value + '-01')}
                className="w-[160px]"
              />
            )}
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={goPrev} disabled={isLoading}>
                ←
              </Button>
              <Button variant="outline" size="icon" onClick={goNext} disabled={isLoading}>
                →
              </Button>
            </div>
            <Button onClick={loadData} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">PKR {revenue}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-red-600">PKR {totalExpenses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>PKR {profit}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses by Day</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <RechartsTooltip formatter={(v: number) => `PKR ${v}`} />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-8">No data for this period</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses (Summary)</CardTitle>
          </CardHeader>
          <CardContent>
            {summaryForChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={summaryForChart}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, value }) => `${name}: PKR ${value}`}
                  >
                    {summaryForChart.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(v: number) => `PKR ${v}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-8">No revenue or expenses in this period</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manual Expenses in Period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end mb-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Date</label>
              <Input
                type="date"
                value={expenseForm.date}
                onChange={(e) => setExpenseForm((f) => ({ ...f, date: e.target.value }))}
                className="w-[160px]"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Amount (PKR)</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm((f) => ({ ...f, amount: e.target.value }))}
                className="w-[120px]"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Category</label>
              <Select
                value={expenseForm.category}
                onValueChange={(v) => setExpenseForm((f) => ({ ...f, category: v }))}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Description</label>
              <Input
                placeholder="Optional"
                value={expenseForm.description}
                onChange={(e) => setExpenseForm((f) => ({ ...f, description: e.target.value }))}
                className="w-[200px]"
              />
            </div>
            <Button onClick={handleAddExpense} disabled={isLoading}>
              Add
            </Button>
          </div>

          {expenses.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">No expenses in this period</p>
          ) : (
            <div className="space-y-2">
              {expenses.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <span className="font-medium">PKR {e.amount}</span>
                    {e.description && (
                      <span className="text-muted-foreground ml-2">— {e.description}</span>
                    )}
                    <span className="text-xs text-muted-foreground ml-2">
                      ({e.date}) {e.category}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteExpense(e.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
