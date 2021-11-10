import http from '@/server/http';

/**
 *基础数据的获取
 *
 * @param params
 * @returns
 */

export const getBasicData = async (params: {}) => {
  return http.get('/api/basic/data', params);
};
/**
 * 获取属性列表
 *
 * @param params
 * @return promise
 */
export const getAttributeList = async (params: {}) => {
  return http.get('/api/attribute/list', params);
};

/**
 * 查询属性列表
 *
 * @param params
 * @return promise
 */
export const queryAttributeList = async (params: {}) => {
  return http.get('/api/attribute/index', params);
};

/**
 * 查询属性
 *
 * @param params
 * @return promise
 */
export const queryAttribute = async (params: {}) => {
  return http.get('/api/attribute/detail', params);
};

/**
 * 创建属性
 *
 * @param params
 * @return promise
 */
export const createAttribute = async (data = {}) => {
  return http.post('/api/attribute/create', data);
};

/**
 * 更新属性
 *
 * @param params
 * @return promise
 */
export const updateAttribute = async (data = {}, params = {}) => {
  return http.post('/api/attribute/update', data);
};

/**
 * 删除属性
 *
 * @param params
 * @return promise
 */
export const deleteAttribute = async (params = {}) => {
  return http.post('/api/attribute/delete', params);
};

/**
 * 属性下事件列表的获取
 * @param params
 */
export const getAttributeEventList = async (params = {}) => {
  return http.post('/api/attribute/eventList', params);
};
