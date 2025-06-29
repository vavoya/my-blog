import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {FolderObj} from "@/components/modal/utils/toObj";

/**
 * 초기 폴더 ID로부터 상위 폴더 ID들을 역추적하여 폴더 경로를 구성합니다.
 *
 * @param {FolderInfoResponse['_id']} initFolderId - 폴더 경로를 구성할 시작 폴더 ID
 * @param {FolderObj} folderObj - 폴더 ID를 키로 하고 해당 폴더 정보를 값으로 가지는 객체
 * @return {Array} 루트 폴더부터 시작 폴더까지의 ID 배열
 */
export function buildFolderPathIds(initFolderId: FolderInfoResponse['_id'], folderObj: FolderObj) {
    const reverseFolderPath = [initFolderId];

    let folderId = folderObj[initFolderId].pfolder_id;

    while (folderId) {
        reverseFolderPath.push(folderId);
        folderId = folderObj[folderId].pfolder_id;
    }

    return reverseFolderPath.reverse();
}