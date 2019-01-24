let flag = 'pro'; // dev开发版  pro生产版
module.exports = {
  baseURL:
    flag === 'pro'
      ? 'http://192.168.199.109:9001/master-admin'
      : flag === 'dev'
      ? 'http://localhost:9001/master-admin'
      : null,
};
