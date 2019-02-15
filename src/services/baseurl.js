let flag = 'dev'; // dev开发版  pro生产版 local本地 test测试
module.exports = {
  baseURL:
    flag === 'test'
      ? '/api'
      : flag === 'dev'
      ? 'http://192.168.199.109:9001/master-admin'
      : flag === 'local'
      ? 'http://localhost:9001/master-admin'
      : flag === 'pro'
      ? '/api'
      : null,
};
