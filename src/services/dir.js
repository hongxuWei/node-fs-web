import axios from './axios';

export const getDir = (data) => axios.get('/dir', data);
export const getTrashDir = (data) => axios.get('/dir/trash', data);
