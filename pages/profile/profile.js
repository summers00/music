import request from "../../utils/request"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户信息
    userInfo:{},
    // 最近播放
    recentPlayList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取本地存储的用户信息
    let userInfo = wx.getStorageSync('userInfo')
   if(userInfo) { //用户已登录
      // 保存用户信息
    this.setData({
      userInfo,
    })
    // 请求最近播放
    this.getRecentPlayData(this.data.userInfo.userId)
   }
  },
  // 请求最近播放数据功能函数
  async getRecentPlayData(uid) {
    let result = await request('/user/record',{uid:uid,type:1})
    let index = 0;
    // 更新数据
    this.setData({
      recentPlayList:result.weekData.slice(0,9).map(item => {
        // 数组中加唯一标识
        item.id = index++;
        return item;
      })
    })
  },
  // 跳转到登录
  login() {
    // 登录成功后禁止跳转,对象下某个属性，有表示已登录
    if(this.data.userInfo.nickname) {
      return;
    }
    wx.navigateTo({
      url:'/pages/login/login',
    })
  },
})