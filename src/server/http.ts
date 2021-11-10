import request from 'umi-request';
import conf from '../config/conf';
import { HttpType, responseDataType } from './data.d';
const { REACT_APP_ENV } = process.env;
import {
  message,
} from 'antd';
import { history } from 'umi';

const http = ({
  method,
  url,
  data,
  params,
}: HttpType): Promise<responseDataType<any>> => {
  //   data = Object.assign({}, data, conf)
  const token = window.localStorage.getItem('token');
  data = Object.assign({}, data);
  //   data = getSigndata(data)
  const headers = {
    Authorization: `${token}`,
  };
  return request(url, {
    method,
    data,
    params,
    headers,
  }).catch((error) => {
    console.log(error);
  });
};

//查看
http.get = (url: string, params = {}) =>
  http({
    method: 'get',
    url,
    params,
  });

//创建
http.post = (url: string, data = {}) =>
  http({
    method: 'post',
    url,
    data,
  });

//编辑
http.put = (url: string, data = {}) =>
  http({
    method: 'put',
    url,
    data,
  });

//删除
http.delete = (url: string, data = {}) =>
  http({
    method: 'delete',
    url,
    data,
  });
  request.interceptors.response.use(async (response) => {
    const res = await response.clone().json();
    if (res?.status === 401) {
      message.error(res?.msg || '请重新登录');
      history.push({
        pathname: '/login',
      });
    }else if(res?.status===1){
      message.error(res?.msg||'数据问题');
    }
    return response;
});
export default http;
