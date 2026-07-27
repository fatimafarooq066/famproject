import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-[#1A1110] text-[#FAF6F2] py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-2">
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-wide mb-6">FAM Fashion</h2>
            <p className="text-[#C4A99E] max-w-sm text-sm leading-relaxed mb-8">
              Bringing luxury global makeup brands to Pakistan. Discover your perfect shade with our advanced AI virtual try-on technology.
            </p>
          </div>
          
          <div>
            <h3 className="font-serif text-xl mb-6 text-white">Categories</h3>
            <ul className="space-y-4 text-sm text-[#C4A99E]">
              <li><Link href="/shop?category=lips" className="hover:text-white transition-colors">Lips</Link></li>
              <li><Link href="/shop?category=eyes" className="hover:text-white transition-colors">Eyes</Link></li>
              <li><Link href="/shop?category=blush" className="hover:text-white transition-colors">Blush</Link></li>
              <li><Link href="/shop?category=foundation" className="hover:text-white transition-colors">Foundation</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif text-xl mb-6 text-white">Connect</h3>
            <ul className="space-y-4 text-sm text-[#C4A99E]">
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-white transition-colors">TikTok</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#3A2822] mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-[#9E8A7C]">
          <p>&copy; {new Date().getFullYear()} FAM Fashion. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}