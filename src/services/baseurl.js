let flag = "pro"; // dev开发版  pro生产版
module.exports={
  baseURL:flag === "dev" ? "http://192.168.199.108:8080/renren-admin" : (flag === "pro" ? "http://localhost:8080/renren-admin":"")
}
