export interface TagConfType {
  tag_name: string,
  tag_key: string,
  description?: string,
}

export interface ActivityFilterListType {
  activity_id: number;
  title: string;
  tag_conf: TagConfType[];
}

export interface ActivityListItemDataType {
  activity_id: number;
  title: string;
  tag_conf: TagConfType[];
  description?: string;
  created_at: number;
  updated_at?: number;
}

export interface ActivityFormItemDataType {
  activity_id: number;
  title: string;
  tag_conf: TagConfType[];
  description: string;
  created_at: number;
  updated_at: number;
}