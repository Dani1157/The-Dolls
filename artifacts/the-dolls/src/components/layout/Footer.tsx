import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10 text-white/70">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link href="/" className="text-3xl font-display font-bold tracking-widest text-white text-glow mb-6 inline-block">
              THE DOLLS
            </Link>
            <p className="text-sm leading-relaxed mb-6 font-sans">
              Unapologetically bold. Dripping with glamour. Fashion that sees you, celebrates you, and makes you feel fabulous. For trans women, non-binary folks, and all girls.
            </p>
          </div>
          
          <div>
            <h4 className="font-display font-semibold text-white tracking-widest uppercase mb-6">Shop</h4>
            <ul className="space-y-4 text-sm font-sans">
              <li><Link href="/shop" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/shop?category=dresses" className="hover:text-primary transition-colors">Dresses</Link></li>
              <li><Link href="/shop?category=accessories" className="hover:text-primary transition-colors">Accessories</Link></li>
              <li><Link href="/shop?category=heels" className="hover:text-primary transition-colors">Heels</Link></li>
              <li><Link href="/shop?isSale=true" className="hover:text-primary transition-colors">Sale</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-semibold text-white tracking-widest uppercase mb-6">Experience</h4>
            <ul className="space-y-4 text-sm font-sans">
              <li><Link href="/live" className="hover:text-primary transition-colors">Live Runway</Link></li>
              <li><Link href="/lookbook" className="hover:text-primary transition-colors">Lookbook</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-semibold text-white tracking-widest uppercase mb-6">Support</h4>
            <ul className="space-y-4 text-sm font-sans">
              <li><Link href="/orders" className="hover:text-primary transition-colors">My Orders</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 font-sans text-xs">
          <p>&copy; {new Date().getFullYear()} The Dolls. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
