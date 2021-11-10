import { Reducer, Effect } from 'umi';
import {
  AttributeItemDataType,
  AttributeListItemDataType,
  OptionColumn,
} from './data.d';

import {
  getBasicData,
  getAttributeList,
  queryAttributeList,
  queryAttribute,
  createAttribute,
  updateAttribute,
  deleteAttribute,
} from './service';

export interface ModalState {
  total: number;
  attributeList: Partial<AttributeListItemDataType>[];
  list: AttributeListItemDataType[];
  item: AttributeItemDataType;
  attributeTypes: [OptionColumn];
}

export interface ModelType {
  namespace: string;
  state: ModalState;
  effects: {
    attributeTypes: Effect;
    attributeList: Effect;
    fetch: Effect;
    find: Effect;
    create: Effect;
    update: Effect;
    delete: Effect;
    reset: Effect;
  };
  reducers: {
    getAttributeTypes: Reducer<ModalState>;
    setTotal: Reducer<ModalState>;
    getAttributeList: Reducer<ModalState>;
    queryList: Reducer<ModalState>;
    queryOne: Reducer<ModalState>;
    resetState: Reducer<ModalState>;
  };
}

//初始化 List 数据
export const ModalListData: AttributeListItemDataType[] = [];

//初始化 item 数据
export const ModalItemData: Partial<AttributeItemDataType> = {
  attribute_id: 0,
  attribute_key: '',
  attribute_name: '',
  description: '',
};

const Model: ModelType = {
  namespace: 'attribute',
  state: {
    total: 0,
    attributeList: [],
    list: ModalListData,
    item: ModalItemData,
    attributeTypes: [
      {
        value: '',
      },
    ],
  },
  effects: {
    *attributeTypes({ params }, { call, put }) {
      const response = yield call(getBasicData, params);

      yield put({
        type: 'getAttributeTypes',
        payload: response.data || [],
      });

      return response;
    },
    *attributeList({ params }, { call, put }) {
      const response = yield call(getAttributeList, params);

      yield put({
        type: 'getAttributeList',
        payload: response.data.list || [],
      });

      return response;
    },
    *fetch({ params }, { call, put }) {
      const response = yield call(queryAttributeList, params);

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
      const { data: response } = yield call(queryAttribute, params);
      yield put({
        type: 'queryOne',
        payload: response || {},
      });
    },
    *create({ payload }, { call, put }) {
      yield call(createAttribute, payload);
    },
    *update({ payload, params }, { call, put }) {
      yield call(updateAttribute, payload, params);
    },
    *delete({ payload }, { call, put }) {
      yield call(deleteAttribute, payload);
    },
    *reset({ payload }, { put }) {
      yield put({
        type: 'resetState',
        payload: payload,
      });
    },
  },

  reducers: {
    getAttributeTypes(state, action) {
      return {
        ...(state as ModalState),
        attributeTypes: action.payload,
      };
    },
    getAttributeList(state, action) {
      return {
        ...(state as ModalState),
        attributeList: action.payload,
      };
    },
    setTotal(state, action) {
      return {
        ...(state as ModalState),
        total: action.payload,
        loading: false,
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
