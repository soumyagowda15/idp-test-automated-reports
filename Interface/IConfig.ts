enum WidgetType {
    input = 'input',
    select = 'select',
    datepicker = 'datepicker',
    checkbox = 'checkbox'
  }
  enum FieldType {
    string = 'string',
    number = 'number',
    date = 'date',
    boolean = 'boolean'
  }
export interface Config {
    _n_field_label_: string;
    _n_field_label_synonyms_: string[];
    _n_field_pattern_: string;
    _n_field_pattern_matches?: boolean;
    _n_field_redacted_: boolean;
    _n_field_type_: FieldType;
    _n_field_value_: string;
    _n_field_widget_type_: WidgetType;
    _n_date_pattern_: string;
    _n_field_preferred_date_pattern: string;
    _n_field_date_patterns_: Array<string>;
    _n_field_date_string_value: Date;
}