let flag = 'pro'; // dev开发版  pro生产版
module.exports = {
  baseURL:
    flag === 'pro'
      ? 'http://192.168.199.109:8080/renren-admin'
      : flag === 'dev'
      ? 'http://localhost:8080/renren-admin'
      : null,
};
