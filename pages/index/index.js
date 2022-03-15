import request from '../../utils/request'
Page({
  data: {
    // 轮播图
    banners:[],
    // 推荐
    recommendList:[],
    // 排行榜
    topList:[]
  },
//  监听页面
onLoad: function() {
  // 必须用this调用
  this.getIniteData()
},
// 请求数据
async getIniteData() {
  let result = await request('/banner',{type:2})
  // 保存数据
  this.setData({
    banners:result.banners
  })
  // 请求推荐数据
  result = await request('/personalized')
  // 保存请求推荐数据
  this.setData({
    recommendList:result.result
  })
  //请求次数0-4 发5次请求
  let idx = 0;
  let resultArr = [];
  while(idx<5) {
    // 发送请求,每次idx加1
    result = await request('/top/list',{idx:idx++})
    resultArr.push({
      name:result.playlist.name,
      tracks:result.playlist.tracks.filter((item,index)=> {
        return index<3 //取出数组前3个
      })
      })
  // 循环内实时更新，加载快，需更新5次
      this.setData({
        topList:resultArr
      })
  }
},
// 跳转至推荐页
toRecommendSong(){
  wx.navigateTo({
    url: '/pages/songPackage/pages/recommendSong/recommendSong'
  })
},
})
