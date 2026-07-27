import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function About() {
  return (
    <div className="bg-[#FAF6F2] min-h-screen pt-20">
      {/* Hero */}
      <section className="relative h-[60vh] bg-[#3A2822] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-40">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(196,169,158,0.2)_0%,transparent_100%)]" />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#C4A99E] tracking-[0.3em] uppercase text-sm font-semibold mb-6"
          >
            Our Story
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-5xl md:text-7xl text-[#FAF6F2] max-w-4xl mx-auto leading-tight"
          >
            Curating Global Luxury for Pakistan.
          </motion.h1>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-[#3A2822] mb-8 leading-relaxed">
            "We believe that premium beauty shouldn't be a geographical privilege. It should be accessible, authentic, and perfectly matched to you."
          </h2>
          <p className="text-lg text-[#9E8A7C] leading-relaxed mb-8">
            FAM Fashion was born from a simple frustration: finding authentic luxury makeup in Pakistan was too difficult. And once found, knowing if a shade would suit your skin tone was a gamble.
          </p>
          <p className="text-lg text-[#9E8A7C] leading-relaxed">
            We source directly from official distributors of MAC, NARS, Charlotte Tilbury, Urban Decay, Fenty Beauty, and more — ensuring 100% authenticity. But we didn't stop there. We integrated state-of-the-art AI technology so you can try before you buy, completely eliminating the guesswork.
          </p>
        </div>
      </section>

      {/* Technology */}
      <section className="bg-white py-24 border-y border-[#EDE6DF]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16 max-w-5xl mx-auto">
            <div className="flex-1 relative">
              <div className="aspect-[4/5] bg-[#F7EFEA] border border-[#C4A99E]/30 relative overflow-hidden">
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  <div className="flex justify-between items-center text-[#7B1C2E]">
                    <div className="w-2 h-2 rounded-full bg-[#7B1C2E] animate-pulse" />
                    <span className="font-mono text-xs uppercase tracking-widest">Vision Engine v2.0</span>
                  </div>
                  <div className="self-center flex flex-col items-center mt-8">
                    <div className="w-40 h-40 rounded-full border border-[#7B1C2E]/20 flex items-center justify-center relative">
                      <div className="absolute inset-0 border border-[#7B1C2E] rounded-full animate-[spin_4s_linear_infinite] border-t-transparent" />
                      <span className="font-serif text-[#7B1C2E] text-xl italic">Scanning</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono text-[#9E8A7C] uppercase mt-auto">
                    <div>Skin Tone: <span className="text-[#3A2822]">Detecting...</span></div>
                    <div>Feature Map: <span className="text-[#3A2822]">468 pts</span></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="font-serif text-4xl text-[#3A2822] mb-6">The Magic Behind the Mirror</h2>
              <p className="text-[#9E8A7C] mb-6 leading-relaxed">
                Our Virtual Try-On studio uses advanced MediaPipe face-mapping technology. By detecting 468 precise facial landmarks in real-time, the engine understands your unique facial structure, lighting, and skin tone.
              </p>
              <p className="text-[#9E8A7C] mb-8 leading-relaxed">
                We've painstakingly digitized the exact hex codes, finishes, and opacity levels of every product in our catalog. A matte lipstick applies differently than a sheer gloss. A shimmering blush catches the light differently than a matte powder. Our engine replicates these real-world physics so what you see on screen is what you get in the mail.
              </p>
              <Link href="/try-on" className="inline-flex items-center gap-2 text-[#7B1C2E] font-medium hover:opacity-70 transition-opacity pb-1 border-b border-[#7B1C2E]">
                Experience it now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-24 bg-[#3A2822] text-[#FAF6F2]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl mb-16 text-[#C4A99E]">The Houses We Carry</h2>
          <div className="flex flex-wrap justify-center gap-x-16 gap-y-12 max-w-4xl mx-auto font-serif text-2xl md:text-4xl tracking-widest uppercase opacity-80">
            <span>MAC</span>
            <span>NARS</span>
            <span>Charlotte Tilbury</span>
            <span>Urban Decay</span>
            <span>Fenty Beauty</span>
            <span>Huda Beauty</span>
            <span>NYX</span>
            <span>L'Oréal</span>
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-32 text-center container mx-auto px-6">
        <h2 className="font-serif text-5xl md:text-6xl text-[#3A2822] mb-8">Ready to find your shade?</h2>
        <Link href="/shop" className="inline-flex items-center justify-center bg-[#7B1C2E] text-white px-10 py-5 text-lg font-medium hover:bg-[#631525] transition-colors shadow-xl shadow-[#7B1C2E]/20">
          Start Shopping
        </Link>
      </section>
    </div>
  );
}