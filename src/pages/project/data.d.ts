export interface DrawerConfType {
  visible: boolean;
  title?: string;
}

export interface ModalConfType {
  visible: boolean;
  title?: string;
  confirmLoading?: false;
}

export interface TagConfType {
  tag_key: string;
  tag_name: string;
  description?: string;
}

export interface ProjectListItemDataType {
  project_id: number;
  title: string;
  start_date: number;
  end_date: number;
  tag_conf: TagConfType[];
  description?: string;
  created_at: number;
  updated_at?: number;
}

export interface ProjectItemDataType {
  project_id: number;
  title: string;
  start_date: number;
  end_date: number;
  tag_conf: TagConfType[];
  description: string;
  tag_list?: TagConfType[];
}

export interface DatePickerType {
  start_date: number;
  end_date: number;
}
