import axios, { PAYLOAD } from './axios';

export const getDir = (data) => axios.get('/dir', data);
export const getDirInfo = (data) => axios.get('/dir/info/{dirId}', data);
export const getTrashDir = (data) => axios.get('/dir/trash', data);
export const addDir = (data) => axios.post('/dir', data);
export const batchDeleteDir = (data) => axios.delete('/dir/batch', data, PAYLOAD.URL);
export const renameDir = (data) => axios.put('/dir/{id}/name/{name}', data);
