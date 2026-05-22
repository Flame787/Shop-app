// this script migrates data from the old MySQL database to the new Prisma-based database

require("dotenv").config({ path: ".env.local" });

const mysql = require("mysql2/promise");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function migrate() {
  // 1) CONNECT TO THE OLD DATABASE
  const oldDb = await mysql.createConnection({
    host: process.env.OLD_DB_HOST,
    user: process.env.OLD_DB_USER,
    password: process.env.OLD_DB_PASSWORD,
    database: process.env.OLD_DB_NAME,
    port: process.env.OLD_DB_PORT,
  });

  console.log("Connected to OLD database");

  // 2) MIGRATE CATEGORIES
//   const [categories] = await oldDb.query("SELECT * FROM categories");
//   console.log(`Found ${categories.length} categories`);


//   for (const c of categories) {
//     await prisma.category.create({
//       data: {
//         category_id: c.category_id,
//         category_name: c.category_name,
//         sort_order: c.sort_order ?? null,
//       },
//     });
//   }

// categories were already moved, but the script broke during items-migration. 
// This way, we can run the script again without breaking the database, it will check if category already exists - it will not be created again, 
// but if it doesn't exist, it will be created:
// for (const c of categories) {
//   await prisma.category.upsert({
//     where: { category_id: c.category_id },
//     update: {}, // ništa ne mijenjamo
//     create: {
//       category_id: c.category_id,
//       category_name: c.category_name,
//       sort_order: c.sort_order ?? null,
//     },
//   });
// }

//   console.log("Categories migrated");

console.log("Skipping categories — already migrated");

  // 3) MIGRATE ITEMS
  const [items] = await oldDb.query("SELECT * FROM items");
  console.log(`Found ${items.length} items`);

  for (const i of items) {
    await prisma.item.create({
      data: {
        item_id: i.item_id,
        name: i.name,
        description: i.description,
        price: i.price,
        discount_price: i.discount_price,
        quantity_in_stock: i.quantity_in_stock,
        picture_url: i.picture_url,
        category_id: i.category_id,
        tags: i.tags,
        is_active: i.is_active === null ? null : i.is_active === 1,  // convert 1/0 to true/false, and keep null as null
        date_added: i.date_added,
        last_updated: i.last_updated,
      },
    });
  }

  console.log("Items migrated");

  // 4) MIGRATE CUSTOMERS
  const [customers] = await oldDb.query("SELECT * FROM customers");
  console.log(`Found ${customers.length} customers`);

  for (const u of customers) {
    await prisma.customer.create({
      data: {
        customer_id: u.customer_id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        street: u.street,
        city: u.city,
        postal_code: u.postal_code,
        country: u.country,
        date_registered: u.date_registered,
        password_hash: u.password_hash,
        role: u.role,
      },
    });
  }

  console.log("Customers migrated");

  console.log("Migration complete!");
  process.exit(0);
}

migrate().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
