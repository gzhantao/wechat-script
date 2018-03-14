var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    smsDisable: false,
    smsCodeTime: "获取验证码"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      openId: wx.getStorageSync("openId")
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 保存用户输入的手机号
   */
  _phone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  /**
   * 获取验证码
   */
  _getSmsCode: function () {
    if (this.data.smsDisable) return false;
    var that = this;
    var phone = this.data.phone;
    var regMobile = /^1\d{10}$/;
    if (!regMobile.test(phone)) {
      wx.showToast({
        title: '手机号有误！'
      })
      return false;
    }
    var data = {
      phone: phone,
      smsType: 1
    }
    wx.request({
      url: app.url + 'getSmsCode',
      method: "POST",
      data: data,
      success: function (e) {
        var data = e.data
        if (data.code == '000000') {
          var c = 60;
          var intervalId = setInterval(function () {
            c = c - 1;
            that.setData({
              smsCodeTime: c + 's后重发',
              smsDisable: true
            })
            if (c == 0) {
              clearInterval(intervalId);
              that.setData({
                smsCodeTime: '获取验证码',
                smsDisable: false
              })
            }
          }, 1000)
          wx.showModal({
            showCancel: false,
            content: data.msg,
          })
        }

      }
    })
  },
  formSubmit: function (e) {
    var that = this
    var data = e.detail.value
    data.openId = this.data.openId
    wx.request({
      url: app.url + 'acReg',
      method: "POST",
      data: data,
      success: function (e) {
        var data = e.data
        if (data.code == "000000") {
          wx.showModal({
            showCancel: false,
            content: data.msg,
            success: function (res) {
              wx.setStorageSync("user", data.data)
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/my/my'
                })
              }
            }
          })
        } else {
          wx.showModal({
            showCancel: false,
            content: data.msg,
          })
        }
      }
    })
  }
})