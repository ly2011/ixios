import Vue from 'vue'
import { sources, requestMap } from '../src/main'
import router from './router'
import App from './App.vue'

router.beforeEach(async (to, from, next) => {
  // 路由发生变化时取消当前页面网络请求
  Object.keys(sources).forEach(item => {
    sources[item]('取消前页面请求')
  })
  Object.keys(sources).forEach(key => {
    delete sources[key]
  })
  requestMap.clear()
  next()
})

new Vue({
  el: '#root',
  router,
  render: h => h(App)
})
// import _ from 'ittool'
// import request from '../src/main'

// const getTopics = async params => {
//   const defaultParams = {
//     page: 1,
//     tab: 'share',
//     limit: 10
//   }
//   const { data } = await request({
//     baseURL: 'https://cnodejs.org/api/v1',
//     withCredentials: false,
//     url: 'topics',
//     method: 'get',
//     params: { ...defaultParams, ...params }
//   })
//   let topics = []
//   if (data.success) {
//     topics = data.data
//   }
//   // console.log('topics: ', topics)
//   return topics
// }
// const getTopic = async id => {
//   return request({
//     // headers: {
//     //   'Content-Type': 'application/json'
//     // },
//     baseURL: 'https://cnodejs.org/api/v1',
//     withCredentials: false,
//     url: `topic/${id}`,
//     method: 'get'
//   })
// }
// let topics = []
// const getTableData = async () => {
//   if (Array.isArray(topics) && topics.length) {
//     const topicId = topics[0].id
//     // for (let i = 0; i < topics.length; i++) {
//       // await _.sleep(1000)
//       // const topicId = topics[i].id
//     getTopic(topicId)
//     // }
//   } else {
//     topics = await getTopics()
//   }
// }

// getTableData()

// const repeatBtn = document.querySelector('#repeatBtn')
// repeatBtn.addEventListener('click', () => {
//   getTableData()
// })
