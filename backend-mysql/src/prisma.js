// ORM for MySQL database using Prisma 
// - this file initializes the Prisma client, which will be used to interact with the MySQL database throughout the application. 
// The Prisma client provides a type-safe API for querying and manipulating the database, making it easier to work with data 
// and reducing the likelihood of runtime errors. By exporting the initialized Prisma client, we can import it in other parts of the 
// application to perform database operations seamlessly.

import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
