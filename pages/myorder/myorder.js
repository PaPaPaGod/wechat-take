// pages/myorder/myorder.js
var app = getApp();
var register = require('../../utils/refreshLoadRegister.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    token:'',
    currentSize: 0,
    page:0,
    orders: []
  },

  onShareAppMessage:function(){},

  onLoad: function (options) {
    this.setData({
      token:options.token
    })
    console.log("token:"+this.data.token)
    
    register.register(this);
    this.refresh()
  },

  getOrders:function(token,page,isLoading){
    const _this = this
    wx.request({
      url: app.globalData.EXPRESS_URL,
      header: { 
        'content-type': 'application/x-www-form-urlencoded'
      },
      method:'POST',
      data:{
        token:token,
        page: page
      },
      success:function(e){
        register.loadFinish(_this,true)
        var code = e.data.code
        var msg = e.data.msg
        if(code == 0){
          if(e.data.data!=null){
            if(isLoading){
              var newArray = _this.data.orders.concat(e.data.data)
              console.log(newArray)
              _this.setData({
                orders: newArray,
                currentSize: _this.data.currentSize + e.data.data.length,
                page: _this.data.page+1
              })
            }else{
              _this.setData({
                orders: e.data.data,
                currentSize: e.data.data.length,
                page: 0
              })
            }
          }
        }else{
          _this.showToast(msg)
        }
      },
      fail:function(e){
        register.loadFinish(_this, true)
        wx.showToast({
          title: e,
          duration:1500
        })
      }
    })
  },

  navigateToDetail:function(e){
    var index = parseInt(e.currentTarget.dataset.index)
    var dataSet = this.data.orders[index]
    console.log(dataSet)
    if (dataSet.status==2){
      wx.navigateTo({
        url: '../orderdetail/orderdetail?company=' + dataSet.company
        + '&place=' + dataSet.place
        + '&des=' + dataSet.des
        + '&created=' + dataSet.created
        + '&state=' + dataSet.status
        + '&money=' + dataSet.price
        + '&accepter_id=' + dataSet.accepter_id,
      })
    }else{
      wx.navigateTo({
        url: '../orderdetail/orderdetail?company=' + dataSet.company
        + '&place=' + dataSet.place
        + '&des=' + dataSet.des
        + '&created=' + dataSet.created
        + '&state=' + dataSet.status
        + '&money=' + dataSet.price,
      })
    }
    
  },

  //上拉刷新
  refresh:function() {
    this.getOrders(this.data.token,"0",false)
  },
 
  //加载更多数据
  loadMore: function () {
    var size = this.data.currentSize
    var page = parseInt(this.data.page) + parseInt(1)
    this.getOrders(this.data.token, page+"",true);
  },
  showToast: function (title) {
    this.setData({
      toastShow: true,
      title: title
    });
    var that = this;
    setTimeout(function () {
      that.setData({
        toastShow: false
      });
    }, 1500);
  }
  
})