import http from '@/server/http';

/**
 * 获取指标列表
 *
 * @param params
 * @return promiss
 */
export const getTagList = async (params: {}) => {
  return http.get('/api/sys-tag/list', params);
};

/**
 * 查询指标列表
 *
 * @param params
 * @return promiss
 */
export const queryTagList = async (params: {}) => {
  return http.get('/api/sys-tag/index', params);
};

/**
 * 查询指标
 *
 * @param params
 * @return promiss
 */
export const queryTag = async (params: {}) => {
  return http.get('/api/sys-tag/detail', params);
};

/**
 * 创建指标
 *
 * @param params
 * @return promiss
 */
export const createTag = async (data = {}) => {
  return http.post('/api/sys-tag/create', data);
};

/**
 * 更新指标
 *
 * @param params
 * @return promiss
 */
export const updateTag = async (data = {}, params = {}) => {
  return http.post('/api/sys-tag/update', data, params);
};

/**
 * 删除指标
 *
 * @param params
 * @return promiss
 */
export const deleteTag = async (params = {}) => {
  return http.post('/api/sys-tag/delete', params);
};
