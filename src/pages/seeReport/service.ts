import http from '@/server/http';
const bigDataURL_test = 'https://test-open-gateway.enbrands.com';
const bigDataURL_prod = 'https://jifenn-open.enbrands.com'; // https://jifenn-open.enbrands.com
var bigDataURL = '';
if (window.location.href.indexOf('buriedpoint') > -1) {
  bigDataURL = bigDataURL_test;
} else {
  bigDataURL =
    window.location.href.indexOf('test') > -1 ||
    window.location.href.indexOf('localhost') > -1
      ? bigDataURL_test
      : bigDataURL_prod;
}

export const detailReport = async (id: string) => {
  return http.get(`/api/report/detail?id=${id}`);
};
export const detailApp = async (id: string, open_type: number) => {
  return http.get(`/api/application/detail?id=${id}&open_type=${open_type}`);
};
export const eventByindic = async (id: string) => {
  return http.post(`/api/indicator/listById`);
};
export const queryBasicData = async (id: string) => {
  return http.get(`/api/basic/data?id=${id}`);
};
export const getNumFromBigData = async (params: any) => {
  return http.post(`${bigDataURL}/erlang/views/getAggregData`, params);
};
