export type SkinTone = "fair" | "light" | "medium" | "tan" | "deep";
export type Category = "lips" | "eyes" | "blush" | "foundation";

export interface Product {
  id: number;
  name: string;
  shade: string;
  category: Category;
  color: string;
  price: number;
  brand: string;
  finish: string;
  suitableFor: SkinTone[];
  image: string;
  shadeImage?: string;
}

export const PRODUCTS: Product[] = [
  // LIPS
  { id:1, name:"Ruby Woo", shade:"Retro Matte", category: "lips", color:"#9B1B1B", price:6200, brand:"MAC", finish:"Matte", suitableFor:["medium","tan","deep"], image:"/products/ruby woo.png", shadeImage:"/products/ruby woo shade.png" },
  { id:2, name:"Velvet Teddy", shade:"Matte", category: "lips", color:"#9B7155", price:6200, brand:"MAC", finish:"Matte", suitableFor:["light","medium"], image:"/products/velvet teddy.png", shadeImage:"/products/velvet teddy shade.png" },
  { id:3, name:"Diva", shade:"Matte", category: "lips", color:"#572137", price:6200, brand:"MAC", finish:"Matte", suitableFor:["tan","deep"], image:"/products/diva.png", shadeImage:"/products/diva shade.png" },
  { id:4, name:"Pillow Talk", shade:"Matte Revolution", category: "lips", color:"#C07A8C", price:10700, brand:"Charlotte Tilbury", finish:"Matte", suitableFor:["fair","light"], image:"/products/pillow talk.png", shadeImage:"/products/pillow talk shade.png" },
  { id:5, name:"Walk of No Shame", shade:"Matte", category: "lips", color:"#B83A3A", price:10700, brand:"Charlotte Tilbury", finish:"Matte", suitableFor:["medium","tan"], image:"/products/walk of no shame.png", shadeImage:"/products/walk of no shame shade.png" },
  { id:6, name:"Vienna", shade:"Soft Matte", category: "lips", color:"#C4A0A8", price:2800, brand:"NYX", finish:"Soft Matte", suitableFor:["fair","light","medium"], image:"/products/vienna.png", shadeImage:"/products/vienna shade.png" },
  { id:7, name:"Cannes", shade:"Soft Matte", category: "lips", color:"#B22222", price:2800, brand:"NYX", finish:"Soft Matte", suitableFor:["medium","tan","deep"], image:"/products/cannes.png", shadeImage:"/products/cannes shade.png" },
  { id:8, name:"Jungle Red", shade:"Satin Lip Pencil", category: "lips", color:"#C41E3A", price:10100, brand:"NARS", finish:"Satin", suitableFor:["medium","tan","deep"], image:"/products/jungle red.png", shadeImage:"/products/juncle red shade.png" },
  { id:9, name:"Dragon Girl", shade:"Powermatte", category: "lips", color:"#8B1A3A", price:10100, brand:"NARS", finish:"Powermatte", suitableFor:["tan","deep"], image:"/products/dragon girl.png", shadeImage:"/products/dragon girl shade.png" },
  { id:10, name:"Raspberry Red", shade:"Colour Riche", category: "lips", color:"#C0396B", price:3400, brand:"L'Oréal", finish:"Satin", suitableFor:["medium","tan","deep"], image:"/products/rasberry red.png", shadeImage:"/products/rasberry red shade.png" },
  
  // EYES
  { id:11, name:"Half Baked", shade:"Eyeshadow", category: "eyes", color:"#A0693C", price:6700, brand:"Urban Decay", finish:"Shimmer", suitableFor:["fair","light","medium","tan","deep"], image:"/products/half baked.png", shadeImage:"/products/half baked shade.png" },
  { id:12, name:"Midnight Cowboy", shade:"Eyeshadow", category: "eyes", color:"#C4966A", price:6700, brand:"Urban Decay", finish:"Sparkle", suitableFor:["fair","light","medium"], image:"/products/midnight cowboy.png", shadeImage:"/products/midnight cowboy shade.png" },
  { id:13, name:"Club", shade:"Eyeshadow", category: "eyes", color:"#4A3728", price:6200, brand:"MAC", finish:"Velvet", suitableFor:["fair","light","medium","tan","deep"], image:"/products/club.png", shadeImage:"/products/club shade.png" },
  { id:14, name:"Woodwinked", shade:"Eyeshadow", category: "eyes", color:"#B8733C", price:6200, brand:"MAC", finish:"Velvet", suitableFor:["medium","tan","deep"], image:"/products/woody.png", shadeImage:"/products/woody shade.png" },
  { id:15, name:"Night Rider", shade:"Eyeshadow", category: "eyes", color:"#1C1826", price:10100, brand:"NARS", finish:"Matte", suitableFor:["fair","light","medium","tan","deep"], image:"/products/night rider.png", shadeImage:"/products/night rider shades.png" },
  { id:16, name:"Pillow Talk Rose", shade:"Luxury Eye Palette", category: "eyes", color:"#C4A0A0", price:19000, brand:"Charlotte Tilbury", finish:"Mixed", suitableFor:["fair","light"], image:"/products/pillow talk rose.png", shadeImage:"/products/pillow talk rose shades.png" },
  { id:17, name:"Obsidian Smoky", shade:"Eyeshadow Palette", category: "eyes", color:"#2C1F38", price:16200, brand:"Huda Beauty", finish:"Mixed", suitableFor:["fair","light","medium","tan","deep"], image:"/products/obsidian smoky.png", shadeImage:"/products/obsidisn smoky shades.png" },
  
  // BLUSH
  { id:18, name:"Orgasm", shade:"Blush", category: "blush", color:"#E8906A", price:9500, brand:"NARS", finish:"Shimmer", suitableFor:["fair","light","medium"], image:"/products/orgasam.png" },
  { id:19, name:"Deep Throat", shade:"Blush", category: "blush", color:"#F0B0C0", price:9500, brand:"NARS", finish:"Shimmer", suitableFor:["fair","light"], image:"/products/deep throat.png" },
  { id:20, name:"Exhibit A", shade:"Blush", category: "blush", color:"#E05A40", price:9500, brand:"NARS", finish:"Matte", suitableFor:["medium","tan","deep"], image:"/products/exibit a.png" },
  { id:21, name:"Peaches", shade:"Powder Blush", category: "blush", color:"#F0A060", price:7800, brand:"MAC", finish:"Satin", suitableFor:["fair","light"], image:"/products/peachy.png" },
  { id:22, name:"Mocha", shade:"Powder Blush", category: "blush", color:"#9B6B5A", price:7800, brand:"MAC", finish:"Matte", suitableFor:["tan","deep"], image:"/products/mocha.png" },
  { id:23, name:"Fiji", shade:"Cheeks Out", category: "blush", color:"#C47480", price:6200, brand:"Fenty Beauty", finish:"Satin", suitableFor:["medium","tan"], image:"/products/fiji.png" },
  
  // FOUNDATION
  { id:24, name:"NC15", shade:"Studio Fix Fluid", category: "foundation", color:"#F2D8B8", price:12600, brand:"MAC", finish:"Matte", suitableFor:["fair","light"], image:"/products/NC15.png" },
  { id:25, name:"NC30", shade:"Studio Fix Fluid", category: "foundation", color:"#C8945A", price:12600, brand:"MAC", finish:"Matte", suitableFor:["medium"], image:"/products/NC30.png" },
  { id:26, name:"NC45", shade:"Studio Fix Fluid", category: "foundation", color:"#9B6B3A", price:12600, brand:"MAC", finish:"Matte", suitableFor:["tan"], image:"/products/NC45.png" },
  { id:27, name:"NC55", shade:"Studio Fix Fluid", category: "foundation", color:"#6B3A1A", price:12600, brand:"MAC", finish:"Matte", suitableFor:["deep"], image:"/products/NC55.png" },
  { id:28, name:"420W", shade:"Pro Filt'r", category: "foundation", color:"#C8A07A", price:11200, brand:"Fenty Beauty", finish:"Soft Matte", suitableFor:["medium"], image:"/products/420.png" },
  { id:29, name:"490W", shade:"Pro Filt'r", category: "foundation", color:"#7A4A2A", price:11200, brand:"Fenty Beauty", finish:"Soft Matte", suitableFor:["deep"], image:"/products/490.png" },
];