import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import LoginSuccess from '@/components/LoginSuccess'
import TermsOfService from '@/components/TermsOfService'
import Privacy from '@/components/Privacy'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
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
