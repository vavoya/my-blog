import NavItem from "@/components/modal/components/NavItem";
import {SeriesInfoResponse} from "@/lib/mongoDB/types/documents/seriesInfo.type";

type NavBodyProps = {
    seriesInfo: SeriesInfoResponse[];
    seriesId: SeriesInfoResponse['_id'] | null;
    setSeriesId: (newSeriesId: SeriesInfoResponse['_id'] | null) => void;
}

export default function SeriesNavBody({seriesInfo, seriesId, setSeriesId}: NavBodyProps) {

    return (
        <>
            {
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
            }
        </>
    )
}