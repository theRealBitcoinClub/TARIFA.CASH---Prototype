import './firebase'
import Vue from 'vue'
import App from './App'
import router from './router'
import VueFire from 'vuefire'

Vue.config.productionTip = false
Vue.use(VueFire)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
