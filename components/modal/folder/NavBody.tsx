import NavItem from "@/components/modal/components/NavItem";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";

type NavBodyProps = {
    folderInfo: FolderInfoResponse[];
    folderPath: FolderInfoResponse['_id'][];
    setFolderPath: (newFolderPath: FolderInfoResponse['_id'][]) => void;
}

export default function NavBody({folderInfo, folderPath, setFolderPath}: NavBodyProps) {
    const currentFolderId = folderPath[folderPath.length - 1];
    const subFolders = folderInfo.filter((folder) => folder.pfolder_id === currentFolderId);
    const hasSubFolders = subFolders.length > 0;

    return (
        <>
            {
                hasSubFolders
                    ? (
                        subFolders.map((subFolder) => {
                            const name = subFolder.folder_name
                            const postCount = subFolder.post_count
                            const folderId = subFolder._id

                            const moveToSub = () => {
                                const newFolderPath = [...folderPath];
                                newFolderPath.push(folderId);
                                setFolderPath(newFolderPath);
                            }

                            return (
                                <NavItem
                                    key={folderId}
                                    name={name}
                                    postCount={postCount}
                                    onClick={moveToSub} />
                            )
                        }))
                    : (
                        <NavItem
                            key={1}
                            name={"하위 폴더가 없어요"}
                            postCount={null}
                            onClick={() => null}/>)
            }
        </>
    )
}