import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
  mode: 'history',
  fallback: false,
  routes: [
    {
      path: '/',
      component: resolve => require.ensure([], () => resolve(require('./views/Home.vue')), 'home')
    },
    {
      path: '/about',
      component: resolve => require.ensure([], () => resolve(require('./views/About.vue')), 'about')
    }
  ]
})
