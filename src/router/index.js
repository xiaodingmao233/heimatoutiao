import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '@/views/login'
// import Home from '@/views/home'
// import Layout from '@/views/layout'
// import Article from '@/views/article'
// import Publish from '@/views/publish'
// import Image from '@/views/image'
// import Comment from '@/views/comment'
// import Settings from '@/views/settings'
// import Fans from '@/views/fans'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/',
    // name: 'layout',
    component: () => import('@/views/layout'),
    children: [
      {
        path: '', // path 为空会作为默认子路由渲染
        name: 'home',
        component: () => import('@/views/home')
      },
      {
        path: '/article',
        name: 'article',
        component: () => import('@/views/article')
      },
      {
        path: '/publish',
        name: 'publish',
        component: () => import('@/views/publish')
      },
      {
        path: '/image',
        name: 'image',
        component: () => import('@/views/image')
      },
      {
        path: '/comment',
        name: 'comment',
        component: () => import('@/views/comment')
      },
      {
        path: '/settings',
        name: 'settings',
        component: () => import('@/views/settings')
      },
      {
        path: '/fans',
        name: 'fans',
        component: () => import('@/views/fans')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 路由导航守卫 说白了所有页面的导航都会经过这里
// 守卫页面的导航的
// to 要去的路由信息
// from 来自哪里的路由信息
// next 放行方法
router.beforeEach((to, from, next) => { // beforeEach 每次之前
  const user = JSON.parse(window.localStorage.getItem('user'))
  // 校验非登录页面的登录状态
  if (to.path === '/login') {
    // 登录页面 正常允许通过
    next()
  } else {
    if (user) {
      // 已登录 允许通过
      next()
    } else {
      // 没有登录 跳转到登录页面
      next('/login')
    }
  }
})

// 我们在组件中使用的 this.$router 其实就是这个模块中的 router
export default router
