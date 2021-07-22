import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'lib-flexible/flexible.js'
import api from './request/index'
import setRem from './utils/setRem'
import iphoneX from './utils/iphoneX'
import moment from 'moment'
// import Vconsole from 'vconsole'
Vue.prototype.$api = api
Vue.prototype.$iphoneX = iphoneX
Vue.prototype.$moment = moment
// Vue.prototype.$log = new Vconsole()
Vue.config.productionTip = false

setRem()
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
