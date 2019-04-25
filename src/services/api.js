import { stringify } from 'qs';
import request from '@/utils/request';
import { baseURL } from '../services/baseurl';

//测试接口
export async function queryTest(params) {
  return request(`${baseURL}/sys/icon/list`, {
    method: 'POST',
    body: params
  });
}


//登录接口
export async function fakeAccountLogin(params) {
  return request(`${baseURL}/sys/login`, {
    method: 'POST',
    body: params,
  });
}
//退出登录
export async function logOut() {
  return request(`${baseURL}/logout`);
}

//动态读取菜单
export async function queryMenus() {
  return request(`${baseURL}/sys/menu/nav`, {
    method: 'GET',
  });
}

//获取图形验证码
export async function getFakeCaptcha(params) {
  return `${baseURL}/captcha.jpg?t=${params}`;
}
//检测用户名是否存在
export async function isExistByUserName(params) {
  return request(`${baseURL}/sys/user/isExistByUserName`, {
    method: 'POST',
    body: params,
  });
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
//修改用户基本信息
export async function updateBasic(params) {
  return request(`${baseURL}/sys/user/updateBasic`, {
    method: 'POST',
    body: params,
  });
}

//修改头像
export async function avatarFileUpload(params) {
  return request(`${baseURL}/sys/user/upload`, {
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
//检测角色是否存在
export async function isExistByRoleName(params) {
  return request(`${baseURL}/sys/role/isExistByRoleName`, {
    method: 'POST',
    body: params,
  });
}
//新增角色
export async function addRole(params) {
  return request(`${baseURL}/sys/role/save`, {
    method: 'POST',
    body: params,
  });
}
//删除角色信息
export async function removeRole(params) {
  return request(`${baseURL}/sys/role/delete`, {
    method: 'POST',
    body: params,
  });
}
//修改角色信息
export async function updateRole(params) {
  return request(`${baseURL}/sys/role/update`, {
    method: 'POST',
    body: params,
  });
}
//查询角色列表
export async function queryRole(params) {
  return request(`${baseURL}/sys/role/list?${stringify(params)}`);
}

//添加菜单
export async function addMenu(params) {
  return request(`${baseURL}/sys/menu/save`, {
    method: 'POST',
    body: params,
  });
}
//删除菜单
export async function removeMenu(params) {
  return request(`${baseURL}/sys/menu/delete`, {
    method: 'POST',
    body: params,
  });
}

//修改菜单信息
export async function updateMenu(params) {
  return request(`${baseURL}/sys/menu/update`, {
    method: 'POST',
    body: params,
  });
}
//查询所有菜单列表
export async function queryMenulist(params) {
  return request(`${baseURL}/sys/menu/list?${stringify(params)}`);
}
//查询icon图标
export async function queryIcon() {
  return request(`${baseURL}/sys/icon/list`,{
    method: 'POST',
  });
}

//查询定时任务列表
export async function queryTiming(params) {
  return request(`${baseURL}/sys/schedule/list?${stringify(params)}`);
}
//查询定时任务日志列表
export async function queryTimingLog(params) {
  return request(`${baseURL}/sys/scheduleLog/list?${stringify(params)}`);
}
//添加定时任务
export async function addTiming(params) {
  return request(`${baseURL}/sys/schedule/save`, {
    method: 'POST',
    body: params,
  });
}
//暂停任务
export async function suspendTiming(params) {
  return request(`${baseURL}/sys/schedule/pause`, {
    method: 'POST',
    body: params,
  });
}
//恢复任务
export async function recoveryTiming(params) {
  return request(`${baseURL}/sys/schedule/resume`, {
    method: 'POST',
    body: params,
  });
}
//执行任务
export async function implementTiming(params) {
  return request(`${baseURL}/sys/schedule/run`, {
    method: 'POST',
    body: params,
  });
}
//删除任务
export async function removeTiming(params) {
  return request(`${baseURL}/sys/schedule/delete`, {
    method: 'POST',
    body: params,
  });
}
//修改定时任务
export async function updateTiming(params) {
  return request(`${baseURL}/sys/schedule/update`, {
    method: 'POST',
    body: params,
  });
}

//添加参数
export async function addParame(params) {
  return request(`${baseURL}/sys/config/save`, {
    method: 'POST',
    body: params,
  });
}
//删除参数
export async function removeParame(params) {
  return request(`${baseURL}/sys/config/delete`, {
    method: 'POST',
    body: params,
  });
}
//修改参数
export async function updateParame(params) {
  return request(`${baseURL}/sys/config/update`, {
    method: 'POST',
    body: params,
  });
}
//查询参数列表
export async function queryParame(params) {
  return request(`${baseURL}/sys/config/list?${stringify(params)}`);
}


//添加字典
export async function addDictionary(params) {
  return request(`${baseURL}/sys/dict/save`, {
    method: 'POST',
    body: params,
  });
}
//删除字典
export async function removeDictionary(params) {
  return request(`${baseURL}/sys/dict/delete`, {
    method: 'POST',
    body: params,
  });
}
//修改字典
export async function updateDictionary(params) {
  return request(`${baseURL}/sys/dict/update`, {
    method: 'POST',
    body: params,
  });
}
//查询字典列表
export async function queryDictionary(params) {
  return request(`${baseURL}/sys/dict/list?${stringify(params)}`);
}

//查询系统日志列表
export async function querySystemlog(params) {
  return request(`${baseURL}/sys/log/list?${stringify(params)}`);
}



//云存储配置
export async function addSaveConfig(params) {
  return request(`${baseURL}/sys/oss/saveConfig`, {
    method: 'POST',
    body: params,
  });
}

//查询文件上传列表
export async function fileUploadList(params) {
  return request(`${baseURL}/sys/oss/list?${stringify(params)}`);
}
//查询文件上配置
export async function configList(params) {
  return request(`${baseURL}/sys/oss/config?${stringify(params)}`);
}
//文件上传
export async function fileUpload(params) {
  return request(`${baseURL}/sys/oss/upload`, {
    method: 'POST',
    body: params,
  });
}
//文件删除
export async function removeUpload(params) {
  return request(`${baseURL}/sys/oss/delete`, {
    method: 'POST',
    body: params,
  });
}





//查询二维码列表
export async function queryQrcode(params) {
  // return request(`${baseURL}/qrcode/info/list`, {
  //   method: 'POST',
  //   body: params,
  // });
  return request(`${baseURL}/qrcode/info/list?${stringify(params)}`);
}

//新建二维码
export async function addQrcode(params) {
  return request(`${baseURL}/qrcode/info/save`, {
    method: 'POST',
    body: params,
  });
}
//删除二维码信息
export async function removeQrcode(params) {
  return request(`${baseURL}/qrcode/info/delete`, {
    method: 'POST',
    body: params,
  });
}
//修改二维码信息
export async function updateQrcode(params) {
  return request(`${baseURL}/qrcode/info/update`, {
    method: 'POST',
    body: params,
  });
}
//生成二维码
export async function createqrCode(params) {
  return request(`${baseURL}/qrcode/info/createqrCode`, {
    method: 'POST',
    body: params,
  });
}
//批量生成二维码
export async function createqrCodes(params) {
  return request(`${baseURL}/qrcode/info/createqrCodes`, {
    method: 'POST',
    body: params,
  });
}
//查询二维码参数列表
export async function queryQrcodeConfig(params) {
  // return request(`${baseURL}/qrcode/info/list`, {
  //   method: 'POST',
  //   body: params,
  // });
  return request(`${baseURL}/qrcode/config/list?${stringify(params)}`);
}

//新建二维码参数
export async function addQrcodeConfig(params) {
  return request(`${baseURL}/qrcode/config/save`, {
    method: 'POST',
    body: params,
  });
}
//删除二维码参数信息
export async function removeQrcodeConfig(params) {
  return request(`${baseURL}/qrcode/config/delete`, {
    method: 'POST',
    body: params,
  });
}
//修改二维码参数信息
export async function updateQrcodeConfig(params) {
  return request(`${baseURL}/qrcode/config/update`, {
    method: 'POST',
    body: params,
  });
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
