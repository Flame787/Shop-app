// Startup script that applies missing DB changes idempotently before the server starts.
// Runs via: node setup.js && node server.js

const { PrismaClient } = require("@prisma/client");

async function main() {
  const prisma = new PrismaClient();

  // Add cart_items column to customer table (JSON, nullable)
  try {
    await prisma.$executeRawUnsafe(
      "ALTER TABLE `customer` ADD COLUMN `cart_items` JSON NULL"
    );
    console.log("[setup] Added cart_items column to customer table.");
  } catch (e) {
    if (e.message && e.message.includes("Duplicate column name")) {
      console.log("[setup] cart_items column already exists, skipping.");
    } else {
      console.error("[setup] Error adding cart_items column:", e.message);
      throw e;
    }
  }

  // Rename 'order' table to 'orders' — ORDER is a reserved MySQL keyword,
  // which breaks Railway's dashboard query (SELECT * FROM order LIMIT 10).
  // MySQL automatically updates all foreign keys that reference the renamed table.
  try {
    await prisma.$executeRawUnsafe("RENAME TABLE `order` TO `orders`");
    console.log("[setup] Renamed 'order' table to 'orders'.");
  } catch (e) {
    // Silently skip: table was already renamed on a previous deploy,
    // or the table never existed under that name.
    console.log("[setup] Table rename skipped:", e.message);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("[setup] Setup failed:", e);
  process.exit(1);
});
