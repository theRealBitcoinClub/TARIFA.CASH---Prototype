import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import LoginSuccess from '@/components/LoginSuccess'
import TermsOfService from '@/components/TermsOfService'
import VerifyEmail from '@/components/VerifyEmail'
import Privacy from '@/components/Privacy'
import Meta from 'vue-meta'

Vue.use(Router)
Vue.use(Meta)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/verifyEmail',
      name: 'VerifyEmail',
      component: VerifyEmail
    },
    {
      path: '/loginSuccess',
      name: 'LoginSuccess',
      component: LoginSuccess
    },
    {
      path: '/privacy',
      name: 'Privacy',
      component: Privacy
    },
    {
      path: '/tos',
      name: 'TermsOfService',
      component: TermsOfService
    }
  ]
})
