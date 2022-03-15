import config from './config'
export default (url,data={},method="GET") => {
  // 初始化Promise,状态为pendding
  return new Promise((resolve,reject) => {
    // 执行异步任务
    wx.request({
      //不同环境不同的请求地址
      url:config.host + url,
      data,
      method,
      // 请求头携带cookie,要求传入字符串，这里是数组会自动调用原型的方法，需手动调用数组自身方法
      header:{
        // 没有登录cookie为空,找MUSIC字符不等于-1说明找到
        cookie:wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U')!== -1):''
      },
      // 修改promise状态
      success:(res) => {
        // 登录请求，判断传入的data中的isLogin(只有登录请求有)
        if(data.isLogin) {
          // 保存cookies到本地
          wx.setStorageSync('cookies', res.cookies)
        }
        resolve(res.data) //将promise改为成功状态resolved
      },
      fail:(err) => {
        reject(err) //将promise改为失败状态rejected
      }
    })
  })
}