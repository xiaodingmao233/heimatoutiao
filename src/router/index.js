import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Home from '@/views/home'
import Layout from '@/views/layout'
import Article from '@/views/article'
import Publish from '@/views/publish'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    // name: 'layout',
    component: Layout,
    children: [
      {
        path: '',
        name: 'home',
        component: Home
      },
      {
        path: '/article',
        name: 'article',
        component: Article
      },
      {
        path: '/publish',
        name: 'publish',
        component: Publish
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => { // beforeEach 每次之前
  const user = JSON.parse(window.localStorage.getItem('user'))
  if (to.path === '/login') {
    next()
  } else {
    if (user) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
