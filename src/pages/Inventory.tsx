import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Package,
  History,
  Menu,
  LayoutDashboard,
  ArrowDownToLine,
  AlertTriangle,
  TrendingUp,
  Layers,
  FileText,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { localDatabase } from '@/lib/localDatabase';
import { toast } from '@/hooks/use-toast';

const UNIT_OPTIONS = ['pcs', 'kg', 'L', 'box', 'pack', 'dozen'];

type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  low_stock_at: number | null;
  cost_price: number | null;
  category?: string;
  notes?: string;
  max_stock?: number | null;
};

type LogEntry = {
  id: string;
  item_id: string;
  type: string;
  quantity_change: number;
  quantity_after: number;
  reason: string | null;
  created_at: string;
};

export default function InventoryManagement() {
  const navigate = useNavigate();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('pcs');
  const [lowStockAt, setLowStockAt] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [search, setSearch] = useState('');
  const [receiveItemId, setReceiveItemId] = useState('');
  const [receiveQty, setReceiveQty] = useState('');
  const [receiveReason, setReceiveReason] = useState('');
  const [logFilterItem, setLogFilterItem] = useState<string>('all');
  const [logFilterType, setLogFilterType] = useState<string>('all');
  const [reportRange, setReportRange] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');
  const [reportDate, setReportDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [reportWeekStart, setReportWeekStart] = useState(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d);
    monday.setDate(diff);
    return monday.toISOString().slice(0, 10);
  });
  const [reportMonth, setReportMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [reportFrom, setReportFrom] = useState(() => new Date().toISOString().slice(0, 10));
  const [reportTo, setReportTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [reportLog, setReportLog] = useState<LogEntry[]>([]);
  const [reportLoading, setReportLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      await localDatabase.init();
      const [list, logList] = await Promise.all([
        localDatabase.getInventoryItems(),
        localDatabase.getInventoryLog(),
      ]);
      setItems(list);
      setLog(logList);
    } catch (e) {
      toast({ title: 'Error', description: 'Could not load', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filteredItems = items.filter((i) =>
    !search.trim() || i.name.toLowerCase().includes(search.toLowerCase())
  );
  const lowStockItems = items.filter((i) => i.low_stock_at != null && i.quantity <= i.low_stock_at);
  const stockValue = items.reduce((sum, i) => sum + (i.quantity * (i.cost_price ?? 0)), 0);
  const recentLog = log.slice(0, 15);
  const filteredLog = log.filter((e) => {
    const matchItem = logFilterItem === 'all' || e.item_id === logFilterItem;
    const matchType = logFilterType === 'all' || e.type === logFilterType;
    return matchItem && matchType;
  });

  const openAdd = () => {
    setEditingId(null);
    setName('');
    setQuantity('0');
    setUnit('pcs');
    setLowStockAt('');
    setCostPrice('');
    setDialogOpen(true);
  };

  const openEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setName(item.name);
    setQuantity(String(item.quantity));
    setUnit(item.unit || 'pcs');
    setLowStockAt(item.low_stock_at != null ? String(item.low_stock_at) : '');
    setCostPrice(item.cost_price != null ? String(item.cost_price) : '');
    setDialogOpen(true);
  };

  const save = async () => {
    const q = parseFloat(quantity);
    if (!name.trim()) {
      toast({ title: 'Enter name', variant: 'destructive' });
      return;
    }
    if (isNaN(q) || q < 0) {
      toast({ title: 'Quantity must be 0 or more', variant: 'destructive' });
      return;
    }
    const id = editingId || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'item';
    const low = lowStockAt.trim() ? parseFloat(lowStockAt) : null;
    const cost = costPrice.trim() ? parseFloat(costPrice) : null;
    setSaving(true);
    try {
      await localDatabase.saveInventoryItem({
        id,
        name: name.trim(),
        name_urdu: '',
        quantity: q,
        unit,
        low_stock_at: low != null && !isNaN(low) ? low : null,
        cost_price: cost != null && !isNaN(cost) ? cost : null,
      });
      toast({ title: 'Saved' });
      setDialogOpen(false);
      loadData();
    } catch (e) {
      toast({ title: e instanceof Error ? e.message : 'Could not save', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Remove this item from inventory?')) return;
    try {
      await localDatabase.deleteInventoryItem(id);
      toast({ title: 'Removed' });
      loadData();
    } catch (e) {
      toast({ title: 'Could not delete', variant: 'destructive' });
    }
  };

  const updateQty = async (id: string, newQty: number, reason?: string) => {
    if (newQty < 0) return;
    try {
      await localDatabase.updateInventoryQuantity(id, newQty, reason);
      loadData();
      setLog(await localDatabase.getInventoryLog());
    } catch (e) {
      toast({ title: 'Could not update', variant: 'destructive' });
    }
  };

  const openReceive = (itemId?: string) => {
    setReceiveItemId(itemId || (items[0]?.id ?? ''));
    setReceiveQty('');
    setReceiveReason('');
    setReceiveOpen(true);
  };

  const doReceive = async () => {
    const item = items.find((i) => i.id === receiveItemId);
    if (!item) {
      toast({ title: 'Select an item', variant: 'destructive' });
      return;
    }
    const add = parseFloat(receiveQty);
    if (isNaN(add) || add <= 0) {
      toast({ title: 'Enter quantity to add', variant: 'destructive' });
      return;
    }
    await updateQty(item.id, item.quantity + add, receiveReason.trim() || 'Stock received');
    setReceiveOpen(false);
    toast({ title: 'Stock added' });
  };

  const itemName = (id: string) => items.find((i) => i.id === id)?.name ?? id;
  const formatDate = (iso: string) => new Date(iso).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });

  function getReportStartEnd(): { start: Date; end: Date } {
    if (reportRange === 'daily') {
      const start = new Date(reportDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(reportDate);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    if (reportRange === 'weekly') {
      const start = new Date(reportWeekStart);
      start.setHours(0, 0, 0, 0);
      const end = new Date(reportWeekStart);
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    if (reportRange === 'monthly') {
      const [y, m] = reportMonth.split('-').map(Number);
      const start = new Date(y, m - 1, 1, 0, 0, 0, 0);
      const end = new Date(y, m, 0, 23, 59, 59, 999);
      return { start, end };
    }
    const start = new Date(reportFrom);
    start.setHours(0, 0, 0, 0);
    const end = new Date(reportTo);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  const loadReport = async () => {
    setReportLoading(true);
    try {
      await localDatabase.init();
      const { start, end } = getReportStartEnd();
      const data = await localDatabase.getInventoryLogByDateRange(start, end);
      setReportLog(data);
    } catch (e) {
      toast({ title: 'Error', description: 'Could not load report', variant: 'destructive' });
    } finally {
      setReportLoading(false);
    }
  };

  useEffect(() => {
    if (reportRange) loadReport();
  }, [reportRange, reportDate, reportWeekStart, reportMonth, reportFrom, reportTo]);

  const reportStockIn = reportLog.filter((e) => e.quantity_change > 0).reduce((s, e) => s + e.quantity_change, 0);
  const reportStockOut = reportLog.filter((e) => e.quantity_change < 0).reduce((s, e) => s + Math.abs(e.quantity_change), 0);
  const reportAdjustments = reportLog.filter((e) => e.type === 'adjust').length;
  const reportLabel = reportRange === 'daily' ? reportDate : reportRange === 'weekly' ? `${reportWeekStart} to ${new Date(new Date(reportWeekStart).getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)}` : reportRange === 'monthly' ? reportMonth : `${reportFrom} to ${reportTo}`;

  function downloadCsv(filename: string, rows: string[][]) {
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Downloaded', description: filename });
  }

  const exportReportCsv = () => {
    const rows = [
      ['Item', 'Type', 'Change', 'After', 'Reason', 'Date'],
      ...reportLog.map((e) => [
        itemName(e.item_id),
        e.type,
        String(e.quantity_change),
        String(e.quantity_after),
        e.reason || '',
        formatDate(e.created_at),
      ]),
    ];
    downloadCsv(`inventory-report-${reportLabel.replace(/\s/g, '-')}.csv`, rows);
  };

  const exportItemsCsv = () => {
    const rows = [
      ['Name', 'Quantity', 'Unit', 'Cost (PKR)', 'Warn below'],
      ...items.map((i) => [
        i.name,
        String(i.quantity),
        i.unit,
        i.cost_price != null ? String(i.cost_price) : '',
        i.low_stock_at != null ? String(i.low_stock_at) : '',
      ]),
    ];
    downloadCsv('inventory-items.csv', rows);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-lg font-bold">Inventory</h1>
                <p className="text-muted-foreground text-sm">Stock, cost, movements — all in one place. Selling prices are in Menu.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/menu')}>
                <Menu className="h-4 w-4 mr-2" />
                Menu & prices
              </Button>
              <Button variant="outline" size="sm" onClick={() => openReceive()}>
                <ArrowDownToLine className="h-4 w-4 mr-2" />
                Receive stock
              </Button>
              <Button onClick={openAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add item
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-5 h-auto gap-1 p-1">
            <TabsTrigger value="overview" className="text-sm py-2">
              <LayoutDashboard className="h-4 w-4 mr-1.5" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="items" className="text-sm py-2">
              <Layers className="h-4 w-4 mr-1.5" />
              Items
              {items.length > 0 && <Badge variant="secondary" className="ml-1 text-xs">{items.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="receive" className="text-sm py-2">
              <ArrowDownToLine className="h-4 w-4 mr-1.5" />
              Receive
            </TabsTrigger>
            <TabsTrigger value="history" className="text-sm py-2">
              <History className="h-4 w-4 mr-1.5" />
              History
            </TabsTrigger>
            <TabsTrigger value="reports" className="text-sm py-2">
              <FileText className="h-4 w-4 mr-1.5" />
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{items.length}</div>
                  <p className="text-xs text-muted-foreground">Products in stock</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Stock value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">PKR {stockValue.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                  <p className="text-xs text-muted-foreground">Quantity × cost (items without cost not included)</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Low stock</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{lowStockItems.length}</div>
                  <p className="text-xs text-muted-foreground">At or below alert level</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Low stock
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">Items that need restocking</p>
                </CardHeader>
                <CardContent>
                  {lowStockItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground">All good — no low stock.</p>
                  ) : (
                    <ScrollArea className="h-[200px]">
                      <ul className="space-y-2">
                        {lowStockItems.map((item) => (
                          <li key={item.id} className="flex items-center justify-between py-2 border-b last:border-0 text-sm">
                            <span className="font-medium">{item.name}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant="destructive" className="text-xs">{item.quantity} {item.unit}</Badge>
                              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => openReceive(item.id)}>Add</Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Recent movements
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">Latest stock changes</p>
                </CardHeader>
                <CardContent>
                  {recentLog.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No movements yet.</p>
                  ) : (
                    <ScrollArea className="h-[200px]">
                      <ul className="space-y-2 text-sm">
                        {recentLog.map((e) => (
                          <li key={e.id} className="flex justify-between py-1.5 border-b last:border-0">
                            <span>{itemName(e.item_id)}</span>
                            <span className={e.quantity_change > 0 ? 'text-green-600' : 'text-red-600'}>
                              {e.quantity_change > 0 ? '+' : ''}{e.quantity_change} → {e.quantity_after}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Items */}
          <TabsContent value="items" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">All items</CardTitle>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Input placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs h-9 text-sm" />
                  <Button variant="outline" size="sm" className="h-9" onClick={exportItemsCsv}>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : filteredItems.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{items.length === 0 ? 'No items yet. Add your first item.' : 'No items match filters.'}</p>
                    {items.length === 0 && <Button className="mt-4" size="sm" onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add item</Button>}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="pb-2 pr-4 font-medium">Name</th>
                          <th className="pb-2 pr-4 font-medium">Quantity</th>
                          <th className="pb-2 pr-4 font-medium">Cost</th>
                          <th className="pb-2 pr-4 font-medium">Warn below</th>
                          <th className="pb-2 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredItems.map((item) => {
                          const isLow = item.low_stock_at != null && item.quantity <= item.low_stock_at;
                          return (
                            <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30">
                              <td className="py-3 pr-4">
                                <span className="font-medium">{item.name}</span>
                                {isLow && <Badge variant="destructive" className="ml-2 text-xs">Low</Badge>}
                              </td>
                              <td className="py-3 pr-4">{item.quantity} {item.unit}</td>
                              <td className="py-3 pr-4">{item.cost_price != null ? `PKR ${item.cost_price}` : '—'}</td>
                              <td className="py-3 pr-4 text-muted-foreground">
                                {item.low_stock_at != null ? item.low_stock_at : '—'}
                              </td>
                              <td className="py-3">
                                <div className="flex items-center gap-1">
                                  <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => openReceive(item.id)}>+ Stock</Button>
                                  <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => updateQty(item.id, item.quantity - 1)} disabled={item.quantity <= 0}>−</Button>
                                  <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => updateQty(item.id, item.quantity + 1)}>+</Button>
                                  <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(item)}><Pencil className="h-3.5 w-3.5" /></Button>
                                  <Button variant="outline" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={() => deleteItem(item.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Receive */}
          <TabsContent value="receive" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Receive stock</CardTitle>
                <p className="text-sm text-muted-foreground">Record new stock for one item. Open the dialog to add quantity.</p>
              </CardHeader>
              <CardContent>
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Add items first from the Items tab.</p>
                ) : (
                  <div className="grid gap-2 max-w-md">
                    {items.slice(0, 20).map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <span className="font-medium text-sm">{item.name}</span>
                        <span className="text-muted-foreground text-sm">{item.quantity} {item.unit}</span>
                        <Button size="sm" variant="default" onClick={() => openReceive(item.id)}>Add quantity</Button>
                      </div>
                    ))}
                    {items.length > 20 && <p className="text-xs text-muted-foreground">... and {items.length - 20} more. Use Items tab or Receive stock in header.</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* History */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Movement history</CardTitle>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Select value={logFilterItem} onValueChange={setLogFilterItem}>
                    <SelectTrigger className="w-[180px] h-9 text-sm"><SelectValue placeholder="Item" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All items</SelectItem>
                      {items.map((i) => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={logFilterType} onValueChange={setLogFilterType}>
                    <SelectTrigger className="w-[120px] h-9 text-sm"><SelectValue placeholder="Type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="in">In</SelectItem>
                      <SelectItem value="out">Out</SelectItem>
                      <SelectItem value="adjust">Adjust</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {filteredLog.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No movements yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="pb-2 pr-4 font-medium">Item</th>
                          <th className="pb-2 pr-4 font-medium">Type</th>
                          <th className="pb-2 pr-4 font-medium">Change</th>
                          <th className="pb-2 pr-4 font-medium">After</th>
                          <th className="pb-2 pr-4 font-medium">Reason</th>
                          <th className="pb-2 font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLog.map((e) => (
                          <tr key={e.id} className="border-b last:border-0">
                            <td className="py-2 pr-4">{itemName(e.item_id)}</td>
                            <td className="py-2 pr-4"><Badge variant={e.type === 'in' ? 'default' : e.type === 'out' ? 'destructive' : 'secondary'} className="text-xs">{e.type}</Badge></td>
                            <td className="py-2 pr-4">{e.quantity_change > 0 ? '+' : ''}{e.quantity_change}</td>
                            <td className="py-2 pr-4">{e.quantity_after}</td>
                            <td className="py-2 pr-4 text-muted-foreground">{e.reason || '—'}</td>
                            <td className="py-2 text-muted-foreground text-xs">{formatDate(e.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Inventory reports</CardTitle>
                <p className="text-sm text-muted-foreground">Select a timeline to see stock movements for that period.</p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Select value={reportRange} onValueChange={(v: 'daily' | 'weekly' | 'monthly' | 'custom') => setReportRange(v)}>
                    <SelectTrigger className="w-[140px] h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="custom">Custom range</SelectItem>
                    </SelectContent>
                  </Select>
                  {reportRange === 'daily' && (
                    <div className="flex items-center gap-2">
                      <Label className="text-sm whitespace-nowrap">Date</Label>
                      <Input type="date" value={reportDate} onChange={(e) => setReportDate(e.target.value)} className="h-9 text-sm w-[160px]" />
                    </div>
                  )}
                  {reportRange === 'weekly' && (
                    <div className="flex items-center gap-2">
                      <Label className="text-sm whitespace-nowrap">Week starting</Label>
                      <Input type="date" value={reportWeekStart} onChange={(e) => setReportWeekStart(e.target.value)} className="h-9 text-sm w-[160px]" />
                    </div>
                  )}
                  {reportRange === 'monthly' && (
                    <div className="flex items-center gap-2">
                      <Label className="text-sm whitespace-nowrap">Month</Label>
                      <Input type="month" value={reportMonth} onChange={(e) => setReportMonth(e.target.value)} className="h-9 text-sm w-[160px]" />
                    </div>
                  )}
                  {reportRange === 'custom' && (
                    <>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm whitespace-nowrap">From</Label>
                        <Input type="date" value={reportFrom} onChange={(e) => setReportFrom(e.target.value)} className="h-9 text-sm w-[160px]" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm whitespace-nowrap">To</Label>
                        <Input type="date" value={reportTo} onChange={(e) => setReportTo(e.target.value)} className="h-9 text-sm w-[160px]" />
                      </div>
                    </>
                  )}
                  <Button variant="outline" size="sm" onClick={loadReport} disabled={reportLoading}>
                    {reportLoading ? 'Loading...' : 'Refresh'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportReportCsv} disabled={reportLog.length === 0}>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm font-medium text-muted-foreground">Period: {reportLabel}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-xs text-muted-foreground">Stock in</p>
                      <p className="text-xl font-bold text-green-600">{reportStockIn}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-xs text-muted-foreground">Stock out</p>
                      <p className="text-xl font-bold text-red-600">{reportStockOut}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-xs text-muted-foreground">Adjustments</p>
                      <p className="text-xl font-bold">{reportAdjustments}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-xs text-muted-foreground">Total transactions</p>
                      <p className="text-xl font-bold">{reportLog.length}</p>
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-2">Movement detail</h3>
                  {reportLoading ? (
                    <p className="text-sm text-muted-foreground">Loading...</p>
                  ) : reportLog.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No movements in this period.</p>
                  ) : (
                    <div className="overflow-x-auto border rounded-lg">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50 text-left">
                            <th className="pb-2 pt-2 pr-4 pl-4 font-medium">Item</th>
                            <th className="pb-2 pt-2 pr-4 font-medium">Type</th>
                            <th className="pb-2 pt-2 pr-4 font-medium">Change</th>
                            <th className="pb-2 pt-2 pr-4 font-medium">After</th>
                            <th className="pb-2 pt-2 pr-4 font-medium">Reason</th>
                            <th className="pb-2 pt-2 font-medium">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportLog.map((e) => (
                            <tr key={e.id} className="border-b last:border-0">
                              <td className="py-2 pl-4 pr-4">{itemName(e.item_id)}</td>
                              <td className="py-2 pr-4">
                                <Badge variant={e.type === 'in' ? 'default' : e.type === 'out' ? 'destructive' : 'secondary'} className="text-xs">{e.type}</Badge>
                              </td>
                              <td className="py-2 pr-4">{e.quantity_change > 0 ? '+' : ''}{e.quantity_change}</td>
                              <td className="py-2 pr-4">{e.quantity_after}</td>
                              <td className="py-2 pr-4 text-muted-foreground">{e.reason || '—'}</td>
                              <td className="py-2 pr-4 text-muted-foreground text-xs">{formatDate(e.created_at)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add / Edit item dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base">{editingId ? 'Edit item' : 'Add item'}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="grid gap-4 py-4">
                <div>
                  <Label className="text-sm">Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Cheese" disabled={!!editingId} className="text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Quantity</Label>
                    <Input type="number" min={0} step="any" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" className="text-sm" />
                  </div>
                  <div>
                    <Label className="text-sm">Unit</Label>
                    <Select value={unit} onValueChange={setUnit}>
                      <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {UNIT_OPTIONS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Cost per unit (PKR)</Label>
                    <Input type="number" min={0} step="any" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} placeholder="Optional" className="text-sm" />
                  </div>
                  <div>
                    <Label className="text-sm">Warn when below</Label>
                    <Input type="number" min={0} step="any" value={lowStockAt} onChange={(e) => setLowStockAt(e.target.value)} placeholder="Optional" className="text-sm" />
                  </div>
                </div>
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button>
              <Button size="sm" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Receive stock dialog */}
        <Dialog open={receiveOpen} onOpenChange={setReceiveOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-base">Receive stock</DialogTitle>
            </DialogHeader>
            <p className="text-xs text-muted-foreground -mt-2">How many did you receive?</p>
            <div className="grid gap-4 py-4">
              <div>
                <Label className="text-sm">Item</Label>
                <Select value={receiveItemId} onValueChange={setReceiveItemId}>
                  <SelectTrigger className="text-sm"><SelectValue placeholder="Pick item" /></SelectTrigger>
                  <SelectContent>
                    {items.map((i) => <SelectItem key={i.id} value={i.id}>{i.name} — {i.quantity} {i.unit}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Quantity to add</Label>
                <Input type="number" min={0.01} step="any" value={receiveQty} onChange={(e) => setReceiveQty(e.target.value)} placeholder="e.g. 10" className="text-sm" />
              </div>
              <div>
                <Label className="text-sm">Note (optional)</Label>
                <Input value={receiveReason} onChange={(e) => setReceiveReason(e.target.value)} placeholder="e.g. Delivery #123" className="text-sm" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setReceiveOpen(false)}>Cancel</Button>
              <Button size="sm" onClick={doReceive}>Add to stock</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
