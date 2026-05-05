import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db/client';
import { UserRole } from '@prisma/client';
import { hashEmail } from '@/lib/validations/auth';
import { verifyTelegramHash } from '@/lib/validations/telegram';

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || 'mock_client_id',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock_client_secret',
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID || 'mock_client_id',
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET || 'mock_client_secret',
        }),
        CredentialsProvider({
            id: 'telegram',
            name: 'Telegram',
            credentials: {
                hash: { type: 'text' },
            },
            async authorize(credentials, req) {
                const botToken = process.env.TELEGRAM_BOT_TOKEN;
                if (!botToken || !credentials) return null;

                // Extract all query params from req to verify the hash
                // NextAuth provides req.query in some versions, but here we might need to pass data through credentials
                // For simplicity, we assume the client sends all telegram fields in the credentials object
                const isValid = verifyTelegramHash(credentials, botToken);

                if (!isValid) {
                    console.error('Telegram Auth Failed: Invalid Hash');
                    return null;
                }

                const telegramData = credentials as any;
                const telegramId = telegramData.id;
                const email = `${telegramId}@telegram.user`; // Placeholder email since Telegram doesn't provide one

                try {
                    let user = await prisma.user.findUnique({
                        where: { email },
                    });

                    if (!user) {
                        // Create new user for Telegram
                        const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-10) + '!TG';
                        const hashedEmail = await hashEmail(email);

                        user = await prisma.user.create({
                            data: {
                                email,
                                emailHash: hashedEmail,
                                name: telegramData.first_name + (telegramData.last_name ? ` ${telegramData.last_name}` : ''),
                                avatar: telegramData.photo_url as string || null,
                                role: UserRole.USER,
                                emailVerified: new Date(),
                                password: randomPassword,
                                isActive: true,
                            },
                        });
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        image: user.avatar,
                        role: user.role,
                    };
                } catch (error) {
                    console.error('Telegram DB Error:', error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async signIn({ user, account }) {
            if (!user.email) return false;

            try {
                // Check if user exists
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email },
                });

                if (!existingUser) {
                    // Create new user for social login
                    // Note: Password field is required by schema but social user controls no password.
                    // We set a random long string that cannot be logged in with standard auth.
                    const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) + '!@#ABC';
                    const hashedEmail = await hashEmail(user.email);

                    await prisma.user.create({
                        data: {
                            email: user.email,
                            emailHash: hashedEmail,
                            name: user.name,
                            avatar: user.image,
                            role: UserRole.USER,
                            emailVerified: new Date(), // Trusted provider
                            password: randomPassword, // Placeholder
                            isActive: true,
                        },
                    });
                }

                return true;
            } catch (error) {
                console.error('Social Sign In Error:', error);
                return false;
            }
        },
        async jwt({ token, user }) {
            // Initial sign in
            if (user?.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: user.email },
                    select: { id: true, role: true }
                });

                if (dbUser) {
                    token.id = dbUser.id;
                    token.role = dbUser.role;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.id) {
                // Extend session with database ID and role
                (session.user as any).id = token.id as string;
                (session.user as any).role = token.role as string;
            }
            return session;
        }
    },
    pages: {
        signIn: '/auth/login',
        newUser: '/dashboard',
    },
    secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'fallback-secret-for-dev',
};
