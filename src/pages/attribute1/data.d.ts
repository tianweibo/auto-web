export interface DrawerConfType {
  visible: boolean;
  title?: string;
}

export interface AttributeListItemDataType {
  attribute_id: number;
  attribute_tag: string;
  attribute_code: string;
  attribute_name: string;
  attribute_type?: string;
  attribute_source: string;
  attribute_zdz?: string;
  attribute_relax: string;
}

export interface AttributeItemDataType {
  attribute_tag: string;
  attribute_code: string;
  attribute_name: string;
  attribute_type?: string;
  attribute_source: string;
  attribute_zdz?: string;
  attribute_relax: string;
}

export interface ArrayColumn {
  [key: string]: any;
}

export interface OptionColumn {
  value: string | number;
  label?: React.ReactNode;
  disabled?: boolean;
  children?: OptionColumn[];
}
