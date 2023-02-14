import { FormField } from "./IFormField";
import { Word } from "./IWord";
import { Classification } from "./IClassification";
import { Table } from "./ITable";
export interface EngineResult {
    _id: string;
    ocr: string;
    file_id: string;
    job_id: string;
    form_fields: FormField[];
    tables?: Table[];
    words: Word[];
    classification: Classification[];
    _n_redacted_text_?: string[];
    expires_at: Date;
    created_at: Date;
}