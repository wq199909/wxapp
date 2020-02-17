// pages/record/record.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    record:[],
  },
  destroy: function(){
    const db = wx.cloud.database();
    db.collection('rooms').where({
      _roomid:app.globalData.roomid
    }).get({
      success:res=>{
        console.log(res);
        for(let i=0;i<res.data.length;i++){
          db.collection('rooms').doc(res.data[i]._id).remove({
          })
        }
        wx.switchTab({
          url: '../match/match',
        })
      }
    })
  },
  showtip:function(e){
    var i = e.target.dataset.index;
    const db = wx.cloud.database();
    db.collection('rooms').where({
      _roomid:app.globalData.roomid,
    }).get({
      success:res=>{
        console.log(res.data[i].person);
        var name = res.data[i].person.name;
        var state = res.data[i].person.state;
        var school = res.data[i].person.school;
        var major = res.data[i].person.major;
        var number = res.data[i].person.number;
        if(school==undefined){
          school="未填写"
        }
        if(major==undefined){
          major="未填写"
        }
        if(number){
          number="未填写"
        }
        wx.showModal({
          title: '详细信息',
          content: "学校:"+school+"\r\n专业:"+major+"\r\n学号:"+number,
          showCancel: false
        })
      }
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    const db = wx.cloud.database();
    db.collection('rooms').where({
      _roomid: app.globalData.roomid
    }).get({
      success:res=>{
        console.log(res.data.length);
        var list=[];
        var a;
        for(let i=0;i<res.data.length;i++){
          if(res.data[0].person.state){
            a = "success";
          }else{
            a = "fail";
          }
          var x = res.data[i].person.time;
          var y;
          if(x/60<10){
            y="0"+parseInt(x/60);
          }else{
            y=parseInt(x/60);
          }
          if(x%60<10){
            x="0"+(x%60);
          }else{
            x = x%60;
          }
          y = y + ":" + x;
          var obj = {
            image:res.data[i].person.image,
            state:a,
            name:res.data[i].person.name,
            duration:y
            }
          list.push(obj);
        }
        that.setData({
          record:list
        })
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