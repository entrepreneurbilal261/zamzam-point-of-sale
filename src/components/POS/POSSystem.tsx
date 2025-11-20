import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { menuData, shopInfo } from '@/data/menu';
import { useSupabaseReceipts } from '@/hooks/useSupabaseReceipts';
import { CartItem, Receipt, POSState } from '@/types/pos';
import { CategoryCard } from './CategoryCard';
import { MenuItem } from './MenuItem';
import { Cart } from './Cart';
import { ReceiptModal } from './ReceiptModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Search, Store, BarChart3 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import bannerImage from '@/assets/zam-zam-banner.jpg';

export const POSSystem = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<POSState>({
    cart: [],
    selectedCategory: null,
    isReceiptModalOpen: false,
    currentReceipt: null
  });

  const [searchTerm, setSearchTerm] = useState('');
  const { saveReceipt } = useSupabaseReceipts();

  const selectedCategoryData = menuData.find(cat => cat.id === state.selectedCategory);

  const filteredItems = useMemo(() => {
    if (!selectedCategoryData) return [];
    
    if (!searchTerm) return selectedCategoryData.items;
    
    return selectedCategoryData.items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nameUrdu.includes(searchTerm)
    );
  }, [selectedCategoryData, searchTerm]);

  const addToCart = (item: CartItem) => {
    setState(prev => {
      const existingItemIndex = prev.cart.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex >= 0) {
        const updatedCart = [...prev.cart];
        updatedCart[existingItemIndex].quantity += item.quantity;
        return { ...prev, cart: updatedCart };
      } else {
        return { ...prev, cart: [...prev.cart, item] };
      }
    });
    
    toast({
      title: "Item Added",
      description: `${item.name} added to cart`,
      duration: 2000,
    });
  };

  const removeFromCart = (itemId: string) => {
    setState(prev => {
      const existingItemIndex = prev.cart.findIndex(item => item.id === itemId);
      
      if (existingItemIndex >= 0) {
        const updatedCart = [...prev.cart];
        if (updatedCart[existingItemIndex].quantity > 1) {
          updatedCart[existingItemIndex].quantity -= 1;
        } else {
          updatedCart.splice(existingItemIndex, 1);
        }
        return { ...prev, cart: updatedCart };
      }
      
      return prev;
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItemCompletely(itemId);
      return;
    }
    
    setState(prev => ({
      ...prev,
      cart: prev.cart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    }));
  };

  const removeItemCompletely = (itemId: string) => {
    setState(prev => ({
      ...prev,
      cart: prev.cart.filter(item => item.id !== itemId)
    }));
  };

  const clearCart = () => {
    setState(prev => ({ ...prev, cart: [] }));
    toast({
      title: "Cart Cleared",
      description: "All items removed from cart",
      duration: 2000,
    });
  };

  const generateReceipt = async () => {
    if (state.cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before generating receipt",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const receipt: Receipt = {
      id: `ZZ${Date.now().toString().slice(-8)}`,
      items: [...state.cart],
      total: state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      date: new Date()
    };

    // Save to database
    await saveReceipt(receipt);

    setState(prev => ({
      ...prev,
      currentReceipt: receipt,
      isReceiptModalOpen: true,
      cart: [] // Clear cart after generating receipt
    }));

    toast({
      title: "Receipt Generated",
      description: `Receipt #${receipt.id} created successfully`,
      duration: 3000,
    });
  };

  const getCartQuantityForItem = (itemId: string, size?: string) => {
    const key = size ? `${itemId}-${size}` : itemId;
    const item = state.cart.find(cartItem => cartItem.id === key);
    return item?.quantity || 0;
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="relative bg-gradient-hero text-white shadow-elegant overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${bannerImage})` }}
        />
        <div className="relative p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                <Store className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold drop-shadow-md">{shopInfo.name}</h1>
                <p className="font-urdu text-xl opacity-90 drop-shadow-md">{shopInfo.nameUrdu}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/20"
                onClick={() => navigate('/reports')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Reports
              </Button>
              <div className="text-right text-sm opacity-90 bg-black/20 backdrop-blur-sm p-3 rounded-lg">
                <p className="font-semibold">Phone: {shopInfo.phone}</p>
                <p className="font-urdu">{shopInfo.addressUrdu}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Navigation Bar */}
          <div className="bg-card border-b p-4">
            <div className="flex items-center gap-4">
              {state.selectedCategory && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setState(prev => ({ ...prev, selectedCategory: null }));
                    setSearchTerm('');
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Categories
                </Button>
              )}
              
              <div className="flex-1">
                <h2 className="text-lg font-semibold">
                  {state.selectedCategory 
                    ? selectedCategoryData?.name || 'Unknown Category'
                    : 'Select Category'
                  }
                </h2>
                {selectedCategoryData && (
                  <p className="font-urdu text-primary font-bold">
                    {selectedCategoryData.nameUrdu}
                  </p>
                )}
              </div>

              {state.selectedCategory && (
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search items..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Content Area */}
          <ScrollArea className="flex-1 p-6">
            {!state.selectedCategory ? (
              // Category Selection
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {menuData.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    isSelected={false}
                    onSelect={(categoryId) => 
                      setState(prev => ({ ...prev, selectedCategory: categoryId }))
                    }
                  />
                ))}
              </div>
            ) : (
              // Items Display
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item) => (
                  <MenuItem
                    key={item.id}
                    item={item}
                    onAddToCart={addToCart}
                    onRemoveFromCart={removeFromCart}
                    cartQuantity={getCartQuantityForItem(item.id, item.sizes ? 'small' : undefined)}
                  />
                ))}
              </div>
            )}
            
            {state.selectedCategory && filteredItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No items found</p>
                <p className="font-urdu text-muted-foreground">کوئی آئٹم نہیں ملا</p>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Cart Sidebar */}
        <div className="w-80 bg-card border-l flex flex-col">
          <Cart
            items={state.cart}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItemCompletely}
            onGenerateReceipt={generateReceipt}
            onClearCart={clearCart}
          />
        </div>
      </div>

      {/* Receipt Modal */}
      <ReceiptModal
        receipt={state.currentReceipt}
        isOpen={state.isReceiptModalOpen}
        onClose={() => setState(prev => ({ 
          ...prev, 
          isReceiptModalOpen: false, 
          currentReceipt: null 
        }))}
      />
    </div>
  );
};