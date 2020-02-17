// pages/match/match.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用
    versionSupport: wx.canIUse('button.open-type.getUserInfo'),
    recommendation1:"0-0-0-0",
    recommendation2:"0-0-0-0",
    recommendation3:"0-0-0-0",
    input1:"",
    input2:"",
    input3:"",
    input4:"",
    city:"",
    flag:false,
    focusinput:false,
    hasgetpos:true,
    latitude:"",
    longitude:"",
  },
  initroom:function(i){
    var recommendation;
    recommendation = (Math.floor(10000*Math.random())+1)+"";
    while(recommendation.length != 4){
      recommendation = "0"+recommendation;
    }
    recommendation = recommendation.replace(/(.{1})/g,"$1-").slice(0,7);
    while(recommendation==this.recommendation1||
      recommendation==this.recommendation2||
      recommendation==this.recommendation3){
      recommendation = (Math.floor(10000 * Math.random()) + 1)+""; 
      recommendation = recommendation.replace(/(.{1})/g, "$1-").slice(0, 7);
    }
    if(i==1){
      this.setData({
        recommendation1:recommendation
      })
    }else if(i==2){
      this.setData({
        recommendation2:recommendation
      })
    } else if (i == 3) {
      this.setData({
        recommendation3:recommendation
      })
    }
    this.find(recommendation,i);
  },
  find: function (roomid,i) {
    var that = this;
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('rooms').where({
      '_roomid': roomid
    }).get({
      success: res => {
        //查看是否存在数据
        app.globalData.unfound = true;
        if (res.data.length > 0) {
          app.globalData.unfound = false;
        }
        if (!app.globalData.unfound) {
          if(i==0){
            wx.showToast({
              title: '房间号已存在',
              icon: 'none',
              duration: 1000//持续的时间
            })
          } else {
            that.initroom(i);
          }
        }else{
          if (i == 0) {
            that.add(roomid);
          }
        }
      },
    })
  },
  addroom:function(){
    if(app.globalData.flag001){
      wx.showToast({
        title: "请关闭首页的计时器",
        icon:"none",
        duration:2000
      })
    }else{
    var that = this;
    if (that.data.input4) {
      app.globalData.howinroom = "add";
      var value = that.data.input1 + "-" + that.data.input2 + "-" + that.data.input3 + "-" + that.data.input4;
      const db = wx.cloud.database();
      db.collection('rooms').where({
        '_roomid' : value,
        state:"create"
      }).get({
        success: res=>{
          app.globalData.a = false;
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[0].start) {
              app.globalData.a = true;
              break;
            }
          }
          if (res.data.length > 0) {
            wx.showLoading({
              title: '正在加入房间...',
            })
            app.globalData.roomid = value;
            app.globalData.roomname = res.data[0]._roomname;
            app.globalData.longi = res.data[0].longitude;
            app.globalData.lati = res.data[0].latitude;
            var a = app.globalData.lati * Math.PI / 180.0 - that.data.latitude * Math.PI / 180.0;
            var b = app.globalData.longi * Math.PI / 180.0 - that.data.longitude * Math.PI / 180.0;
            app.globalData.distance = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(app.globalData.lati * Math.PI / 180.0) * Math.cos(that.data.latitude * Math.PI / 180.0) * Math.pow(Math.sin(b / 2), 2)));
            app.globalData.distance = app.globalData.distance * 6378137.0;
            if(app.globalData.distance>500&&app.globalData.distance<10000){
              wx.showToast({
                title: '你距离房间太远',
                icon:"none",
                duration:2000
              })
            } else {
              wx.redirectTo({
                url: '../room/room',
              })
              wx.setNavigationBarTitle({
                title: '房间',
              })
              db.collection('rooms').where({
                _roomid:value,
                _openid:app.globalData.openid
              }).get({
                success:res=>{
                  if(!app.globalData.a){
                    if(!(res.data.length>0)){
                    app.globalData.inbefore = false;
                    db.collection('rooms').add({
                      data: {
                        _roomid: app.globalData.roomid,
                        _roomname: app.globalData.roomname,
                        longitude: this.data.longitude,
                        latitude: this.data.latitude,
                        person: { image: app.globalData.image, name: app.globalData.trueName, state: false, time: 0,number:app.globalData.number,major:app.globalData.major,school:app.globalData.schoolName },
                        state: "add"
                      },
                    })
                  }
                  app.globalData.personis = "add";
                  if(res.data[0].state=="create"){
                    app.globalData.personis="create";
                  }
                  app.globalData.inbefore = true;
                  app.globalData.howinroom = "add";
                  } else {
                    wx.showToast({
                      title: '房间已开启，无法加入',
                      icon: "none",
                      duration: 2000
                    })
                  }
                }
              })
            }
          }else{
            wx.showToast({
              title: '你输入的房间号不存在',
              icon:"none",
              duration:2000
            })
          }
        }
      })
    }
    }
  },
  add: function (roomid) {
    const db = wx.cloud.database();
    db.collection('rooms').add({
      data: {
        _roomid: roomid,
        _roomname:app.globalData.roomname,
        longitude:this.data.longitude,
        latitude:this.data.latitude,
        person: { image: app.globalData.image, name: app.globalData.trueName, state: false, time: 0, number: app.globalData.number, major: app.globalData.major, school: app.globalData.schoolName},
        start:false,
        state:"create",
      },
    })
    app.globalData.roomid = roomid;
    app.globalData.howinroom = "create";
    app.globalData.personis = "create";
    wx.redirectTo({
      url: '../room/room',
    })
    wx.setNavigationBarTitle({
      title: '房间',
    })
  },
  createroom:function(e){
    if(app.globalData.flag001){
      wx.showToast({
        title: '请关闭首页的计时器',
        icon: "none",
        duration: 2000
      })
    }else{
    if(app.globalData.roomname){
      var value=e.target.id;
      var index=parseInt(e.target.dataset.index);
      if(value=="btn"){
        if(this.data.input4!=""){
          value = this.data.input1 + "-" + this.data.input2 + "-" + this.data.input3 + "-" + this.data.input4;
          this.find(value,index);
        }else{
          return;
        }
      }else{
        this.initroom(index);
        this.add(value);
      }
    }
    else{
      wx.showToast({
        title: '请输入房间名',
        icon: "none",
        duration:2000
      })
    }
    }
  },
  inputname: function(e){
    app.globalData.roomname = e.detail.value;
  },
  inputnum: function (e) {
    var value = e.detail.value;
    if(value.length==0){
      this.setData({
        input1: "",
        input2: "",
        input3: "",
        input4: ""
      })
    }
    else if(value.length==1){
      this.setData({
        input1: value[0],
        input2: "",
        input3: "",
        input4: ""
      })
    }
    else if (value.length == 2) {
      this.setData({
        input1: value[0],
        input2: value[1],
        input3: "",
        input4: ""
      })
    }
    else if (value.length == 3) {
      this.setData({
        input1: value[0],
        input2: value[1],
        input3: value[2],
        input4: ""
      })
    }
    else if (value.length == 4) {
      this.setData({
        input1: value[0],
        input2: value[1],
        input3: value[2],
        input4: value[3]
      })
    }
  },
  changetap: function(e){
    var that = this;
    if(e.detail.value){
      // 获取当前的地理位置
      var lati = 0;
      var longi =0;
      wx.getLocation({
        type: 'gcj02',
        success: function (res) {
          lati = res.latitude;
          longi = res.longitude;
          that.setData({
            latitude:lati,
            longitude:longi
          })
        }
      })
    }
    this.setData({
      notgetpos:e.detail.value,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              app.globalData.image = res.userInfo.avatarUrl;
            }
          });
        } else {
        }
      }
    })
    this.initroom(1);
    this.initroom(2);
    this.initroom(3);
    const db = wx.cloud.database();
    db.collection('rooms').where({
      _openid:app.globalData.openid,
    }).get({
      success:res=>{
        for(let i=0;i<res.data.length;i++){
          var da = res.data[i];
          db.collection('rooms').where({
            _roomid:res.data[i].roomid,
          }).get({
            success:res=>{
              let hasroom = false;
              for(let j=0;j<res.data.length;j++){
                if(res.data[j].state=="create"){
                  hasroom = true;
                }
              }
              if(!hasroom){
                db.collection.where({
                  _id:da._id,
                }).get({
                  success:res=>{
                    if(res.data.length>0){
                      db.collection('rooms').doc(da._id).remove();
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  focusin: function(){
    this.setData({
      focusinput:true
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