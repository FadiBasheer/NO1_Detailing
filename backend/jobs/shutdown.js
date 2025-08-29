import prisma from "../prisma/client.js";

export function setupGracefulShutdown() {
  process.on('SIGINT', async () => {
    console.log('Shutting down...');
    await prisma.$disconnect();
    process.exit(0);
  });
}
