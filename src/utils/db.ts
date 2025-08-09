let db;

if (process.env.NODE_ENV === "development") {
  // Use normal Prisma client in dev
  const { PrismaClient } = await import("@prisma/client");
  db = new PrismaClient();
} else {
  // Use Accelerate in prod
  const { PrismaClient } = await import("@prisma/client/edge");
  const { withAccelerate } = await import("@prisma/extension-accelerate");

  db = new PrismaClient().$extends(withAccelerate());
}

export { db };
