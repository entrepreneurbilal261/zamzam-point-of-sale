import { CartItem } from "@/types/pos";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Trash2, Receipt, Plus, Minus } from "lucide-react";

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onGenerateReceipt: () => void;
  onClearCart: () => void;
}

export const Cart = ({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onGenerateReceipt, 
  onClearCart 
}: CartProps) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Cart
          {totalItems > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {totalItems}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground font-urdu text-lg">
                کارٹ خالی ہے
              </p>
              <p className="text-sm text-muted-foreground">
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
                        <p className="font-urdu text-primary font-bold">
                          {item.nameUrdu}
                        </p>
                        {item.size && (
                          <p className="text-xs text-muted-foreground">
                            Size: {item.size === 'small' ? 'چھوٹا' : 
                                   item.size === 'medium' ? 'درمیانہ' : 'بڑا'}
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
                        <span className="font-bold min-w-[2rem] text-center">
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
                        <p className="font-bold">PKR {item.price * item.quantity}</p>
                        <p className="text-xs text-muted-foreground">
                          PKR {item.price} each
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg font-urdu">کل رقم:</span>
                <span className="font-bold text-xl text-primary">PKR {total}</span>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={onGenerateReceipt}
                  className="w-full"
                  variant="golden"
                  size="lg"
                >
                  <Receipt className="h-4 w-4 mr-2" />
                  Generate Receipt
                </Button>
                <Button 
                  onClick={onClearCart}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
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