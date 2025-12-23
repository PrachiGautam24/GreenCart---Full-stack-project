import ProductCard from "./ProductCard";
import { useQuery } from "@tanstack/react-query";
import { productService, Product } from "@/store/services/productService";
import { Loader2 } from "lucide-react";

interface ProductGridProps {
  selectedCategory: string;
  searchQuery: string;
}

const ProductGrid = ({ selectedCategory, searchQuery }: ProductGridProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', selectedCategory, searchQuery],
    queryFn: () => {
      // Some filter buttons represent sustainability tags (organic/handmade/recycled)
      // while others represent product categories (clothing/home...).
      // Map UI category ids to API params accordingly.
      const tagFilters = ['organic', 'handmade', 'recycled'];
      const categoryMap: Record<string, string> = {
        clothing: 'Clothing',
        home: 'Home & Kitchen'
      };

      const params: any = {};
      if (searchQuery) params.search = searchQuery;

      if (selectedCategory && selectedCategory !== 'all') {
        if (tagFilters.includes(selectedCategory)) {
          params.tags = selectedCategory;
        } else {
          params.category = categoryMap[selectedCategory] || selectedCategory;
        }
      }

      return productService.getProducts(params);
    },
  });

  const products = Array.isArray(data?.data?.products) ? data!.data!.products : [];

  if (isLoading) {
    return (
      <section id="products" className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading products...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="products" className="container mx-auto px-4 py-12">
        <div className="text-center py-16">
          <p className="text-xl text-destructive mb-2">Failed to load products</p>
          <p className="text-sm text-muted-foreground">Please try again later</p>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Featured Products</h2>
          <p className="text-muted-foreground">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground mb-2">No products found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: Product) => {
            // Get the first valid image or provide a category-specific fallback
            const getProductImage = () => {
              if (product.images && product.images.length > 0 && product.images[0]) {
                return product.images[0];
              }
              
              // Category-specific fallback images
              const categoryImages = {
                'Clothing': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80&auto=format&fit=crop',
                'Home & Kitchen': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop',
                'Accessories': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80&auto=format&fit=crop',
                'Food & Beverage': 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80&auto=format&fit=crop',
                'Personal Care': 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80&auto=format&fit=crop',
                'Home & Decor': 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80&auto=format&fit=crop',
                'Stationery': 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80&auto=format&fit=crop'
              };
              
              return categoryImages[product.category] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80';
            };

            return (
              <ProductCard 
                key={product._id}
                id={product._id}
                name={product.title}
                price={product.price}
                image={getProductImage()}
                seller={product.seller.username}
                location={product.seller.city}
                rating={product.averageRating || 0}
                tags={product.sustainabilityTags || []}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ProductGrid;