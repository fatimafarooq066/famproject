import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingBag, Sparkles, SlidersHorizontal, X } from "lucide-react";
import { PRODUCTS, Category, SkinTone, Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Shop() {
  const { addToCart } = useCart();
  const [location] = useLocation();
  
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [activeSkinTone, setActiveSkinTone] = useState<SkinTone | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (window.location.search.includes("category=lips")) setActiveCategory("lips");
    if (window.location.search.includes("category=eyes")) setActiveCategory("eyes");
    if (window.location.search.includes("category=blush")) setActiveCategory("blush");
    if (window.location.search.includes("category=foundation")) setActiveCategory("foundation");
  }, [location]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchCat = activeCategory === "all" || p.category === activeCategory;
      const matchTone = activeSkinTone === "all" || p.suitableFor.includes(activeSkinTone);
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchTone && matchSearch;
    });
  }, [activeCategory, activeSkinTone, searchQuery]);

  const categories: { id: Category | "all", label: string }[] = [
    { id: "all", label: "All Products" },
    { id: "lips", label: "Lips" },
    { id: "eyes", label: "Eyes" },
    { id: "blush", label: "Blush" },
    { id: "foundation", label: "Foundation" },
  ];

  const skinTones: { id: SkinTone | "all", label: string, color?: string }[] = [
    { id: "all", label: "All Skin Tones" },
    { id: "fair", label: "Fair", color: "#F5E0C8" },
    { id: "light", label: "Light", color: "#E8C9A0" },
    { id: "medium", label: "Medium", color: "#C8956A" },
    { id: "tan", label: "Tan", color: "#A0623A" },
    { id: "deep", label: "Deep", color: "#5C3317" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6F2] pt-20 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-[#EDE6DF] py-12 md:py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-[#3A2822] mb-4">The Collection</h1>
          <p className="text-[#9E8A7C] max-w-xl mx-auto">Explore our curated selection of global luxury makeup. Filter by category or find your perfect match by skin tone.</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex justify-between items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E8A7C]" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#EDE6DF] rounded-none py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#7B1C2E]"
              />
            </div>
            <button 
              onClick={() => setIsMobileFiltersOpen(true)}
              className="bg-white border border-[#EDE6DF] p-3 text-[#3A2822]"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Sidebar / Filters */}
          <aside className={`
            fixed inset-y-0 left-0 z-50 w-[280px] bg-[#FAF6F2] p-6 shadow-2xl transform transition-transform duration-300 lg:translate-x-0 lg:static lg:w-64 lg:p-0 lg:shadow-none lg:bg-transparent lg:z-auto
            ${isMobileFiltersOpen ? "translate-x-0" : "-translate-x-full"}
          `}>
            <div className="flex justify-between items-center lg:hidden mb-8">
              <span className="font-serif text-2xl text-[#3A2822]">Filters</span>
              <button onClick={() => setIsMobileFiltersOpen(false)}><X className="w-6 h-6 text-[#3A2822]" /></button>
            </div>

            <div className="hidden lg:block relative mb-10">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E8A7C]" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#EDE6DF] rounded-none py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#7B1C2E]"
              />
            </div>

            <div className="mb-10">
              <h3 className="text-sm font-semibold tracking-widest uppercase text-[#3A2822] mb-5">Category</h3>
              <div className="space-y-3">
                {categories.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.id); setIsMobileFiltersOpen(false); }}
                    className={`block w-full text-left text-sm transition-colors ${activeCategory === cat.id ? "text-[#7B1C2E] font-semibold" : "text-[#9E8A7C] hover:text-[#3A2822]"}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold tracking-widest uppercase text-[#3A2822] mb-5">Skin Tone</h3>
              <div className="space-y-3">
                {skinTones.map(tone => (
                  <button 
                    key={tone.id}
                    onClick={() => { setActiveSkinTone(tone.id); setIsMobileFiltersOpen(false); }}
                    className={`flex items-center gap-3 w-full text-left text-sm transition-colors ${activeSkinTone === tone.id ? "text-[#7B1C2E] font-semibold" : "text-[#9E8A7C] hover:text-[#3A2822]"}`}
                  >
                    {tone.color && <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: tone.color }} />}
                    {tone.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>
          
          {/* Overlay for mobile sidebar */}
          {isMobileFiltersOpen && (
            <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setIsMobileFiltersOpen(false)} />
          )}

          {/* Product Grid */}
          <main className="flex-1">
            <div className="mb-6 text-sm text-[#9E8A7C]">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-[#EDE6DF] p-16 text-center">
                <p className="text-[#3A2822] font-serif text-2xl mb-2">No products found</p>
                <p className="text-[#9E8A7C]">Try adjusting your filters or search query.</p>
                <button 
                  onClick={() => { setActiveCategory("all"); setActiveSkinTone("all"); setSearchQuery(""); }}
                  className="mt-6 text-[#7B1C2E] border-b border-[#7B1C2E] pb-1 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
                <AnimatePresence>
                  {filteredProducts.map(product => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      key={product.id} 
                      className="group flex flex-col"
                    >
                      <div className="bg-white aspect-square mb-4 flex items-center justify-center p-6 relative overflow-hidden border border-[#EDE6DF] hover-elevate">
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                        
                        {/* Hover actions */}
                        <div className="absolute inset-x-0 bottom-0 p-2 md:p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex flex-col md:flex-row gap-2 bg-gradient-to-t from-white/90 to-transparent pt-12">
                          <button 
                            onClick={(e) => { e.preventDefault(); addToCart(product); }}
                            className="flex-1 bg-[#3A2822] text-white py-2.5 text-xs font-medium hover:bg-[#1A1110] transition-colors flex items-center justify-center gap-1.5"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" /> <span className="hidden md:inline">Add</span>
                          </button>
                          <Link 
                            href="/try-on" 
                            className="flex-1 bg-[#FAF6F2] text-[#3A2822] py-2.5 text-xs font-medium hover:bg-white transition-colors border border-[#D9CEC8] flex items-center justify-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5" /> <span className="hidden md:inline">Try</span>
                          </Link>
                        </div>
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="text-[10px] md:text-xs text-[#9E8A7C] uppercase tracking-wider font-semibold mb-1">{product.brand}</span>
                        <h3 className="font-serif text-lg md:text-xl text-[#3A2822] leading-tight mb-1">{product.name}</h3>
                        <p className="text-xs md:text-sm text-[#7B1C2E] mb-3">{product.shade}</p>
                        <div className="mt-auto flex justify-between items-center">
                          <span className="font-medium text-[#3A2822] text-sm md:text-base">Rs. {product.price.toLocaleString()}</span>
                          {/* Mobile quick add */}
                          <button onClick={(e) => { e.preventDefault(); addToCart(product); }} className="md:hidden w-8 h-8 rounded-full bg-[#F7EFEA] flex items-center justify-center text-[#7B1C2E]">
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}