import { Link } from "wouter";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { useAddToCart, useAddToWishlist, getGetCartQueryKey, getGetWishlistQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const queryClient = useQueryClient();
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart.mutate(
      { data: { productId: product.id, quantity: 1 } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          toast.success("Added to bag", {
            description: `${product.name} has been added to your shopping bag.`,
          });
        }
      }
    );
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToWishlist.mutate(
      { data: { productId: product.id } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetWishlistQueryKey() });
          toast.success("Added to wishlist", {
            description: `${product.name} has been saved for later.`,
          });
        }
      }
    );
  };

  return (
    <Link href={`/product/${product.id}`} className="group block relative">
      <div className="relative aspect-[3/4] overflow-hidden bg-black mb-4">
        {product.isNew && (
          <Badge className="absolute top-3 left-3 z-10 bg-primary hover:bg-primary text-primary-foreground border-none px-3 py-1 rounded-none font-display uppercase tracking-widest text-[10px]">
            New
          </Badge>
        )}
        {product.isSale && (
          <Badge className="absolute top-3 left-3 z-10 bg-accent hover:bg-accent text-accent-foreground border-none px-3 py-1 rounded-none font-display uppercase tracking-widest text-[10px]">
            Sale
          </Badge>
        )}
        
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 group-hover:opacity-50"
        />
        
        {/* Hover Actions Overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <button 
            onClick={handleAddToWishlist}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all hover:scale-110"
          >
            <Heart className="w-5 h-5" />
          </button>
          <button 
            onClick={handleAddToCart}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all hover:scale-110"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-display font-medium text-lg uppercase tracking-wide group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-3 font-sans">
          <span className="font-semibold text-white">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-white/50 line-through text-sm">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
