// pages/home/home.js
const app = getApp();
var interval;
var rpx;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    helpstop:"-1000vh",
    // 登录授权状态
    notLoggedIn:true,
    //判断小程序的API，回调，参数，组件等是否在当前版本可用
    versionSupport:wx.canIUse('button.open-type.getUserInfo'),
    // 用户的openid
    openid:"",
    // 时间、事件选择的值
    timeSelector:"点击选择时间",
    thingSelector:"点击选择事件",
    // 按钮显示文字
    startOrEnd:"开始",
    // 时间、事件列表
    timeList:[],
    thingsList:[],
    //剩余时间
    timeleftMin:0,
    timeleftSec:0,
    mo:"none",
    deng:"none",
    xian:"none",
    bai:"none",
    le:"none",
    shao:"none",
    nian:"none",
    tou:"none",
    kong:"none",
    bei:"none",
    qie:"none",
    canvashide:"block",
  },
  /**漏斗 */
  drawGlass:function(){
    wx.getSystemInfo({
      success: function (res) {
        rpx = res.windowWidth/750;
      },
    })
    var context = wx.createCanvasContext('timeCanvas');
    context.setStrokeStyle('#000000')
    context.setLineWidth(2);
    context.beginPath();
    context.moveTo(200*rpx, 0*rpx);
    context.lineTo(400*rpx, 0*rpx);
    context.lineTo(304*rpx, 146*rpx);
    context.lineTo(304*rpx, 154*rpx);
    context.lineTo(400*rpx, 300*rpx);
    context.lineTo(200*rpx, 300*rpx);
    context.lineTo(296*rpx, 154*rpx);
    context.lineTo(296*rpx, 146*rpx);
    context.lineTo(200*rpx, 0*rpx);
    context.stroke();
    context.closePath();
    context.beginPath();
    context.setFillStyle("#ffffff");
    context.setLineWidth(0);
    context.moveTo(202 * rpx, 2 * rpx);
    context.lineTo(398 * rpx, 2 * rpx);
    context.lineTo(300 * rpx, 150 * rpx);
    context.lineTo(202 * rpx, 2 * rpx);
    context.fill();
    context.closePath();
    context.draw();
  },
  /**
   * 漏斗内部成分
   */
  drawWater:function(height,water){
    var that=this;
    var context = wx.createCanvasContext('timeCanvas');
    context.clearRect(200*rpx,0,200*rpx,300*rpx);
    context.setStrokeStyle('#000000')
    context.setLineWidth(2);
    context.beginPath();
    context.moveTo(200 * rpx, 0 * rpx);
    context.lineTo(400 * rpx, 0 * rpx);
    context.lineTo(304 * rpx, 146 * rpx);
    context.lineTo(304 * rpx, 154 * rpx);
    context.lineTo(400 * rpx, 300 * rpx);
    context.lineTo(200 * rpx, 300 * rpx);
    context.lineTo(296 * rpx, 154 * rpx);
    context.lineTo(296 * rpx, 146 * rpx);
    context.lineTo(200 * rpx, 0 * rpx);
    context.stroke();
    context.closePath();
    context.beginPath();
    context.setFillStyle("#ffffff");
    context.setLineWidth(0);
    context.setFillStyle("#ffffff");
    context.setLineWidth(0);
    context.moveTo(300 * rpx, 150 * rpx);
    context.lineTo((300 + 2 * height / 3) * rpx, (150 - height) * rpx);
    context.lineTo((300 - 2 * height / 3) * rpx, (150 - height) * rpx);
    context.lineTo(300*rpx,150*rpx);
    context.fill();
    context.closePath();
    context.beginPath();
    context.setFillStyle("#ffffff");
    context.setLineWidth(0);
    context.moveTo(202*rpx,298*rpx);
    context.lineTo(398*rpx,298*rpx);
    context.lineTo((300+2*height/3)*rpx,(150+height)*rpx);
    context.lineTo((300-2*height/3)*rpx,(150+height)*rpx);
    context.fill();
    context.closePath();
    context.beginPath();
    context.setFillStyle("#ffffff");
    context.setLineWidth(0);
    context.arc(300*rpx,water*rpx,3*rpx,0,2*Math.PI,false);
    context.fill();
    context.closePath();
    context.draw();
  },
  /**
   * 选择时间
   */
  selectTime: function (e) {
    var that = this;
    if (that.data.startOrEnd=="开始"){
      that.setData({
        timeSelector: app.globalData.timelist[e.detail.value]
      })
    }
  },
  /**
   * 选择事件
   */
  selectThing: function (e) {
    var that = this;
    if (that.data.startOrEnd=='开始'){
      that.setData({
        thingSelector: app.globalData.thinglist[e.detail.value]
      })
    }
  },
  /**
   * 开始或结束按钮
   */
  startOrend:function(){
    var that = this;
    if(that.data.timeSelector!="点击选择时间"&&that.data.thingSelector!="点击选择事件"){
      //获取开始时间戳
      var date = new Date();
      var startTime = date.getTime();
      if (that.data.startOrEnd == "开始") {
        that.setData({
          startOrEnd: "结束",
        })
        app.globalData.flag001 = true;
        interval = setInterval(function () {
          var nowTime = (new Date()).getTime();
          var timePassed = parseInt((nowTime - startTime) / 1000 + 0.005);
          var timeleft = parseInt(that.data.timeSelector) * 60 - timePassed;
          var i = 0;
          var interval2 = setInterval(function(){
            that.drawWater((timeleft / (timeleft + timePassed) * 148), 150+i*15);
            i++;
            if(i==10)clearInterval(interval2);
          },100);
          app.globalData.timeleft = timeleft;
          if (timeleft <= 0) {
            that.setData({
              startOrEnd: "开始"
            })
            app.globalData.flag001 = false;
            clearInterval(interval);
            //将修改的数据存到云数据库中
            const db = wx.cloud.database()
            // 查询当前用户所有的 counters
            db.collection('user').where({
              _openid: app.globalData.openid
            }).get({
              success: res => {
                app.globalData.record = res.data[0].record;
                app.globalData.record.push({ time: date, thing: that.data.thingSelector, state: "成功", duration: parseInt(that.data.timeSelector) * 60 });
                console.log(app.globalData.record);
                app.globalData.timeAll = app.globalData.timeAll + parseInt(that.data.timeSelector) * 60;
                db.collection('user').doc(res.data[0]._id).update({
                  data: {
                    record: app.globalData.record,
                    timeAll: app.globalData.timeAll
                  }
                })
              },
            })
          }
          that.setData({
            timeleftMin: parseInt(timeleft / 60),
            timeleftSec: timeleft - (parseInt(timeleft / 60)) * 60
          })
        }, 1000);
      }
      else if (that.data.startOrEnd == "结束") {
        that.setData({
          startOrEnd: "开始",
        })
        app.globalData.flag001=false;
        console.log(app.globalData.flag001);
        clearInterval(interval);
        const db = wx.cloud.database()
        // 查询当前用户所有的 counters
        db.collection('user').where({
          _openid: app.globalData.openid
        }).get({
          success: res => {
            app.globalData.record = res.data[0].record;
            console.log(app.globalData.timeleft);
            if(app.globalData.timeleft){
              console.log(app.globalData.timeleft);
              app.globalData.record.push({ time: date, thing: that.data.thingSelector, state: "失败", duration: (parseInt(that.data.timeSelector) * 60 - app.globalData.timeleft) });
            }else{
              app.globalData.record.push({ time: date, thing: that.data.thingSelector, state: "失败", duration:0 });
            }
            app.globalData.timeAll = app.globalData.timeAll + (parseInt(that.data.timeSelector) * 60 - app.globalData.timeleft);
            db.collection('user').doc(res.data[0]._id).update({
              data: {
                record: app.globalData.record,
                timeAll: app.globalData.timeAll
              }
            })
          },
        })
      }
    }
    
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
    var that = this;
    var t = 0;
    var txt = setInterval(function () {
      t++;
      if (t == 1) {
        that.setData({
          mo: "block",
        })
      } else if (t == 2) {
        that.setData({
          deng: "block",
        })
      } else if (t == 3) {
        that.setData({
          xian: "block",
        })
      } else if (t == 4) {
        that.setData({
          bai: "block",
        })
      } else if (t == 5) {
        that.setData({
          le: "block",
        })
      } else if (t == 6) {
        that.setData({
          shao: "block",
        })
      } else if (t == 7) {
        that.setData({
          nian: "block",
        })
      } else if (t == 8) {
        that.setData({
          tou: "block",
        })
      } else if (t == 9) {
        that.setData({
          kong: "block",
        })
      } else if (t == 10) {
        that.setData({
          bei: "block",
        })
      } else if (t == 11) {
        that.setData({
          qie: "block",
        })
      } else {
        clearInterval(txt);
      }
    }, 500);
    //修改时间事件对应列表
    if(app.globalData.timelist!=undefined){
      that.drawGlass();
      that.setData({
        timeList:app.globalData.timelist,
        thingsList:app.globalData.thinglist
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },
  help:function(){
    this.setData({
      helpstop:"5vh",
      canvashide:"none"
    })
  },
  outhelp:function(){
    this.setData({
      helpstop: "-1000vh",
      canvashide:"block"
    })
  },
  // /**
  //  * 生命周期函数--监听页面卸载
  //  */
  // onUnload: function () {

  // },

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
})