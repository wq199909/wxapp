// pages/rank/rank.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:"",
    todolist:[],
    donelist:[]
  },
  inputThings: function(e){
    this.setData({
      value: e.detail.value
    })
  },
  submit: function(){
    if(this.data.value!=""){
      app.globalData.toDoList.todo.unshift(this.data.value);
      //将修改的数据存到云数据库中
      const db = wx.cloud.database()
      // 查询当前用户所有的 counters
      db.collection('user').where({
        _openid: app.globalData.openid
      }).get({
        success: res => {
          db.collection('user').doc(res.data[0]._id).update({
            data: {
              toDoList: app.globalData.toDoList
            }
          })
        },
      })
      this.setData({
        todolist:app.globalData.toDoList.todo,
        value:""
      })
    }
  },
  changetodo:function(e){
    var i = e.target.dataset.index;
    var thing = app.globalData.toDoList.todo.splice(i,1);
    app.globalData.toDoList.done.unshift(thing);
    //将修改的数据存到云数据库中
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('user').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        db.collection('user').doc(res.data[0]._id).update({
          data: {
            toDoList: app.globalData.toDoList
          }
        })
      },
    })
    this.setData({
      todolist: app.globalData.toDoList.todo,
      donelist: app.globalData.toDoList.done
    })
  },
  changedone: function (e) {
    var i = e.target.dataset.index;
    var thing = app.globalData.toDoList.done.splice(i, 1);
    app.globalData.toDoList.todo.unshift(thing);
    //将修改的数据存到云数据库中
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('user').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        db.collection('user').doc(res.data[0]._id).update({
          data: {
            toDoList: app.globalData.toDoList
          }
        })
      },
    })
    this.setData({
      todolist: app.globalData.toDoList.todo,
      donelist: app.globalData.toDoList.done
    })
  },
  deletetodo: function(e){
    var i = e.target.dataset.index;
    var thing = app.globalData.toDoList.todo.splice(i,1);
    //将修改的数据存到云数据库中
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('user').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        db.collection('user').doc(res.data[0]._id).update({
          data: {
            toDoList: app.globalData.toDoList
          }
        })
      },
    })
    this.setData({
      todolist: app.globalData.toDoList.todo
    })
  },
  deletedone: function (e) {
    var i = e.target.dataset.index;
    var thing = app.globalData.toDoList.done.splice(i, 1);
    //将修改的数据存到云数据库中
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('user').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        db.collection('user').doc(res.data[0]._id).update({
          data: {
            toDoList: app.globalData.toDoList
          }
        })
      },
    })
    this.setData({
      donelist: app.globalData.toDoList.done
    })
  },
  changedone: function (e) {
    var i = e.target.dataset.index;
    var thing = app.globalData.toDoList.done.splice(i, 1);
    app.globalData.toDoList.todo.unshift(thing);
    //将修改的数据存到云数据库中
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('user').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        db.collection('user').doc(res.data[0]._id).update({
          data: {
            toDoList: app.globalData.toDoList
          }
        })
      },
    })
    this.setData({
      todolist: app.globalData.toDoList.todo,
      donelist: app.globalData.toDoList.done
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
    if (app.globalData.toDoList == undefined) {
      this.setData({
        notLoggedIn: true,
      })
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
            that.setData({
              notLoggedIn: true
            });
          }
        }
      })
    } else {
      this.setData({
        todolist: app.globalData.toDoList.todo,
        donelist: app.globalData.toDoList.done
      })
    }
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