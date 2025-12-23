import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, ShoppingCart, Star, ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  seller: string;
  location: string;
  rating: number;
  tags: string[];
}

const ProductCard = ({ id, name, price, image, seller, location, rating, tags }: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const { addToCart } = useCart();

  // Fallback images for different categories
  const getFallbackImage = () => {
    const fallbackImages = [
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80&auto=format&fit=crop', // Generic product
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80&auto=format&fit=crop', // Eco products
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80&auto=format&fit=crop', // Sustainable items
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80&auto=format&fit=crop', // Candles
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop', // Kitchen items
    ];
    return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    await addToCart(id, name);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Card className="group overflow-hidden border-border hover:shadow-lg transition-all duration-300">
      <Link to={`/product/${id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <ImageIcon className="w-12 h-12 text-muted-foreground animate-pulse" />
            </div>
          )}
          
          {imageError ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
              <div className="text-center">
                <ImageIcon className="w-16 h-16 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-green-600 font-medium">Eco Product</p>
              </div>
            </div>
          ) : (
            <img
              src={image || getFallbackImage()}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
            />
          )}
          <Button
            size="icon"
            variant="secondary"
            className={cn(
              "absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all",
              isWishlisted && "opacity-100"
            )}
            onClick={handleWishlist}
          >
            <Heart className={cn("w-4 h-4", isWishlisted && "fill-accent text-accent")} />
          </Button>
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-card/95 backdrop-blur-sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link to={`/product/${id}`}>
          <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
          </div>
          <span>•</span>
          <span className="line-clamp-1">{seller}</span>
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
          <MapPin className="w-4 h-4" />
          <span className="line-clamp-1">{location}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary">Rs. {price.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full gap-2" size="sm" onClick={handleAddToCart}>
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;