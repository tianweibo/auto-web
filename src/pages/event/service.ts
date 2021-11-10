import http from '@/server/http';

/**
 *基础数据的获取
 *
 * @param params
 * @returns
 */

export const BasicData = async (id: string) => {
  return http.get(`/api/basic/data?id=${id}`);
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

/**
 * 查询指标列表
 *
 * @param params
 * @return promiss
 */
export const queryEventList = async (params: {}) => {
  return http.post('/api/event/list', params);
};

/**
 * 查询事件详情
 *
 * @param params
 * @return promiss
 */
export const queryEvent = async (id: string) => {
  return http.get(`/api/event/detail?id=${id}`);
};
export const indicatorListByEventId = async (id:string) => {
  return http.get(`/api/event/indicByEventId?id=${id}`);
};
/**
 * 创建事件
 *
 * @param params
 * @return promiss
 */
export const createEvent = async (data = {}) => {
  return http.post('/api/event/create', data);
};

/**
 * 事件批量导入
 *
 * @param params
 * @return promiss
 */
export const importEvent = async (data = {}) => {
  return http.post('/api/event/update', data);
};

/**
 * 事件更新
 *
 * @param params
 * @return promiss
 */
export const updateEvent = async (data = {}, id:string) => {
  return http.post(`/api/event/update?id=${id}`, data);
};

/**
 * 事件的归档与否
 *
 * @param params
 * @return promiss
 */
export const usefulEvent = async (id: string) => {
  return http.get(`/api/event/archive?id=${id}`);
};

/**
 * 事件的删除
 *
 * @return promiss
 */
export const deleteEvent = async (id: string) => {
  return http.delete(`/api/event/delete?id=${id}`);
};

/**
 * 获取属性列表
 *
 * @param params
 * @return promise
 */
export const getAttributeList = async (params: {}) => {
  return http.post('/api/attribute/list', params);
};

/**
 * 属性详情查看，批量
 */

export const getAttributeDetail = async (params: {}) => {
  return http.post('/api/attribute/detail', params);
};

export const getLabelTree = async (params: {}) => {
  return http.post('/api/label/listTree', params);
};