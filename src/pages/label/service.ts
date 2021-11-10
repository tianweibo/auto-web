import http from '@/server/http';

/**
 * 获取标签的列表
 *
 * @param params
 * @return promiss
 */
export const getLabelList = async (params: {}) => {
  return http.post('/api/label/list', params);
};
export const getLabelTree = async (params: {}) => {
  return http.post('/api/label/listTree', params);
};

/**
 * 标签的创建
 *
 * @param params
 * @return promiss
 */
export const addLabel = async (params: {}) => {
  return http.post('/api/label/create', params);
};

/**
 * 应用的编辑
 *
 * @param params
 * @return promiss
 */
export const editLabel = async (params: {}) => {
  return http.post(`/api/label/update`, params);
};

/**
 * 标签的删除
 *
 * @return promiss
 */
 export const deleteLabel = async (id:string) => {
  return http.delete(`/api/label/delete?id=${id}`);
};
export const getFLabels = async () => {
  return http.get(`/api/label/labelType`);
};
export const getFuid=async(id:string)=>{
  return http.get(`/api/label/findLabelId?id=${id}`);
}
