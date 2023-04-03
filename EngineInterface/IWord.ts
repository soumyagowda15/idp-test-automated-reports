import { Coordinate } from "./ICoordinate";
export interface Word {
    pageNumber: number;
    content: string;
    coordinates: Coordinate[];
    confidence: number;
}