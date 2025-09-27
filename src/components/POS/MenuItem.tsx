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
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('small');
  
  const hasMultipleSizes = item.sizes && Object.keys(item.sizes).length > 0;
  const currentPrice = hasMultipleSizes ? item.sizes![selectedSize] : item.price!;

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
            <p className="font-urdu text-xl font-bold text-primary mb-2">
              {item.nameUrdu}
            </p>
            
            {hasMultipleSizes && (
              <div className="mb-3">
                <p className="text-sm text-muted-foreground mb-2 font-urdu">سائز منتخب کریں</p>
                <div className="flex gap-2">
                  {Object.entries(item.sizes!).map(([size, price]) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSize(size as 'small' | 'medium' | 'large')}
                      className="font-urdu"
                    >
                      {size === 'small' ? 'چھوٹا' : size === 'medium' ? 'درمیانہ' : 'بڑا'}
                      <span className="ml-1">Rs.{price}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <Badge variant="secondary" className="text-lg font-bold">
              Rs. {currentPrice}
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