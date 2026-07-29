import { prisma } from "../lib/prisma";
import { categories } from "../lib/data";

async function main() {
  console.log("Seeding collections...");
  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    const slug = cat.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await prisma.collection.upsert({
      where: { slug },
      update: {
        title: cat.title,
        href: cat.href,
        image: cat.image,
        sortOrder: i,
      },
      create: {
        title: cat.title,
        slug,
        href: cat.href,
        image: cat.image,
        sortOrder: i,
      },
    });
  }
  console.log("Seeding collections finished!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
