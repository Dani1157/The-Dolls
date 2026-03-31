import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { 
  useGetCurrentLiveEvent, 
  useGetLiveFeed,
  getGetLiveFeedQueryKey,
  useGetProducts
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Heart, MessageCircle, Share2, Eye, X } from "lucide-react";
import { Link } from "wouter";
import liveEventImg1 from "@/assets/live-event-1.png";
import liveEventImg2 from "@/assets/live-event-2.png";

export default function Live() {
  const queryClient = useQueryClient();
  const { data: currentEvent } = useGetCurrentLiveEvent();
  const { data: feed } = useGetLiveFeed();
  
  // Use featured products IDs from the event to fetch the actual products
  const productIds = currentEvent?.featuredProducts || [];
  const { data: allProducts } = useGetProducts();
  const featuredProducts = allProducts?.filter(p => productIds.includes(p.id)) || [];

  const [activeProduct, setActiveProduct] = useState<number | null>(null);

  useEffect(() => {
    // Auto refresh feed every 3 seconds
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: getGetLiveFeedQueryKey() });
    }, 3000);
    return () => clearInterval(interval);
  }, [queryClient]);

  // Set initial active product when they load
  useEffect(() => {
    if (featuredProducts.length > 0 && !activeProduct) {
      setActiveProduct(featuredProducts[0].id);
    }
  }, [featuredProducts, activeProduct]);

  const activeProductData = featuredProducts.find(p => p.id === activeProduct);

  const getMessageStyle = (type: string) => {
    switch (type) {
      case 'purchase': return 'text-primary font-bold';
      case 'join': return 'text-white/40 italic';
      case 'heart': return 'text-accent';
      default: return 'text-white';
    }
  };

  return (
    <div className="min-h-[100dvh] bg-black text-white font-sans flex flex-col h-screen overflow-hidden">
      <Navbar />
      
      <main className="flex-1 flex flex-col lg:flex-row pt-20 h-full">
        
        {/* VIDEO/MAIN SECTION */}
        <div className="flex-1 relative bg-zinc-950 flex flex-col">
          {/* Video Placeholder */}
          <div className="relative flex-1 min-h-[40vh] lg:min-h-0 bg-black">
            <img 
              src={liveEventImg1} 
              alt="Live Show" 
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
            
            {/* Live Indicators */}
            <div className="absolute top-6 left-6 flex items-center gap-4">
              <div className="bg-primary text-white px-3 py-1 font-display text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                LIVE
              </div>
              <div className="bg-black/50 backdrop-blur-md px-3 py-1 font-sans text-xs flex items-center gap-2 border border-white/10">
                <Eye className="w-4 h-4 text-white/70" />
                {currentEvent?.viewerCount || 1245} viewing
              </div>
            </div>

            {/* Event Info Overlay */}
            <div className="absolute bottom-6 left-6 right-6 lg:right-auto lg:w-2/3">
              <h1 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-wider mb-2 text-glow">
                {currentEvent?.title || "Midnight Runway"}
              </h1>
              <p className="text-white/80 font-sans hidden md:block">
                {currentEvent?.description || "Join us for an exclusive look at the new collection. Hosted by special guests."}
              </p>
            </div>
          </div>
          
          {/* Featured Products Bar (Horizontal on Mobile, Bottom on Desktop) */}
          <div className="h-40 lg:h-48 bg-zinc-950 border-t border-white/10 flex items-center overflow-x-auto hide-scrollbar px-4 gap-4">
            {featuredProducts.map(product => (
              <button 
                key={product.id}
                onClick={() => setActiveProduct(product.id)}
                className={`shrink-0 w-24 lg:w-32 group relative transition-all duration-300 ${activeProduct === product.id ? 'ring-2 ring-primary -translate-y-2' : 'opacity-60 hover:opacity-100'}`}
              >
                <div className="aspect-[3/4] bg-black">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                </div>
                {activeProduct === product.id && (
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center border-2 border-black z-10">
                    <ShoppingBag className="w-3 h-3" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* SIDEBAR (Chat & Product Info) */}
        <div className="w-full lg:w-[400px] xl:w-[450px] bg-black border-l border-white/10 flex flex-col h-[60vh] lg:h-full z-10">
          
          {/* Active Product Focus */}
          {activeProductData && (
            <div className="p-6 border-b border-white/10 bg-gradient-to-b from-zinc-900 to-black relative">
              <div className="flex gap-4">
                <div className="w-20 aspect-[3/4] bg-black shrink-0 border border-white/10">
                  <img src={activeProductData.imageUrl} alt={activeProductData.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <div className="text-primary text-[10px] font-display uppercase tracking-widest mb-1">On the runway</div>
                    <h3 className="font-display font-bold uppercase tracking-wider text-sm md:text-base leading-tight mb-1">
                      {activeProductData.name}
                    </h3>
                    <div className="font-sans font-medium">${activeProductData.price.toFixed(2)}</div>
                  </div>
                  <Link href={`/product/${activeProductData.id}`} className="bg-white text-black px-4 py-2 font-display uppercase tracking-widest text-xs font-bold text-center hover:bg-primary hover:text-white transition-colors mt-2">
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Chat Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col-reverse hide-scrollbar scroll-smooth">
            {feed?.slice().reverse().map((msg) => (
              <div key={msg.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <span className="font-display font-bold text-xs text-white/50 mr-2">{msg.username}</span>
                <span className={`font-sans text-sm inline-flex items-center gap-1 ${getMessageStyle(msg.type)}`}>
                  {msg.type === 'purchase' && <ShoppingBag className="w-3 h-3 inline" />}
                  {msg.type === 'heart' && <Heart className="w-3 h-3 inline fill-current" />}
                  {msg.message}
                </span>
              </div>
            ))}
            <div className="text-center text-xs text-white/30 font-display uppercase tracking-widest my-4">
              Welcome to the chat
            </div>
          </div>

          {/* Chat Input & Actions */}
          <div className="p-4 border-t border-white/10 bg-zinc-950 pb-safe">
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-black border border-white/20 rounded-full flex items-center px-4 h-10">
                <input 
                  type="text" 
                  placeholder="Say something..." 
                  className="bg-transparent border-none outline-none w-full text-sm font-sans placeholder:text-white/30 text-white"
                />
              </div>
              <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
