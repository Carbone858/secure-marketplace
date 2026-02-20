import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'user@secure-marketplace.com';
    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            role: true,
            emailVerified: true,
            lockedUntil: true,
            password: true // To see if it's hashed
        }
    });

    if (user) {
        console.log('USER FOUND:');
        console.log(JSON.stringify(user, null, 2));
    } else {
        console.log('USER NOT FOUND:', email);
    }

    const allUsers = await prisma.user.count();
    console.log('Total users in DB:', allUsers);
}

main().finally(() => prisma.$disconnect());
