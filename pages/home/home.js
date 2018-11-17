// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "imgs":[
      "/images/136.jpg",
      "/images/133.jpg",
      "/images/134.jpg",
      "/images/135.jpg",
      "/images/137.jpg",
    ],
    HomeList:[

    ],
  
  },
  Goto_sheet(e){
    wx.navigateTo({
      // JSON.stringify 将JSON转化为字符串
      url: '/pages/songSheet/songSheet?into=' + JSON.stringify(e.currentTarget.dataset)});
    console.log(e.currentTarget.dataset)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
  wx.request({
    url: 'http://localhost:3000/personalized',
    success:function(res){
      console.log(res)
      that.setData({
        HomeList: res.data.result
      })
    }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //获取事件源

})