import { Button } from "@/components/ui/button";
import { Leaf, Recycle, Heart, Shirt, Package, Sparkles } from "lucide-react";

const categories = [
  { id: "all", label: "All Products", icon: Sparkles },
  { id: "organic", label: "Organic", icon: Leaf },
  { id: "handmade", label: "Handmade", icon: Heart },
  { id: "recycled", label: "Recycled", icon: Recycle },
  { id: "clothing", label: "Clothing", icon: Shirt },
  { id: "home", label: "Home Goods", icon: Package },
];

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <section className="bg-card border-y border-border">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            Filter by:
          </span>
          <div className="flex gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  className="gap-2 whitespace-nowrap"
                  onClick={() => onCategoryChange(category.id)}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryFilter;