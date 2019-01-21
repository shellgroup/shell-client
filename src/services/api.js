import { stringify } from 'qs';
import request from '@/utils/request';
import { baseURL } from '../services/baseurl';

//登录接口
export async function fakeAccountLogin(params) {
  return request(`${baseURL}/sys/login`, {
    method: 'POST',
    body: params,
  });
}
//动态读取菜单
export async function queryMenus() {
  return request(`${baseURL}/sys/menu/nav`, {
    method: 'GET',
  });
}

//获取图形验证码
export async function getFakeCaptcha() {
  return `${baseURL}/captcha.jpg?t=${new Date().getTime()}`;
}

//新建管理员
export async function addUser(params) {
  return request(`${baseURL}/sys/user/save`, {
    method: 'POST',
    body: params,
  });
}
//删除管理员
export async function removeUser(params) {
  return request(`${baseURL}/sys/user/delete`, {
    method: 'POST',
    body: params,
  });
}
//修改用户信息
export async function updateUser(params) {
  return request(`${baseURL}/sys/user/update`, {
    method: 'POST',
    body: params,
  });
}
//查询管理员管理列表
export async function queryUser(params) {
  return request(`${baseURL}/sys/user/list?${stringify(params)}`);
}

//新建部门
export async function addDept(params) {
  return request(`${baseURL}/sys/dept/save`, {
    method: 'POST',
    body: params,
  });
}
//删除部门信息
export async function removeDept(params) {
  return request(`${baseURL}/sys/dept/delete`, {
    method: 'POST',
    body: params,
  });
}
//修改部门信息
export async function updateDept(params) {
  return request(`${baseURL}/sys/dept/update`, {
    method: 'POST',
    body: params,
  });
}
//查询部门列表
export async function queryDept(params) {
  return request(`${baseURL}/sys/dept/list?${stringify(params)}`);
}


//新增角色
export async function addRole(params) {
  return request(`${baseURL}/sys/role/save`, {
    method: 'POST',
    body: params,
  });
}
//查询角色列表
export async function queryRole(params) {
  return request(`${baseURL}/sys/role/list?${stringify(params)}`);
}
//查询系统日志列表
export async function querySystemlog(params) {
  return request(`${baseURL}/sys/log/list?${stringify(params)}`);
}
//查询字典列表
export async function queryDictionary(params) {
  return request(`${baseURL}/sys/dict/list?${stringify(params)}`);
}
//查询参数列表
export async function queryParame(params) {
  return request(`${baseURL}/sys/config/list?${stringify(params)}`);
}
//查询定时任务列表
export async function queryTiming(params) {
  return request(`${baseURL}/sys/schedule/list?${stringify(params)}`);
}
//查询所有菜单列表
export async function queryMenulist(params) {
  return request(`${baseURL}/sys/menu/list?${stringify(params)}`);
}

//查询文件上传列表
export async function fileUploadList(params) {
  return request(`${baseURL}/sys/oss/list?${stringify(params)}`);
}

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}
