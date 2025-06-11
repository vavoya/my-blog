import headerStyles from "./tableHeader.module.scss";
import tableStyles from "./table.module.scss"

export default function TableHeader() {
    return (
        <div role="rowgroup">
            <div role="row" className={`${headerStyles.row} ${tableStyles.row}`}>
                <span id="col-title" role="columnheader" className={tableStyles.col2}>제목</span>
                <span id="col-created" role="columnheader" className={tableStyles.col1}>생성일시</span>
                <span id="col-updated" role="columnheader" className={tableStyles.col1}>수정일시</span>
            </div>
        </div>
    )
}