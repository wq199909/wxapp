// pages/set/set.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //事件时间列表
    timelist:[],
    thinglist:[],
    //选择时间、事件
    timeSelected:"selected",
    thingSelected: "",
    //时间、时间隐藏
    timeView: "block",
    thingView: "none",
    //添加页面隐藏
    notTimeAdd:true,
    notThingAdd:true,
    //输入的值
    value:"",
    //输入值是否符合要求
    isfit:true,
    tip1left:"-575rpx",
    tip2left:"175rpx"
  },
  //监听输入是否为小于120的正整数
  inputTime: function (e) {
    this.setData({
      value: e.detail.value
    })
    if (parseInt(this.data.value) == this.data.value && this.data.value > 0 && this.data.value <= 120) {
      this.setData({
        isfit: true
      })
    }
    else {
      this.setData({
        isfit: false
      })
    }
  },
  /**
   * 取消添加时间
   */
  cancel:function(){
    this.setData({
      notTimeAdd: true,
      value: ""
    });
  },
  /**
   * 确定添加时间
   */
  confirm: function () {
    if (this.data.isfit == false) {
      this.setData({
        value: ""
      })
    } 
    else {
      var that = this;
      var i = 0;
      for(var len=app.globalData.timelist.length;i<len;i++){
        if (parseInt(app.globalData.timelist[i]) < parseInt(that.data.value)) {
          break;
        }
        else if(parseInt(app.globalData.timelist[i]) == parseInt(that.data.value)){//排除已经存在的时间
          i = -1;
          break;
        } else if (isNaN(parseInt(app.globalData.timelist[i]))) {//排除已经存在的时间
          i = -1;
          break;
        }
      }
      if(i>=0){
        //把要添加的时间按递减的循序添加到数组中
        app.globalData.timelist.splice(i, 0, parseInt(this.data.value) + "min");
        that.setData({
          timelist: app.globalData.timelist,
          notTimeAdd: true,
          value: ""
        })
        //将修改的数据存到云数据库中
        const db = wx.cloud.database()
        // 查询当前用户所有的 counters
        db.collection('user').where({
          _openid: app.globalData.openid
        }).get({
          success: res => {
            db.collection('user').doc(res.data[0]._id).update({
              data: {
                times: app.globalData.timelist
              }
            })
          },
        })
      }
      else{
        that.setData({
          notTimeAdd: true,
          value: ""
        })
      }
    }
  },
  /**
   * 选择设置时间  
   */
  timeSets:function(){
    var that = this;
    that.setData({
      timeSelected: "selected",
      thingSelected:"",
      timeView: "block",
      thingView: "none",
    })
  },
  /**
   * 选择设置事件  
   */
  thingSets: function () {
    var that = this;
    that.setData({
      timeSelected: "",
      thingSelected: "selected",
      thingView: "block",
      timeView: "none"
    })
  },
  /**
   * 添加时间
   */
  addTime:function(){
    var that = this;
    that.setData({
      notTimeAdd:false
    })
  },
  /**
   * 添加事件
   */
  addThing: function () {
    var that = this;
    that.setData({
      notThingAdd: false
    })
  },

  /**
   * 删除时间
   */
  deleteTime: function (e) {
    var i = e.target.dataset.index;
    var that = this;
    wx.showModal({
      title:"提示",
      content:"确定删除此时间",
      success:function(res){
        if(res.confirm){
          app.globalData.timelist.splice(i,1);
          that.setData({
            timelist:app.globalData.timelist,
          })
          //将修改的数据存到云数据库中
          const db = wx.cloud.database()
          // 查询当前用户所有的 counters
          db.collection('user').where({
            _openid: app.globalData.openid
          }).get({
            success: res => {
              db.collection('user').doc(res.data[0]._id).update({
                data: {
                  times: app.globalData.timelist
                }
              })
            },
          })
        }
        else if(res.cancel){
          return false;
        }
      }
    })
  },
  //监听输入是否非空或全为空格
  inputThing: function (e) {
    this.setData({
      value: e.detail.value
    })
    var str = (this.data.value).replace(/\s+/g, "");
    console.log(this.data.value,str);
    if (str!="") {
      this.setData({
        isfit: true
      })
    }
    else {
      this.setData({
        isfit: false
      })
    }
  },
  /**
   * 取消添加事件
   */
  cancelAddThing: function () {
    this.setData({
      notThingAdd: true,
      value: ""
    });
  },
  /**
   * 确定添加事件
   */
  confirmAddThing:function(){
    if (this.data.isfit == false) {
      var that = this;
      that.setData({
        value: ""
      })
    }
    else {
      var that = this;
      var i = 0;
      for (var len = app.globalData.thinglist.length; i < len; i++) {
        if (parseInt(app.globalData.thinglist[i]) == parseInt(that.data.value)) {//排除已经存在的时间
          i = -1;
          break;
        }
      }
      console.log(i);
      if (i >= 0) {
        //把要添加的时间按递减的循序添加到数组中
        app.globalData.thinglist.splice(i,0,this.data.value);
        console.log(app.globalData.thinglist);
        that.setData({
          thinglist: app.globalData.thinglist,
          notThingAdd: true,
          value: ""
        })
        //将修改的数据存到云数据库中
        const db = wx.cloud.database()
        // 查询当前用户所有的 counters
        db.collection('user').where({
          _openid: app.globalData.openid
        }).get({
          success: res => {
            db.collection('user').doc(res.data[0]._id).update({
              data: {
                things: app.globalData.thinglist
              }
            })
          },
        })
      }
      else {
        that.setData({
          notThingAdd: true,
          value: ""
        })
      }
    }
  },
  /**
   * 删除事件
   */
  deleteThing: function (e) {
    var i = e.target.dataset.index;
    var that = this;
    wx.showModal({
      title: "提示",
      content: "确定删除此事件",
      success: function (res) {
        if (res.confirm) {
          app.globalData.thinglist.splice(i, 1);
          that.setData({
            thinglist: app.globalData.thinglist,
          })
          //将修改的数据存到云数据库中
          const db = wx.cloud.database()
          // 查询当前用户所有的 counters
          db.collection('user').where({
            _openid: app.globalData.openid
          }).get({
            success: res => {
              db.collection('user').doc(res.data[0]._id).update({
                data: {
                  things: app.globalData.thinglist
                }
              })
            },
          })
        }
        else if (res.cancel) {
          return false;
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      timelist: app.globalData.timelist,
      thinglist:app.globalData.thinglist
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
    var that = this;
    app.globalData.t = setInterval(function(){
      var x = parseInt(that.data.tip1left);
      var y = parseInt(that.data.tip2left);
      x --;
      y --;
      if(x==-750){
        x=750;
      }
      if(y==-750){
        y=750;
      }
      that.setData({
        tip1left:x+"rpx",
        tip2left:y+"rpx"
      })
    },10)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(app.globalData.t);
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