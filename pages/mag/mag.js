// pages/mag/mag.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if (options.into){
      console.log(options.into);
      this.setData({
        Searchsonginfo: JSON.parse(decodeURIComponent(options.into))
      })
    }else{
      var id = options.id;
      var arry = that.data.infoList.songDown;
      var detail = arry.find(function (item) {
        return item.id == id;
      })
      that.setData({
        info: detail
      })
    }
  
    //监听用户自带播放器，防止图片显示不同步
    wx.onBackgroundAudioPlay(function() {
      app.flag = false
      that.setData({
        flag: false
      })
    })
    wx.onBackgroundAudioPause(function() {
      app.flag = true
      that.setData({
        flag: true
      })
    })
    wx.getBackgroundAudioManager().onStop(function()
    {
      app.flag = true
      that.setData({
        flag: true})
    })
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    var backMusic = wx.getBackgroundAudioManager();
    if(app.flag)
    {
      backMusic.play();
    }
    else
    {
      backMusic.pause();
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //点击播放/暂停音乐
  playMusic() {
    var that = this;
    console.log(that.data.Searchsonginfo)
    if (that.data.flag) {
      wx.request({
        url: 'http://localhost:3000/song/url?id=' + that.data.Searchsonginfo.id,
        success:function(res){
          console.log(res.data.data[0].url)
          console.log(res);
          wx.playBackgroundAudio({
            dataUrl: res.data.data[0].url,
            success: function (res) {
              app.flag = false
              that.setData({
                flag: false
              })
            }
          })
        }
      })
    } else {
      wx.pauseBackgroundAudio({
        success: function(res) {
          app.flag=true
          that.setData({
            flag: true
          })
        }
      })
    }
  }
})