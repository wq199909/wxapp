// pages/person/person.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sign:"",
    value:"",
    timeall:0,
    notLoggedIn: false,
    //判断小程序的API，回调，参数，组件等是否在当前版本可用
    versionSupport: wx.canIUse('button.open-type.getUserInfo'),
  },
  /**
   * 个性签名输入
   */
  inputThing:function(e){
    app.globalData.sign = e.detail.value;
    this.setData({
      sign:e.detail.value
    })
    return e.detail.value;
  },
  /**
   * 点击进入设置页面
   */
  sets:function(){
    wx.navigateTo({
      url: '../set/set'
    })
    wx.setNavigationBarTitle({
      title: '设置',
    })
  },
  home:function(){
    wx.navigateTo({
      url: '../homes/homes',
    })
    wx.setNavigationBarTitle({
      title: '个人信息',
    })
  },
  record:function(){
    wx.navigateTo({
      url: '../record/record',
    })
    wx.setNavigationBarTitle({
      title: '记录',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    var timeAllchar='';
    if(parseInt(app.globalData.timeAll/3600)>0){
      timeAllchar =timeAllchar+ parseInt(app.globalData.timeAll / 3600)+'h';
    }
    if ((parseInt((app.globalData.timeAll - parseInt(app.globalData.timeAll / 3600)*3600)/60))>0){
      timeAllchar = timeAllchar + parseInt((app.globalData.timeAll - parseInt(app.globalData.timeAll / 3600) * 3600) / 60)+"min";
    }
    if(app.globalData.timeAllchar%60>0){
      timeAllchar = timeAllchar + app.globalData.timeAll % 60 + "s";
    }
    this.setData({
      timeall: timeAllchar,
      sign:app.globalData.sign,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if(app.globalData.sign!=undefined){
      //将修改的数据存到云数据库中
      const db = wx.cloud.database()
      // 查询当前用户所有的 counters
      db.collection('user').where({
        _openid: app.globalData.openid
      }).get({
        success: res => {
          db.collection('user').doc(res.data[0]._id).update({
            data: {
              sign: app.globalData.sign
            }
          })
        },
      })
    }
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