// pages/submit/submit.js
Page({
  data: {
    index: -1,
    pickerArr: ['QQ','微信'],
    textData: [],
    photoData: [],
    fileID: [],
  },
  // 
  pickerchange(event){
    this.setData({
      index: event.detail.value
    })
  },
  // 上传图片
  getPhotos(){
    const that = this
    wx.showActionSheet({
      itemList: ['拍照','从相册选择'],
      success() {
        wx.chooseMedia({
          count: 3,
          sizeType: ['compressed'],
          mediaType: ['image'],
          sourceType: ['camera','album'],
          success: res => {
            that.setData({
              photoData: res.tempFiles
            })
            // console.log(res)
          },
          errMsg(error){
            console.log(error)
          }
        })
      },
      fail: function(res){
        console.log(res.errMsg)
      }
    })
  },
  // 检测输入框内容
  handleTextInput(event){
    this.setData({
      textData: event.detail.value
    })
  },
  // 点击发布闲置按钮
  submit(){
    // 获取缓存中的userInfo
    const that = this
    const TD = this.data.textData
    const UI = wx.getStorageSync('userInfo')
    // 判断用户是否登录
    if(!UI.openid){
      wx.showModal({
        title: '提示',
        content: '发布闲置需要获取登录信息',
        showCancel: true,
        cancelText: '拒绝',
        confirmText: '允许',
        cancelColor: '#e84a4a',
        confirmColor: '#3ee21d',
        success: (result) => {
          if(result.confirm){
            wx.switchTab({
              url: '/pages/me/me'  //提交成功后跳转页面
            })
          }
        },
      });
    }else{
      // 如果已经登录了
      wx.showLoading({
        title: '发布中',
      })
      new Promise((resolve) => {
        for (const val of this.data.photoData) {
          console.log(val)
          wx.cloud.uploadFile({
            cloudPath: "userPhoto/" + UI.openid + Date.now() + ".png",
            filePath: val.tempFilePath
          }).then(res => {
            const FILEID = res.fileID
            this.setData({
              fileID: this.data.fileID.concat(FILEID)
            })
            // 判断是否处理到最后一张图片
            if(val === this.data.photoData.slice(-1)[0]){
              resolve('done')
            }
            // console.log(this.data.fileID)
          })
        }
      }).then(() => {
        wx.cloud.callFunction({
          name:"createcommodity",
          data:{
            openid: UI.openid,
            avatarUrl: UI.avatarUrl,
            nickname: UI.nickName,
            sold: false,
            date: Date.now(),
            text: TD,
            picture: that.data.fileID
          },
        })
        wx.hideLoading({
          success: () => {
            wx.switchTab({
              url: '/pages/index/index',
            })
            wx.showToast({
              title: '发布成功',
              duration: 1000
            })
          },
        })
      })
      
      
    }
  }
})