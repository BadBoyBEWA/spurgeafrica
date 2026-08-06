import {
  CheckCircle,
  Gem,
  ImagePlus,
  MapPin,
  Ruler,
  Scissors,
  Sparkles,
  Truck,
  User
} from "lucide-react";

export type Product = {
  id: string;
  slug?: string;
  name: string;
  category: string;
  price: number;
  color: string;
  fabric: string;
  occasion: string;
  description: string;
  image: string;
  gallery: string[];
  stock?: number;
};

export const navLinks = [
  ["Shop", "/collections"],
  ["Custom Tailoring", "/tailoring"],
  // ["Lookbook", "/lookbook"],
  ["About", "/about"],
  ["Contact", "/contact"]
] as const;

export const heroImage = "/images/herosa.png";

export const categories = [
  {
    title: "Agbada",
    href: "/collections?category=Agbada",
    image: "/images/SP Agbada.png"
  },
  {
    title: "Senator Wear",
    href: "/collections?category=Senator",
    image: "/images/SP Senator.png"
  },
  {
    title: "Kaftans",
    href: "/collections?category=Kaftan",
    image: "/images/SP Kaftan.png"
  },
  {
    title: "2-Piece",
    href: "/collections?category=2-piece",
    image: "/images/SP 2-piece.png"
  },
  {
    title: "Fila",
    href: "/collections?category=Fila",
    image: "/images/SP Fila.png"
  },
  {
    title: "Pants",
    href: "/collections?category=Pants",
    image: "/images/SP Pants.png"
  },
  {
    title: "Danshiki",
    href: "/collections?category=Danshiki",
    image: "/images/SP Danshiki.png"
  }
];

const gallerySeed = [
  "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1503342313934-5f7f38d2cfe5?auto=format&fit=crop&w=1000&q=80"
];

export const products: Product[] = [
  {
    id: "royal-agbada",
    name: "Royal Crest Agbada",
    category: "Agbada",
    price: 245000,
    color: "Gold",
    fabric: "Guinea Brocade",
    occasion: "Wedding",
    description:
      "A commanding three-piece agbada cut in luminous brocade with tonal embroidery and a sculptural drape.",
    image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=85",
    gallery: gallerySeed
  },
  {
    id: "emerald-senator",
    name: "Emerald Line Senator",
    category: "Senator",
    price: 118000,
    color: "Emerald",
    fabric: "Senator Material",
    occasion: "Corporate",
    description:
      "A sharply tailored senator set with clean seams, polished cuffs, and a refined emerald tone.",
    image: "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=1200&q=85",
    gallery: gallerySeed
  },
  {
    id: "terracotta-kaftan",
    name: "Terracotta Silk Kaftan",
    category: "Kaftan",
    price: 96000,
    color: "Terracotta",
    fabric: "Silk Blend",
    occasion: "Traditional",
    description:
      "A fluid 2-piece kaftan with warm terracotta depth, invisible pockets, and restrained neckline detail.",
    image: "https://images.unsplash.com/photo-1503342313934-5f7f38d2cfe5?auto=format&fit=crop&w=1200&q=85",
    gallery: gallerySeed
  },
  {
    id: "midnight-danshiki",
    name: "Midnight Danshiki Set",
    category: "Danshiki",
    price: 88000,
    color: "Black",
    fabric: "Cotton Jacquard",
    occasion: "Casual",
    description:
      "Soft danshiki separates made for everyday presence, finished with jacquard texture and matte buttons.",
    image: "https://images.unsplash.com/photo-1542060748-10c28b62716f?auto=format&fit=crop&w=1200&q=85",
    gallery: gallerySeed
  },
  {
    id: "groom-signature",
    name: "Groom Signature Agbada",
    category: "Agbada",
    price: 310000,
    color: "Cream",
    fabric: "Cashmere",
    occasion: "Wedding",
    description:
      "A ceremonial agbada for modern grooms, hand-finished with metallic thread and a soft cashmere handle.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85",
    gallery: gallerySeed
  },
  {
    id: "heritage-fila",
    name: "Heritage Velvet Fila Cap",
    category: "Fila",
    price: 35000,
    color: "Multicolor",
    fabric: "Velvet",
    occasion: "Traditional",
    description:
      "Handcrafted velvet fila cap designed to complement traditional agbada and senator attire.",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=85",
    gallery: gallerySeed
  },
  {
    id: "ivory-lace-kaftan",
    name: "Ivory Lace Kaftan",
    category: "Kaftan",
    price: 138000,
    color: "Ivory",
    fabric: "Lace",
    occasion: "Luxury",
    description:
      "A rare 2-piece lace kaftan with a structured collar, layered transparency, and precise tonal finishing.",
    image: "https://images.unsplash.com/photo-1536766768598-e09213fdcf22?auto=format&fit=crop&w=1200&q=85",
    gallery: gallerySeed
  },
  {
    id: "tailored-native-pants",
    name: "Tailored Executive Pants",
    category: "Pants",
    price: 65000,
    color: "Navy",
    fabric: "Cashmere",
    occasion: "Corporate",
    description:
      "Crisp, custom-tailored native trousers crafted from premium cashmere blend fabric.",
    image: "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=1200&q=85",
    gallery: gallerySeed
  }
];

export const craftHighlights = [
  { title: "Premium Fabrics", copy: "Curated brocade, cashmere, lace, Ankara, and jacquard sourced for texture and longevity.", icon: Gem },
  { title: "Expert Tailoring", copy: "Pattern masters and finishers shape each piece to sit cleanly on the body.", icon: Scissors },
  { title: "Nationwide Delivery", copy: "Secure packaging and coordinated delivery across Nigeria and select international routes.", icon: Truck },
  { title: "Precision Craftsmanship", copy: "Measured cuts, controlled drape, and quiet hand details define the Spurge finish.", icon: Ruler }
];

export const processSteps = [
  { title: "Choose Outfit", icon: Sparkles },
  { title: "Add Inspiration", icon: ImagePlus },
  { title: "Measurements", icon: Ruler },
  { title: "Contact Details", icon: User },
  { title: "Submit Request", icon: CheckCircle }
];

export const testimonials = [
  {
    name: "Tobi Akinola",
    role: "Lagos",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    review: "My wedding agbada looked regal without feeling heavy. The fit was exact and the embroidery was flawless."
  },
  {
    name: "Chinedu Okafor",
    role: "Abuja",
    photo: "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=400&q=80",
    review: "The senator sets are now my default for executive events. Clean lines, rich fabric, fast delivery."
  },
  {
    name: "Adeola Mensah",
    role: "Accra",
    photo: "https://images.unsplash.com/photo-1545992336-1fce6e2d138b?auto=format&fit=crop&w=400&q=80",
    review: "They translated my inspiration images into something more polished than I imagined."
  }
];

export const lookbook = [
  "Wedding", "Agbada", "Corporate", "Luxury", "Casual", "Celebrity Styles"
].flatMap((tag, index) => [
  {
    tag,
    title: `${tag} Edit ${index + 1}`,
    image: products[index % products.length].image
  },
  {
    tag,
    title: `${tag} Silhouette ${index + 1}`,
    image: products[(index + 2) % products.length].image
  }
]);

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(value);

export const apiOrders: unknown[] = [];
export const apiSubscribers: unknown[] = [];
export const apiMessages: unknown[] = [];
