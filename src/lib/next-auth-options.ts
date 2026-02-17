import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import { prisma } from '@/lib/db/client';
import { UserRole } from '@prisma/client';
import { hashEmail } from '@/lib/validations/auth';

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
