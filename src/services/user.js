import request from '@/utils/request';
import baseUrl from './baseurl';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
  //return request(`${baseURL}/sys/user/info`);
}
