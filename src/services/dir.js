import axios from './axios';

export const getDir = (data) => axios.get('/dir', data);
export const getDirInfo = (data) => axios.get('/dir/info/{dirId}', data);
export const getTrashDir = (data) => axios.get('/dir/trash', data);
