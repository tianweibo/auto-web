import http from '@/server/http';
/**
 * 登录
 *
 * @return promiss
 */
export const login = async (params) => {
  return http.post(`/api/user/login`,params);
};
export const isLogin = async () => {
  return http.get(`/api/user/isLogin`);
};
export const loginOut = async () => {
  return http.get(`/api/user/loginOut`);
};
export const resetPassword = async (params) => {
  return http.post(`/api/user/editPassword`,params);
};
