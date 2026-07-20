import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
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

                    if (res.ok && data.user && data.token) {
                        return {
                            id: data.user.id.toString(),
                            name: data.user.name,
                            email: data.user.email,
                            laravelUser: data.user,
                            token: data.token
                        } as any;
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
            // Initial sign in
            if (account && user) {
                if (account.provider === 'credentials') {
                    // For credentials (Admins), we already prepared the data in authorize()
                    token.accessToken = (user as any).token;
                    token.laravelUser = (user as any).laravelUser;
                } else {
                    // For Social Logins (Google/Facebook), go to Laravel register endpoint
                    const payload = {
                        provider_name: account.provider, // 'google' or 'facebook'
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
                            token.accessToken = data.token;
                            token.laravelUser = data.user;
                            console.log('Successfully fetched from Laravel API:', data.user);
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
            console.log('NextAuth Session Callback - Token:', token);
            if (token) {
                session.accessToken = token.accessToken as string;
                session.user = { ...session.user, ...token.laravelUser as any };
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
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
});

export { handler as GET, handler as POST };
