<template>
  <div class="home">
    <h3>这里是主页</h3>
    <button @click="toAbout">跳转到关于我页面</button>
  </div>
</template>
<script>
import request from '../../src/main'
export default {
  data () {
    return {
      topics: [],
      topic: {}
    }
  },
  async created () {
    this.getTableData()
  },
  methods: {
    async getTableData () {
      const topics = await this.getTopics()
      if (Array.isArray(topics) && topics.length) {
        for (let i = 0; i < topics.length; i++) {
          // await _.sleep(1000)
          const topicId = topics[i].id
          this.getTopic(topicId)
        }
      }
    },
    async getTopics (params) {
      const defaultParams = {
        page: 1,
        tab: 'share',
        limit: 20
      }
      const { data } = await request({
        baseURL: 'https://cnodejs.org/api/v1',
        withCredentials: false,
        url: 'topics',
        method: 'get',
        params: { ...defaultParams, ...params }
      })
      let topics = []
      if (data.success) {
        topics = data.data
      }
      // console.log('topics: ', topics)
      return topics
    },
    async getTopic (id) {
      return request({
        // headers: {
        //   'Content-Type': 'application/json'
        // },
        baseURL: 'https://cnodejs.org/api/v1',
        withCredentials: false,
        url: `topic/${id}`,
        method: 'get'
      })
    },
    toAbout () {
      this.$router.push('/about')
    }
  }
}
</script>

