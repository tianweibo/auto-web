import { Reducer, Effect } from 'umi';
import {
  EventItemDataType,
  EventListItemDataType,
  OptionColumn,
} from './data.d';

import {
  BasicData,
  getLabelTree,
  getEventList,
  queryEventList,
  queryEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} from './service';

export interface ModalState {
  total: number;
  eventList: Partial<EventListItemDataType>[];
  list: EventListItemDataType[];
  item: EventItemDataType;
  triggerTypes: [OptionColumn];
  tags: [OptionColumn];
  attributeTags: [OptionColumn];
  dataTypes: [OptionColumn];
}

export interface ModelType {
  namespace: string;
  state: ModalState;
  effects: {
    triggerBasicData: Effect;
    tagBasicData: Effect;
    attributeBasicData: Effect;
    dataTypes: Effect;
    eventList: Effect;
    fetch: Effect;
    find: Effect;
    create: Effect;
    update: Effect;
    delete: Effect;
    reset: Effect;
  };
  reducers: {
    getTriggerBasicData: Reducer<ModalState>;
    getTagBasicData: Reducer<ModalState>;
    getAttributeBasicData: Reducer<ModalState>;
    getDataType: Reducer<ModalState>;
    setTotal: Reducer<ModalState>;
    getEventList: Reducer<ModalState>;
    queryList: Reducer<ModalState>;
    queryOne: Reducer<ModalState>;
    resetState: Reducer<ModalState>;
  };
}

//初始化 List 数据
export const ModalListData: EventListItemDataType[] = [];

//初始化 item 数据
export const ModalItemData: Partial<EventItemDataType> = {
  event_id: 0,
  event_key: '',
  event_name: '',
  description: '',
};

const Model: ModelType = {
  namespace: 'event',
  state: {
    total: 0,
    eventList: [],
    list: ModalListData,
    item: ModalItemData,
    tags: [{ value: '' }],
    triggerTypes: [
      {
        value: '',
      },
    ],
    attributeTags: [
      {
        value: '',
      },
    ],
    dataTypes: [
      {
        value: '',
      },
    ],
  },
  effects: {
    *triggerBasicData({ params }, { call, put }) {
      const response = yield call(BasicData, params.id);

      yield put({
        type: 'getTriggerBasicData',
        payload: response.data || [],
      });
    },
    *tagBasicData({ params }, { call, put }) {
      const response = yield call(getLabelTree,{id:2});
      let arr=response.data.arr;
      arr = arr.map(ele =>{ele.disabled=false; return ele});
      yield put({
        type: 'getTagBasicData',
        payload: arr || [],
      });
    },
    *attributeBasicData({ params }, { call, put }) {
      const response = yield call(BasicData, params);

      yield put({
        type: 'getAttributeBasicData',
        payload: response.data || [],
      });
    },
    *eventList({ params }, { call, put }) {
      const response = yield call(getEventList, params);
      yield put({
        type: 'getEventList',
        payload: response.data.arr || [],
      });

      return response;
    },
    *dataTypes({ params }, { call, put }) {
      const response = yield call(BasicData, params);

      yield put({
        type: 'getDataType',
        payload: response.data || [],
      });
    },
    *fetch({ params }, { call, put }) {
      const response = yield call(queryEventList, params);

      yield put({
        type: 'queryList',
        payload: response.data.arr || [],
      });

      yield put({
        type: 'setTotal',
        payload: response.data.count,
      });

      return response;
    },
    *find({ params }, { call, put }) {
      const { data: response } = yield call(queryEvent, params);
      yield put({
        type: 'queryOne',
        payload: response || {},
      });
    },
    *create({ payload }, { call, put }) {
      yield call(createEvent, payload);
    },
    *update({ payload, params }, { call, put }) {
      yield call(updateEvent, payload, params);
    },
    *delete({ payload }, { call, put }) {
      yield call(deleteEvent, payload);
    },
    *reset({ payload }, { put }) {
      yield put({
        type: 'resetState',
        payload: payload,
      });
    },
  },

  reducers: {
    getTriggerBasicData(state, action) {
      return {
        ...(state as ModalState),
        loading: true,
        triggerTypes: action.payload,
      };
    },
    getTagBasicData(state, action) {
      return {
        ...(state as ModalState),
        loading: true,
        tags: action.payload,
      };
    },
    getAttributeBasicData(state, action) {
      return {
        ...(state as ModalState),
        loading: true,
        attributeTags: action.payload,
      };
    },
    getDataType(state, action) {
      return {
        ...(state as ModalState),
        loading: true,
        dataTypes: action.payload,
      };
    },
    getEventList(state, action) {
      return {
        ...(state as ModalState),
        list: action.payload,
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
