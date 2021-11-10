import http from '@/server/http';

/**
 * 查询项目列表
 *
 * @param params
 * @return promiss
 */
export const queryProjectList = async (params: {}) => {
  return http.get('/api/project/index', params);
};

export const getProjectList = async (params: {}) => {
  return http.get('/api/project/list', params);
};

/**
 * 查询项目
 *
 * @param params
 * @return promiss
 */
export const queryProject = async (params: {}) => {
  return http.get('/api/project/detail', params);
};

/**
 * 创建项目
 *
 * @param params
 * @return promiss
 */
export const createProject = async (data = {}) => {
  return http.post('/api/project/create', data);
};

/**
 * 更新项目
 *
 * @param params
 * @return promiss
 */
export const updateProject = async (data = {}) => {
  return http.post('/api/project/update', data);
};

/**
 * 删除项目
 *
 * @param params
 * @return promiss
 */
export const deleteProject = async (params = {}) => {
  return http.post('/api/project/delete', params);
};
