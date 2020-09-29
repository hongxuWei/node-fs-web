import axios from './axios';

export function getFileList(data) {
  return axios.get('/file', {
    params: data,
  });
}