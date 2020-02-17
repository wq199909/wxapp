// pages/login/login.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用
    versionSupport: wx.canIUse('button.open-type.getUserInfo'),
  },
  /**
     * 获取用户的openid 
     */
  getOpenid() {
    let that = this;
    wx.cloud.callFunction({
      name: 'getOpenid',
      success: res => {
        var openid = res.result.openId;
        app.globalData.openid = openid;
        that.setData({
          openid: res.result.openId,
        })
        that.onFind();
      }
    })
  },
  /**
   *点击授权登录后状态 
   */
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      that.getOpenid();
    }
    else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },
  /**
   * 添加用户数据
   */
  onAdd: function () {
    const db = wx.cloud.database();
    db.collection('user').add({
      data: {
        times: ['120min', '90min', '60min', '30min', '25min'],
        things: ["谈恋爱", "锻炼", "写作业", "上课", "工作", "吃饭"],
        sign: "",
        record: [],
        timeAll: 0,
        toDoList: { todo: [], done: [] },
        major : "",
        number: "",
        schoolName:"",
      },
      success: res => {
        app.globalData.flag001 = false;
        app.globalData.timelist =  ['120min', '90min', '60min', '30min', '25min'];
        app.globalData.thinglist = ["谈恋爱", "锻炼","写作业","上课","工作","吃饭"];
        app.globalData.sign = "";
        app.globalData.record = [];
        app.globalData.timeAll = 0;
        app.globalData.toDoList = { todo: [], done: [] };
        app.globalData.inroom = [];
        app.globalData.createroom = [];
        app.globalData.trueName = "";
        app.globalData.schoolName = "";
        app.globalData.major = "";
        app.globalData.number = ""; 
        wx.switchTab({
          url: '../home/home',
        })
      },
    })
  },
  /**
   *  查找用户的数据
  */
  onFind: function () {
    var that = this;
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('user').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        //查看是否存在数据
        app.globalData.unfound = true;
        if (res.data.length > 0 && res.data[0]._openid == app.globalData.openid) {
          app.globalData.unfound = false;
        }
        if (app.globalData.unfound) {
          //数据不存在，添加数据
          that.onAdd();
        }
        app.globalData.flag001 = false;
        app.globalData.sign = res.data[0].sign;
        app.globalData.timelist = res.data[0].times;
        app.globalData.thinglist = res.data[0].things;
        app.globalData.record = res.data[0].record;
        app.globalData.timeAll = res.data[0].timeAll;
        app.globalData.toDoList = res.data[0].toDoList;
        app.globalData.inroom = res.data[0].inroom;
        app.globalData.createroom = res.data[0].createroom;
        app.globalData.trueName = res.data[0].trueName;
        app.globalData.schoolName = res.data[0].schoolName;
        app.globalData.major = res.data[0].major;
        app.globalData.number = res.data[0].number;
        wx.switchTab({
          url: '../home/home',
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              app.globalData.image = res.userInfo.avatarUrl;
              that.getOpenid();
            }
          });
        } else {
          
        }
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

  }
})