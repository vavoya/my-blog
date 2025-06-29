import useAsyncTaskManager from "@/hook/useAsyncTaskManager";
import {useManagementStore} from "@/store/ManagementProvider";
import {useCallback, useMemo} from "react";
import styles from "./seriesWindow.module.scss";
import {createAddSeriesAsyncTask} from "@/app/management/_window/series/handlers/createAddSeriesAsyncTask";
import {formatDate} from "@/utils/formatDate";
import SeriesContentWindow from "@/app/management/_window/series-content/SeriesContentWindow";
import {WindowCommandBuilder} from "@/app/management/_window/provider/utils/windowCommands";
import createWindowObj from "@/app/management/_window/provider/utils/createWindowObj";


export default function SeriesWindow() {
    const asyncTaskManager = useAsyncTaskManager();
    const userInfo = useManagementStore((state) => state.userInfo);
    const seriesObj = useManagementStore((state) => state.seriesObj);
    const setWindows = useManagementStore((state) => state.setWindows);
    const setSeriesObj = useManagementStore((state) => state.setSeriesObj);

    const seriesByUpdatedAt = useMemo(() => {
        return Object.values(seriesObj).sort((a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
    }, [seriesObj])

    const createSeries = useCallback((seriesName: string) => {

        asyncTaskManager.addAsyncTask(
            createAddSeriesAsyncTask(
                {
                    userId: userInfo._id,
                    seriesName,
                    lastModified: userInfo.last_modified
                },
                {
                    seriesObj,
                    setSeriesObj: setSeriesObj
                }
            )
        )
    }, [asyncTaskManager, seriesObj, setSeriesObj, userInfo._id, userInfo.last_modified])

    const openSeriesContentWindow = useCallback((seriesId: string) => {
        const windowCommandBuilder = new WindowCommandBuilder()

        const windowId = `SeriesContentWindow-${seriesId}`;

        const newCommands = windowCommandBuilder
            .add([
                createWindowObj(
                    windowId,
                    `${seriesObj[seriesId].series_name}`,
                    <SeriesContentWindow seriesId={seriesId} windowId={windowId}/>,
                    0,
                    0,
                    750,
                    500
                )
            ])
            .returnCommand()

        setWindows(newCommands)
    }, [seriesObj, setWindows])


    return (
        <div role='table' className={styles.table}>
            <div role='rowgroup'>
                <div role='row' className={styles.hRow}>
                    <span role='columnheader' id='col-title' className={styles.col2}>시리즈 제목</span>
                    <span role='columnheader' id='col-created' className={styles.col1}>생성 일시</span>
                    <span role='columnheader' id='col-updated' className={styles.col1}>수정 일시</span>
                </div>
            </div>
            <ul role='rowgroup' className={styles.ul}>
                <li className={styles.createSeriesRow} onClick={() => createSeries("새 시리즈")}>
                    <span role='cell' id='createNewSeries'>새 시리즈 생성</span>
                </li>
                {
                    seriesByUpdatedAt.map(series => (
                        <li role='row' key={series._id} className={styles.bRow} onClick={() => openSeriesContentWindow(series._id)}>
                            <span role='cell' id='title' className={styles.col2}>{series.series_name}</span>
                            <time role='cell' id='created' className={styles.col1}>{formatDate(new Date(series.createdAt), true)}</time>
                            <time role='cell' id='updated' className={styles.col1}>{formatDate(new Date(series.updatedAt), true)}</time>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}