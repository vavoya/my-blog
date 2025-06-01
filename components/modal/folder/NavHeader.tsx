import SvgUndo from "@/components/svg/Undo";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";

type NavHeaderProps = {
    folderPath: FolderInfoResponse['_id'][];
    setFolderPath: (newFolderPath: FolderInfoResponse['_id'][]) => void
}

export default function NavHeader({folderPath, setFolderPath}: NavHeaderProps) {
    const isRoot = folderPath.length <= 1;

    const moveToParent = () => {
        const newFolderPath = [...folderPath];
        newFolderPath.pop();
        setFolderPath(newFolderPath);
    }

    return (
        <>
            <span>폴더</span>
            {
                !isRoot && (
                    <button onClick={moveToParent}>
                        <SvgUndo/>
                        <span>이전</span>
                    </button>
                )
            }
        </>
    )
}