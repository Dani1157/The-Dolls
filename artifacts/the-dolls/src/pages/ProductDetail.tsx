import { useParams } from "wouter";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/shared/ProductCard";
import { 
  useGetProduct, 
  getGetProductQueryKey,
  useGetProducts,
  useAddToCart,
  useAddToWishlist,
  getGetCartQueryKey,
  getGetWishlistQueryKey
} from "@workspace/api-client-react";
import { Heart, ShoppingBag, Ruler, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Link } from "wouter";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || "0", 10);
  
  const queryClient = useQueryClient();
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [activeImage, setActiveImage] = useState<number>(0);

  const { data: product, isLoading } = useGetProduct(productId, { 
    query: { enabled: !!productId, queryKey: getGetProductQueryKey(productId) } 
  });

  const { data: relatedProducts } = useGetProducts({ 
    category: product?.category, 
    limit: 4 
  }, {
    query: { enabled: !!product?.category }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-12">
          <div className="md:w-1/2 space-y-4">
            <Skeleton className="aspect-[3/4] w-full bg-white/5 rounded-none" />
          </div>
          <div className="md:w-1/2 space-y-8">
            <Skeleton className="h-12 w-3/4 bg-white/5 rounded-none" />
            <Skeleton className="h-6 w-1/4 bg-white/5 rounded-none" />
            <Skeleton className="h-32 w-full bg-white/5 rounded-none" />
            <Skeleton className="h-16 w-full bg-white/5 rounded-none" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 flex flex-col items-center justify-center">
        <Navbar />
        <h1 className="text-4xl font-display uppercase tracking-widest mb-6">Product Not Found</h1>
        <Link href="/shop" className="text-primary hover:text-white underline font-sans">Return to Shop</Link>
      </div>
    );
  }

  const allImages = [product.imageUrl, ...(product.images || [])];

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (product.colors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    addToCart.mutate(
      { data: { productId: product.id, quantity: 1, size: selectedSize, color: selectedColor } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          toast.success("Added to bag");
        }
      }
    );
  };

  const handleAddToWishlist = () => {
    addToWishlist.mutate(
      { data: { productId: product.id } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetWishlistQueryKey() });
          toast.success("Added to wishlist");
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pt-20 selection:bg-primary selection:text-white">
      <Navbar />
      
      {/* BREADCRUMBS */}
      <div className="border-b border-white/10 bg-zinc-950">
        <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-xs font-display uppercase tracking-widest text-white/50">
          <Link href="/" className="hover:text-white">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-white">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/shop?category=${product.category}`} className="hover:text-white">{product.category}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white">{product.name}</span>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* IMAGE GALLERY */}
          <div className="lg:w-1/2 flex flex-col md:flex-row-reverse gap-4">
            <div className="flex-1 aspect-[3/4] bg-zinc-900 overflow-hidden">
              <img 
                src={allImages[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex md:flex-col gap-4 overflow-auto md:w-24 hide-scrollbar">
              {allImages.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 md:w-full aspect-[3/4] flex-shrink-0 bg-zinc-900 border-2 transition-colors ${activeImage === idx ? 'border-primary' : 'border-transparent hover:border-white/50'}`}
                >
                  <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover opacity-80 hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>

          {/* PRODUCT INFO */}
          <div className="lg:w-1/2 flex flex-col">
            <div className="mb-8">
              {product.lgbtqFriendly && (
                <div className="text-primary text-xs font-display font-bold uppercase tracking-widest mb-4 inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Inclusive Sizing Available
                </div>
              )}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold uppercase tracking-widest mb-4 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 text-2xl font-sans">
                <span>${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-white/40 line-through">${product.originalPrice.toFixed(2)}</span>
                )}
                {product.isSale && (
                  <span className="text-accent text-sm font-display uppercase tracking-widest ml-4 bg-accent/10 px-3 py-1">Sale</span>
                )}
              </div>
            </div>

            <div className="prose prose-invert max-w-none text-white/70 font-sans mb-10 leading-relaxed">
              <p>{product.description}</p>
            </div>

            <div className="space-y-8 mb-10">
              {/* COLORS */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-display text-sm uppercase tracking-widest">Color</span>
                    <span className="text-white/50 text-sm">{selectedColor || "Select"}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-6 py-3 border text-sm font-sans uppercase tracking-wider transition-all
                          ${selectedColor === color 
                            ? 'border-white bg-white text-black' 
                            : 'border-white/20 hover:border-white'}`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SIZES */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-display text-sm uppercase tracking-widest">Size</span>
                    <button className="text-white/50 hover:text-white text-sm flex items-center gap-2 underline underline-offset-4 transition-colors">
                      <Ruler className="w-4 h-4" />
                      Size Guide
                    </button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 border text-sm font-sans uppercase tracking-wider transition-all
                          ${selectedSize === size 
                            ? 'border-primary bg-primary text-white' 
                            : 'border-white/20 hover:border-white'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <Button 
                onClick={handleAddToCart}
                disabled={!product.inStock || addToCart.isPending}
                className="flex-1 h-16 rounded-none bg-white text-black hover:bg-primary hover:text-white font-display uppercase tracking-widest text-sm font-bold transition-all"
              >
                {addToCart.isPending ? "Adding..." : product.inStock ? "Add to Bag" : "Sold Out"}
              </Button>
              <Button 
                onClick={handleAddToWishlist}
                disabled={addToWishlist.isPending}
                variant="outline"
                className="h-16 w-full sm:w-16 rounded-none border-white/20 bg-transparent hover:bg-white/10 hover:text-white"
              >
                <Heart className="w-5 h-5" />
              </Button>
            </div>

            {/* DETAILS */}
            <div className="mt-12 border-t border-white/10 pt-8 grid grid-cols-2 gap-y-4 text-sm font-sans text-white/60">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" /> Free US Shipping
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" /> Discreet Packaging
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" /> 30-Day Returns
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts && relatedProducts.length > 1 && (
          <section className="mt-32 border-t border-white/10 pt-20">
            <h2 className="text-3xl font-display uppercase tracking-widest mb-10 text-center">Complete The Look</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.filter(p => p.id !== product.id).slice(0, 4).map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
