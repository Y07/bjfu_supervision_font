import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { currentUser } from '../service/api/user'
import { setToken, getToken, canTurnTo } from '@/libs/util'
import config from '@/config'
import { ROUTER_DEFAULT_CONFIG } from '@/config/config'
const { homeName } = config

Vue.use(Router)
const router = new Router({
  routes,
  mode: 'hash',
  ...ROUTER_DEFAULT_CONFIG
})
const LOGIN_PAGE_NAME = 'login'

const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
  else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  // const token = getToken()
  if (to.name !== LOGIN_PAGE_NAME) {
    store.dispatch('getUserInfo').then((resp) => {
      if (resp.code !== 200) {
        next({ name: LOGIN_PAGE_NAME })
      }
    }).catch(() => {
      next({ name: LOGIN_PAGE_NAME })
    })
    if (store.state.user.userInfo.is_admin || store.state.user.userInfo.is_leader ||
      (store.state.user.userInfo.is_guider && (store.state.user.userInfo.guider.is_grouper || store.state.user.userInfo.guider.is_main_grouper))) {
      if (to.path === '/') {
        next({ name: 'home' })
      }
    } else {
      if (to.path === '/') {
        next({ name: '督导端' })
      }
    }
  } else {
    next()
  }

  next()
})

router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
