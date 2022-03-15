import PubSub from 'pubsub-js'
import request from '../../../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    month:'',
    day:'',
    // 歌曲列表
    songListData:[],
    // 歌曲在数组中的下标
    index:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let date = new Date();
    this.setData({
      month:date.getMonth() + 1,
      day:date.getDate(),
    })
    // 请求歌曲列表
    this.songListData();
    // 订阅
    PubSub.subscribe('switchType',(msg,switchType) => {
      let {songListData,index} = this.data
      // 如果点击类型是上一首
      if(switchType === "pre") {
        // 如果下标为0
        if(index === 0) {
          // 将index改为数组最后一个，不用减1，因为下一句会减1
          index = songListData.length;
        }
        index-=1;
        // 点击类型是下一首
      } else {
        // 如果index下标为数组最后一个
        if(index === songListData.length-1) {
          // 将index改为数组第1个，因为下一句会加1，所以是-1
          index = -1;
        } 
        index+=1;
      }
      // 更新下标
      this.setData({
        index
      })
      // 数组对应下标的id为当前音乐id
    let musicId = songListData[index].id
    // 发布
    PubSub.publish('musicId',musicId)
    })
  },
  // 请求歌曲列表功能函数
  async songListData() {
    let result = await request('/recommend/songs');
    this.setData({
      songListData:result.recommend
    })
  },
  // 跳转详情页
  toDetail(e) {
    // 获取歌曲id
    let id = e.currentTarget.dataset.id;
    // 当前歌曲在数组中的下标
    let index = e.currentTarget.dataset.index;
    // 更新当前点击歌曲下标
    this.setData({
      index
    })

    wx.navigateTo({
      // query传参,字符串格式，传参内容过长会截取
      url: '/pages/songPackage/pages/songDetail/songDetail?id='+id, 
    })
  },
})