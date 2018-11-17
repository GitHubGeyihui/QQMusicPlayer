// pages/songSheet/songSheet.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songSheetInfo: '',
    songList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let songSheetId = JSON.parse(options.into).id ;
    let that = this;
    wx.request({
      url: 'http://localhost:3000/playlist/detail?id=' + songSheetId,
      success: function (res) {
        console.log(res);
        // 歌单信息
        let info = {};
        info.name = res.data.playlist.name;
        info.coverImgUrl = res.data.playlist.coverImgUrl;
        info.description = res.data.playlist.description;
        info.arrTags = res.data.playlist.tags;
        that.setData({
          songList: res.data.playlist.tracks,
          songSheetInfo: info
        });

      }
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
  fun_searchDetailsPage(e) {
    wx.navigateTo({
      url: `../Details/Details?info=${JSON.stringify(e.currentTarget.dataset)}`,
      success: function (res) {

      },
      fail: function (res) { },
      complete: function (res) { },
    });
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