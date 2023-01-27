import {Key} from './IKey';
import { Value } from './IValue';
import { Config } from './IConfig';
export interface FormField {
    pageNumber: number;
    key: Key;
    value: Value;
    confidence: number;
    config: Config;
}