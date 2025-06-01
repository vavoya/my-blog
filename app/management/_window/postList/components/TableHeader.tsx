import headerStyles from "./tableHeader.module.css";
import tableStyles from "./table.module.css"

export default function TableHeader() {
    return (
        <div role="rowgroup">
            <div role="row" className={`${headerStyles.row} ${tableStyles.row}`}>
                <span id="col-title" role="columnheader" className={`${headerStyles.cell} ${tableStyles.col2}`}>제목</span>
                <span id="col-created" role="columnheader" className={`${headerStyles.cell} ${tableStyles.col1}`}>생성일시</span>
                <span id="col-updated" role="columnheader" className={`${headerStyles.cell} ${tableStyles.col1}`}>수정일시</span>
            </div>
        </div>
    )
}