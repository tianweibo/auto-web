import http from '@/server/http';

/**
 * 获取指标列表
 *
 * @param params
 * @return promiss
 */
export const getIndicatorList = async (params: {}) => {
  return http.post('/api/indicator/list', params);
};

/**
 * 指标的创建
 *
 * @param params
 * @return promiss
 */
export const addIndicator = async (params: {}) => {
  return http.post('/api/indicator/create', params);
};

/**
 * 指标的编辑
 *
 * @param params
 * @return promiss
 */
export const editIndicator = async (params: {},id:string) => {
  return http.post(`/api/indicator/update?id=${id}`, params);
};

/**
 * 指标的详情查看
 *
 * @return promiss
 */
export const detailIndicator = async (id:string) => {
  return http.get(`/api/indicator/detail?id=${id}`);
};

/**
 * 指标的归档与否
 *
 * @param params
 * @return promiss
 */
 export const usefulIndicator = async (id:string) => {
  return http.get(`/api/indicator/archive?id=${id}`);
};

/**
 * 指标的删除
 *
 * @return promiss
 */
 export const deleteIndicator = async (id:string) => {
  return http.delete(`/api/indicator/delete?id=${id}`);
};

/**
 * 基础数据的获取
 *
 * @return promiss
 */
 export const basicData = async (id:string) => {
  return http.get(`/api/basic/data?id=${id}`);
};
export const getIndicListByType = async (params: {}) => {
  return http.post('/api/indicator/listByType', params);
};

/**
 * 获取事件列表
 *
 * @param params
 * @return promiss
 */
 export const getEventList = async (params: {}) => {
  return http.post('/api/event/list', params);
};
export const getLabelTree = async (params: {}) => {
  return http.post('/api/label/listTree', params);
};

export const getEventById=async (params: {}) => {
  return http.post('/api/event/listById', params);
};