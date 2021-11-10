import http from '@/server/http';

/**
 * 获取用户列表
 *
 * @param params
 * @return promiss
 */
export const getUserList = async (params: {}) => {
  return http.post('/api/user/list', params);
};

/**
 * 用户的创建
 *
 * @param params
 * @return promiss
 */
export const addUser = async (params: {}) => {
  return http.post('/api/user/create', params);
};

export const giveData = async (params: {}) => {
  return http.post('/api/user/dataGift', params);
};
/**
 * 用户的编辑
 *
 * @param params
 * @return promiss
 */
export const editUser = async (params: {}, id: string) => {
  return http.post(`/api/user/update?id=${id}`, params);
};
/**
 * 用户的详情查看
 *
 * @param params
 * @return promiss
 */
export const detailUser = async (id: string) => {
  return http.get(`/api/user/detail?id=${id}`);
};

/**
 * 用户的禁用与否
 *
 * @param params
 * @return promiss
 */
export const usefulUser = async (id: string) => {
  return http.get(`/api/user/useful?id=${id}`);
};
/**
 * 用户的删除
 *
 * @return promiss
 */
export const deleteUser = async (id: string) => {
  return http.delete(`/api/user/delete?id=${id}`);
};
/**
 * 基础数据的获取
 *
 * @return promiss
 */
export const basicData = async (id: string) => {
  return http.get(`/api/basic/data?id=${id}`);
};

export const resetPassword = async (id: string) => {
  return http.get(`/api/user/resetPassword?id=${id}`);
};

export const requireProList = async () => {
  return http.get(`/api/productLine/listAll`);
};
