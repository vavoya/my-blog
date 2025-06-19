import TableBodyRow from "@/app/management/_window/postList/components/TableBodyRow";
import {formatDate} from "@/utils/formatDate";
import PostListFooter from "@/app/management/_window/postList/components/PostListFooter";
import {PaginatedPostsResponse} from "@/data-access/post-info/types";
import {RefObject} from "react";
import {SetWindows} from "@/app/management/_components/Background";
import createWindowObj from "@/app/management/_window/provider/utils/createWindowObj";
import {buildFolderPath} from "@/utils/buildFolderPath";
import PostWindow from "@/app/management/_window/post/PostWindow";
import {FolderObj} from "@/components/modal/utils/toObj";
import {FolderInfoResponse} from "@/lib/mongoDB/types/documents/folderInfo.type";
import {useManagementStore} from "@/store/ManagementProvider";
import {WindowCommandBuilder} from "@/app/management/_window/provider/utils/windowCommands";
import styles from "@/app/management/_window/postList/components/tableBody.module.scss";

export type OpenPostWindow = () => void;
type TableBodyProps = {
    folderId: FolderInfoResponse['_id'];
    pages: PaginatedPostsResponse[];
    isError: boolean;
    hasNext: boolean;
    errorMessage: string | undefined;
    intersectionTarget: RefObject<HTMLDivElement | null>;
}
export default function TableBody(rest: TableBodyProps) {
    const folderObj = useManagementStore<FolderObj>((state) => state.folderObj);
    const setWindows = useManagementStore<SetWindows>((state) => state.setWindows);

    return (
        <ul key={'body'} role="rowgroup" className={styles.ul}>
            {
                rest.pages.map(paginatedPost => {
                    const openPostWindow: OpenPostWindow = () => {
                        const window = createWindowObj(
                            `PostWindow-${paginatedPost._id}`,
                            buildFolderPath(folderObj[rest.folderId], folderObj) + '/' + paginatedPost.post_name,
                            <PostWindow paginatedPost={paginatedPost}/>,
                            0,
                            0,
                            670,
                            520
                        )

                        const commands = new WindowCommandBuilder().add([
                            window
                        ]).returnCommand()
                        setWindows(commands)

                    }


                    return <TableBodyRow key={paginatedPost._id}
                                         openPostWindow={openPostWindow}
                                         title={paginatedPost.post_name}
                                         created={formatDate(new Date(paginatedPost.post_createdAt), true)}
                                         updated={formatDate(new Date(paginatedPost.post_updatedAt), true)}/>
                })
            }
            <PostListFooter hasPage={rest.pages.length > 0}
                            isError={rest.isError}
                            hasNext={rest.hasNext}
                            errorMessage={rest.errorMessage}
                            intersectionTarget={rest.intersectionTarget}/>
        </ul>
    )
}