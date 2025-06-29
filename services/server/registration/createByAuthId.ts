import {client} from "@/lib/mongoDB/mongoClient";
import {ObjectId} from "mongodb";
import {CreateInput} from "@/services/server/registration/createByAuthId.type";
import insertOneUserInfo from "@/data-access/user-info/insertOne";
import insertOneAboutInfo from "@/data-access/about-info/insertOne";
import insertOneFolder from "@/data-access/folder-info/insertOne";
import insertOneSeries from "@/data-access/series-info/insertOne";
import {parseBlocks, shikiPromise} from "md-ast-parser";
import getUserInfoByBlogUrl from "@/data-access/user-info/getUserInfoByBlogUrl";
import getBannedAuthDocument from "@/data-access/banned-auth-list/getBannedAuthDocument";
import isSignupAllowed from "@/data-access/settings/isSignupAllowed";
import findUserIdAndUpdateLoginByAuthId from "@/data-access/user-info/findUserIdAndUpdateLoginByAuthId";


export type CreateByAuthIdResult =
    | { success: true;}
    | { success: false; error: "AlreadyRegistered"; message: string }
    | { success: false; error: "RegistrationFailed"; message: string }
    | { success: false; error: "SignupDisabled"; message: string }
    | { success: false; error: "BlogAlreadyExists"; message: string }
    | { success: false; error: "BannedUser"; message: string }
    | { success: false; error: "TransactionError"; message: string; stack?: string };
/**
 * 주어진 정보로 사용자 정보를 생성합니다..
 *
 * 다음 절차로 동작합니다:
 * 1. 트랜잭션 시작
 * 2. `lastModified` 버전 검증
 * 3. 이미 등록된 url 인지 확인합니다
 * 4. 차단된 authId의 가입을 막습니다
 * 5. 이미 등록된 유저인지 확입합니다
 * 6. users 생성하고, userId를 얻습니다.
 * 6. 트랜잭션 커밋
 *
 * 중간에 실패 시 트랜잭션을 중단하고 에러 정보를 반환합니다.
 *
 * @param params 사용자 이름, 블로그 이름, 블로그 URL, lastModified 버전을 포함한 요청 데이터
 * @returns 업데이트 성공 여부 및 새로운 lastModified 값 또는 에러 정보
 */
export default async function createByAuthId(params: CreateInput & { authId: string, email: string }): Promise<CreateByAuthIdResult> {
    const session = client.startSession()

    session.startTransaction();

    const blogUrl = `@${params.blogUrl}`

    try {
        // 1. 회원가입 가능한지 확인
        const isAllowed = await isSignupAllowed();
        if (!isAllowed) {
            await session.abortTransaction();
            return {
                success: false,
                error: "SignupDisabled",
                message: "현재는 신규 가입이 제한되어 있습니다."
            };
        }

        // 2. 먼저 중복 url 여부 확인
        const userInfoByBlogurl = await getUserInfoByBlogUrl(blogUrl, session);
        if (userInfoByBlogurl) {
            await session.abortTransaction();
            return {
                success: false,
                error: "BlogAlreadyExists", // 또는 "BlogAlreadyExists"
                message: "이미 등록된 블로그입니다."
            }
        }

        // 3. 차단된 유저의 회원가입 막기
        const bannedUserDocument = await getBannedAuthDocument(params.authId);
        if (!!bannedUserDocument) {
            await session.abortTransaction();
            return {
                success: false,
                error: "BannedUser",
                message: "해당 계정은 서비스 이용이 제한되었습니다."
            };
        }

        // 4. 이미 등록된 유저
        const userInfo = await findUserIdAndUpdateLoginByAuthId(params.authId, session);
        if (userInfo) {
            await session.abortTransaction();
            return {
                success: false,
                error: "AlreadyRegistered",
                message: "이미 등록된 계정입니다."
            };
        }

        // 5. users 생성 -> userId 얻기
        const newUserInfo = await insertOneUserInfo(
            {
                _id: new ObjectId(),
                auth_id: params.authId,
                blog_name: params.blogName,
                user_name: params.name,
                email: params.email,
                blog_url: blogUrl,
                next_post_id: 0,
                registration_state: true,
                last_modified: new Date(),
                is_deleted: false,
                last_login_at: new Date(),
                agreements: {
                    privacy: true,
                    terms: true,
                    email: false,
                }
            },
            session
        )
        if (!newUserInfo.acknowledged) {
            await session.abortTransaction();
            return {
                success: false,
                error: "RegistrationFailed",
                message: "유저 정보를 생성에 실패했습니다.."
            }
        }

        await shikiPromise;

        // 6. folders, series, about 기본 생성
        const results = await Promise.all([
            insertOneAboutInfo(
                {
                    _id: new ObjectId,
                    user_id: newUserInfo.insertedId,
                    content: "",
                    ast: parseBlocks([""]),
                },
                session
            ),
            insertOneFolder(
                {
                    _id: new ObjectId,
                    folder_name: "~",
                    pfolder_id: null,
                    post_count: 0,
                    user_id: newUserInfo.insertedId,
                },
                session
            ),
            insertOneSeries(
                {
                    _id: new ObjectId,
                    user_id: newUserInfo.insertedId,
                    series_name: "기본 시리즈",
                    series_description: "기본 시리즈입니다.",
                    post_list: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                session
            )
        ])
        if (results.some(result => !result.acknowledged)) {
            await session.abortTransaction();
            return {
                success: false,
                error: "RegistrationFailed",
                message: "기본 파일 생성에 실패했습니다."
            }
        }

        await session.commitTransaction();
        return {
            success: true,
        }
    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        let message = "알 수 없는 에러가 발생했습니다.";
        let stack = undefined;

        if (error instanceof Error) {
            message = error.message;
            stack = error.stack;
        } else if (typeof error === "string") {
            message = error;
        }

        console.error(
            "[MongoDB 트랜잭션 에러]",
            `email: ${params.email}`,
            `error: ${message}`,
            stack ? `stack: ${stack}` : ""
        );

        return {
            success: false,
            error: "TransactionError",
            message,
            stack
        };
    } finally {
        await session.endSession();
    }
}