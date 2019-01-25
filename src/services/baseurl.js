let flag = 'pro'; // dev开发版  pro生产版 local本地
module.exports = {
  baseURL:
    flag === 'pro'? '/api': flag === 'dev'? 'http://192.168.199.109:9001/master-admin': null,
};
