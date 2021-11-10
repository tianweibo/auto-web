import { Reducer, Effect } from 'umi';
import { TagItemDataType, TagListItemDataType } from './data.d';

import {
  getTagList,
  queryTagList,
  queryTag,
  createTag,
  updateTag,
  deleteTag,
} from './service';

export interface ModalState {
  total: number;
  tagList: Partial<TagListItemDataType>[];
  list: TagListItemDataType[];
  item: TagItemDataType;
}

export interface ModelType {
  namespace: string;
  state: ModalState;
  effects: {
    tagList: Effect;
    fetch: Effect;
    find: Effect;
    create: Effect;
    update: Effect;
    delete: Effect;
    reset: Effect;
  };
  reducers: {
    setTotal: Reducer<ModalState>;
    getTagList: Reducer<ModalState>;
    queryList: Reducer<ModalState>;
    queryOne: Reducer<ModalState>;
    resetState: Reducer<ModalState>;
  };
}

//初始化 List 数据
export const ModalListData: TagListItemDataType[] = [];

//初始化 item 数据
export const ModalItemData: Partial<TagItemDataType> = {
  tag_id: 0,
  tag_key: '',
  tag_name: '',
  description: '',
};

const Model: ModelType = {
  namespace: 'tag',
  state: {
    total: 0,
    tagList: [],
    list: ModalListData,
    item: ModalItemData,
  },
  effects: {
    *tagList({ params }, { call, put }) {
      const response = yield call(getTagList, params);

      yield put({
        type: 'getTagList',
        payload: response.data.list || [],
      });

      return response;
    },
    *fetch({ params }, { call, put }) {
      const response = yield call(queryTagList, params);

      yield put({
        type: 'queryList',
        payload: response.data.list || [],
      });

      yield put({
        type: 'setTotal',
        payload: response.data.total,
      });

      return response;
    },
    *find({ params }, { call, put }) {
      const { data: response } = yield call(queryTag, params);
      yield put({
        type: 'queryOne',
        payload: response || {},
      });
    },
    *create({ payload }, { call, put }) {
      yield call(createTag, payload);
    },
    *update({ payload, params }, { call, put }) {
      yield call(updateTag, payload, params);
    },
    *delete({ payload }, { call, put }) {
      yield call(deleteTag, payload);
    },
    *reset({ payload }, { put }) {
      yield put({
        type: 'resetState',
        payload: payload,
      });
    },
  },

  reducers: {
    getTagList(state, action) {
      return {
        ...(state as ModalState),
        tagList: action.payload,
      };
    },
    setTotal(state, action) {
      return {
        ...(state as ModalState),
        total: action.payload,
      };
    },
    queryList(state, action) {
      return {
        ...(state as ModalState),
        list: action.payload,
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
