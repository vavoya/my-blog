import {client} from "@/lib/mongoDB/mongoClient";
import {ObjectId} from "mongodb";
import {CreateInput} from "@/services/server/registration/createByAuthId/type";
import insertOneUserInfo from "@/models/user_info/insertOne";
import insertOneAboutInfo from "@/models/about_info/insertOne";
import insertOneFolder from "@/models/folder_info/insertOne";
import insertOneSeries from "@/models/series_info/insertOne";
import {parseBlocks, shikiPromise} from "md-ast-parser";
import getUserInfoByBlogUrl from "@/models/user_info/getUserInfoByBlogUrl";


export type CreateByAuthIdResult =
    | { success: true;}
    | { success: false; error: "AlreadyRegistered"; message: string }
    | { success: false; error: "RegistrationFailed"; message: string }
    | { success: false; error: "TransactionError"; message: string; stack?: string };
export default async function createByAuthId(params: CreateInput & { authId: string, email: string }): Promise<CreateByAuthIdResult> {
    const session = client.startSession()

    session.startTransaction();

    const blogUrl = `@${params.blogUrl}`

    try {
        // 먼저 중복 url 여부 확인
        const userInfoByBlogurl = await getUserInfoByBlogUrl(blogUrl, session);
        if (userInfoByBlogurl) {
            await session.abortTransaction();
            return {
                success: false,
                error: "AlreadyRegistered", // 또는 "BlogAlreadyExists"
                message: "이미 등록된 블로그입니다."
            }
        }

        // userInfo 생성 -> userId 얻기
        const userInfo = await insertOneUserInfo(
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
            },
            session
        )
        if (!userInfo.acknowledged) {
            await session.abortTransaction();
            return {
                success: false,
                error: "RegistrationFailed",
                message: "유저 정보를 생성에 실패했습니다.."
            }
        }

        await shikiPromise;

        // folder, series, about 기본 생성
        const results = await Promise.all([
            insertOneAboutInfo(
                {
                    _id: new ObjectId,
                    user_id: userInfo.insertedId,
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
                    user_id: userInfo.insertedId,
                },
                session
            ),
            insertOneSeries(
                {
                    _id: new ObjectId,
                    user_id: userInfo.insertedId,
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