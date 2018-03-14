App({
  url: "",
  onLaunch: function () {
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    var that = this
    var openId = wx.getStorageSync("openId")
    if (!openId) {
      that._openId()
    }
  },
  _openId: function () {
    var that = this
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: that.url + 'wxOpenId',
            data: { code: res.code },
            method: "POST",
            success: function (e) {
              var data = e.data.data;
              if (e.data.code == '000000') {
                wx.setStorageSync("openId", data.openId);
                that._login(data.openId)
              } else {
                wx.showModal({
                  content: e.data.msg,
                  showCancel: false,
                })
              }
            }
          })
        }
      }
    })
  },
  _login: function (openId) {
    var that = this
    wx.request({
      url: that.url + "wxLogin",
      method: "POST",
      data: { openId: openId },
      success: function (e) {
        var data = e.data.data
        if (e.data.code == "000000") {
          wx.setStorageSync("user", data)
        } else {
          that._reg(openId)
        }
      }
    })
  },
  _reg: function (openId) {
    var that = this
    wx.getUserInfo({
      complete: function (res) {
        var data = {}
        if (res.errMsg == "getUserInfo:ok"){data = res.userInfo}
        data.openId = openId
        wx.request({
          url: that.url + "wxReg",
          method: "POST",
          data: data,
          success: function (e) {
            var data = e.data.data
            if (e.data.code == "000000") {
              wx.setStorageSync("user", data)
            }
          }
        })
      }
    })
  }
})