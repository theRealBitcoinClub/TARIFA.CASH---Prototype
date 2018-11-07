<template>
  <div class="login">
    <Navigation></Navigation>
    <div class="container">
      <h1 class="animated fadeInDown delay1 mb-2">TCH - Tarifa Cash</h1>
      <h2 class="animated fadeInDown delay2 mb-2">Tarifa Cash is a local currency backed by BCH - Bitcoin</h2>
      <h3 class="animated fadeInDown delay3 mb-2">It is a 100% transparent, 100% unfakeable currency which can not be abused for speculation!</h3>
      <h4 class="animated fadeInDown delay4 mb-2">You can charge TCH in all participating shops, check out our <a href="https://map.tarifa.cash">MAP</a> or <a href="https://news.tarifa.cash">NEWS</a> page!</h4>
      <h4 class="animated fadeInDown delay4">Tarifa Cash gives you a discount on all of your purchases, we are growing a sustainable local community!</h4>
    </div>
  </div>
</template>
<script>
import Navigation from '@/components/Navigation'
require('../../static/noty.css')
require('../../static/themes/sunset.css')
const Noty = require('noty')

export default {
  name: 'Home',
  components: {
    'Navigation': Navigation
  },
  data () {
    return {
      emailOrPhone: false
    }
  },
  mounted () {
    this.initPushMessageProvider()
    this.initChat()
    this.showNotification()
  },
  methods: {
    initPushMessageProvider () {
      const s = document.createElement('script')
      s.setAttribute('src', 'https://cdn.onesignal.com/sdks/OneSignalSDK.js')
      document.head.appendChild(s)

      var OneSignal = window.OneSignal || []
      OneSignal.push(function () {
        OneSignal.init({
          appId: '33c77356-dd40-448a-a02a-3dd6282557a7'
        })
      })
    },
    initChat () {
      const s1 = document.createElement('script')
      const s0 = document.getElementsByTagName('script')[0]
      s1.async = true
      s1.src = 'https://embed.tawk.to/5be2bf4970ff5a5a3a710573/default'
      s1.charset = 'UTF-8'
      s1.setAttribute('crossorigin', '*')
      s0.parentNode.insertBefore(s1, s0)
    },
    showNotification () {
      if (Notification.permission !== 'granted') {
        const n = new Noty({
          theme: 'sunset',
          killer: true,
          text: 'Would you like to receive <b>notifications</b> to your phone status bar as soon as more shops accept Tarifa Cash?',
          buttons: [
            Noty.button('Maybe later!', 'btn btn-danger', function () {
              n.close()
            }),
            Noty.button('YES, Please!', 'btn btn-success float-right', function () {
              Notification.requestPermission(function (status) {
                console.log('Notification permission status:', status)
              })
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
