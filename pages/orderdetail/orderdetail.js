// pages/orderdetail/orderdetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:'',
    company:'',
    des:'',
    state:'',
    money:'',
    created:'',
    place:'',
    taker_id:'',
    takerName:'',
    takerPhone:''
  },

  onShareAppMessage:function(){},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var token =''
    wx.getStorage({
      key: 'token',
      success: function(res) {
        token = res.data
      },
    })
    this.setData({
      token:token,
      company: options.company,
      des: options.des,
      state: options.state,
      money: options.money,
      created: options.created,
      place: options.place,
      taker_id: options.accepter_id
    })
    if(this.data.state==2){
      this.getTakerMsg(this.data.taker_id)
    }
  },
  getTakerMsg:function(id){
    var _this = this
    wx.request({
      url: 'https://takeapp.com.cn/Home/User/userDetail',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data:{
        token:this.data.token,
        user_id:id
      },
      success:function(e){
        var code = e.data.code
        if(code ==0){
          var phone = e.data.data.phone_num
          var name = e.data.data.name
          _this.setData({
            takerName:name,
            takerPhone:phone
          })
        }
      }
    })
  },
  call:function(){
    var phone = this.data.takerPhone;
    if(phone.length!=0){
      console.log("orderdetail:phone::"+phone);
      wx.makePhoneCall({
        phoneNumber: phone,
      })
    }else{
      console.log("orderdetail: phone is null");
    }
  }
})