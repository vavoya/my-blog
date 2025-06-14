import NextAuth, { Session, DefaultSession } from "next-auth"
import Google from "next-auth/providers/google"
import { JWT, DefaultJWT } from "next-auth/jwt"
import getByAuthId from "@/fetch/server/userInfo/getByAuthId";
import Naver from "@auth/core/providers/naver";

declare module "next-auth" {
    interface Session extends DefaultSession {
        provider: string;
        userId: string | null;
        registrationState: boolean;
        providerAccountId: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        provider: string
        userId: string | null;
        registrationState: boolean;
        providerAccountId: string;
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        Naver({
            clientId: process.env.AUTH_NAVER_ID!,
            clientSecret: process.env.AUTH_NAVER_SECRET!,
        })
    ],
    callbacks: {
        async jwt ({ account, token }): Promise<JWT> {

            if (account) {
                try {
                    const auth_id = `${account.provider}_${account.providerAccountId}`;
                    const result = await getByAuthId(auth_id)
                    if (result.status !== 200) throw new Error("No user found with id " + account.providerAccountId)
                    token.userId = result.data._id.toString();
                    token.registrationState = result.data.registration_state
                } catch {
                    token.userId = null
                    token.registrationState = false
                } finally {
                    token.provider = account.provider
                    token.providerAccountId = account.providerAccountId
                }
            } else if (token) {
                const auth_id = `${token.provider}_${token.providerAccountId}`;
                try {
                    const result = await getByAuthId(auth_id)
                    if (result.status !== 200) throw new Error("No user found with id " + token.providerAccountId)
                    token.userId = result.data._id.toString();
                    token.registrationState = result.data.registration_state
                } catch {
                    token.userId = null
                    token.registrationState = false
                }
            }
            return token
        },
        session({session, token}: { session: Session; token: JWT }) {
            if (token) {
                session.userId = token.userId;
                session.provider = token.provider;
                session.registrationState = token.registrationState;
                session.providerAccountId = token.providerAccountId;
            }

            return session
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 10 * 60, // 10분
        updateAge: 4 * 60, // 4분마다 갱신
    }
})