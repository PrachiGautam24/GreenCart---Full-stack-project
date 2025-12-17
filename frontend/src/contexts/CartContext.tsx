import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";
import { cartService, Cart as BackendCart } from "@/store/services/cartService";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (productId: string, productName: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const transformBackendCart = (backendCart: BackendCart): CartItem[] => {
    return backendCart.items.map((item) => ({
      id: item.product._id,
      name: item.product.title,
      price: item.product.price,
      image: item.product.images[0] || "",
      quantity: item.quantity,
      stock: item.product.stock,
    }));
  };

  const refreshCart = async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }
    
    try {
      setLoading(true);
      const response = await cartService.getCart();
      if (response.success) {
        setItems(transformBackendCart(response.data));
      }
    } catch (error: any) {
      console.error("Failed to fetch cart:", error);
      if (error.response?.status !== 401) {
        toast({
          title: "Error",
          description: "Failed to load cart",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [isAuthenticated]);

  const addToCart = async (productId: string, productName: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to add items to cart",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await cartService.addToCart(productId, 1);
      if (response.success) {
        setItems(transformBackendCart(response.data));
        toast({
          title: "Added to cart",
          description: `${productName} has been added to your cart`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error?.message || "Failed to add to cart",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      setLoading(true);
      const response = await cartService.removeFromCart(productId);
      if (response.success) {
        setItems(transformBackendCart(response.data));
        toast({
          title: "Removed from cart",
          description: "Item has been removed from your cart",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error?.message || "Failed to remove from cart",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      setLoading(true);
      const response = await cartService.updateCartItem(productId, quantity);
      if (response.success) {
        setItems(transformBackendCart(response.data));
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error?.message || "Failed to update quantity",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await cartService.clearCart();
      setItems([]);
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error?.message || "Failed to clear cart",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        loading,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
