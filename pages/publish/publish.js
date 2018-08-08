var app = getApp()
var formData = new Array();
var util = require('../../utils/util.js');
for (var i = 0; i < 7; i++) {
  formData[i] = ""
}

var appId = 'wxeefef217c2ab4ce5'
var appSecret = 'ce1c01b1c75896d98261d879414ea260'

Page({
  data: {
    companyIndex: -1,
    companyArray: [
      '百汇世通',
      '圆通快递',
      '韵达快递',
      '中通快递',
      '顺丰快递',
      '申通快递',
      '当当EMS',
      '京东快递',
      '聚美优品',
      '快捷快递',
      '全峰快递',
      '苏宁快递',
      '天天快递',
      '万象快递',
      '唯品会',
      '优速快递',
      '邮政小包',
      '宅急送'
    ],
    token: '',
    openId: '',
    access_token: '',
    toastShow: false
  },
  formatTime: function (date) {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    if (month < 10) {
      month = '0' + month;
    };
    if (day < 10) {
      day = '0' + day;
    };
    // var h = now.getHours();
    // var m = now.getMinutes();
    // var s = now.getSeconds();
    var formatDate = year + '-' + month + '-' + day;
    return formatDate;
  },
  onLoad: function (options) {
    var _this = this
    wx.getStorage({
      key: 'token',
      success: function (res) {
        _this.setData({
          token: res.data
        })
      },
    })
    _this.setData({
      openId: options.openId,
      access_token: options.access_token
    })

  },

  bindCompanyChange: function (e) {
    var index = e.detail.value
    this.setData({
      companyIndex: index
    })
    formData[0] = this.data.companyArray[index]
    console.log(formData[0])
  },

  desInput: function (e) {
    console.log(e.detail.value)
    formData[1] = e.detail.value
  },
  addrInput: function (e) {
    console.log(e.detail.value)
    formData[2] = e.detail.value
  },
  traInput: function (e) {
    console.log(e.detail.value)
    formData[3] = e.detail.value
  },
  moneyInput: function (e) {
    console.log(e.detail.value)
    formData[4] = e.detail.value
  },
  smsInput: function (e) {
    console.log(e.detail.value)
    // formData[5] = e.detail.value
  },

  formSubmit: function (e) {
    this.showLoading('正在发布，请稍后...');
    console.log("formId:" + e.detail.formId)
    formData[0] = this.data.companyArray[e.detail.value.company]
    console.log("company:" + formData[0])
    formData[1] = e.detail.value.des
    formData[2] = e.detail.value.addr
    formData[3] = e.detail.value.tran
    formData[4] = e.detail.value.money
    formData[5] = "time"
    formData[6] = e.detail.value.sms
    var formId = e.detail.formId
    var isVerify = this.textVerify();
    if (isVerify) {
      this.submit(formId);
    }
  },

  textVerify: function () {
    for (var i in formData) {
      if (formData[i] == null || formData[i] == "" || formData[i].length == 0) {
        // if(i==5)
        //   continue
        this.hideLoading()
        this.showToast('请输入完整信息')
        return false;
      }
    }
    return true;
  },
  loginTimeOut: function () {
    this.showToast("登录过期，请重新登录")
    wx.clearStorage()
    wx.redirectTo({
      url: '../login/login'
    })
  },
  submit: function (formId) {
    var token = this.data.token
    console.log("submit:" + token)
    if (token == null || token.length == 0) {
      //token is null,go to login
      this.loginTimeOut()
      return;
    }
    // this.orderSend(formId)
    var _this = this
    wx.request({
      url: 'http://takeapp.com.cn/Home/Express/createOrder',
      data: {
        token: token,
        company: formData[0],
        des: formData[1],
        address: formData[2],
        place: formData[3],
        price: formData[4],
        take_time: formData[5],
        sms_content: formData[6]
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        var code = res.data.code;
        var msg = res.data.msg;
        console.log("msg:" + msg + "  code:" + code)
        wx.hideLoading();
        if (code == 1) {
          _this.showToast('发布成功！')
          //send module msg
          _this.orderSend(formId);
          //close this page
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
          }, 1500)
        } else if (code == 100) {
          _this.showToast("发布失败！原因：" + msg)
        } else {
          _this.loginTimeOut()
        }
      },
      fail: function (res) {
        wx.hideLoading();
        console.log(res.data);
      }
    })
  },
  orderSend: function (formId) {
    var _this = this
    var time = this.formatTime(new Date())
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + this.data.access_token,
      header: {
        "Content-Type": "application/json"
      },
      method: 'POST',
      data: {
        "touser": this.data.openId,
        "template_id": 'BT0rgajG4VB-9Ses28CM2yLOjLcCAgtY5QKriBEYofc',
        "page": 'pages/myorder/myorder',
        "form_id": formId,
        "data": {
          "keyword1": {
            "value": formData[0],
            "color": "#173177"
          },
          "keyword2": {
            "value": formData[1],
            "color": "#173177"
          },
          "keyword3": {
            "value": time,
            "color": "#173177"
          }
        }
      }, success: function (e) {
        console.log("push msg");
        console.log(e);
      }, fail: function (e) {
        // fail  
        console.log("push err")
        console.log(e);
      }
    })
  },

  showToast: function (title) {
    wx.showToast({
      title: title,
      duration: 3000,
      mask: false,
      image: '../../image/ic_error_outline.png'
    })
  },
  hideToast: function () {
    wx.hideToast()
  },
  showLoading: function (title) {
    wx.showLoading({
      title: title,
    })
  },
  hideLoading: function () {
    wx.hideLoading()
  },

}) 
