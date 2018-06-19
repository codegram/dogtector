import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Gallery from './views/Gallery.vue'
import Admin from './views/Admin.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: Gallery
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin
    }
  ]
})
