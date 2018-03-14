var app = getApp()
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    fixedId:1,
    page:1,
    list:[]
  },
  onShow:function(){
    // this.setData({
    //   list: [],
    //   newsConfig: {},
    //   page: 1
    // })
    // this._newsConfig()
    // this._newsList()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  onPullDownRefresh:function(){
    this._newsList()
  },
  onReachBottom:function(){
    this._newsList()
  },
  /**
   * 搜索框--事件
   */
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ''
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value,
      list: [],
      fixedId: '',
      typeId: '',
      childTypeId:'',
      page:1
    });
    this._newsList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this._newsType()
    this._newsList()
    this._newsConfig()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      list: [],
      newsConfig:{},
      page: 1
    })
    this._newsConfig()
    this._newsList()
  },
  /**
   * 获取新闻资讯类型
   */
  _newsType: function () {
    var that = this
    wx.request({
      url: app.url + "newsType",
      method: "POST",
      success: function (e) {
        var data = e.data.data
        if (e.data.code == "000000") {
          that.setData({ type: data })
        }
      }
    })
  },
  /**
   * 获取新闻轮播/跑马灯
   */
  _newsConfig: function () {
    var that = this
    wx.request({
      url: app.url + "newsConfig",
      method: "POST",
      success: function (e) {
        var data = e.data.data
        if (e.data.code == "000000") {
          that.setData({ newsConfig: data })
        }
      }
    })
  },
  /**
   * 获取新闻列表
   */
  _newsList:function(){
    var that = this
    var data = {}
    var page = this.data.page
    var list = this.data.list
    wx.showLoading({title: '加载中...',})
    data.page = page
    if (this.data.fixedId != "") { data.fixedId = this.data.fixedId }
    else if (this.data.childTypeId != "") { data.typeId = this.data.childTypeId }
    else if (this.data.inputVal != "") { data.search = this.data.inputVal }
    wx.request({
      url: app.url + "news",
      method: "POST",
      data: data,
      success: function (e) {
        var data = e.data.data
        if (e.data.code == "000000") {
          wx.hideLoading()
          wx.stopPullDownRefresh()
          if(data){
            list = list.concat(data)
            that.setData({
              list: list,
              page: page + 1
            })
          }
        }
      }
    })
  },

  /**
   * 热点、推荐筛选
   */
  _changeFixed:function(options){
    var fixedId = options.target.dataset.fixedid
    this.setData({
      list:[],
      fixedId: fixedId,
      typeId: '',
      childTypeId: '',
      child: '',
      page:1
    })
    this._newsList()
  },
  /**
   * 新闻分类筛选
   */
  _changeType: function (e){
    var that = this
    var typeid = e.target.dataset.typeid
    var key = e.target.dataset.key
    this.setData({
      list: [],
      fixedId:'',
      typeId: typeid,
      childTypeId:'',
      page:1
    })
    var child = this.data.type[key].child
    if (child.length > 0){
      this._childType(key)
    }else{
      this._newsList()
    }
  },

  /**
   * 显示新闻子分类
   */
  _childType:function(key){
    this.setData({
      child: this.data.type[key].child
    })
    var that = this
    var typeid = this.data.type[key].child[0].typeId
    this.setData({
      list: [],
      fixedId: '',
      childTypeId: typeid,
      page:1
    })
    this._newsList()
  },
  /**
   * 子分类查询
   */
  _changeChildType:function(e){
    var that = this
    var typeid = e.target.dataset.typeid
    this.setData({
      list: [],
      fixedId: '',
      childTypeId: typeid,
      page: 1
    })
    this._newsList()
  },

  _navigator:function(e){
    var newsId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/newsdetail/newsdetail?newsId='+newsId,
    })
  }
});