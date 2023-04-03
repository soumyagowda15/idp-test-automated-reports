import { Cell } from "./ICell";
export interface Table {
    pageNumber:  number;
    cells:       Cell[];
    headers:     Cell[];
    rowCount:    number;
    columnCount: number;
}