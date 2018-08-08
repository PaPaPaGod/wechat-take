// pages/home/home.js
var token=''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:''
  },

  onShareAppMessage:function(){
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'token',
      success: function(res) {
        token = res.data
        console.log("home page get token: "+token)
      },fail:function(e){
        console.log(e)
        wx.redirectTo({
          url: '../login/login',
        })
      }
    })
    this.wxGetAccessToken();
    this.wxLogin();
  },
  //获取access_token
  wxGetAccessToken:function(){
    console.log("appId:" + this.globalData.appId)
    console.log("secret:" + this.globalData.appSecret)
    var _this = this
    wx.request({
      url: 'https://takeapp.com.cn/Home/Index/getaccesstoken',
      success:function(e){
        _this.globalData.access_token = e.data.data
        console.log("access_token:" + _this.globalData.access_token)
      }
    })    
  },

  //获取openId
  wxLogin:function(){
    var _this = this
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          console.log("res.code::"+res.code)
          // wx.request({
          //   url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + _this.globalData.appId + '&secret=' + _this.globalData.appSecret+'&js_code='+res.code+'&grant_type=authorization_code',
          //   method: 'GET',  
          //   success: function (res) {
          //     var obj = {};
          //     obj.openid = res.data.openid;
          //     obj.expires_in = Date.now() + res.data.expires_in;
          //     wx.setStorageSync('openId', obj);//存储openid  
          //     console.log("openId:"+obj.openid)
          //     _this.globalData.openId = obj.openid
          //   }
          // })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  navigateToPublish:function(){
    wx.navigateTo({
      url: '../publish/publish?access_token=' + this.globalData.access_token + '&' + 'openId=' + this.globalData.openId,
    })
  },
  navigateToMyOrder: function () {
    wx.navigateTo({
      url: '../myorder/myorder?token='+token,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  navigateToLogin: function () {
    wx.navigateTo({
      url: '../login/login?token=' + token,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  globalData:{
    appId : 'wxeefef217c2ab4ce5',
    appSecret : 'ce1c01b1c75896d98261d879414ea260',
    openId : '',
    access_token: ''
  }
})