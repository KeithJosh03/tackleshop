import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";

import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60,
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'}/api/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: credentials?.email,
                            password: credentials?.password,
                        })
                    });

                    const data = await res.json();

                    // Using the new clean UserResource from Laravel
                    if (res.ok && data.user && data.token) {
                        return {
                            id: data.user.id.toString(),
                            name: data.user.name,
                            email: data.user.email,
                            image: data.user.image,
                            role: data.user.role,
                            accessToken: data.token
                        };
                    }
                    return null;
                } catch (error) {
                    console.error("Credentials login failed", error);
                    return null;
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID || "",
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, account, user }) {
            if (account && user) {
                if (account.provider === 'credentials') {
                    token.id = Number(user.id);
                    token.role = user.role;
                    token.email = user.email;
                    token.accessToken = user.accessToken;
                } else {
                    const payload = {
                        provider_name: account.provider,
                        provider_id: account.providerAccountId,
                        name: user.name,
                        email: user.email,
                        avatar_url: user.image,
                    };

                    try {
                        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'}/api/register`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                            },
                            body: JSON.stringify(payload),
                        });

                        if (res.ok) {
                            const data = await res.json();
                            token.id = Number(data.user.id);
                            token.role = data.user.role;
                            token.email = data.user.email;
                            token.accessToken = data.token;
                        } else {
                            const errorText = await res.text();
                            console.error('Laravel API Registration Error:', res.status, errorText);
                        }
                    } catch (error) {
                        console.error('Fetch to Laravel API failed', error);
                    }
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = Number(token.id);
                session.user.role = token.role as string;
                session.user.email = token.email as string;
                session.accessToken = token.accessToken as string;
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth',
    },
    debug: true,
    logger: {
        error(code, metadata) {
            console.error('NextAuth Error:', code, metadata);
        },
        warn(code) {
            console.warn('NextAuth Warn:', code);
        },
        debug(code, metadata) {
            console.log('NextAuth Debug:', code, metadata);
        }
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
