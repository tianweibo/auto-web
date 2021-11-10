import http from '@/server/http';
/**
 * 基础数据的获取
 *
 * @return promiss
 */
 export const basicData = async (id:string) => {
  return http.get(`/api/basic/data?id=${id}`);
};

/**
 * 获取属性列表
 *
 * @param params
 * @return promiss
 */
export const getAttributeList = async (params: {}) => {
  return http.post('/api/attribute/list', params);
};


/**
 * 属性的详情查看
 *
 * @return promiss
 */
export const detailAttribute = async (params: {}) => {
  return http.post(`/api/attribute/detail`,params);
};


/**
 * 属性下的事件列表
 *
 * @return promiss
 */
 export const eventListOfAttr = async (params: {}) => {
  return http.post(`/api/attribute/eventList`,params);
};
export const getLabelTree = async (params: {}) => {
  return http.post('/api/label/listTree', params);
};
