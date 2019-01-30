import moment from 'moment';
import React from 'react';
import nzh from 'nzh/cn';
import { parse, stringify } from 'qs';
import { Modal } from 'antd';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  return nzh.toMoney(n);
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}
/*操作统一模态提醒*/
export function tips(res, that, path, menu) {
  if (res.code == 0) {
    Modal.success({
      title: '成功提示！',
      content: res.msg,
    });
  } else {
    console.log(res,99999000000);
    Modal.error({
      title: '错误提示！',
      content: res.msg,
    });
  }
  if (menu == "menu") {
    window.location.reload();
  }
  if (path && that) {
    const { dispatch } = that.props;
    dispatch({
      type: path,
    });
  }

}
/*操作按钮授权*/
export function disablesBtns(that) {
  //arguments//
  const data = that.props.location.state;
  if(!data){
    return;
  }
  for (let i = 0; i < data.length; i++) {
    if (data[i].indexOf('save') != -1) {
      that.setState({
        SaveBtn: true,
      });
    }
    if (data[i].indexOf('delete') != -1) {
      that.setState({
        DeleteBtn: true,
      });
    }
    if (data[i].indexOf('update') != -1) {
      that.setState({
        UpdateBtn: true,
      });
    }
    if (data[i].indexOf('select') != -1) {
      that.setState({
        SelectBtn: true,
      });
    }
    if (data[i].indexOf('list') != -1) {
      that.setState({
        ShowList: true,
      });
    }
    if (data[i].indexOf('info') != -1) {
      that.setState({
        ShowInfo: true,
      });
    }
    if (data[i].indexOf('pause') != -1) {
      that.setState({
        PauseBtn: true,
      });
    }
    if (data[i].indexOf('resume') != -1) {
      that.setState({
        ResumeBtn: true,
      });
    }
    if (data[i].indexOf('run') != -1) {
      that.setState({
        RunBtn: true,
      });
    }
    if (data[i].indexOf('log') != -1) {
      that.setState({
        LogBtn: true,
      });
    }
  }
}
//统一删除模板

export function showDeleteConfirmParames(index) {
  if(index){
    switch(index)
    {
      case 1:
        return {
          title: '暂停确认',
          content: '你确定进行【暂停】操作吗？',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
        };
        break;
      case 2:
        return {
          title: '恢复确认',
          content: '你确定进行【恢复】操作吗？',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
        };
        break;
      case 3:
        return {
          title: '执行确认',
          content: '你确定进行【执行】操作吗？',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
        };
        break;
      case 4:
        return {
          title: '删除确认',
          content: '你确定进行【删除】操作吗？',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
        };
        break;
    }
  }
  return {
    title: '删除确认',
    content: '你确定进行【删除】操作吗？',
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
  };
}
//处理部门数据
export function child(data) {
  if(!data){
    return;
  }
  for (let i = 0; i < data.length; i++) {
    data[i].value = data[i].deptId;
    data[i].key = data[i].deptId;
    data[i].title = data[i].name;
    if (data[i].children) {
      data[i].children = child(data[i].children);
    }
  }
  return data;
}

//处理菜单列表数据
export function menuChild(data) {
  if(!data){
    return;
  }
  for (let i = 0; i < data.length; i++) {
    data[i].key = data[i].menuId;
    data[i].value = data[i].menuId;
    data[i].title = data[i].name;
    if (data[i].children) {
      data[i].children = menuChild(data[i].children);
    }
  }
  return data;
}

export function formatWan(val) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          style={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export function isAntdPro() {
  return window.location.hostname === 'preview.pro.ant.design';
}
