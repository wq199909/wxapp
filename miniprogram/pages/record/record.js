// pages/record/record.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    record:[],
    list: [],
    time: [],
    thing: [],
    state: [],
    duration: []
  },
  formatDateTime: function (inputTime) {
    var date = new Date(inputTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + " "+ h + ':' + minute + ':' + second;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

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
    var time = [],
      thing = [],
      state = [],
      duration = [],
      record=[];
    for (let i = 0; i < app.globalData.record.length; i++) {
      time.push(this.formatDateTime(app.globalData.record[i].time));
      thing.push(app.globalData.record[i].thing);
      state.push(app.globalData.record[i].state=="成功"?"success":"fail");
      var x= app.globalData.record[i].duration;
      var timeAllchar = '';
      if (parseInt( x/ 3600) > 0) {
        timeAllchar = timeAllchar + parseInt(x / 3600) + 'h';
      }
      if ((parseInt((x - parseInt(x / 3600) * 3600) / 60)) > 0) {
        timeAllchar = timeAllchar + parseInt((x - parseInt(x / 3600) * 3600) / 60) + "min";
      }
      if (x % 60 > 0) {
        timeAllchar = timeAllchar + x % 60 + "s";
      }
      duration.push(timeAllchar);
      record.unshift({
        "time":time[i],
        "thing":thing[i],
        "state":state[i],
        "duration":timeAllchar
      })
    }
    this.setData({
      record:record
    })
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