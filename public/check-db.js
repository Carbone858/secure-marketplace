
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    try {
        await prisma.$connect();
        console.log('DB_OK');
    } catch (e) {
        console.log('DB_FAIL');
        console.error(e.message);
    } finally {
        await prisma.$disconnect();
    }
}
main();
