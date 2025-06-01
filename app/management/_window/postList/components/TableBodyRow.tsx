import rowStyles from "./tableBodyRow.module.scss";
import tableStyles from "./table.module.css"
import {OpenPostWindow} from "@/app/management/_window/postList/components/TableBody";

type TableBodyRowProps = {
    openPostWindow: OpenPostWindow;
    title: string;
    created: string;
    updated: string;
}
export default function TableBodyRow({openPostWindow, title, created, updated}: TableBodyRowProps) {
    return (
        <li tabIndex={0} role="row" className={`${rowStyles.row} ${tableStyles.row}`} onClick={openPostWindow}>
            <span role="cell" aria-labelledby="col-title" className={`${rowStyles.cell} ${tableStyles.col2}`}>{title}</span>
            <time role="cell" aria-labelledby="col-created" dateTime={created} className={`${rowStyles.cell} ${tableStyles.col1}`}>{created}</time>
            <time role="cell" aria-labelledby="col-updated" dateTime={updated} className={`${rowStyles.cell} ${tableStyles.col1}`}>{updated}</time>
        </li>
    )
}
