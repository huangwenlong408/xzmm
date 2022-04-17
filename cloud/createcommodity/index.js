// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const DB = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    console.log(event.sold)
    return await DB.collection('commodity').add({
      data:{
        openid: event.openid,
        avatarUrl: event.avatarUrl,
        nickname: event.nickname,
        date: event.date,
        sold: event.sold,
        text: event.text,
        picture: event.picture
      }
    })
  } catch (error) {
    console.log(error)
  }
}