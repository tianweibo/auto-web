import http from '@/server/http';

/**
 * 获取应用列表
 *
 * @param params
 * @return promiss
 */
export const getAppList = async (params: {}) => {
  return http.post('/api/application/list', params);
};

/**
 * 应用的创建
 *
 * @param params
 * @return promiss
 */
export const addApp = async (params: {}) => {
  return http.post('/api/application/create', params);
};

/**
 * 应用的编辑
 *
 * @param params
 * @return promiss
 */
export const editApp = async (params: {}, id: string) => {
  return http.post(`/api/application/update?id=${id}`, params);
};
/**
 * 事件的详情查看(组)
 *
 * @param params
 * @return promiss
 */
export const detailOfEvent = async (params = {}) => {
  return http.post('/api/application/detailByEvent', params);
};
/**
 * 应用的详情查看
 *
 * @return promiss
 */
export const detailApp = async (id: string, open_type: number) => {
  return http.get(`/api/application/detail?id=${id}&open_type=${open_type}`);
};
export const indicatorNumOfApp = async (id: string) => {
  return http.get(`/api/application/indicatorNum?id=${id}`);
};
/**
 * 指标的详情查看(组)
 *
 * @param params
 * @return promiss
 */
export const detailOfIndicator = async (params = {}) => {
  return http.post('/api/application/detailByIndicator', params);
};

/**
 * 应用的启停与否
 *
 * @param params
 * @return promiss
 */
export const usefulApp = async (id: string) => {
  return http.get(`/api/application/useful?id=${id}`);
};

/**
 * 应用的删除
 *
 * @return promiss
 */
export const deleteApp = async (id: string) => {
  return http.delete(`/api/application/delete?id=${id}`);
};

/**
 * 基础数据的获取
 *
 * @return promiss
 */
export const basicData = async (id: string) => {
  return http.get(`/api/basic/data?id=${id}`);
};

/**
 * 获取指标
 *
 * @param params
 * @return promiss
 */
export const getIndicListByType = async (params: {}) => {
  return http.post('/api/indicator/listByType', params);
};

export const getIndicListByid = async (params: {}) => {
  return http.post('/api/indicator/listById', params);
};

export const detailByEvent = async (params: {}) => {
  return http.post('/api/application/detailByEvent', params);
};
export const getLabelTree = async (params: {}) => {
  return http.post('/api/label/listTree', params);
};
export const downloadData = async (id: any, flag: boolean) => {
  return http.get(`/api/auxiliary/downData?id=${id}&flag=${flag}`);
};
