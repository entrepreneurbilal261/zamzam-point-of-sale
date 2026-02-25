import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
import { localDatabase } from '@/lib/localDatabase';
import { toast } from '@/hooks/use-toast';

const ICON_OPTIONS = ['🍕', '🍔', '🍗', '🌯', '🍝', '🍟', '🥤', '🍨', '🍽️', '🎁', '🎂', '⭐', '🧀', '🍓'];
const COLOR_OPTIONS = [
  { value: 'bg-gradient-to-br from-red-500 to-orange-600', label: 'Red/Orange' },
  { value: 'bg-gradient-to-br from-purple-500 to-pink-600', label: 'Purple/Pink' },
  { value: 'bg-gradient-to-br from-yellow-500 to-orange-600', label: 'Yellow/Orange' },
  { value: 'bg-gradient-to-br from-red-400 to-pink-500', label: 'Red/Pink' },
  { value: 'bg-gradient-to-br from-amber-500 to-orange-600', label: 'Amber/Orange' },
  { value: 'bg-gradient-to-br from-blue-400 to-cyan-500', label: 'Blue/Cyan' },
  { value: 'bg-gradient-to-br from-green-400 to-emerald-500', label: 'Green' },
  { value: 'bg-gradient-to-br from-pink-500 to-purple-600', label: 'Pink/Purple' },
];

function parseSizes(text: string): Record<string, number> | null {
  if (!text.trim()) return null;
  const out: Record<string, number> = {};
  const parts = text.split(',').map((p) => p.trim());
  for (const p of parts) {
    const idx = p.lastIndexOf(':');
    if (idx === -1) continue;
    const name = p.slice(0, idx).trim().toLowerCase().replace(/\s+/g, '_');
    const num = parseFloat(p.slice(idx + 1).trim());
    if (name && !isNaN(num)) out[name] = num;
  }
  return Object.keys(out).length ? out : null;
}

