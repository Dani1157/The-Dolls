import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/shared/ProductCard";
import { useGetShopSummary, useGetProducts } from "@workspace/api-client-react";
import heroImage from "@assets/hero_1774971624828.jpg";
import { ArrowRight, Play, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import categoryDress from "@/assets/category-dress.png";
import categoryHeels from "@/assets/category-heels.png";
import categoryAccessories from "@/assets/category-accessories.png";
import categoryMakeup from "@/assets/category-makeup.png";

export default function Home() {
  const { data: summary, isLoading: isSummaryLoading } = useGetShopSummary();
  const { data: featuredProducts, isLoading: isProductsLoading } = useGetProducts({ sort: "popular", limit: 4 });

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-white">
      <Navbar />
      
      <main>
        {/* HERO SECTION */}
        <section className="relative h-[100dvh] w-full overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 w-full h-full z-0">
            <img 
              src={heroImage} 
              alt="The Dolls Hero" 
              className="w-full h-full object-cover object-[center_20%] opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
          </div>
          
          <div className="container relative z-10 mx-auto px-4 mt-20">
            <div className="max-w-3xl">
              <h2 className="text-primary font-sans tracking-[0.3em] uppercase text-sm mb-6 flex items-center gap-4">
                <span className="w-12 h-px bg-primary"></span>
                The New Collection
              </h2>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold leading-[0.9] mb-8 text-glow">
                UNAPOLOGETIC <br/>
                <span className="text-transparent stroke-text" style={{ WebkitTextStroke: '2px white' }}>GLAMOUR.</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 font-sans max-w-xl mb-12 leading-relaxed">
                For the girls who command the room. High fashion, unapologetically bold, and designed to make you feel fabulous.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link href="/shop" className="bg-primary hover:bg-white hover:text-black text-white px-10 py-5 font-display tracking-widest uppercase text-sm font-bold transition-all duration-300 text-center flex items-center justify-center gap-3 group">
                  Shop The Runway
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/live" className="glass-panel px-10 py-5 font-display tracking-widest uppercase text-sm font-bold transition-all hover:bg-white/10 text-center flex items-center justify-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                  Watch Live Event
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* MARQUEE SECTION */}
        <section className="py-6 border-y border-white/10 bg-black/50 overflow-hidden relative">
          <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="mx-8 font-display text-2xl md:text-4xl font-bold uppercase tracking-widest text-transparent stroke-text" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>
                THE DOLLS <span className="text-primary inline-block mx-8 text-glow">✦</span>
              </span>
            ))}
          </div>
        </section>

        {/* FEATURED CATEGORIES */}
        <section className="py-32 container mx-auto px-4">
          <div className="flex items-end justify-between mb-16">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-wider mb-4">Curated Edits</h2>
              <p className="text-white/60 font-sans">Find your next obsession.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Dresses", image: categoryDress, link: "/shop?category=dresses" },
              { title: "Heels", image: categoryHeels, link: "/shop?category=heels" },
              { title: "Accessories", image: categoryAccessories, link: "/shop?category=accessories" },
              { title: "Beauty", image: categoryMakeup, link: "/shop?category=makeup" }
            ].map((cat, i) => (
              <Link key={i} href={cat.link} className="group relative aspect-[3/4] overflow-hidden block">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
                <img src={cat.image} alt={cat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                  <h3 className="font-display text-2xl font-bold uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{cat.title}</h3>
                  <div className="h-px w-0 bg-primary mt-4 group-hover:w-full transition-all duration-500" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* NEW ARRIVALS */}
        <section className="py-32 bg-zinc-950 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
              <div>
                <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-wider mb-4 flex items-center gap-4">
                  New Arrivals
                  <Star className="text-primary w-8 h-8 fill-primary" />
                </h2>
                <p className="text-white/60 font-sans max-w-xl">Fresh off the runway. The latest pieces designed for the bold and beautiful.</p>
              </div>
              <Link href="/shop" className="text-sm font-display tracking-widest uppercase border-b border-primary text-primary hover:text-white hover:border-white transition-colors pb-1">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {isProductsLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-[3/4] w-full bg-white/5 rounded-none" />
                    <Skeleton className="h-6 w-3/4 bg-white/5 rounded-none" />
                    <Skeleton className="h-4 w-1/4 bg-white/5 rounded-none" />
                  </div>
                ))
              ) : (
                featuredProducts?.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>
          </div>
        </section>

        {/* LIVE EVENT TEASER */}
        <section className="py-32 container mx-auto px-4">
          <div className="glass-panel p-8 md:p-16 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-1.5 font-display text-xs uppercase tracking-widest mb-6 border border-primary/30">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Live Event Tonight
                </div>
                <h2 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-wider mb-6">
                  Midnight <br/><span className="text-primary">Runway</span>
                </h2>
                <p className="text-lg text-white/70 font-sans mb-8 max-w-lg">
                  Join our exclusive live shopping event. Watch the new collection in motion, chat with the designers, and shop the looks straight from the runway.
                </p>
                <Link href="/live" className="inline-flex items-center gap-4 bg-white text-black hover:bg-primary hover:text-white px-8 py-4 font-display tracking-widest uppercase text-sm font-bold transition-colors">
                  <Play className="w-4 h-4 fill-current" />
                  Enter The Show
                </Link>
              </div>
              <div className="flex-1 w-full relative">
                <div className="aspect-[4/3] bg-zinc-900 overflow-hidden relative border border-white/10">
                  <img src={heroImage} alt="Live Event Teaser" className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full border border-white/30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                      <Play className="w-8 h-8 ml-2 text-white fill-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BRAND STORY */}
        <section className="py-32 relative flex items-center justify-center overflow-hidden min-h-[80vh]">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black/80 z-10" />
            <img src={categoryMakeup} alt="Brand Story" className="w-full h-full object-cover filter grayscale opacity-30" />
          </div>
          <div className="container relative z-20 mx-auto px-4 text-center max-w-4xl">
            <h2 className="font-display text-5xl md:text-7xl font-bold uppercase tracking-widest mb-8 text-glow">We See You.</h2>
            <p className="text-xl md:text-3xl font-serif text-white/90 leading-relaxed mb-12">
              "The Dolls isn't just a store. It's a statement. A sanctuary for trans women, femmes, and everyone who uses fashion as their armor and their art."
            </p>
            <Link href="/about" className="font-display tracking-widest uppercase text-sm border-b border-primary text-primary pb-2 hover:text-white hover:border-white transition-colors">
              Read Our Story
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
