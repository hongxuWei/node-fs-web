import { message } from 'antd';
import axios from 'axios';


export const PAYLOAD = {
  JSON: Symbol('JSON'),
  FORM: Symbol('FORM'),
  URL: Symbol('URL'),
};

const instance = axios.create({
  baseURL: 'http://localhost/',
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
    console.log(error)
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

class Request {
  common (method, url, data, payloadType, options) {
    const axiosConfig = {
      method: method,
      url: url.replace(/{(\w+)}/g, (a, b) => {
        const m = data[b];
        delete data[b];
        return m;
      }),
    };

    if (data) {
      if (method === 'get' || payloadType === PAYLOAD.URL) {
        for (const k in data) {
          if (data.hasOwnProperty(k) && data[k] === '') {
            data[k] = undefined;
          }
        }
        axiosConfig.params = data;
      } else {
        if (payloadType === PAYLOAD.FORM) {
          const params = new URLSearchParams();
          Object.keys(data).forEach((key) => {
            if (data[key] !== undefined) {
              params.append(key, data[key]);
            }
          });
          axiosConfig.data = params;
        } else {
          axiosConfig.data = data;
        }
      }
      if (data._payload) {
        axiosConfig.data = data._payload;
      }
    }
    return instance({
      ...axiosConfig,
      ...options
    });
  }
  get (url, data, payloadType = PAYLOAD.URL, options = {}) {
    return this.common('get', url, data, payloadType, options);
  }
  post (url, data, payloadType = PAYLOAD.JSON, options) {
    return this.common('post', url, data, payloadType, options);
  }
  put (url, data, payloadType = PAYLOAD.URL, options) {
    return this.common('put', url, data, payloadType, options);
  }
  delete (url, data, payloadType = PAYLOAD.JSON, options) {
    return this.common('delete', url, data, payloadType, options);
  }
}

export default new Request();
