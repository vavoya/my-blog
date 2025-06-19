import NextAuth, { Session, DefaultSession } from "next-auth"
import Google from "next-auth/providers/google"
import { JWT, DefaultJWT } from "next-auth/jwt"
import getByAuthId from "@/fetch/server/users/getByAuthId";
import getByBannedAuthId from "@/fetch/server/banned-auth-list/getByAuthId";
import Naver from "@auth/core/providers/naver";

declare module "next-auth" {
    interface Session extends DefaultSession {
        userId: string | null;
        registrationState: boolean; // DB 등록 여부
        authId: string;
        isLogin: boolean; // 로그인 허용 여부. 실시간 차단 여부 확인을 위해 추가(차단 => false)
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        userId: string | null;
        registrationState: boolean;
        authId: string;
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
            let authId = null;
            if (account) {
                authId = `${account.provider}_${account.providerAccountId}`;
            } else if (token) {
                authId = token.authId;
            }

            if (authId) {
                try {
                    const result = await getByAuthId(authId)
                    if (result.status !== 200) throw new Error("No user found with id " + authId)
                    token.userId = result.data._id.toString();
                    token.registrationState = result.data.registration_state
                } catch {
                    token.userId = null
                    token.registrationState = false
                } finally {
                    token.authId = authId;
                }
            }

            return token
        },
        async session({session, token}: { session: Session; token: JWT }) {
            if (token) {
                session.userId = token.userId;
                session.isLogin = session.registrationState = token.registrationState;
                session.authId = token.authId;
            }


            // 실시간 차단 여부 확인
            // 차단되면 null 반환으로 세션 무효화
            if (session.authId) {
                const result = await getByBannedAuthId(session.authId)
                if (result.status === 200 && !!result.data) {
                    session.isLogin = false;
                    return session;
                }
            }

            return session
        },
        async signIn({ account }) {
            if (account) {
                const authId = `${account.provider}_${account.providerAccountId}`;

                const result = await getByBannedAuthId(authId)
                if (result.status === 200 && !!result.data) {
                    const encodedReason = encodeURIComponent(result.data.reason)
                    return `/banned?reason=${encodedReason}`
                }
            }

            return true;
        }
    },
    session: {
        strategy: 'jwt',
        maxAge: 60 * 60,      // 1시간
        updateAge: 15 * 60    // 15분
    }
})