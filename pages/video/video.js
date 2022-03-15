import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 导航列表
    navList:[],
    // 导航标识
    navId:0,
    // 视频列表
    videoList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 请求标签数据
    this.getNavListData();
  },
//  获取标签数据功能函数 
  async getNavListData() {
    let result = await request('/video/group/list')
    // 更新数据
    this.setData({
      navList:result.data.slice(0,10),
      // 默认是第一个
      navId:result.data[0].id
    })
    // 请求视频列表
    this.getVideoListData(this.data.navId);
  },
  // 请求视频功能函数
  async getVideoListData(id) {
    let index = 0;
    let result = await request('/video/group',{id})
    // 隐藏加载
    wx.hideLoading();
    // 携带cookie后更新数据
    this.setData({
      videoList:result.datas.map(item=> {
        item.id = index++;
        return item;
      })
    })
  },
// 点击导航
navItemTap(e) {
  // 获取id类型是String,需转为Number
  // let navId = Number(e.currentTarget.id)
  // 获取id是Number
  let navId = e.currentTarget.dataset.id
  this.setData({
    navId,
    // 视频列表清空
    videoList:[],
  })
  // 正在加载
  wx.showLoading({
    title: '正在加载',
  })
  // 请求视频数据
  this.getVideoListData(this.data.navId)
},
// 分享
onShareAppMessage:function({from}) {
  return {
    page: '/pages/video/video',
  }
}
})