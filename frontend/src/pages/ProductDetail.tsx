import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/store/services/productService";
import { reviewService } from "@/store/services/reviewService";
import { useCart } from "@/contexts/CartContext";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { ShoppingCart, MapPin, Star, Loader2, Store, MessageSquare } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id!),
    enabled: !!id,
  });

  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => reviewService.getProductReviews(id!),
    enabled: !!id,
  });

  const createReviewMutation = useMutation({
    mutationFn: (data: { productId: string; rating: number; comment: string }) =>
      reviewService.createReview(data),
    onSuccess: () => {
      toast({
        title: "Review submitted!",
        description: "Thank you for your feedback.",
      });
      setComment("");
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to submit review",
        description: error.response?.data?.error?.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const product = data?.data;
  const reviews = reviewsData?.data || [];

  const handleAddToCart = async () => {
    if (product) {
      await addToCart(product._id, product.title);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to submit a review",
        variant: "destructive",
      });
      return;
    }
    if (id) {
      createReviewMutation.mutate({ productId: id, rating, comment });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
            <img
              src={product.images[0] || "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80"}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="flex flex-wrap gap-2 mb-4">
              {product.sustainabilityTags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {product.title}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-accent text-accent" />
                <span className="font-semibold text-foreground">{product.averageRating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
              </div>
            </div>

            <div className="text-4xl font-bold text-primary mb-6">
              Rs. {product.price.toFixed(2)}
            </div>

            <div className="prose prose-sm mb-6">
              <p className="text-foreground">{product.description}</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Store className="w-5 h-5" />
                <span>Sold by <span className="font-semibold text-foreground">{product.seller.username}</span></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-5 h-5" />
                <span>{product.seller.city}</span>
              </div>
              <div className="text-sm">
                <span className={product.stock > 0 ? "text-green-600" : "text-destructive"}>
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="flex-1 gap-2"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>
            </div>

            <div className="mt-8 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Product Details</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Category:</dt>
                  <dd className="font-medium text-foreground">{product.category}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Stock:</dt>
                  <dd className="font-medium text-foreground">{product.stock} units</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            Customer Reviews ({reviews.length})
          </h2>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Write Review Form */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Write a Review</CardTitle>
                </CardHeader>
                <CardContent>
                  {isAuthenticated ? (
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Rating</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => setRating(value)}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`w-6 h-6 ${
                                  value <= rating
                                    ? "fill-accent text-accent"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Your Review</label>
                        <Textarea
                          placeholder="Share your experience with this product..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          required
                          rows={4}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={createReviewMutation.isPending}
                      >
                        {createReviewMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Submit Review
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        Please login to write a review
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-4">
              {reviews.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-foreground mb-2">
                      No reviews yet
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Be the first to review this product!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                reviews.map((review) => (
                  <Card key={review._id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-foreground">
                            {review.buyer.username}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((value) => (
                              <Star
                                key={value}
                                className={`w-4 h-4 ${
                                  value <= review.rating
                                    ? "fill-accent text-accent"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-foreground">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
