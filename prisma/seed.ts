import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const gallerySeed = JSON.stringify([
  "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1503342313934-5f7f38d2cfe5?auto=format&fit=crop&w=1000&q=80"
]);

const products = [
  {
    slug: "royal-agbada",
    name: "Royal Crest Agbada",
    category: "Agbada",
    price: 245000,
    color: "Gold",
    fabric: "Guinea Brocade",
    occasion: "Wedding",
    description: "A commanding three-piece agbada cut in luminous brocade with tonal embroidery and a sculptural drape.",
    image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=85",
    gallery: gallerySeed,
    stock: 10
  },
  {
    slug: "emerald-senator",
    name: "Emerald Line Senator",
    category: "Senator",
    price: 118000,
    color: "Emerald",
    fabric: "Senator Material",
    occasion: "Corporate",
    description: "A sharply tailored senator set with clean seams, polished cuffs, and a refined emerald tone.",
    image: "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=1200&q=85",
    gallery: gallerySeed,
    stock: 10
  },
  {
    slug: "terracotta-kaftan",
    name: "Terracotta Silk Kaftan",
    category: "Kaftan",
    price: 96000,
    color: "Terracotta",
    fabric: "Silk Blend",
    occasion: "Traditional",
    description: "A fluid kaftan with warm terracotta depth, invisible pockets, and restrained neckline detail.",
    image: "https://images.unsplash.com/photo-1503342313934-5f7f38d2cfe5?auto=format&fit=crop&w=1200&q=85",
    gallery: gallerySeed,
    stock: 10
  },
  {
    slug: "midnight-native",
    name: "Midnight Native Set",
    category: "Casual",
    price: 88000,
    color: "Black",
    fabric: "Cotton Jacquard",
    occasion: "Casual",
    description: "Soft native separates made for everyday presence, finished with jacquard texture and matte buttons.",
    image: "https://images.unsplash.com/photo-1542060748-10c28b62716f?auto=format&fit=crop&w=1200&q=85",
    gallery: gallerySeed,
    stock: 10
  },
  {
    slug: "groom-signature",
    name: "Groom Signature Agbada",
    category: "Agbada",
    price: 310000,
    color: "Cream",
    fabric: "Cashmere",
    occasion: "Wedding",
    description: "A ceremonial agbada for modern grooms, hand-finished with metallic thread and a soft cashmere handle.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85",
    gallery: gallerySeed,
    stock: 10
  },
  {
    slug: "ankara-weekend",
    name: "Ankara Weekend Shirt",
    category: "Casual",
    price: 52000,
    color: "Multicolor",
    fabric: "Ankara",
    occasion: "Casual",
    description: "A relaxed statement shirt cut from vibrant Ankara cotton for warm afternoons and late dinners.",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=85",
    gallery: gallerySeed,
    stock: 10
  },
  {
    slug: "ivory-lace-kaftan",
    name: "Ivory Lace Kaftan",
    category: "Kaftan",
    price: 138000,
    color: "Ivory",
    fabric: "Lace",
    occasion: "Luxury",
    description: "A rare lace kaftan with a structured collar, layered transparency, and precise tonal finishing.",
    image: "https://images.unsplash.com/photo-1536766768598-e09213fdcf22?auto=format&fit=crop&w=1200&q=85",
    gallery: gallerySeed,
    stock: 10
  },
  {
    slug: "heritage-senator",
    name: "Heritage Senator Suit",
    category: "Senator",
    price: 125000,
    color: "Navy",
    fabric: "Cashmere",
    occasion: "Corporate",
    description: "A boardroom-ready senator suit with a longline top, discreet embroidery, and tailored trousers.",
    image: "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=1200&q=85",
    gallery: gallerySeed,
    stock: 10
  }
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@spurgeafrica.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "password123";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin User",
      passwordHash,
    },
  });

  console.log(`Admin user created: ${admin.email}`);

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }
  console.log("Products seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
