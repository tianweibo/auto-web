export interface DrawerConfType {
  visible: boolean;
  title?: string;
  data?: any;
}

export interface EventListItemDataType {
  event_id: number;
  event_key: string;
  event_name: string;
  description?: string;
  created_at: number;
  updated_at?: number;
}

export interface EventItemDataType {
  event_id: number;
  event_key: string;
  event_name: string;
  description?: string;
  created_at: number;
  updated_at?: number;
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
