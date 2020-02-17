// pages/room/room.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomname:"",
    roomid:"",
    time:{min:"45",s:"00"},
    ifName:true,
    images:[],
    iadd:"none",
    icreate:"none",
    btn:"开始倒计时"
  },
  setValue:function(e){
    app.globalData.trueName=e.detail.value;
  },
  cancel:function(){
    const db = wx.cloud.database();
      db.collection('rooms').where({
        _openid:app.globalData.openid,
        _roomid: app.globalData.roomid
      }).get({
        success: res => {
          if(res.data.length>0){
          db.collection('rooms').doc(res.data[0]._id).remove({
            
          })}
        }
      })
    wx.switchTab({
      url: '../match/match',
    })
  },
  confirm:function(){
    if (app.globalData.trueName) {
      //将修改的数据存到云数据库中
      const db = wx.cloud.database()
      this.setData({
        ifName:false
      })
      // 查询当前用户所有的 counters
      db.collection('rooms').where({
        _openid:app.globalData.openid,
       _roomid:app.globalData.roomid
      }).get({
        success: res => {
          if (res.data.length > 0) {
            app.globalData.person = res.data[0].person;
            app.globalData.person.name=app.globalData.trueName;
            db.collection("rooms").doc(res.data[0]._id).update({
              data:{
                person:app.globalData.person
              }
            })
          }
        },
      })
      db.collection('user').where({
        _openid:app.globalData.openid
      }).get({
        success:res=>{
          var obj = { roomid: app.globalData.roomid, roomname: app.globalData.roomname }
          var a = true;
          for(let i = 0;i < app.globalData.inroom.length;i++){
            if(app.globalData.inroom[i].roomid==app.globalData.roomid){
              a=false;
              break;
            }
          }
          for(let i=0;i<app.globalData.createroom.length;i++){
            if(app.globalData.createroom.roomid == app.globalData.roomid){
              a = false;
              break;
            }
          }
          if(a){
          if(app.globalData.howinroom=="create"){
            app.globalData.createroom.push(obj);
          } else if (app.globalData.howinroom == "add") {
            app.globalData.inroom.push(obj);
          }
          db.collection('user').doc(res.data[0]._id).update({
            data:{
              inroom:app.globalData.inroom,
              createroom:app.globalData.createroom,
              trueName:app.globalData.trueName
            }
          })
        }
        }
      })
    }
  },
  begin:function(){
    if(this.data.btn!="退出房间"){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '开始后其他人不可进入房间',
      success: function (res) {
        if (res.confirm) {
          that.setData({
            btn: "退出房间"
          })
          const db = wx.cloud.database();
          db.collection('rooms').where({
            state:"create",
            _roomid: app.globalData.roomid
          }).get({
            success:res=>{
              if(res.data.length>0){
                app.globalData.begintime = (new Date()).getTime();
                db.collection('rooms').doc(res.data[0]._id).update({
                  data:{
                    start:true
                  }
                })
              }
            }
          })
        }
      }
    })
    }else{
      const db = wx.cloud.database();
      clearInterval(app.globalData.jishiqi);
      db.collection('rooms').where({
        _openid: app.globalData.openid,
        _roomid: app.globalData.roomid,
      }).get({
        success: res => {
          db.collection('rooms').doc(res.data[0]._id).remove();
        }
      })
      wx.switchTab({
        url: '../match/match',
      })
    }
  },
  out:function(){
    const db = wx.cloud.database();
    db.collection('rooms').where({
      _openid:app.globalData.openid,
      _roomid:app.globalData.roomid
    }).get({
      success:res=>{
        db.collection('rooms').doc(res.data[0]._id).remove();
      }
    })
    wx.switchTab({
      url: '../match/match',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.rkey = true;
    if (app.globalData.personis=="create"){
      this.setData({
        iadd:"none",
        icreate:"block"
      })
    }else{
      this.setData({
        iadd:"block",
        icreate:"none"
      })
    }
    this.setData({
      roomid:app.globalData.roomid,
      roomname:app.globalData.roomname
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
    if (app.globalData.trueName!=""){
      this.setData({
        ifName:false
      })
    }
    var that = this;
      //将修改的数据存到云数据库中
      const db = wx.cloud.database();
      // 查询当前用户所有的 counters
      var key = true;
      app.globalData.showpic = setInterval(function(){
        db.collection('rooms').where({
          _roomid: app.globalData.roomid
        }).get({
          success: res => {
            var len = res.data.length;
            let image = [];
            var hasroom = false;
            for (let i = 0; i < len; i++) {
              app.globalData.person = res.data[i].person;
              image.push(app.globalData.person.image);
              if(res.data[i].state=="create"){
                hasroom=true;
                if(res.data[i].start){
                  clearInterval(app.globalData.showpic);
                  key=false;
                  if(!app.globalData.begintime){
                    app.globalData.begintime = (new Date()).getTime();
                  }
                  app.globalData.jishiqi = setInterval(function(){
                    db.collection('rooms').where({
                      _roomid: app.globalData.roomid,
                      state:false,
                    }).get({
                      success:res=>{
                        if(res.data.length>0){
                          clearInterval(app.globalData.jishiqi);
                        }
                      }
                    })
                    var tmin = parseInt(that.data.time.min);
                    var ts = parseInt(that.data.time.s);
                    var nowtime =  (new Date()).getTime();
                    tmin = parseInt((2700-parseInt((nowtime-app.globalData.begintime+5)/1000))/60);
                    ts = parseInt(2700 - parseInt((nowtime - app.globalData.begintime + 5) / 1000)) % 60;
                    if(ts<= 0 && tmin <= 0){
                      ts=0;
                      tmin=0;
                      clearInterval(app.globalData.jishiqi);

                    }
                  if (ts < 0) {
                    ts = 59;
                    tmin--;
                  }
                  if (ts < 10) {
                    ts = "0" + ts;
                  } else {
                    ts = "" + ts;
                  }
                  if (tmin < 10) {
                    tmin = "0" + tmin;
                  } else {
                    tmin = "" + tmin;
                  }
                  that.setData({
                    time: { min: tmin, s: ts }
                  })
                  db.collection('rooms').where({
                    _openid: app.globalData.openid,
                    _roomid:app.globalData.roomid,
                  }).get({
                    success: res => {
                      app.globalData.person = res.data[0].person;
                      var endtime = (new Date()).getTime();
                      app.globalData.person.time = parseInt((endtime - app.globalData.begintime + 5) / 1000);
                      if(app.globalData.person.time>=2700){
                        app.globalData.person.state = true;
                        if(res.data[0].start!=undefined){
                          db.collection('rooms').doc(res.data[0]._id).update({
                            data:{
                              start: false
                            }
                          })
                        }
                      }
                      db.collection('rooms').doc(res.data[0]._id).update({
                        data: {
                          person:app.globalData.person,
                        },
                        success: function () {
                          if (app.globalData.rkey&&app.globalData.person.time >= 2700) {
                            app.globalData.rkey = false;
                            if (res.data[0].state == "create") {
                              wx.redirectTo({
                                url: '../roomend/roomend',
                              })
                              wx.setNavigationBarTitle({
                                title: '房间',
                              })
                            } else {
                              wx.switchTab({
                                url: '../match/match',
                              })
                            }
                          }
                        }
                      });
                      
                    },
                  })
                },1000)
              }
            }
            if(!hasroom){
              db.collection('rooms').where({
                _openid:app.globalData.openid,
                _roomid:app.globalData._roomid,
              }).get({
                success:res=>{
                  db.collection('rooms').doc(res.data[0]._id).remove({});
                }
              })
              wx.switchTab({
                url: '../match/match',
              })
            }
            if(key){
              that.setData({
                images: image
              })
            }
          }
        }
      })
    },500)
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