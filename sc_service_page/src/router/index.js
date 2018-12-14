import Vue from 'vue'
import Router from 'vue-router'
import Index from '../page/index'
import Login from '../page/login'
import NotFont from '../page/404'
import ErrorPage from '../page/500'
// import Forbidden from '../page/403'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      children: []
    },
    // 如果跳转到index路径，则重定向到首页
    {
      path: '/index',
      redirect: {
        name: 'Index'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/500',
      name: '500',
      component: ErrorPage
    },
    // {
    //   path: '/403',
    //   name: '403',
    //   component: Forbidden
    // },
    {
      path: '*',
      name: '404',
      component: NotFont
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('TOKEN')
  const isLoginPage = to.path.indexOf('/login') !== -1
  // 判断系统登录状态并根据情况跳转
  if (isLoginPage && token !== undefined && token !== null) {
    next({ path: '/' })
  } else if (!isLoginPage && (token === undefined || token === null)) {
    next({ path: '/login' })
  } else {
    next()
  }
})

export default router
