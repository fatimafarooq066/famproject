import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Camera, ShieldCheck, ShoppingBag } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { useCart } from "@/context/CartContext";

const FEATURED_IDS = [1, 4, 18, 17, 25, 11];

export default function Home() {
  const { addToCart } = useCart();
  const featuredProducts = PRODUCTS.filter(p => FEATURED_IDS.includes(p.id));

  return (
    <div className="w-full bg-[#FAF6F2] overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] bg-[#7B1C2E] flex items-center pt-20 overflow-hidden">
        {/* Floating background elements */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-20 top-20 w-96 h-96 opacity-40 mix-blend-screen pointer-events-none"
        >
          <img src="/products/ruby woo.png" alt="" className="w-full h-full object-contain scale-150" />
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -left-32 bottom-10 w-96 h-96 opacity-30 mix-blend-screen pointer-events-none"
        >
          <img src="/products/pillow talk.png" alt="" className="w-full h-full object-contain scale-150" />
        </motion.div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#C4A99E] font-medium tracking-[0.2em] uppercase text-sm mb-6"
            >
              The New Standard of Beauty
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-5xl md:text-7xl lg:text-8xl text-[#FAF6F2] leading-[1.1] mb-8"
            >
              Luxury Makeup, <br/>
              <span className="italic text-[#C4A99E]">Curated for You.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[#FAF6F2]/80 text-lg md:text-xl max-w-xl mb-10 leading-relaxed font-light"
            >
              Experience global beauty brands in Pakistan. Discover your perfect shade instantly with our advanced AI virtual try-on.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/try-on" className="inline-flex items-center justify-center gap-2 bg-[#FAF6F2] text-[#7B1C2E] px-8 py-4 rounded-none font-medium hover:bg-white transition-colors group">
                <Camera className="w-5 h-5" />
                Try On Virtually
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/shop" className="inline-flex items-center justify-center gap-2 border border-[#C4A99E] text-[#FAF6F2] px-8 py-4 rounded-none font-medium hover:bg-[#C4A99E]/10 transition-colors">
                Shop Collection
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="bg-[#3A2822] py-6 overflow-hidden flex whitespace-nowrap">
        <motion.div 
          animate={{ x: [0, -1035] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex gap-16 items-center text-[#C4A99E]/60 font-serif text-2xl tracking-widest uppercase"
        >
          {/* Repeat enough times to loop seamlessly */}
          <span>MAC Cosmetics</span><span>•</span>
          <span>NARS</span><span>•</span>
          <span>Charlotte Tilbury</span><span>•</span>
          <span>Fenty Beauty</span><span>•</span>
          <span>Huda Beauty</span><span>•</span>
          <span>Urban Decay</span><span>•</span>
          <span>NYX</span><span>•</span>
          <span>L'Oréal</span><span>•</span>
          <span>MAC Cosmetics</span><span>•</span>
          <span>NARS</span><span>•</span>
          <span>Charlotte Tilbury</span><span>•</span>
          <span>Fenty Beauty</span><span>•</span>
          <span>Huda Beauty</span><span>•</span>
          <span>Urban Decay</span><span>•</span>
          <span>NYX</span><span>•</span>
          <span>L'Oréal</span><span>•</span>
        </motion.div>
      </div>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl text-[#3A2822] mb-4">Cult Favorites</h2>
            <p className="text-[#9E8A7C] max-w-md">Our most loved formulas, shades, and finishes that deserve a spot in every vanity.</p>
          </div>
          <Link href="/shop" className="inline-flex items-center gap-2 text-[#7B1C2E] font-medium hover:opacity-70 transition-opacity pb-1 border-b border-[#7B1C2E]">
            View all products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {featuredProducts.map((product, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1 }}
              key={product.id} 
              className="group flex flex-col"
            >
              <div className="bg-white aspect-square mb-6 flex items-center justify-center p-8 relative overflow-hidden border border-[#EDE6DF] hover-elevate">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                
                {/* Hover actions */}
                <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
                  <button 
                    onClick={(e) => { e.preventDefault(); addToCart(product); }}
                    className="flex-1 bg-[#3A2822] text-white py-3 text-sm font-medium hover:bg-[#1A1110] transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Bag
                  </button>
                  <Link 
                    href="/try-on" 
                    className="flex-1 bg-[#FAF6F2] text-[#3A2822] py-3 text-sm font-medium hover:bg-white transition-colors border border-[#D9CEC8] flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" /> Try On
                  </Link>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs text-[#9E8A7C] uppercase tracking-wider font-semibold mb-1 block">{product.brand}</span>
                  <h3 className="font-serif text-2xl text-[#3A2822] mb-1">{product.name}</h3>
                  <p className="text-sm text-[#7B1C2E]">{product.shade} • {product.finish}</p>
                </div>
                <span className="font-medium text-[#3A2822]">Rs. {product.price.toLocaleString()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* VIRTUAL TRY ON BANNER */}
      <section className="bg-[#7B1C2E] text-[#FAF6F2] py-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-12 md:p-24 flex flex-col justify-center">
            <Sparkles className="w-10 h-10 text-[#C4A99E] mb-8" />
            <h2 className="font-serif text-4xl md:text-6xl mb-6 leading-tight">Your Face is the Canvas</h2>
            <p className="text-[#FAF6F2]/80 text-lg mb-10 leading-relaxed font-light max-w-md">
              Stop guessing your shade. Our advanced AI maps your facial features to let you virtually test lipsticks, eyeshadows, blushes, and foundations in real-time.
            </p>
            <Link href="/try-on" className="inline-flex items-center justify-center gap-2 bg-[#FAF6F2] text-[#7B1C2E] px-8 py-4 rounded-none font-medium hover:bg-white transition-colors w-max">
              <Camera className="w-5 h-5" /> Launch Try-On Studio
            </Link>
          </div>
          <div className="relative h-[400px] md:h-auto bg-[#631525]">
            <img src="/products/ruby woo shade.png" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] object-cover opacity-30 mix-blend-overlay" alt="" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#7B1C2E] to-transparent" />
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-64 h-80 border border-[#C4A99E]/40 p-4 relative backdrop-blur-sm bg-white/5">
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#C4A99E]" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#C4A99E]" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#C4A99E]" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#C4A99E]" />
                <div className="w-full h-full border border-dashed border-[#C4A99E]/20 flex items-center justify-center flex-col gap-4 text-[#FAF6F2]">
                   <span className="font-serif text-2xl italic">Scanning...</span>
                   <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#C4A99E] to-transparent animate-pulse" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-24 container mx-auto px-6">
        <h2 className="font-serif text-4xl md:text-5xl text-[#3A2822] mb-12 text-center">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Lips", img: "/products/ruby woo.png", href: "/shop?category=lips" },
            { name: "Eyes", img: "/products/half baked.png", href: "/shop?category=eyes" },
            { name: "Blush", img: "/products/orgasam.png", href: "/shop?category=blush" },
            { name: "Foundation", img: "/products/NC30.png", href: "/shop?category=foundation" },
          ].map((cat, i) => (
            <Link key={cat.name} href={cat.href} className="group block h-96 relative overflow-hidden bg-white border border-[#EDE6DF]">
              <div className="absolute inset-0 flex items-center justify-center p-12 transition-transform duration-700 group-hover:scale-110">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-contain mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <h3 className="absolute bottom-8 left-0 w-full text-center font-serif text-3xl text-[#3A2822] group-hover:text-white transition-colors duration-300 z-10">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-[#FDFBF9] py-24 border-t border-b border-[#EDE6DF]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#F7EFEA] flex items-center justify-center mb-6 text-[#7B1C2E]">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl text-[#3A2822] mb-4">100% Authentic</h3>
              <p className="text-[#9E8A7C] max-w-xs">Directly sourced from official global distributors. No replicas, guaranteed.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#F7EFEA] flex items-center justify-center mb-6 text-[#7B1C2E]">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl text-[#3A2822] mb-4">Curated Curation</h3>
              <p className="text-[#9E8A7C] max-w-xs">Handpicked shades tailored for Pakistani and South Asian skin tones.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#F7EFEA] flex items-center justify-center mb-6 text-[#7B1C2E]">
                <Camera className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl text-[#3A2822] mb-4">Try Before You Buy</h3>
              <p className="text-[#9E8A7C] max-w-xs">Test any product on your own face instantly with our AI technology.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}