// import axios from 'axios'
import request from '../src/main'

const getTopics = async params => {
  const { data } = await request({
    baseURL: 'https://cnodejs.org/api/v1',
    withCredentials: false,
    url: 'topics',
    method: 'get',
    params
  })
  let topics = []
  if (data.success) {
    topics = data.data
  }
  // console.log('topics: ', topics)
  return topics
}
const getTopic = async id => {
  return request({
    baseURL: 'https://cnodejs.org/api/v1',
    withCredentials: false,
    url: `topic/${id}`,
    method: 'get'
  })
}
const getTableData = async () => {
  const topics = await getTopics()
  if (Array.isArray(topics)) {
    for (let i = 0; i < topics.length; i++) {
      const topicId = topics[i].id
      getTopic(topicId)
    }
  }
}

getTableData()
