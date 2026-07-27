import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { ShoppingCart, Menu, X, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount, isCartOpen, setIsCartOpen, cartItems, removeFromCart, cartTotal } = useCart();

  const isHome = location === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navClass = isHome
    ? isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent text-white"
    : "bg-white shadow-sm";

  const textClass = isHome && !isScrolled ? "text-white" : "text-[#3A2822]";
  const logoClass = isHome && !isScrolled ? "text-white" : "text-[#7B1C2E]";

  return (
    <>
      <header className={`fixed top-0 w-full z-40 transition-all duration-300 ${navClass}`}>
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className={`md:hidden ${textClass}`} onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className={`font-serif text-2xl md:text-3xl font-bold tracking-wide ${logoClass}`}>
              FAM Fashion
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className={`text-sm font-medium hover:opacity-70 transition-opacity ${textClass}`}>Home</Link>
            <Link href="/shop" className={`text-sm font-medium hover:opacity-70 transition-opacity ${textClass}`}>Shop</Link>
            <Link href="/try-on" className={`text-sm font-medium hover:opacity-70 transition-opacity ${textClass}`}>Virtual Try-On</Link>
            <Link href="/about" className={`text-sm font-medium hover:opacity-70 transition-opacity ${textClass}`}>About</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={() => setIsCartOpen(true)} className={`relative flex items-center justify-center p-2 rounded-full hover:bg-black/5 transition-colors ${textClass}`}>
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-[#7B1C2E] text-white text-xs font-bold rounded-full flex items-center justify-center translate-x-1 -translate-y-1">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-xl flex flex-col">
            <div className="p-6 border-b border-[#EDE6DF] flex justify-between items-center">
              <span className="font-serif text-2xl font-bold text-[#7B1C2E]">FAM Fashion</span>
              <button onClick={() => setMobileMenuOpen(false)}><X className="w-6 h-6 text-[#3A2822]" /></button>
            </div>
            <nav className="flex flex-col p-6 gap-6 text-[#3A2822] text-lg font-medium">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link href="/shop" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
              <Link href="/try-on" onClick={() => setMobileMenuOpen(false)}>Virtual Try-On</Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
            </nav>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right">
            <div className="p-6 border-b border-[#EDE6DF] flex justify-between items-center bg-[#FAF6F2]">
              <span className="font-serif text-2xl font-semibold text-[#3A2822]">Your Bag ({cartCount})</span>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <X className="w-6 h-6 text-[#3A2822]" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-[#9E8A7C]">
                  <ShoppingCart className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg">Your bag is empty.</p>
                  <Button onClick={() => setIsCartOpen(false)} className="mt-6 bg-[#7B1C2E] hover:bg-[#631525] text-white rounded-none">
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-[#EDE6DF] pb-6">
                    <div className="w-24 h-24 bg-[#F7EFEA] flex-shrink-0 relative border border-[#EDE6DF]">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs text-[#9E8A7C] uppercase tracking-wider font-semibold">{item.brand}</p>
                          <h4 className="font-serif text-lg text-[#3A2822]">{item.name}</h4>
                          <p className="text-sm text-[#7B1C2E]">{item.shade}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-[#9E8A7C] hover:text-[#7B1C2E]">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="mt-auto">
                        <p className="font-medium text-[#3A2822]">Rs. {item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-[#EDE6DF] bg-[#FAF6F2]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[#3A2822] font-medium">Subtotal</span>
                  <span className="text-xl font-serif font-bold text-[#7B1C2E]">Rs. {cartTotal.toLocaleString()}</span>
                </div>
                <Button className="w-full bg-[#7B1C2E] hover:bg-[#631525] text-white rounded-none h-14 text-lg">
                  Checkout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}