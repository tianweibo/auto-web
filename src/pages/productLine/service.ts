import http from '@/server/http';

/**
 * 获取产品线列表
 *
 * @param params
 * @return promiss
 */
export const getProductLineList = async (params: {}) => {
  return http.post('/api/productLine/list', params);
};

/**
 * 产品线的创建
 *
 * @param params
 * @return promiss
 */
export const addProductLine = async (params: {}) => {
  return http.post('/api/productLine/create', params);
};

/**
 * 产品线的编辑
 *
 * @param params
 * @return promiss
 */
export const editproductLine = async (params: {}, id: string) => {
  return http.post(`/api/productLine/update?id=${id}`, params);
};

/**
 * 产品线的禁用与否
 *
 * @param params
 * @return promiss
 */
export const usefulproductLine = async (id: string) => {
  return http.get(`/api/productLine/useful?id=${id}`);
};
/**
 * 产品线的删除
 *
 * @return promiss
 */
export const deleteproductLine = async (id: string) => {
  return http.get(`/api/productLine/delete?id=${id}`);
};
export const detailproductLine = async (id: string) => {
  return http.get(`/api/productLine/detail?id=${id}`);
};
