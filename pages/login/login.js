import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    password:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  // 监听文本框输入
  handleInp(e) {
    // 获取data-value
    let type = e.currentTarget.dataset.type
    // 更新数据
    this.setData({
      // 属性为变量，用中括号
      [type]:e.detail.value //文本框的值更新到对应变量中
    })
  },
  // 登录
  async login() {
    // 收集表单项数据
    let {phone,password} = this.data
    // 前端验证
    // 手机号验证：是否为空
    if(!phone) {
      // 弹窗提示
      wx.showToast({
        title: '请输入手机号',
        icon:'none',
      })
      return;
    }
    // 手机号格式是否正确
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
    if(!phoneReg.test(phone)) {
      wx.showToast({
        title:'手机号格式错误',
        icon:'none'
      })
      return;
    }
    // 密码验证
    if(!password) {
      wx.showToast({
        title: '请输入密码',
        icon:'none'
      })
      return;
    }

    // 验证通过，发送请求，进行后端验证
    let result = await request('/login/cellphone',{phone,password,isLogin:true})
    // 200请求成功 400手机号错误 502密码错误
    if(result.code === 200) {
      // 跳转到个人中心，switchTab跳到tabbar,关闭所有非tarbar；reLaunch关闭所有页面
      wx.reLaunch({
        url:'/pages/profile/profile'
      })
      // 用户信息保存到本地存储
      wx.setStorageSync('userInfo',result.profile);

    } else if(result.code === 400) {
      wx.showToast({
        title: '手机号错误',
        icon:'none'
      })
    } else if (result.code === 502) {
      wx.showToast({
        title: '密码错误',
        icon:'none'
      })
    } else {
      wx.showToast({
        title: '请重新登录',
        icon:'none'
      })
    }
  }
})