import { CartItem } from "@/types/pos";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Trash2, Receipt, Plus, Minus } from "lucide-react";

interface CartProps {
  items: CartItem[];
  customerName?: string;
  onCustomerNameChange?: (value: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onGenerateReceipt: () => void;
  onClearCart: () => void;
}

export const Cart = ({
  items,
  customerName = '',
  onCustomerNameChange,
  onUpdateQuantity,
  onRemoveItem,
  onGenerateReceipt,
  onClearCart
}: CartProps) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-3 px-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <ShoppingCart className="h-4 w-4" />
          Cart
          {totalItems > 0 && (
            <Badge variant="secondary" className="ml-auto text-xs">
              {totalItems}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center px-2">
            <div>
              <ShoppingCart className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">Cart is empty</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add items to get started
              </p>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="border rounded-lg p-3 bg-accent/30">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        {item.size && (
                          <p className="text-xs text-muted-foreground">
                            Size: {item.size}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveItem(item.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="h-7 w-7 p-0"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="font-semibold text-sm min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="h-7 w-7 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">PKR {item.price * item.quantity}</p>
                        <p className="text-xs text-muted-foreground">
                          PKR {item.price} each
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="mt-3 pt-3 border-t">
              {onCustomerNameChange && (
                <div className="mb-3">
                  <label className="text-xs text-muted-foreground block mb-1">Customer name (optional)</label>
                  <Input
                    placeholder="Name for receipt"
                    value={customerName}
                    onChange={(e) => onCustomerNameChange(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
              )}
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-sm">Total:</span>
                <span className="font-semibold text-base text-primary">PKR {total}</span>
              </div>
              
              <div className="space-y-1.5">
                <Button 
                  onClick={onGenerateReceipt}
                  className="w-full text-sm h-9"
                  variant="golden"
                  size="default"
                >
                  <Receipt className="h-3.5 w-3.5 mr-1.5" />
                  Generate Receipt
                </Button>
                <Button 
                  onClick={onClearCart}
                  variant="outline"
                  className="w-full text-xs h-8"
                  size="sm"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  Clear Cart
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};