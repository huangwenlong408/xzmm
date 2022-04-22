// pages/me/me.js
Page({
  data: {
    userInfo: {},
    openid: ""
  },
  // 登录
  login(){
    wx.showLoading({
      title: '登录中',
    })
    const that = this;
    wx.getUserProfile({
      desc: '获取用户信息',
      // 允许登录
      success: (e) => {
        wx.cloud.callFunction({
          name: 'getopenid',
          // 调用云函数成功
          success(res){
            console.log('调用成功')
            that.setData({
              userInfo: e.userInfo,
              openid:res.result.openid
            })
            that.data.userInfo.openid = that.data.openid
            wx.setStorageSync('userInfo', that.data.userInfo)
            wx.hideLoading()
            wx.showToast({
              title: '登录成功',
            })
          },
          fail(res){
            console.log('调用失败')
          }
        }),
        console.log(this.data)
        // console.log(userInfo)
      },
      
    })
  },
  // 退出登录
  logout(){
    this.setData({
      userInfo: {},
      openid: "",
    })
  },
  onLoad(){
    const USERINFO = wx.getStorageSync('userInfo')
    this.setData({
      userInfo: USERINFO,
      openid:USERINFO.openid
    })
  }
})