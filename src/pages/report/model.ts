import { Reducer, Effect, Dispatch } from 'umi';
import { creatUUId, getValueBykey } from '@/utils/util';
import { message } from 'antd';

import { history } from 'umi';
import {
  Report,
  BasicData,
  ApplicationInfo,
  ReportDetail,
  CardObj,
  TableObj,
  TrendObj,
  IndicatorInfo,
} from './data.d';

import {
  queryReportList,
  queryLabelTree,
  queryReport,
  createReport,
  updateReport,
  deleteReport,
  getActList,
  queryBasicData,
  applicationDetail,
  indicatorListById,
  deleteTempData,
} from './service';
export interface ModalState {
  reportList: Array<Report>;
  total: number;
  appLabelList: Array<BasicData>;
  secondIndicatorList: Array<BasicData>;
  timeRangeList: Array<BasicData>;
  applicationDepPlatformList: Array<BasicData>;
  applicationInfo: ApplicationInfo;
  reportInfo: ReportDetail;
  indicatorList: Array<IndicatorInfo>;
}

export interface IAction<T = any> {
  type: string;
  payload: T;
}

export interface ModelType {
  namespace: 'report';
  state: ModalState;
  effects: {
    fetch: Effect;
    labelTree: Effect;
    queryBasicData: Effect;
    delete: Effect;
    create: Effect;
    update: Effect;
    deleteTemp: Effect;
    queryIndicatorList: Effect;
    getReportDetail: Effect;
    clearData: Effect;
  };
  reducers: {
    queryBasicDataReducers: Reducer<
      Partial<ModalState>,
      IAction<Array<BasicData>>
    >;
    queryApplicationDepPlatformReducers: Reducer<
      Partial<ModalState>,
      IAction<Array<BasicData>>
    >;
    querySecondIndicator: Reducer<
      Partial<ModalState>,
      IAction<Array<BasicData>>
    >;
    queryTreeLabel: Reducer<Partial<ModalState>, IAction<Array<BasicData>>>;
    queryStaticTimeRange: Reducer<
      Partial<ModalState>,
      IAction<Array<BasicData>>
    >;
    queryList: Reducer<Partial<ModalState>, IAction<Array<Report>>>;
    indicatorListReducers: Reducer<
      Partial<ModalState>,
      IAction<Array<IndicatorInfo>>
    >;
    reportDetail: Reducer<Partial<ModalState>>;
    appInfoReducers: Reducer<Partial<ModalState>>;
  };
}

