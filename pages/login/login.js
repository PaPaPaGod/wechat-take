// pages/login/login.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: '',
    login: {
      hidden: true
    },
    dialog: {
      hidden: true
    },
    toastShow: false,
    title: '',
    phoneIsRight: true,
    pwdIsRight: true
  },

  phoneDataChange: function (e) {
  },

  passwordChange: function (e) {

  },

  checkboxChange: function (e) {

  },

  onShareAppMessage: function () { },
  formSubmit: function (e) {
    var phone = e.detail.value.phone
    var pwd = e.detail.value.password
    var isPhone = this.checkMobile(phone)
    var isPwd = this.checkPwd(pwd)
    if (isPhone && isPwd) {
      this.login(phone, pwd)
    }
  },

  checkMobile: function (str) {
    var isPhone = false
    if (str == "") {
      this.showToast("手机号码不能为空!")
    } else {
      var re = /^1\d{10}$/
      if (!re.test(str)) {
        this.showToast("手机号码出错!")
      } else {
        isPhone = true;
      }
    }
    this.setData({
      phoneIsRight: isPhone
    })
    return isPhone;
  },

  checkPwd: function (pwd) {
    var pwdIsRight = true
    if (pwd == "") {
      this.showToast("密码不能为空!")
      pwdIsRight = false;
    }
    this.setData({
      pwdIsRight: pwdIsRight
    })
    return pwdIsRight
  },
  
  login: function (phone, pwd) {
    var md5Utils = require("../../utils/md5.js");
    var md5Pasw = md5Utils.hexMD5(pwd);
    var app = getApp();
    wx.request({
      url: app.globalData.REGISTER_OR_LOGIN_URL,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        phone_num: phone,
        password: md5Pasw
      },
      success: function (res) {
        var msg = res.data.msg;
        var code = res.data.code;
        console.log(code);
        if (msg != null && msg.length != 0) {
          console.log(msg)
        }
        if (code == 0) {
          //storage the token
          var token = res.data.data.token
          console.log(token)
          if (token != null && token.length != 0) {
            wx.showToast({
              title: '登录成功',
              duration: 2000
            })
            setTimeout(function () {
              wx.redirectTo({
                url: '../home/home',
              })
            }, 1500)
            wx.setStorage({
              key: "token",
              data: token
            })
          }

          //close this page

        } else {
          wx.showToast({
            title: msg,
            icon: '../../image/ic_error_outline.png',
            image: '../../image/ic_error_outline.png',
            duration: 2000
          })
        }
      },
      fail: function (res) {
        var msg =
          console.log(res.data.code + "  " + res.data.msg);
        wx.showToast({
          title: '',
          icon: '',
          image: '',
          duration: 0,
          mask: true,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    })
  },

  navigateToRegister: function () {
    wx.redirectTo({
      url: '../register/register',
    })
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