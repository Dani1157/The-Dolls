import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/shared/ProductCard";
import { useGetWishlist } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ArrowRight, HeartCrack } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Wishlist() {
  const { data: wishlist, isLoading } = useGetWishlist();

  return (
    <div className="min-h-screen bg-black text-white font-sans pt-20">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 lg:py-20">
        <header className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-widest mb-6">Wishlist</h1>
          <p className="text-white/60 font-sans text-lg">Your curated collection of obsessions.</p>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[3/4] w-full bg-white/5 rounded-none" />
                <Skeleton className="h-6 w-3/4 bg-white/5 rounded-none" />
                <Skeleton className="h-4 w-1/4 bg-white/5 rounded-none" />
              </div>
            ))}
          </div>
        ) : !wishlist || wishlist.length === 0 ? (
          <div className="text-center py-32 bg-zinc-950 border border-white/10 flex flex-col items-center justify-center">
            <HeartCrack className="w-16 h-16 text-white/20 mb-6" />
            <h2 className="text-2xl font-display uppercase tracking-widest mb-4">Nothing here yet</h2>
            <p className="text-white/60 mb-8 font-sans max-w-md">You haven't saved any pieces. Heart your favorite items to build your dream closet.</p>
            <Link href="/shop" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 font-display uppercase tracking-widest text-sm font-bold hover:bg-white hover:text-black transition-colors">
              Explore The Runway <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {wishlist.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
