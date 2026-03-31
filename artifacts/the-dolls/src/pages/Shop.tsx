import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/shared/ProductCard";
import { useGetProducts, useGetCategories } from "@workspace/api-client-react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearch } from "wouter";

export default function Shop() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const initialCategory = searchParams.get('category') || "";
  const initialSearch = searchParams.get('search') || "";
  
  const [category, setCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sort, setSort] = useState<"newest" | "price_asc" | "price_desc" | "popular">("popular");

  const { data: products, isLoading } = useGetProducts({
    category: category || undefined,
    search: searchQuery || undefined,
    sort
  });

  const { data: categories } = useGetCategories();

  return (
    <div className="min-h-screen bg-black text-white font-sans pt-20">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-widest mb-6">The Runway</h1>
          <p className="text-white/60 font-sans text-lg">Curated high-fashion pieces for the bold and unapologetic.</p>
        </header>

        {/* Filters & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-zinc-950 p-4 border border-white/10">
          <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <button 
              onClick={() => setCategory("")}
              className={`whitespace-nowrap px-6 py-2 font-display text-sm uppercase tracking-widest transition-colors ${!category ? 'bg-primary text-white' : 'bg-transparent text-white/60 hover:text-white'}`}
            >
              All
            </button>
            {categories?.map(c => (
              <button 
                key={c.id}
                onClick={() => setCategory(c.slug)}
                className={`whitespace-nowrap px-6 py-2 font-display text-sm uppercase tracking-widest transition-colors ${category === c.slug ? 'bg-primary text-white' : 'bg-transparent text-white/60 hover:text-white'}`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input 
                type="search" 
                placeholder="Search pieces..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 bg-black border-white/20 text-white placeholder:text-white/40 rounded-none focus-visible:ring-primary font-sans h-10"
              />
            </div>
            
            <div className="relative hidden md:block">
              <select 
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="appearance-none bg-black border border-white/20 text-white font-display text-sm uppercase tracking-widest h-10 px-4 pr-10 rounded-none focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="popular">Popular</option>
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[3/4] w-full bg-white/5 rounded-none" />
                <Skeleton className="h-6 w-3/4 bg-white/5 rounded-none" />
                <Skeleton className="h-4 w-1/4 bg-white/5 rounded-none" />
              </div>
            ))
          ) : products && products.length > 0 ? (
            products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-2xl font-display uppercase tracking-widest text-white/40">No pieces found.</p>
              <button 
                onClick={() => { setCategory(""); setSearchQuery(""); }}
                className="mt-6 text-primary hover:text-white font-sans underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
