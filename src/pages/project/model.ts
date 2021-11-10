import { Reducer, Effect } from 'umi';
import { ProjectItemDataType, ProjectListItemDataType } from './data.d';

import {
  queryProjectList,
  queryProject,
  createProject,
  updateProject,
  deleteProject,
} from './service';

export interface ModalState {
  total: number;
  list: ProjectListItemDataType[];
  item: ProjectItemDataType;
}

export interface ModelType {
  namespace: string;
  state: ModalState;
  effects: {
    fetch: Effect;
    find: Effect;
    create: Effect;
    update: Effect;
    delete: Effect;
    reset: Effect;
  };
  reducers: {
    queryList: Reducer<ModalState>;
    queryOne: Reducer<ModalState>;
    resetState: Reducer<ModalState>;
  };
}

//初始化 List 数据
export const ModalListData: ProjectListItemDataType[] = [];

//初始化 item 数据
export const ModalItemData: ProjectItemDataType = {
  project_id: 0,
  title: '',
  tag_conf: [],
  start_date: 0,
  end_date: 0,
  description: '',
};

const Model: ModelType = {
  namespace: 'project',
  state: {
    total: 0,
    list: ModalListData,
    item: ModalItemData,
  },
  effects: {
    *fetch({ params }, { call, put }) {
      const response = yield call(queryProjectList, params);

      yield put({
        type: 'queryList',
        payload: response.data,
      });

      return response;
    },
    *find({ params }, { call, put }) {
      const { data: response } = yield call(queryProject, params);
      yield put({
        type: 'queryOne',
        payload: response || {},
      });
    },
    *create({ payload }, { call, put }) {
      yield call(createProject, payload);
    },
    *update({ payload }, { call, put }) {
      yield call(updateProject, payload);
    },
    *delete({ payload }, { call, put }) {
      yield call(deleteProject, payload);
    },
    *reset({ payload }, { put }) {
      yield put({
        type: 'resetState',
        payload: payload,
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...(state as ModalState),
        ...action.payload,
      };
    },
    queryOne(state, action) {
      return {
        ...(state as ModalState),
        item: action.payload || {},
      };
    },
    resetState(state, action) {
      return {
        ...(state as ModalState),
        ...action.payload,
      };
    },
  },
};

export default Model;
