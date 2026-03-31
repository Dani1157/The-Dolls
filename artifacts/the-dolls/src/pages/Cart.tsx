import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  useGetCart, 
  useRemoveCartItem, 
  useUpdateCartItem,
  useCreateOrder,
  getGetCartQueryKey
} from "@workspace/api-client-react";
import { Minus, Plus, X, ArrowRight, Lock } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Cart() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: cart, isLoading } = useGetCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const createOrder = useCreateOrder();

  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateItem.mutate(
      { itemId, data: { quantity: newQuantity } },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() }) }
    );
  };

  const handleRemove = (itemId: number) => {
    removeItem.mutate(
      { itemId },
      { 
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          toast.success("Item removed");
        }
      }
    );
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !address) {
      toast.error("Please fill in all shipping details");
      return;
    }

    createOrder.mutate(
      { data: { email, shippingAddress: address } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          toast.success("Order placed successfully!", {
            description: "You're going to look fabulous."
          });
          setLocation("/orders");
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pt-20">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 lg:py-20">
        <h1 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-widest mb-12">Your Bag</h1>

        {!isLoading && cart?.items.length === 0 ? (
          <div className="text-center py-20 bg-zinc-950 border border-white/10">
            <h2 className="text-2xl font-display uppercase tracking-widest mb-6">Your bag is empty</h2>
            <p className="text-white/60 mb-8 font-sans">Ready to serve a look?</p>
            <Link href="/shop" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 font-display uppercase tracking-widest text-sm font-bold hover:bg-primary hover:text-white transition-colors">
              Shop The Runway <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
            
            {/* ITEMS LIST */}
            <div className="lg:w-2/3 space-y-8">
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-white/20 text-xs font-display uppercase tracking-widest text-white/50">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-3 text-right">Total</div>
              </div>

              {cart?.items.map((item) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 py-6 border-b border-white/10 relative group">
                  
                  {/* Product Info */}
                  <div className="md:col-span-6 flex gap-6">
                    <Link href={`/product/${item.product.id}`} className="w-24 aspect-[3/4] bg-zinc-900 shrink-0">
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                    </Link>
                    <div className="flex flex-col justify-center">
                      <Link href={`/product/${item.product.id}`} className="font-display text-lg uppercase tracking-wide hover:text-primary transition-colors mb-2">
                        {item.product.name}
                      </Link>
                      <div className="text-white/60 text-sm font-sans space-y-1">
                        {item.size && <p>Size: {item.size}</p>}
                        {item.color && <p>Color: {item.color}</p>}
                        <p className="text-white">${item.product.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Mobile Total (Shows only on mobile above qty) */}
                  <div className="md:hidden flex justify-between items-center font-sans font-medium text-lg">
                    <span>Total</span>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>

                  {/* Quantity */}
                  <div className="md:col-span-3 flex items-center md:justify-center">
                    <div className="flex items-center border border-white/20">
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-white/10 transition-colors"
                        disabled={updateItem.isPending}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-sans">{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-white/10 transition-colors"
                        disabled={updateItem.isPending}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Total & Remove */}
                  <div className="hidden md:flex md:col-span-3 items-center justify-end font-sans font-medium text-lg">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>

                  <button 
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-6 right-0 text-white/40 hover:text-destructive transition-colors md:opacity-0 group-hover:opacity-100"
                    title="Remove item"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* CHECKOUT SECTION */}
            <div className="lg:w-1/3">
              <div className="bg-zinc-950 p-8 border border-white/10 sticky top-24">
                <h3 className="font-display text-2xl uppercase tracking-widest mb-8 border-b border-white/10 pb-4">Order Summary</h3>
                
                <div className="space-y-4 text-sm font-sans mb-8">
                  <div className="flex justify-between text-white/70">
                    <span>Subtotal</span>
                    <span>${cart?.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex justify-between text-xl font-medium">
                    <span>Total</span>
                    <span>${cart?.total.toFixed(2)}</span>
                  </div>
                </div>

                <form onSubmit={handleCheckout} className="space-y-6">
                  <div>
                    <label className="block text-xs font-display uppercase tracking-widest text-white/60 mb-2">Email</label>
                    <Input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-black border-white/20 rounded-none focus-visible:ring-primary font-sans h-12" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-display uppercase tracking-widest text-white/60 mb-2">Shipping Address</label>
                    <Input 
                      type="text" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="bg-black border-white/20 rounded-none focus-visible:ring-primary font-sans h-12" 
                      required 
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={createOrder.isPending}
                    className="w-full h-14 rounded-none bg-primary hover:bg-white text-white hover:text-black font-display uppercase tracking-widest text-sm font-bold transition-all flex items-center justify-center gap-2 mt-4"
                  >
                    {createOrder.isPending ? "Processing..." : (
                      <>
                        <Lock className="w-4 h-4" /> Secure Checkout
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
