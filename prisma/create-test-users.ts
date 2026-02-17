import { PrismaClient, UserRole } from '@prisma/client';
import crypto from 'crypto';
import { hashPassword } from '../src/lib/auth';
import fs from 'fs';
import path from 'path';

// Manual .env loader
function loadEnv() {
    try {
        const envPath = path.resolve(__dirname, '../.env');
        console.log('Loading .env from:', envPath);
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf-8');
            content.split('\n').forEach(line => {
                const parts = line.split('=');
                if (parts.length >= 2 && !line.trim().startsWith('#')) {
                    const key = parts[0].trim();
                    const value = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, ''); // Crude unquote
                    if (key && !process.env[key]) {
                        process.env[key] = value;
                    }
                }
            });
            console.log('.env loaded.');
        } else {
            console.log('.env not found at', envPath);
        }
    } catch (e) {
        console.error('Failed to load .env:', e);
    }
}

loadEnv();

const prisma = new PrismaClient();

async function main() {
    console.log('STARTING MANUAL USER CREATION...');

    // Check DATABASE_URL
    if (!process.env.DATABASE_URL) {
        console.error('ERROR: DATABASE_URL is not set!');
        // Fallback for demo if running locally without env?? No, required.
        process.exit(1);
    }
    // console.log('DATABASE_URL is:', process.env.DATABASE_URL); // Don't print secret

    const hp = await hashPassword('Test123456!@');

    // Test data
    const scenarios = [
        { email: 'admin@secure-marketplace.com', role: 'ADMIN', name: 'System Admin', desc: 'Admin' },
        { email: 'owner@secure-marketplace.com', role: 'SUPER_ADMIN', name: 'Website Owner', desc: 'Owner' },
        { email: 'user@secure-marketplace.com', role: 'USER', name: 'Standard User', desc: 'User' },
        { email: 'company@secure-marketplace.com', role: 'COMPANY', name: 'Verified Company', desc: 'Company' },
        { email: 'pending@secure-marketplace.com', role: 'COMPANY', name: 'Pending Company', desc: 'Pending Company' },
        { email: 'unverified@secure-marketplace.com', role: 'USER', name: 'Unverified User', desc: 'Unverified', unverified: true },
        { email: 'locked@secure-marketplace.com', role: 'USER', name: 'Locked User', desc: 'Locked', locked: true },
    ];

    for (const s of scenarios) {
        const email = s.email;
        const hash = crypto.createHash('sha256').update(email.toLowerCase().trim()).digest('hex');

        try {
            console.log(`Processing ${s.email}...`);
            const existing = await prisma.user.findUnique({ where: { email } });

            if (existing) {
                console.log(`- User exists (ID: ${existing.id}), updating...`);
                await prisma.user.update({
                    where: { email },
                    data: {
                        password: hp,
                        role: s.role as UserRole,
                        emailVerified: s.unverified ? null : new Date(),
                        lockedUntil: s.locked ? new Date(Date.now() + 86400000) : null,
                    }
                });
                console.log(`  Update OK`);
            } else {
                console.log(`- User does not exist, creating...`);
                await prisma.user.create({
                    data: {
                        email,
                        emailHash: hash,
                        password: hp,
                        role: s.role as UserRole,
                        name: s.name,
                        emailVerified: s.unverified ? null : new Date(),
                        lockedUntil: s.locked ? new Date(Date.now() + 86400000) : null,
                    }
                });
                console.log(`  Create OK`);
            }

            // Handle Company creation if needed
            if (s.role === 'COMPANY') {
                const user = await prisma.user.findUnique({ where: { email } });
                if (user) {
                    const companyExists = await prisma.company.findUnique({ where: { userId: user.id } });
                    if (!companyExists) {
                        const slug = s.email.split('@')[0] + '-company-' + Date.now(); // Ensure unique
                        console.log(`  Creating company profile...`);
                        try {
                            await prisma.company.create({
                                data: {
                                    userId: user.id,
                                    name: s.name,
                                    slug: slug,
                                    description: s.desc,
                                    verificationStatus: s.email.includes('pending') ? 'PENDING' : 'VERIFIED',
                                }
                            });
                            console.log('  Company Create OK');
                        } catch (e: any) {
                            console.log('  Company creation warning:', e.message);
                        }
                    } else {
                        // Update Verification Status
                        await prisma.company.update({
                            where: { userId: user.id },
                            data: {
                                verificationStatus: s.email.includes('pending') ? 'PENDING' : 'VERIFIED',
                            }
                        });
                        console.log('  Company Status Update OK');
                    }
                }
            }

        } catch (e: any) {
            console.error(`ERROR processing ${email}:`, e.message);
        }
    }
}

main().finally(() => prisma.$disconnect());
