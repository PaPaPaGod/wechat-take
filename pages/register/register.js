// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: '',
    name:'',
    toastShow: false,
    title: '',
    phoneIsRight: true,
    pwdIsRight: true,
    nameIsRight:true
  },

  onLoad: function (options) {
  
  },

  //register->success->login->success->update userInfo->success->go to home
  formSubmit:function(e){
    var phone = e.detail.value.phone
    var pwd = e.detail.value.password
    var name = e.detail.value.name

    var phoneIsOk = this.checkMobile(phone)
    var pwdIsOk = this.checkPwd(pwd)
    var nameIsOk = this.checkName(name)

    if(phoneIsOk && pwdIsOk && nameIsOk){
      var md5 = require("../../utils/md5.js")
      var md5Pwd = md5.hexMD5(pwd)
      this.register(phone,md5Pwd,name);
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

  checkName: function (name) {
    var nameIsRight = true
    if (name == "") {
      this.showToast("姓名不能为空!")
      nameIsRight = false;
    }
    this.setData({
      nameIsRight: nameIsRight
    })
    return nameIsRight
  },

  register:function(phone,pwd,name){
    //register
    this.showLoading('正在注册，请稍后')
    var _this = this
    wx.request({
      url: 'https://takeapp.com.cn/Home/register/register',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        phone_num: phone,
        password: pwd
      },
      success: function (e) {
        //hide loading
        _this.hideLoading()
        var code = e.data.code
        var msg = e.data.msg
        if (code == 1) {
          console.log("register:"+msg)
          //login
          _this.login(phone,pwd,name)
        }
      },
      fail:function(e){
        _this.hideLoading()
        _this.showToast(e.msg)
      }
    })
  },
  login:function(phone,pwd,name){
    var _this = this
    _this.showLoading('正在登录')
    wx.request({
      url: 'https://takeapp.com.cn/Home/register/login',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        phone_num: phone,
        password: pwd
      },
      success: function (res) {
        _this.hideLoading()
        var msg = res.data.msg;
        var code = res.data.code;
        console.log(code);
        if (msg != null) {
          console.log(msg)
        }
        if (code == 0) {
          //storage the token
          var token = res.data.data.token
          console.log("login:"+token)
          if (token != null || token.length!=0) {
            //保存token
            wx.setStorage({
              key: "token",
              data: token
            })
            //update userInfo
            _this.updateUserInfo(token,name)
          }
        } 
      },
      fail: function (res) {
        _this.hideLoading()
        var msg = res.msg
          console.log(res.data.code + "  " + res.data.msg);
        _this.showToast(msg)
      }
    })
  },
  updateUserInfo:function(token,name){
    wx.request({
      url: 'https://takeapp.com.cn/Home/User/updateUserMsg',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        token: token,
        name: name,
        sex: '保密',
        school_id: '1',
        major: '保密'
      }, success: function (e) {
        var code = e.data.code
        var msg = e.data.msg
        //成功
        if (code == 0) {
          console.log("update:"+msg)
          //hideLoading
          //showToast
          wx.navigateTo({
            url: '../home/home',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }else{
          console.log("update error:" + code)
        }
      }

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
  },
  showLoading:function(title){
    wx.showLoading({
      title: title,
      mask: true
    })
  },
  hideLoading:function(){
    wx.hideLoading()
  }
})