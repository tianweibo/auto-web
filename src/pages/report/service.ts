import http from '@/server/http';
import { Report, BasicData, ApplicationDetail, IndicatorInfo } from './data';
import { responseDataType } from '../../server/data';

/**
 * 查询报表列表
 *
 * @param params
 * @return promiss
 */
export const queryReportList = (params: {}) => {
  return http.post('/api/report/list', params);
};
export const queryLabelTree= (params: {}) => {
  return http.post('/api/label/listTree', params);
};
/**
 * 基础信息查询
 * @param params
 * @returns
 */
export const queryBasicData = (
  params: Record<'id', string>,
): Promise<responseDataType<BasicData>> => {
  return http.get('/api/basic/data', params);
};

/**
 * 应用详情
 * @param params
 * @returns
 */
export const applicationDetail = (params: {
  id: number;
  open_type:number
}): Promise<responseDataType<ApplicationDetail>> => {
  return http.get('/api/application/detail', params);
};

/**
 * 获取指标列表
 * @param params
 * @returns
 */
export const indicatorListById = (params: {
  id: number[];
}): Promise<responseDataType<Array<IndicatorInfo>>> => {
  return http.post('/api/indicator/listById', params);
};

/**
 * 查询报表
 *
 * @param params
 * @return promiss
 */
export const queryReport = async (params:any) => {
  return http.get(`/api/report/detail?id=${params.id}`);
};

/**
 * 创建报表
 *
 * @param params
 * @return promiss
 */
export const createReport = async (data = {}) => {
  return http.post('/api/report/create', data);
};

/**
 * 更新报表
 *
 * @param params
 * @return promiss
 */
export const updateReport = async (data = {}) => {
  return http.post('/api/report/update', data);
};

/**
 * 删除报表
 *
 * @param params
 * @return promiss
 */
export const deleteReport = async (id:any) => {
  return http.delete(`/api/report/delete?id=${id.id}`);
};
export const getActList = async (params: any) => {
  return http.get('/api/activity/list', params);
};
export const deleteTempData = async (params: any) => {
  return http.post('/api/report/deleteTable', params);
};
export const checknameUse = async (name: string) => {
  return http.get(`/api/report/checkName?name=${name}`, name);
};
export const getEventCodesByindic = async (id: string) => {
  return http.get(`/api/indicator/eventCodesByIndic?id=${id}`)
};
