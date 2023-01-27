import { FormField } from "./IFormField";
import { Word } from "./IWord";
import { Classification } from "./IClassification";
export interface EngineResult {
    _id: string;
    ocr: string;
    file_id: string;
    job_id: string;
    form_fields: FormField[];
    tables: any[];
    words: Word[];
    classification: Classification[];
    _n_redacted_text_?: string[];
    expires_at: Date;
    created_at: Date;
}