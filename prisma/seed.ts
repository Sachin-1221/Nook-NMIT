import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const aarav = await prisma.user.upsert({
    where: { email: "aarav@nmit.ac.in" },
    update: {},
    create: { name: "Aarav Mehta", email: "aarav@nmit.ac.in", passwordHash },
  });
  const priya = await prisma.user.upsert({
    where: { email: "priya@nmit.ac.in" },
    update: {},
    create: { name: "Priya Sharma", email: "priya@nmit.ac.in", passwordHash },
  });

  const listings = [
    { title: "Physics Vol 1 — HC Verma", description: "Barely used, no highlights, includes both parts.", price: 450, category: "Textbooks", imageUrl: "https://covers.openlibrary.org/b/id/240727-M.jpg", status: "ACTIVE" as const, pickupLocation: "NMIT Library", contact: "WhatsApp +91 98765 43210", sellerId: aarav.id },
    { title: "Casio FX-991 Calculator", description: "Perfect working condition. Used for one semester.", price: 1200, category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600", status: "ACTIVE" as const, pickupLocation: "CS Block", contact: "aarav@nmit.ac.in", sellerId: aarav.id },
    { title: "Lab Coat — Size M", description: "White lab coat, size medium. Worn twice.", price: 300, category: "Lab gear", imageUrl: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=600", status: "SOLD" as const, pickupLocation: "Chemistry Lab", contact: "priya@nmit.ac.in", sellerId: priya.id },
    { title: "Mini Fridge", description: "1.5L mini fridge. Great for hostel rooms.", price: 2500, category: "Dorm", imageUrl: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600", status: "ACTIVE" as const, pickupLocation: "Hostel Block B", contact: "+91 98765 11111", sellerId: priya.id },
    { title: "Study Table Lamp", description: "Adjustable LED desk lamp with 3 brightness levels.", price: 550, category: "Dorm", imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600", status: "ACTIVE" as const, pickupLocation: "Hostel Block A", contact: "aarav@nmit.ac.in", sellerId: aarav.id },
    { title: "Hero Sprint Cycle", description: "21-speed cycle, well maintained. New tyres.", price: 5500, category: "Cycles", imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600", status: "ACTIVE" as const, pickupLocation: "Main Gate", contact: "WhatsApp +91 99999 88888", sellerId: priya.id },
    { title: "Casio Keyboard CT-S300", description: "61-key portable keyboard. Includes stand.", price: 4000, category: "Musical", imageUrl: "https://images.unsplash.com/photo-1552422535-c45813c61732?w=600", status: "ACTIVE" as const, pickupLocation: "Music Room", contact: "priya@nmit.ac.in", sellerId: priya.id },
    { title: "Engineering Drawing Board", description: "A3 size drawing board with clips. Unused.", price: 250, category: "Stationery", imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600", status: "ACTIVE" as const, pickupLocation: "Mech Block", contact: "aarav@nmit.ac.in", sellerId: aarav.id },
  ];

  for (const l of listings) {
    await prisma.listing.create({ data: l });
  }

  console.log(`Seeded ${listings.length} listings and 2 users`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
