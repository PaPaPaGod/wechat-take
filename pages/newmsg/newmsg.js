// pages/newmsg/newmsg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notifications:[],
    token:'',
    page:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMsg()
  },
  getMsg:function(){
    var _this = this
    wx.request({
      url: 'http://takeapp.com.cn/Home/system/getMessageList',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data:{
        token:token,
        page:page,
        size:size
      },success:function(e){
        var code = e.data.code
        if(code==0){
          _this.setData({
            notifications:e.data.data
          })
        }
      }
    })
  }
})