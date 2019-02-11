import request from '@/utils/request';
import { baseURL } from '../services/baseurl';

export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return request(`${baseURL}/sys/user/info`);
}
