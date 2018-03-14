var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      openId: wx.getStorageSync("openId"),
      page:1
    })
    this._listData()
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
    this.setData({
      list: [],
      page: 1
    })
    this._listData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  _listData: function () {
    wx.showToast({
      title: '读取中...',
      icon: 'loading',
      duration: 300
    })
    var that = this
    var data = {
      openId:this.data.openId,
      page:this.data.page
    }
    wx.request({
      url: app.url + 'collectList',
      data: data,
      method: "POST",
      success: function (e) {
        var data = e.data
        if (data.code == "000000") {
          that.setData({ 
            list: data.data,
            page:2
          })
          wx.stopPullDownRefresh()
        } else {
          wx.showModal({
            showCancel: false,
            content: e.data.msg,
          })
        }
      }
    })
  },

  _navigator: function (e) {
    var newsId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/newsdetail/newsdetail?newsId=' + newsId,
    })
  }
})