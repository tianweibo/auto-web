import { useCallback } from 'react';
import { Reducer, Effect } from 'umi';
import {
  ActivityFormItemDataType,
  ActivityListItemDataType,
  TagConfType,
  ActivityFilterListType,
} from './data.d';
import {
  filterActivityList,
  queryActivityList,
  queryActivityIndex,
  queryActivityItem,
  editActivityItem,
  createActivityItem,
  getProjectList,
} from './service';

export interface ModalState {
  item: ActivityFormItemDataType;
  list: ActivityListItemDataType[];
  filter: ActivityFilterListType[];
}

export interface ModelType {
  namespace: string;
  state: ModalState;
  effects: {
    fetch: Effect;
    fetchList: Effect;
    find: Effect;
    update: Effect;
    create: Effect;
    filter: Effect;
    resetTag: Effect;
    getProjectList: Effect;
  };
  reducers: {
    queryList: Reducer<ModalState>;
    queryOne: Reducer<ModalState>;
    filterList: Reducer<ModalState>;
    resetTag: Reducer<ModalState>;
  };
}

const Model: ModelType = {
  namespace: 'activity',

  state: {
    list: [],
    item: {
      activity_id: 0,
      title: '',
      tag_conf: [],
      description: '',
      created_at: 0,
      updated_at: 0,
    },
    filter: [],
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryActivityList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response.data.list) ? response.data.list : [],
      });
      return response;
    },
    *fetchList({ payload }, { call, put }) {
      const response = yield call(queryActivityIndex, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response.data.list) ? response.data.list : [],
      });
      return response;
    },
    *find({ payload }, { call, put }) {
      const response = yield call(queryActivityItem, payload);
      yield put({
        type: 'queryOne',
        payload: response.data || {},
      });
      return response;
    },
    *update({ payload }, { call, put }) {
      const response = yield call(editActivityItem, payload);
      return response;
    },
    *create({ payload }, { call, put }) {
      const response = yield call(createActivityItem, payload);
      return response;
    },
    *filter({ payload }, { call, put }) {
      const response = yield call(queryActivityList, payload);
      yield put({
        type: 'filterList',
        payload: response || {},
      });
      return response;
    },
    *getProjectList({ payload }, { call, put }) {
      const response = yield call(getProjectList, payload);
      return response;
    },
    resetTag({ payload }, { put }) {
      put({
        type: 'resetTag',
        payload: payload,
      });
    },
  },

  reducers: {
    queryList(state, action) {
      //引用类型，防止外部污染
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
    filterList(state, action) {
      return {
        ...(state as ModalState),
        filter: action.payload,
      };
    },
    resetTag(state, action) {
      const newPayload = Object.assign({}, state?.item, {
        tag_conf: action.payload,
      });
      return {
        ...(state as ModalState),
        item: newPayload || {},
      };
    },
  },
};

export default Model;
