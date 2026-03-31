import { Link, useLocation } from "wouter";
import { ShoppingBag, Heart, Menu, Search, User } from "lucide-react";
import { useGetCart, useGetWishlist } from "@workspace/api-client-react";

export function Navbar() {
  const [location] = useLocation();
  const { data: cart } = useGetCart();
  const { data: wishlist } = useGetWishlist();

  const isHome = location === "/";

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isHome ? "bg-gradient-to-b from-black/80 to-transparent" : "bg-black/95 backdrop-blur-md border-b border-white/10"}`}>
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Mobile Menu */}
        <div className="md:hidden flex items-center">
          <button className="p-2 text-white hover:text-primary transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Logo */}
        <div className="flex-1 md:flex-none flex justify-center md:justify-start">
          <Link href="/" className="text-3xl font-display font-bold tracking-widest text-white hover:text-primary transition-colors text-glow">
            THE DOLLS
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link href="/shop" className="text-sm font-medium tracking-widest uppercase text-white/80 hover:text-primary transition-colors">
            Runway
          </Link>
          <Link href="/shop?category=dresses" className="text-sm font-medium tracking-widest uppercase text-white/80 hover:text-primary transition-colors">
            Dresses
          </Link>
          <Link href="/shop?category=accessories" className="text-sm font-medium tracking-widest uppercase text-white/80 hover:text-primary transition-colors">
            Accessories
          </Link>
          <Link href="/live" className="text-sm font-medium tracking-widest uppercase text-primary hover:text-white transition-colors flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Live
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          <button className="text-white hover:text-primary transition-colors hidden md:block">
            <Search className="w-5 h-5" />
          </button>
          
          <Link href="/orders" className="text-white hover:text-primary transition-colors hidden md:block">
            <User className="w-5 h-5" />
          </Link>

          <Link href="/wishlist" className="text-white hover:text-primary transition-colors relative">
            <Heart className="w-5 h-5" />
            {wishlist && wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                {wishlist.length}
              </span>
            )}
          </Link>
          
          <Link href="/cart" className="text-white hover:text-primary transition-colors relative">
            <ShoppingBag className="w-5 h-5" />
            {cart && cart.itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                {cart.itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
