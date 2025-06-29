import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {buildFolderPathIds} from "@/utils/buildFolderPathIds";
import {FolderObj} from "@/components/modal/utils/toObj";

/**
 * 특정 폴더의 경로를 제공합니다.
 *
 * @param folder 경로 대상이 될 폴더 객체
 * @param folderObj 경로 탐색을 위해 필요한 전체 폴더 객체 모음
 * @return 폴더 경로 문자열을 `/` 로 구분해서 반환합니다.
 */
export function buildFolderPath (folder: FolderInfoResponse, folderObj: FolderObj) {
    return buildFolderPathIds(folder._id, folderObj).map(id => folderObj[id].folder_name).join('/');
}
