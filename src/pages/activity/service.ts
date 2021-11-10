import request from 'umi-request';
import http from '@/server/http';
export async function filterActivityList(params: { count: number }) {
  return request('/api/activity/filter', {
    method: 'POST',
    params,
  });
}

export async function queryActivityList(params: { count: number }) {
  return http.get('/api/activity/list', params);
}

export async function queryActivityIndex(params: any) {
  return http.get('/api/activity/index', params);
}

export const queryActivityItem = async (params: { activity_id: number }) => {
  return http.get('/api/activity/detail', params);
};

export const editActivityItem = async (params: any) => {
  return http.post('/api/activity/update', params);
};

export const createActivityItem = async (params: any) => {
  return http.post('/api/activity/create', params);
};

export const getProjectList = async (params: any) => {
  return http.get('/api/project/list', params);
};
