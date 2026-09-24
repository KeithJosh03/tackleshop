import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id: number;
            role: string;
        } & DefaultSession["user"];
        accessToken?: string;
    }

    interface User extends DefaultUser {
        id: string; // NextAuth expects string for internal user ID
        role: string;
        accessToken?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id: number; // Matches Laravel's numeric primary key (user_id)
        role: string;
        accessToken?: string;
    }
}