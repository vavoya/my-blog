import {UserInfoResponse} from "@/lib/mongoDB/types/documents/userInfo.type";
import {isValidSlug} from "@/utils/isValidSlug";


type ValidateRegister = (
    name: UserInfoResponse['user_name'],
    blogName: UserInfoResponse['blog_name'],
    blogUrl: UserInfoResponse['blog_url'],

) => {
    isValid: true;
} | {
    isValid: false;
    type: "name";
} | {
    isValid: false;
    type: "blogName";
} | {
    isValid: false;
    type: "blogUrl";
} | {
    isValid: false;
    type: "blogUrlSyntax";
}
export const validateRegister: ValidateRegister = (name, blogName, blogUrl) => {
    if (name === "") {
        return {
            isValid: false,
            type: "name",
        }
    }
    if (blogName === "") {
        return {
            isValid: false,
            type: "blogName",
        }
    }
    if (blogUrl === "") {
        return {
            isValid: false,
            type: "blogUrl",
        }
    }
    if (!isValidSlug(blogUrl)) {
        return {
            isValid: false,
            type: "blogUrlSyntax",
        }
    }
    return {
        isValid: true,
    }
}