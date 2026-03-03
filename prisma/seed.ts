import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Start seeding...");

  const hashedPassword = await bcrypt.hash("password123", 12);

  /**
   * 1️⃣ Create Teams (Use upsert)
   */
  const teamA = await prisma.team.upsert({
    where: { code: "TEAM-A" },
    update: {},
    create: {
      name: "Alpha Team",
      code: "TEAM-A",
    },
  });

  const teamB = await prisma.team.upsert({
    where: { code: "TEAM-B" },
    update: {},
    create: {
      name: "Beta Team",
      code: "TEAM-B",
    },
  });

  /**
   * 2️⃣ Create Users
   */
  await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: {
        name: "Super Admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "ADMIN",
      },
    }),

    prisma.user.upsert({
      where: { email: "manager@alpha.com" },
      update: {},
      create: {
        name: "Alpha Manager",
        email: "manager@alpha.com",
        password: hashedPassword,
        role: "MANAGER",
        teamId: teamA.id,
      },
    }),

    prisma.user.upsert({
      where: { email: "user1@alpha.com" },
      update: {},
      create: {
        name: "Alpha User 1",
        email: "user1@alpha.com",
        password: hashedPassword,
        role: "USER",
        teamId: teamA.id,
      },
    }),

    prisma.user.upsert({
      where: { email: "user2@alpha.com" },
      update: {},
      create: {
        name: "Alpha User 2",
        email: "user2@alpha.com",
        password: hashedPassword,
        role: "USER",
        teamId: teamA.id,
      },
    }),

    prisma.user.upsert({
      where: { email: "user@beta.com" },
      update: {},
      create: {
        name: "Beta User",
        email: "user@beta.com",
        password: hashedPassword,
        role: "USER",
        teamId: teamB.id,
      },
    }),
  ]);

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
