const dev = {
  // baseUrl: 'http://172.16.115.214:5032/'
  baseUrl: 'http://152.136.182.96:5032/'
}
const test = {
  // baseUrl: 'http://172.16.115.162:5032/'
  // baseUrl: 'http://localhost:5032/' // 原部署地址
  baseUrl: 'http://152.136.182.96:5032/' // 本地测试地址
}
const production = {
  baseUrl: '',
  baseUrl2: ''
}
console.log(dev, production)
export default test
