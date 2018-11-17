// pages/welcome/welcome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bGetFocus: false,
    songList:[]

  },
  funFocus() {
    console.log('取到焦点');
    this.setData({
      bGetFocus: true
    })
  },
  funCancel() {
    this.setData({
      bGetFocus: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  search(e) {
    var that = this;
    console.log(e)
    wx.request({
      url: 'http://localhost:3000/search?keywords=' + e.detail.value,
      success: function (res) {
        console.log(res);
        that.setData({
          songList: res.data.result.songs
        })

      }
    })
  },
  SongView(e){
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: `../Details/Details?info=${JSON.stringify(e.currentTarget.dataset)}`,
      success: function (res) {

      },
      fail: function (res) { },
      complete: function (res) { },
    });
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})