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
      nameUrdu: item.nameUrdu,
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
    <Card className="hover:shadow-elegant transition-all duration-300 hover:scale-[1.02]">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h4 className="font-semibold text-lg text-foreground mb-1">
              {item.name}
            </h4>
            {item.nameUrdu && (
              <p className="font-urdu text-xl font-bold text-primary mb-2">
                {item.nameUrdu}
              </p>
            )}
            
            {hasMultipleSizes && (
              <div className="mb-3">
                <p className="text-sm text-muted-foreground mb-2 font-urdu">سائز منتخب کریں</p>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(item.sizes!).map(([size, price]) => {
                    const sizeLabels: Record<string, string> = {
                      'small': 'چھوٹا',
                      'medium': 'درمیانہ',
                      'large': 'بڑا',
                      'glass': 'گلاس',
                      'mug': 'مگ'
                    };
                    return (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSize(size)}
                        className="font-urdu"
                      >
                        {sizeLabels[size] || size}
                        <span className="ml-1">PKR {price}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
            
            <Badge variant="secondary" className="text-lg font-bold">
              PKR {currentPrice}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          {cartQuantity > 0 ? (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveFromCart}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-bold text-lg min-w-[2rem] text-center">
                {cartQuantity}
              </span>
              <Button
                variant="default"
                size="sm"
                onClick={handleAddToCart}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleAddToCart}
                  variant="golden"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};