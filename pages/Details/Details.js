// pages/details/details.js
let globalFlag = getApp().flag;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    flag: true,
    // 歌曲ID
    dataID: '',
    // 歌曲详情 封面/歌词
    picUrl: '',
    arrLayric: ['暂无歌词'],
    //当前高亮歌词
    nowHightLightLayricIndex: 0,
    //滑条值
    sliderValue: 0,
    slidering: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    console.log(this);
    let that = this;
    // 不能直接赋值,使用setData视图才会更新.
    this.setData({ info: JSON.parse(options.info) });
    wx.request({
      url: 'http://localhost:3000/song/detail?ids=' + JSON.parse(options.info)['id'],
      success: function (res) {
        console.log(res);
        if (res.data.code == 200) {
          that.setData({
            picUrl: res.data.songs[0].al.picUrl
          });
        } else {
          console.log('请求歌曲详情时,返回状态码非200');
        }
      }
    });
    wx.request({
      url: 'http://localhost:3000/lyric?id=' + JSON.parse(options.info)['id'],
      success: function (res) {
        console.log(res);
        if (res.data.code == 200 && res.data.lrc) {
          let sLyric = res.data.lrc.lyric;
          //搜索字符串匹配值 返回数组(将每句歌词播放时间提取出来)
          let arrLyricTime = sLyric.match(/\[(\S*)\]/g);
          //把数组中的字符串(歌词播放时间)转毫秒
          function convertMs(str) {
            // let jsonStr =  JSON.parse(JSON.stringify(str)); 
            //[0]分  [1]秒
            let arrStr = str.split(':');
            //  console.log(arrStr);
            let strMin = arrStr[0].substr(1, arrStr[0].length);
            let strSec = arrStr[1].substr(0, arrStr[1].length - 1);
            let ms = parseFloat(strMin) * 60 * 1000 + parseFloat(strSec) * 1000;
            return ms;
          }
          for (let i = 0; i < arrLyricTime.length; i++) {
            arrLyricTime[i] = convertMs(arrLyricTime[i]);
          }
          // console.log(arrLyricTime);
          //替换 '[' 和 ']' 之间内容为任意符号的字符为空 
          let layric = sLyric.replace(/\[(\S*)\]/g, '');
          //从所有\n处分割字符串为数组
          let arrLayric = layric.split(/\n/g);
          //console.log(arrLayric);
          //console.log(layric);
          that.setData({
            arrLayric: arrLayric
          });

          let audio = wx.getBackgroundAudioManager();
          //开始监听当前音乐播放进度(时间)更新

          audio.onTimeUpdate(function () {
            if (that.data.slidering) {
              //  console.log(audio.currentTime*1000); 
              //当前播放位置与音频音频长度比值 ,
              that.setData({
                sliderValue: (audio.currentTime / audio.duration) * 100
              });
              //console.log((audio.currentTime / audio.duration) * 100);
              for (let i = 0; i < arrLyricTime.length; i++) {
                //差值的绝对值<=500ms 即匹配索引
                if (Math.abs(audio.currentTime * 1000 - arrLyricTime[i]) <= 500) {
                  //更新数据 驱动视图.把距离最近的索引给高亮
                  that.setData({
                    nowHightLightLayricIndex: i
                  });
                  return i;
                }
              }
            } else {

            }
          });
        } else {
          console.log('请求歌词时,返回状态码非200');
          that.setData({
            arrLayric: ['暂无歌词']
          });
        }
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
    if (getApp().flag) {
      // wx.getBackgroundAudioManager().play();
      this.setData({
        // flag: false
        flag: true
      });
    }

    getApp().flag = false;
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
    console.log('卸载');
    wx.getBackgroundAudioManager().pause();
    //取消监听播放进度更新事件.
    // wx.getBackgroundAudioManager().offTimeUpdate();
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
  playSome() {
    let that = this;
    if (this.data.flag) {
      wx.request({
        url: 'http://localhost:3000/song/url?id=' + that.data.info.id,
        success: function (res) {
          console.log(res);
          if (!res.data.data[0].url) {
            console.log('url错误');
          }
          //是播放状态,不用重新请求,否则导致重新播放.
          if (that.data.flag) {
            wx.playBackgroundAudio({
              dataUrl: res.data.data[0].url,
              success: function () {
                that.setData({
                  flag: false
                })
                getApp().flag = true;
              }
            });
          } else {
            //已经加载过,直接播放
            wx.getBackgroundAudioManager().play();
          }
        }
      })
    } else {
      wx.pauseBackgroundAudio({
        success: function () {
          that.setData({
            flag: true
          });
          getApp().flag = false;
        }
      });

    }
    //wx.getBackgroundAudioManager()全局唯一音频实例
    console.log('当前暂停或者停止', wx.getBackgroundAudioManager().paused);
    // if (wx.getBackgroundAudioManager().paused){
    //   wx.getBackgroundAudioManager().play();
    // }
    //异常停止
    wx.getBackgroundAudioManager().onStop(function () {
      that.setData({
        flag: true
      });
    });
    wx.getBackgroundAudioManager().onPause(function () {
      that.setData({
        flag: true
      });
    });
    wx.getBackgroundAudioManager().onPlay(function () {
      that.setData({
        flag: false
      });
    });
    if (wx.getBackgroundAudioManager().pause) {

    }
  },
  //滑块拖动事件
  fun_slider(e) {
    //console.log(this.data.sliderValue);
    //console.log(e.detail.value);
    this.setData({
      slidering: true
    });
    let songLength = wx.getBackgroundAudioManager().duration;
    let nowValuePercent = e.detail.value / 100;
    // 当前滑块百分比乘总歌曲时长,把播放进度切换到这个位置
    //console.log(songLength);
    //console.log(nowValuePercent);
    wx.getBackgroundAudioManager().seek(nowValuePercent * songLength);
    //console.log(nowValuePercent * songLength);
    this.setData({
      sliderValue: e.detail.value
    });
    //console.log(e.detail.value)
  },
  //拖动中
  fun_slidering() {
    this.setData({
      slidering: false
    });
  }
});