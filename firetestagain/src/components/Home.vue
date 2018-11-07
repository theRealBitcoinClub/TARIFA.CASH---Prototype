<template>
  <div class="login">
    <b-navbar toggleable="md" type="dark" variant="info">
      <b-navbar-brand href="#"><img width="32px" height="32px" src="/static/tarifacash_logo_white_transparent_512x512.png" alt="logo"/></b-navbar-brand>
      <b-navbar-toggle style="outline:none;font-size:26px;font-weight:400;color:#ffffff;border-color:#ffffff;" target="nav_collapse">Menu</b-navbar-toggle>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item v-if="emailOrPhone" href="#/loginSuccess">TCH Wallet</b-nav-item>
          <b-nav-item target="_blank" href="#/tos">Terms of Service</b-nav-item>
          <b-nav-item target="_blank" href="#/privacy">Privacy Policy</b-nav-item>
        </b-navbar-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item v-if="emailOrPhone" target="_blank" :href="explorer+adr">{{adr}}</b-nav-item>
          <b-nav-item v-if="emailOrPhone" href="#">{{emailOrPhone}}</b-nav-item>
          <b-button v-if="!emailOrPhone" style="background-color:#17a2b8;border-color:#ffffff;" variant="success" class="my-2 my-sm-0"><b-link style="color:#ffffff" href="#/login">Login</b-link></b-button>
          <b-button v-if="emailOrPhone" style="background-color:#17a2b8;border-color:#ffffff;" variant="outline-success" class="my-2 my-sm-0"><b-link style="color:#ffffff" href="/">Logout</b-link></b-button>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <div class="container">
      <h1 class="animated fadeInDown delay1 mb-2">TCH - Tarifa Cash</h1>
      <h2 class="animated fadeInDown delay2 mb-2">Tarifa Cash is a local currency backed by BCH - Bitcoin</h2>
      <h3 class="animated fadeInDown delay3 mb-2">It is a 100% transparent, 100% unfakeable currency which can not be abused for speculation!</h3>
      <h4 class="animated fadeInDown delay4 mb-2">You can charge TCH in all participating shops, check out our <a href="https://map.tarifa.cash">MAP</a> or <a href="https://news.tarifa.cash">NEWS</a> page!</h4>
      <h4 class="animated fadeInDown delay4">Tarifa Cash gives you a discount on all of your purchases, we are growing a sustainable local community!</h4>
    </div>
    <div class='onesignal-customlink-container'></div>
  </div>
</template>
<script>
require('../../static/noty.css')
require('../../static/themes/sunset.css')
const Noty = require('noty')

export default {
  name: 'Home',
  mounted () {
    let s = document.createElement('script')
    s.setAttribute('src', 'https://cdn.onesignal.com/sdks/OneSignalSDK.js')
    // s.async = true
    document.head.appendChild(s)

    var OneSignal = window.OneSignal || []
    OneSignal.push(function () {
      OneSignal.init({
        appId: '33c77356-dd40-448a-a02a-3dd6282557a7'
      })
    })

    this.showNotification()
  },
  methods: {
    showNotification () {
      if (Notification.permission !== 'granted') {
        const n = new Noty({
          theme: 'sunset',
          text: 'Would you like to receive <b>notifications</b> to your phone status bar as soon as more shops accept Tarifa Cash?',
          buttons: [
            Noty.button('YES', 'btn btn-success', function () {
              Notification.requestPermission(function (status) {
                console.log('Notification permission status:', status)
              })
              n.close()
            }, {id: 'button1', 'data-status': 'ok'}),
            Noty.button('NO', 'btn btn-danger ml-3', function () {
              n.close()
            })
          ]
        }).show()
      }
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url('https://fonts.googleapis.com/css?family=Lora:700|Roboto');
.container {
  color:#ffffff;
  font-family: 'Roboto', sans-serif;
}
h1 {
  font-family: 'Lora', serif;
  font-size: 80px;
}
h2 {
}
</style>
