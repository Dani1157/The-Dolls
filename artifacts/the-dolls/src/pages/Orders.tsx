import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useGetOrders } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ArrowRight, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function Orders() {
  const { data: orders, isLoading } = useGetOrders();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
      case 'processing': return 'text-blue-500 border-blue-500/30 bg-blue-500/10';
      case 'shipped': return 'text-purple-500 border-purple-500/30 bg-purple-500/10';
      case 'delivered': return 'text-primary border-primary/30 bg-primary/10';
      case 'cancelled': return 'text-destructive border-destructive/30 bg-destructive/10';
      default: return 'text-white border-white/30 bg-white/10';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pt-20">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 lg:py-20">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-widest mb-6">Order History</h1>
          <p className="text-white/60 font-sans text-lg">Track your fabulous deliveries.</p>
        </header>

        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full bg-zinc-950 border border-white/5 rounded-none" />
            ))}
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="text-center py-32 bg-zinc-950 border border-white/10 flex flex-col items-center justify-center">
            <Package className="w-16 h-16 text-white/20 mb-6" />
            <h2 className="text-2xl font-display uppercase tracking-widest mb-4">No orders yet</h2>
            <p className="text-white/60 mb-8 font-sans max-w-md">You haven't made any purchases. Let's fix that.</p>
            <Link href="/shop" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 font-display uppercase tracking-widest text-sm font-bold hover:bg-primary hover:text-white transition-colors">
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="bg-zinc-950 border border-white/10 p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8 border-b border-white/10 pb-6">
                  <div>
                    <h3 className="font-display text-xl uppercase tracking-widest mb-1">Order #{order.id}</h3>
                    <p className="text-white/50 text-sm">{format(new Date(order.createdAt), 'MMMM dd, yyyy')}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-white/50 text-xs font-display uppercase tracking-widest mb-1">Total</p>
                      <p className="font-sans font-medium text-lg">${order.total.toFixed(2)}</p>
                    </div>
                    <span className={`px-4 py-1.5 text-xs font-display uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-6">
                      <Link href={`/product/${item.product.id}`} className="w-20 aspect-[3/4] bg-black shrink-0">
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                      </Link>
                      <div className="flex-1 flex flex-col justify-center">
                        <Link href={`/product/${item.product.id}`} className="font-display text-lg uppercase tracking-wide hover:text-primary transition-colors mb-1">
                          {item.product.name}
                        </Link>
                        <div className="text-white/60 text-sm font-sans space-x-4">
                          <span>Qty: {item.quantity}</span>
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </div>
                      </div>
                      <div className="hidden md:flex flex-col justify-center text-right font-sans">
                        <span className="text-white">${item.product.price.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-sm text-white/50 font-sans">Shipping to: {order.shippingAddress}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
