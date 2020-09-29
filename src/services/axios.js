import { message } from 'antd';
import axios from 'axios';

export const instance = axios.create({
  baseURL: 'http://localhost/',
  timeout: 8000,
  headers: { 'x-requested-with': 'XMLHttpRequest' },
});

instance.interceptors.request.use((req) => {
  if (!window.navigator.onLine) {
    message.info('失去网络链接');
  }
  return req;
});

instance.interceptors.response.use(
  (res) => {
    if (res.status !== 200) {
      return Promise.reject(res.data);
    }
    if (res.data.code !== 1) {
      message.error(res.data.message || '出问题了');
      return Promise.reject(res.data);
    }
    return res.data.data;
  },
  (error) => {
    if (!error.response) {
      message.error('网络异常,请检查网络');
      return Promise.reject({
        message: '网络异常,请检查网络',
      });
    }

    const { url, headers, data, params } = error.config;
    const { data: resData = {}, status } = error.response;
    const { code } = resData;
    let msg = resData.message;
    const p = {
      request: {
        url,
        headers,
        data,
        params,
      },
      response: {
        data: resData,
        status,
      },
    };
    if (code !== 1) {
      message.error(msg);
    }
    return Promise.reject(JSON.stringify(p));
  },
);

export default instance;