function formatSizes(sizes: Record<string, number> | null): string {
  if (!sizes) return '';
  return Object.entries(sizes)
    .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`)
    .join(', ');
}

export default function MenuManagement() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [itemsByCat, setItemsByCat] = useState<Record<string, any[]>>({});
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [itemCategoryId, setItemCategoryId] = useState<string>('');

  const [catName, setCatName] = useState('');
  const [catIcon, setCatIcon] = useState('📋');
  const [catColor, setCatColor] = useState(COLOR_OPTIONS[0].value);
  const [catShowOnMain, setCatShowOnMain] = useState(false);

  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemSizes, setItemSizes] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      await localDatabase.init();
      const cats = await localDatabase.getMenuFromDb();
      setCategories(cats);
      const byCat: Record<string, any[]> = {};
      for (const c of cats) {
        byCat[c.id] = await localDatabase.getMenuItemsByCategory(c.id);
      }
      setItemsByCat(byCat);
    } catch (e) {
      toast({ title: 'Error', description: 'Could not load menu', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddCategory = () => {
    setEditingCategory(null);
    setCatName('');
    setCatIcon('📋');
    setCatColor(COLOR_OPTIONS[0].value);
    setCatShowOnMain(false);
    setCatDialogOpen(true);
  };

  const openEditCategory = (c: any) => {
    setEditingCategory(c);
    setCatName(c.name);
    setCatIcon(c.icon || '📋');
    setCatColor(c.color || COLOR_OPTIONS[0].value);
    setCatShowOnMain(!!c.show_on_main);
    setCatDialogOpen(true);
  };

  const saveCategory = async () => {
    const id = editingCategory?.id || catName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (!id || !catName.trim()) {
      toast({ title: 'Required', description: 'Enter category name', variant: 'destructive' });
      return;
    }
    try {
      await localDatabase.saveMenuCategory({
        id,
        name: catName.trim(),
        name_urdu: '',
        icon: catIcon,
        color: catColor,
        show_on_main: catShowOnMain,
        sort_order: editingCategory?.sort_order ?? categories.length,
      });
      toast({ title: 'Saved', description: 'Category saved' });
      setCatDialogOpen(false);
      loadData();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not save';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Delete this category and all its items?')) return;
    try {
      await localDatabase.deleteMenuCategory(id);
      toast({ title: 'Deleted', description: 'Category removed' });
      loadData();
    } catch (e) {
      toast({ title: 'Error', description: 'Could not delete', variant: 'destructive' });
    }
  };

  const openAddItem = (categoryId: string) => {
    setItemCategoryId(categoryId);
    setEditingItem(null);
    setItemName('');
    setItemPrice('');
    setItemSizes('');
    setItemDialogOpen(true);
  };

  const openEditItem = (item: any, categoryId: string) => {
    setItemCategoryId(categoryId);
    setEditingItem(item);
    setItemName(item.name);
    setItemPrice(item.price != null ? String(item.price) : '');
    setItemSizes(formatSizes(item.sizes_json ? JSON.parse(item.sizes_json) : null));
    setItemDialogOpen(true);
  };

  const saveItem = async () => {
    const id = editingItem?.id || itemName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (!id || !itemName.trim()) {
      toast({ title: 'Required', description: 'Enter item name', variant: 'destructive' });
      return;
    }
    const sizes = parseSizes(itemSizes);
    const price = itemPrice.trim() ? parseFloat(itemPrice) : null;
    if (!sizes && (price === null || isNaN(price))) {
      toast({ title: 'Required', description: 'Enter price or sizes (e.g. Small: 550, Large: 990)', variant: 'destructive' });
      return;
    }
    try {
      await localDatabase.saveMenuItem({
        id,
        category_id: itemCategoryId,
        name: itemName.trim(),
        name_urdu: '',
        price: sizes ? null : (isNaN(price!) ? null : price),
        sizes_json: sizes ? JSON.stringify(sizes) : null,
        sort_order: editingItem?.sort_order ?? (itemsByCat[itemCategoryId]?.length ?? 0),
      });
      toast({ title: 'Saved', description: 'Item saved' });
      setItemDialogOpen(false);
      loadData();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not save';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    try {
      await localDatabase.deleteMenuItem(id);
      toast({ title: 'Deleted', description: 'Item removed' });
      loadData();
    } catch (e) {
      toast({ title: 'Error', description: 'Could not delete', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to POS
            </Button>
            <div>
              <h1 className="text-lg font-bold">Menu & prices</h1>
              <p className="text-muted-foreground text-sm">Add or edit categories, items, and <strong>selling prices</strong> here. Deals shown on main page can be toggled per category.</p>
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Categories & items (set prices here)</CardTitle>
              <Button onClick={openAddCategory}>
                <Plus className="h-4 w-4 mr-2" />
                Add category
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Categories with &quot;Show on main page&quot; appear as deals on the POS home screen.
            </p>
          </CardHeader>
        </Card>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <div className="space-y-2">
            {categories.map((cat) => (
              <Card key={cat.id}>
                <CardHeader
                  className="py-4 cursor-pointer"
                  onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {expandedCat === cat.id ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                      <span className="text-xl">{cat.icon}</span>
                      <div>
                        <p className="font-semibold">{cat.name}</p>
                        {cat.show_on_main ? (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">Shown on main page</span>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button variant="outline" size="sm" onClick={() => openEditCategory(cat)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive" onClick={() => deleteCategory(cat.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="default" size="sm" onClick={() => openAddItem(cat.id)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add item
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {expandedCat === cat.id && (
                  <CardContent className="pt-0 border-t">
                    <ul className="space-y-2 mt-2">
                      {(itemsByCat[cat.id] || []).map((item) => (
                        <li key={item.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.sizes_json
                                ? `Sizes: ${formatSizes(JSON.parse(item.sizes_json))}`
                                : `PKR ${item.price}`}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => openEditItem(item, cat.id)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteItem(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </li>
                      ))}
                      {(!itemsByCat[cat.id] || itemsByCat[cat.id].length === 0) && (
                        <li className="text-muted-foreground py-4 text-center text-sm">No items yet. Click &quot;Add item&quot; above.</li>
                      )}
                    </ul>
                  </CardContent>
                )}
              </Card>
            ))}
            {categories.length === 0 && (
              <p className="text-muted-foreground text-center py-8">No categories. Add one to get started.</p>
            )}
          </div>
        )}
      </div>

      <Dialog open={catDialogOpen} onOpenChange={setCatDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit category' : 'Add category'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label>Name</Label>
              <Input value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="e.g. Pizza Deals" />
            </div>
            <div>
              <Label>Icon</Label>
              <Select value={catIcon} onValueChange={setCatIcon}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((ico) => (
                    <SelectItem key={ico} value={ico}>{ico}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Color</Label>
              <Select value={catColor} onValueChange={setCatColor}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {COLOR_OPTIONS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="showOnMain" checked={catShowOnMain} onCheckedChange={(v) => setCatShowOnMain(!!v)} />
              <Label htmlFor="showOnMain">Show on main page (as deal)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCatDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveCategory}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit item' : 'Add item'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label>Name</Label>
              <Input value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="e.g. Chicken Tikka Pizza" />
            </div>
            <div>
              <Label>Single price (PKR) — leave empty if using sizes</Label>
              <Input type="number" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} placeholder="350" />
            </div>
            <div>
              <Label>Or sizes (e.g. Small: 550, Medium: 990, Large: 1350)</Label>
              <Input value={itemSizes} onChange={(e) => setItemSizes(e.target.value)} placeholder="small: 550, medium: 990, large: 1350" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setItemDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveItem}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
