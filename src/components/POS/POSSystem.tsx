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
import { Badge } from '@/components/ui/badge';
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

  // Separate deals from regular categories
  const deals = menuData.filter(cat => 
    cat.id === 'pizza-deals' || cat.id === 'burger-deals' || cat.id === 'birthday-deals'
  );
  const regularCategories = menuData.filter(cat => 
    cat.id !== 'pizza-deals' && cat.id !== 'burger-deals' && cat.id !== 'birthday-deals'
  );

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
        {/* Left Sidebar - Categories */}
        <div className="w-64 bg-card border-r flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-lg mb-2">Categories</h3>
            <p className="font-urdu text-sm text-muted-foreground">زمرے</p>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {regularCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={state.selectedCategory === category.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setState(prev => ({ ...prev, selectedCategory: category.id }))}
                >
                  <span className="mr-2">{category.icon}</span>
                  <span className="text-sm">{category.name}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
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
                  Back to Deals
                </Button>
              )}
              
              <div className="flex-1">
                <h2 className="text-lg font-semibold">
                  {state.selectedCategory 
                    ? selectedCategoryData?.name || 'Unknown Category'
                    : 'Special Deals'
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
              // Show Deals on Dashboard - Interactive Cards
              <div className="space-y-8">
                {deals.map((dealCategory) => (
                  <div key={dealCategory.id} className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold">{dealCategory.name}</h3>
                      <p className="font-urdu text-lg text-muted-foreground">{dealCategory.nameUrdu}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {dealCategory.items.map(item => (
                        <Card 
                          key={item.id}
                          className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary"
                          onClick={() => {
                            const cartItem: CartItem = {
                              id: item.id,
                              name: item.name,
                              nameUrdu: item.nameUrdu,
                              price: item.price!,
                              quantity: 1,
                              category: item.category
                            };
                            addToCart(cartItem);
                          }}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <Badge variant="secondary" className="text-lg font-bold">
                                {item.name.split(':')[0]}
                              </Badge>
                              <Badge variant="default" className="text-lg">
                                PKR {item.price}
                              </Badge>
                            </div>
                            <h4 className="font-semibold text-lg mb-2">{item.name}</h4>
                            <div className="flex items-center justify-between mt-4">
                              <span className="text-sm text-muted-foreground">
                                {getCartQuantityForItem(item.id) > 0 && (
                                  <span className="font-bold text-primary">
                                    {getCartQuantityForItem(item.id)} in cart
                                  </span>
                                )}
                              </span>
                              <Button size="sm" variant="default">
                                Add to Cart
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
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