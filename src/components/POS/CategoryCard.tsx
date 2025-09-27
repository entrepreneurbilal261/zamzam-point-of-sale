import { MenuCategory } from "@/data/menu";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryCardProps {
  category: MenuCategory;
  isSelected: boolean;
  onSelect: (categoryId: string) => void;
}

export const CategoryCard = ({ category, isSelected, onSelect }: CategoryCardProps) => {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
        isSelected ? 'ring-4 ring-primary shadow-golden' : 'hover:shadow-elegant'
      }`}
      onClick={() => onSelect(category.id)}
    >
      <CardContent className="p-6">
        <div className={`${category.color} rounded-2xl p-4 mb-4 text-center`}>
          <div className="text-4xl mb-2">{category.icon}</div>
          <h3 className="text-white font-bold text-lg">{category.name}</h3>
        </div>
        <div className="text-center">
          <p className="font-urdu text-xl font-bold text-foreground mb-1">
            {category.nameUrdu}
          </p>
          <p className="text-sm text-muted-foreground">
            {category.items.length} items
          </p>
        </div>
      </CardContent>
    </Card>
  );
};