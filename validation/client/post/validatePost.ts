import {PostInfoResponse} from "@/lib/mongoDB/types/documents/postInfo.type";


type ValidatePost = (name: PostInfoResponse['post_name'], content: PostInfoResponse['post_content'], folderId: PostInfoResponse['folder_id']) => {
    isValid: true;
} | {
    isValid: false;
    type: "name";
} | {
    isValid: false;
    type: "content";
} | {
    isValid: false;
    type: "folderId";
};
export const validatePost: ValidatePost = (name, content, folderId) => {
    if (name === "") {
        return {
            isValid: false,
            type: "name",
        }
    }
    if (content === "") {
        return {
            isValid: false,
            type: "content",
        }
    }
    if (folderId === "") {
        return {
            isValid: false,
            type: "folderId",
        }
    }
    return {
        isValid: true,
    }
}