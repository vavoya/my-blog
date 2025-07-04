import NavItem from "@/components/modal/components/NavItem";
import {SeriesInfoResponse} from "@/lib/mongoDB/types/documents/seriesInfo.type";

type NavBodyProps = {
    seriesInfo: SeriesInfoResponse[];
    seriesId: SeriesInfoResponse['_id'] | null;
    setSeriesId: (newSeriesId: SeriesInfoResponse['_id'] | null) => void;
}

export default function SeriesNavBody({seriesInfo, seriesId, setSeriesId}: NavBodyProps) {
    const hasSeries = seriesInfo.length > 0;

    return (
        <>
            {
                hasSeries ? (
                    seriesInfo.map(series => {
                        const isSelected = series._id === seriesId;
                        const postCount = series.post_list.length;

                        const moveToSeries = () => {
                            if (isSelected) {
                                setSeriesId(null)
                            } else {
                                setSeriesId(series._id)
                            }
                        }

                        return (

                            <NavItem
                                key={series._id}
                                name={series.series_name}
                                postCount={postCount}
                                onClick={moveToSeries}
                                isSelected={isSelected}/>

                        )
                    })
                ) : (
                    <NavItem
                        key={1}
                        name={"시리즈가 없어요"}
                        postCount={null}
                        onClick={() => null}/>
                )
            }
        </>
    )
}