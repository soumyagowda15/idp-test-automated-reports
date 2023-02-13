import { Coordinate } from "./ICoordinate";
export interface Cell {
    coordinates: Coordinate[];
    content:     string;
    rowIndex:    number;
    columnIndex: number;
    rowSpan:     number;
    columnSpan:  number;
    confidence:  number;
}