// index.js
const util = require('../../utils/util')
Page({
  data: {
    commodity: {},
  },
  onLoad() {
    this.getCommodity();
  },
  onPullDownRefresh(){
    this.Refresh()
    this.getCommodity()
  },
  Refresh(){
    //导航条加载动画
    // wx.showNavigationBarLoading()
    //loading 提示框
    wx.showLoading({
      title: '刷新中',
    })
    setTimeout(function () {
      wx.hideLoading();
      // wx.hideNavigationBarLoading();
      //停止下拉刷新
      wx.stopPullDownRefresh();
    }, 2000)
  },
  getCommodity(event) {
    const that = this
    wx.cloud.callFunction({
      name:"getcommodity",
      success:res=>{
        console.log('调用了一次云函数')

        that.setData({
          commodity:res.result.data.map(value => {
            var date = util.formatTime(new Date(value.date))
            value.date = date
            return value
          }).reverse()
        })
      }
    })
  },
  submitClick(){
    wx.navigateTo({
      url: '/pages/submit/submit',
    })
  }
  
})
