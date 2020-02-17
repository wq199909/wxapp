// pages/homes/homes.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    input1:true,
    input2:true,
    list1:[],
    list2:[],
    maj:"",
    sch:"",
    nam:"",
    num:""
  },
  inputtruename:function(e){
    app.globalData.trueName = e.detail.value;
  },
  inputnumber: function (e) {
    app.globalData.number = e.detail.value;
  },
  inputschool: function(e){
    var that = this;
    app.globalData.schoolName = e.detail.value;
    const db = wx.cloud.database(); //初始化数据库
    db.collection("all").where({
      name: db.RegExp({
        regexp: app.globalData.schoolName,
        options: "i"
      })
    }).get({
      success: res => {
        let list=[];
        for(let i=0;i<res.data.length;i++){
          list.push(res.data[i].name);
        }
        if (app.globalData.schoolName == ""){
          that.setData({
            list1: [],
            rec1:"none"
          })
        }else{
          that.setData({
            list1:list,
            rec1:"block",
          })
        }
        if (app.globalData.rec1hid) {
          that.setData({
            rec2: "none"
          })
        }
      }
    });
  },
  rec1:function(e){
    app.globalData.schoolName=e.target.dataset.value;
    this.setData({
      sch:app.globalData.schoolName,
      rec1:"none"
    })
    app.globalData.rec1hid = true;
  },
  rec2: function (e) {
    app.globalData.major = e.target.dataset.value;
    this.setData({
      rec2: "none",
      maj: app.globalData.major,
    })
    app.globalData.rec2hid = true;
  },
  inputname: function (e) {
    var that = this;
    app.globalData.major = e.detail.value;
    const db = wx.cloud.database(); //初始化数据库
    db.collection("major").where({
      name: db.RegExp({
        regexp: app.globalData.major,
        options: 'i'
      })
    }).get({
      success: res => {
        let list = [];
        for (let i = 0; i < res.data.length; i++) {
          list.push(res.data[i].name);
        }
        if (app.globalData.schoolName == "") {
          that.setData({
            list2: [],
            rec2: "none"
          })
        } else {
          that.setData({
            list2: list,
            rec2: "block",
          })
        }
        if (app.globalData.rec2hid){
          that.setData({
            rec2: "none"
          })
        }
      }
    });
  },
  hidsch:function(){
    this.setData({
      rec1:"none",
    })
  },
  hidmaj: function () {
    this.setData({
      rec2: "none",
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
    if (app.globalData.major != undefined) {
      this.setData({
        maj: app.globalData.major,
      })
    }
    if (app.globalData.schoolName != undefined) {
      this.setData({
        sch: app.globalData.schoolName,
      })
    }
    if (app.globalData.trueName != undefined) {
      this.setData({
        nam: app.globalData.trueName,
      })
    }
    if (app.globalData.number != undefined) {
      this.setData({
        num: app.globalData.number,
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
    //将修改的数据存到云数据库中
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('user').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        db.collection('user').doc(res.data[0]._id).update({
          data: {
            trueName: app.globalData.trueName,
            schoolName: app.globalData.schoolName,
            major: app.globalData.major,
            number: app.globalData.number,
          }
        })
      },
    })
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