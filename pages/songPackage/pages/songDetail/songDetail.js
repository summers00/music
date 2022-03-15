import PubSub from 'pubsub-js'
import moment from 'moment'
import request from '../../../../utils/request'
// 获取app实例
const appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 控制是否播放
    isPlay:false,
    // 歌曲详情
    detailData:{},
    // 音乐id
    musicId:'',
    // 当前播放音乐链接
    musuicLink:'',
    // 当前播放时间
    currentTime:'00:00',
    // 总时长
    durationTime:'00:00',
    // 进度条实时播放的宽度
    currentWidth:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取路由参数,不传是空对象
    this.setData({
      musicId:options.id
    })
    // 请求音乐详情，传入id
    this.getDetailData(this.data.musicId);
    // 判断全局状态，当前音乐是否在播放，如播放，改当前页面的状态为true
    if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === this.data.musicId) { //当前音乐正播放
      this.setData({
        isPlay:true
      })
    }
    this.backgroundAudio = wx.getBackgroundAudioManager() //当前页面添加音频管理器
    // 监听播放
    this.backgroundAudio.onPlay(() => {
    // 调用控制播放的函数，传入isPlay的值
    this.controlPlay(true)
    appInstance.globalData.musicId = this.data.musicId;
    });
    //  监听暂停
    this.backgroundAudio.onPause(() => {
      this.controlPlay(false)
    });
    //  监听结束音乐
    this.backgroundAudio.onStop(() => {
      this.controlPlay(false)
    });
    //  监听播放进度
    this.backgroundAudio.onTimeUpdate(() => {
      // 当前时长
      let currentTime = moment(this.backgroundAudio.currentTime*1000).format('mm:ss');
      let currentWidth = this.backgroundAudio.currentTime / this.backgroundAudio.duration * 450;
      // 更新当前时长
      this.setData({
        currentTime,
        currentWidth,
      })
})
   // 订阅，只订阅一次，在onload中
 PubSub.subscribe('musicId',(msg,musicId) => {
  //  请求详情数据
  this.getDetailData(musicId)
  // 自动播放，调用播放功能函数 传入参数，不传musicLink会发请求获取播放地址
  this.musicControl(true,musicId)
})
  },
   //  控制播放状态的功能函数
  controlPlay(isPlay) {
    //  改当前页面的状态
    this.setData({
      isPlay
    })
    // 改全局isPlay的状态
    appInstance.globalData.isMusicPlay = isPlay;
  },
  // 歌曲详情函数
  async getDetailData(ids) {
    // 根据id请求数据
    let result = await request('/song/detail?',{ids})
    let durationTime = moment(result.songs[0].dt).format('mm:ss')
    // 更新数据
    this.setData({
      detailData:result.songs[0],
      durationTime
    })
  },
  // 播放开关
  handlePlay() {
    // 取出isPlay,取反
    let isPlay = !this.data.isPlay
    let {musicId,musicLink} = this.data;
    // 调用播放功能函数
    this.musicControl(isPlay,musicId,musicLink)
  },
  // 播放功能函数，由isPlay控制是否播放
  async musicControl(isPlay,musicId,musicLink) {
    // 创建背景音频(可在后台播放)管理器，唯一
    // let backgroundAudio = wx.getBackgroundAudioManager() //if，else都用到，所以放到外边
    // 如果播放
    if(isPlay) {
      // 如果有musicLink不发请求
      if(!musicLink) {
        // 请求音乐地址数据
      let result = await request('/song/url',{id:musicId})
      // 取到播放地址,不能用let
      musicLink = result.data[0].url
      // 更新播放地址
      this.setData({
        musicLink
      })
      }
      // backgroundAudio.src="音乐播放地址" .title必填,设好自动播放
      this.backgroundAudio.src = musicLink;
      this.backgroundAudio.title = this.data.detailData.name
    } else { //暂停播放
      this.backgroundAudio.pause()
    }
  },
  // 上一首/下一首切换
  handleSwitch(e) {
    // 获取当前点击的类型
    let type = e.currentTarget.id;
    // 发布
    PubSub.publish('switchType',type)
  }
})