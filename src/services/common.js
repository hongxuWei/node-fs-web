import axios from './axios';

export const getFileList = (data) => axios.get('/file', data);
export const upload = (data) => axios.post('/file', data);
export const fileExits = (data) => axios.get('/file/exits/{md5}', data);
export const fastUpload = (data) => axios.post('/file/fast/{md5}', data);
export const partUploadStart = (data) => axios.post('/file/part/start', data);
export const partUpload = (data) => axios.post('/file/part/upload/{md5}/{index}', data);
export const partMerge = (data) => axios.post('/file/part/merge/{md5}', data);
