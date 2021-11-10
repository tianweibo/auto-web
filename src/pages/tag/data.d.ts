export interface DrawerConfType {
  visible: boolean;
  title?: string;
}

export interface TagListItemDataType {
  tag_id: number;
  tag_key: string;
  tag_name: string;
  description?: string;
  created_at: number;
  updated_at?: number;
}

export interface TagItemDataType {
  tag_id: number;
  tag_key: string;
  tag_name: string;
  description?: string;
  created_at: number;
  updated_at?: number;
}