const Model: ModelType = {
  namespace: 'report',
  state: {
    reportList: [],
    total: 0,
    reportInfo: {
      card_ids: [],
      trend_ids: [],
      table_ids: [],
      reportInfo: {},
    },
    appLabelList: [],
    secondIndicatorList: [],
    timeRangeList: [],
    applicationDepPlatformList: [],
    indicatorList: [],
    applicationInfo: {
      application_id: 0,
      platform_app: '', // 应用名称
      platform_business: '', // 应用平台
      platform_app_code: '', // 应用代码
      application_dep_platform: '', // 应用部署平台
      platform_app_version: '', // 版本
      application_type: '',
    },
  },
  effects: {
    *getReportDetail({ params }, { call, put }) {
      queryReport;
      const response = yield call(queryReport, params);
      if (response.status == 0) {
        yield put({
          type: 'reportDetail',
          payload: response.data,
        });
        localStorage.setItem('report', JSON.stringify(response.data));
      }
      return response;
    },
    *clearData({ params }, { call, put }) {
      var reportInfo = {
        card_ids: [],
        trend_ids: [],
        table_ids: [],
        reportInfo: {},
      };
      yield put({
        type: 'reportDetail',
        payload: reportInfo,
      });
    },
    *queryIndicatorList({ params }, { call, put }) {
      const response = yield call(applicationDetail, params);
      if (response.status == 0) {
        let indicatorIds = response.data.indicatorIds;
        let appInfo = response.data.appInfo;
        yield put({
          type: 'appInfoReducers',
          payload: response.data.appInfo,
        });
        var res = yield call(indicatorListById, { id: indicatorIds });
        yield put({
          type: 'indicatorListReducers',
          payload: res.data,
        });
      }
      return res;
    },
    *queryBasicData({ params }, { call, put }) {
      const response = yield call(queryBasicData, params);
      if (params.id === 'app_label') {
        yield put({
          type: 'queryBasicDataReducers',
          payload: response.data,
        });
      }
      if (params.id === 'application_dep_platform') {
        yield put({
          type: 'queryApplicationDepPlatformReducers',
          payload: response.data,
        });
      }
      if (params.id === 'statis_time_range') {
        yield put({
          type: 'queryStaticTimeRange',
          payload: response.data,
        });
      }
      if (params.id === 'second_indicator') {
        yield put({
          type: 'querySecondIndicator',
          payload: response.data,
        });
      }
      return response;
    },
    *fetch({ params }, { call, put }) {
      const response = yield call(queryReportList, params);
      yield put({
        type: 'queryList',
        payload: response.data,
      });
      return response;
    },
    *labelTree({ params }, { call, put }) {
      const response: any = yield call(queryLabelTree, params);
      let arr = response.data.arr;
      arr = arr.map((ele) => {
        ele.disabled = false;
        return ele;
      });
      yield put({
        type: 'queryTreeLabel',
        payload: arr,
      });
      return response;
    },
    *delete(id, { call, put }) {
      //const { resolve,data } = payload
      const response = yield call(deleteReport, id);
      return response;
    },
    *create(params, { call, put }) {
      const response = yield call(createReport, params.params);
      if (response.status == 0) {
        message.success('创建成功');
        history.push({
          pathname: '/report',
        });
      }
    },
    *deleteTemp(params, { call, put }) {
      yield call(deleteTempData, params.params);
    },
    *update(params, { call, put }) {
      const response = yield call(updateReport, params.params);
      if (response.status == 0) {
        message.success('编辑成功');
        history.push({
          pathname: '/report',
        });
      }
    },
  },

  reducers: {
    addData(state, action) {
      var reportInfo = {
        card_ids: [],
        trend_ids: [],
        table_ids: [],
      };
      reportInfo = JSON.parse(JSON.stringify(state.reportInfo));
      switch (action.row) {
        case 1:
          var obj1 = {
            card_id: creatUUId(),
            indicator_id: null,
            indicator_name: '',
            indicator_show_name: '',
            indicator_desc: '',
            time_dimension: '',
            time_dimension_label: '',
            sequential: 1,
            show_type: 1,
            indicator_level: '',
            indicator_level_label: '',
          };
          reportInfo.card_ids.push(obj1);
          break;
        case 2:
          var obj2 = {
            trend_id: creatUUId(),
            indicator_id: null,
            indicator_name: '',
            indicator_show_name: '',
            indicator_desc: '',
            show_type: 1,
            time_scope: 'recent_14day',
            time_scope_label: '最近14天',
          };
          reportInfo.trend_ids.push(obj2);
          break;
        case 3:
          var obj3 = {
            table_id: creatUUId(),
            indicator_id: null,
            indicator_name: '',
            indicator_show_name: '',
            indicator_desc: '',
            time_dimension: 'accord_day',
            time_dimension_label: '按天',
            show_type: 1,
            is_import: 1,
          };
          reportInfo.table_ids.push(obj3);
          break;
        default:
          break;
      }
      return {
        ...state,
        reportInfo: reportInfo,
      };
    },
    moveData(state, action) {
      var reportInfo = {
        card_ids: [],
        trend_ids: [],
        table_ids: [],
      };
      reportInfo = JSON.parse(JSON.stringify(state.reportInfo));
      if (action.params.type === 'card') {
        reportInfo.card_ids[action.params.index] = reportInfo.card_ids.splice(
          action.params.index1,
          1,
          reportInfo.card_ids[action.params.index],
        )[0];
      } else if (action.params.type == 'table') {
        reportInfo.table_ids[action.params.index] = reportInfo.table_ids.splice(
          action.params.index1,
          1,
          reportInfo.table_ids[action.params.index],
        )[0];
      } else if (action.params.type === 'trend') {
        reportInfo.trend_ids[action.params.index] = reportInfo.trend_ids.splice(
          action.params.index1,
          1,
          reportInfo.trend_ids[action.params.index],
        )[0];
      }
      return {
        ...state,
        reportInfo: reportInfo,
      };
    },
    deleteData(state, action) {
      var reportInfo = {
        card_ids: [],
        trend_ids: [],
        table_ids: [],
      };
      reportInfo = JSON.parse(JSON.stringify(state.reportInfo));
      if (action.params.type === 'card') {
        var arr = state.reportInfo.card_ids.filter(
          (data: any, index: number) => index !== action.params.index1,
        );
        reportInfo.card_ids = arr;
      } else if (action.params.type == 'table') {
        var arr = state.reportInfo.table_ids.filter(
          (data: any, index: number) => index !== action.params.index1,
        );
        reportInfo.table_ids = arr;
      } else if (action.params.type === 'trend') {
        var arr = state.reportInfo.trend_ids.filter(
          (data: any, index: number) => index !== action.params.index1,
        );
        reportInfo.trend_ids = arr;
      }
      return {
        ...state,
        reportInfo: reportInfo,
      };
    },
    changeInput(state, action) {
      var reportInfo = {
        card_ids: [],
        trend_ids: [],
        table_ids: [],
      };
      reportInfo = JSON.parse(JSON.stringify(state.reportInfo));
      switch (action.params.type) {
        case 'card':
          reportInfo.card_ids[action.params.index][action.params.key] =
            action.params.value;
          break;
        case 'trend':
          reportInfo.trend_ids[action.params.index][action.params.key] =
            action.params.value;
          break;
        case 'table':
          reportInfo.table_ids[action.params.index][action.params.key] =
            action.params.value;
          break;
        default:
          break;
      }
      return {
        ...state,
        reportInfo: reportInfo,
      };
    },
    changeSelect(state, action) {
      var reportInfo = {
        card_ids: [],
        trend_ids: [],
        table_ids: [],
      };
      reportInfo = JSON.parse(JSON.stringify(state.reportInfo));

      //secondIndicatorList:[],
      //timeRangeList:[],
      //indicatorList: [],
      if (action.params.type == 'card') {
        reportInfo.card_ids[action.params.index][action.params.key] =
          action.params.value;
        if (action.params.key === 'indicator_id') {
          reportInfo.card_ids[action.params.index]['indicator_name'] =
            getValueBykey(
              'indicator_id',
              action.params.value,
              state.indicatorList,
              'indicator_name',
            );
          reportInfo.card_ids[action.params.index]['events'] =
            action.params.events;
        }
        if (action.params.key === 'time_dimension') {
          reportInfo.card_ids[action.params.index]['time_dimension_label'] =
            getValueBykey(
              'value',
              action.params.value,
              state.timeRangeList,
              'label',
            );
        }
        if (action.params.key === 'indicator_level') {
          reportInfo.card_ids[action.params.index]['indicator_level_label'] =
            getValueBykey(
              'value',
              action.params.value,
              state.secondIndicatorList,
              'label',
            );
        }
      } else if (action.params.type == 'trend') {
        reportInfo.trend_ids[action.params.index][action.params.key] =
          action.params.value;
        if (action.params.key === 'indicator_id') {
          reportInfo.trend_ids[action.params.index]['indicator_name'] =
            getValueBykey(
              'indicator_id',
              action.params.value,
              state.indicatorList,
              'indicator_name',
            );
          reportInfo.trend_ids[action.params.index]['events'] =
            action.params.events;
        }
      } else if (action.params.type == 'table') {
        reportInfo.table_ids[action.params.index][action.params.key] =
          action.params.value;
        if (action.params.key === 'indicator_id') {
          reportInfo.table_ids[action.params.index]['indicator_name'] =
            getValueBykey(
              'indicator_id',
              action.params.value,
              state.indicatorList,
              'indicator_name',
            );
          reportInfo.table_ids[action.params.index]['events'] =
            action.params.events;
        }
      }
      return {
        ...state,
        reportInfo: reportInfo,
      };
    },
    reportDetail(state, action) {
      return {
        ...state,
        reportInfo: action.payload,
      };
    },
    appInfoReducers(state, action) {
      return {
        ...state,
        applicationInfo: action.payload,
      };
    },
    indicatorListReducers(state, action) {
      return {
        ...state,
        indicatorList: action.payload,
      };
    },
    queryApplicationDepPlatformReducers(state, action) {
      return {
        ...state,
        applicationDepPlatformList: action.payload,
      };
    },
    queryStaticTimeRange(state, action) {
      return {
        ...state,
        timeRangeList: action.payload,
      };
    },
    querySecondIndicator(state, action) {
      return {
        ...state,
        secondIndicatorList: action.payload,
      };
    },
    queryTreeLabel(state, action) {
      return {
        ...state,
        appLabelList: action.payload,
      };
    },
    queryBasicDataReducers(state, action) {
      return {
        ...state,
        appLabelList: action.payload,
      };
    },
    queryList(state, action) {
      debugger;
      return {
        ...state,
        reportList: action.payload.arr,
        total: action.payload.count,
      };
    },
  },
};

export default Model;
