import { MenuItem as MenuItemType } from "@/data/menu";
import { CartItem } from "@/types/pos";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

interface MenuItemProps {
  item: MenuItemType;
  onAddToCart: (item: CartItem) => void;
  onRemoveFromCart: (itemId: string, size?: string) => void;
  cartQuantity: number;
}

export const MenuItem = ({ item, onAddToCart, onRemoveFromCart, cartQuantity }: MenuItemProps) => {
  const hasMultipleSizes = item.sizes && Object.keys(item.sizes).length > 0;
  const firstSize = hasMultipleSizes ? Object.keys(item.sizes!)[0] : null;
  const [selectedSize, setSelectedSize] = useState<string>(firstSize || '');
  
  const currentPrice = hasMultipleSizes ? item.sizes![selectedSize as keyof typeof item.sizes] : item.price!;

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: hasMultipleSizes ? `${item.id}-${selectedSize}` : item.id,
      name: item.name,
      nameUrdu: '',
      price: currentPrice,
      quantity: 1,
      size: hasMultipleSizes ? selectedSize : undefined,
      category: item.category
    };
    onAddToCart(cartItem);
  };

  const handleRemoveFromCart = () => {
    const itemKey = hasMultipleSizes ? `${item.id}-${selectedSize}` : item.id;
    onRemoveFromCart(itemKey);
  };

  return (
    <Card className="hover:shadow-elegant transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm text-foreground mb-1 leading-snug">
              {item.name}
            </h4>
            
            {hasMultipleSizes && (
              <div className="mb-2">
                <p className="text-xs text-muted-foreground mb-1">Select size</p>
                <div className="flex gap-1.5 flex-wrap">
                  {Object.entries(item.sizes!).map(([size, price]) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      className="text-xs h-7 px-2"
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                      <span className="ml-1">PKR {price}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <Badge variant="secondary" className="text-xs font-medium mt-1">
              PKR {currentPrice}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          {cartQuantity > 0 ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveFromCart}
                className="h-7 w-7 p-0"
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <span className="font-semibold text-sm min-w-[1.5rem] text-center">
                {cartQuantity}
              </span>
              <Button
                variant="default"
                size="sm"
                onClick={handleAddToCart}
                className="h-7 w-7 p-0"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleAddToCart}
              variant="golden"
              size="sm"
              className="text-xs h-8"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add to Cart
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};