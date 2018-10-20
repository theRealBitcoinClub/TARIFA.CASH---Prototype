<template>
  <div class="loginSuccess">
    <h2>{{email}}</h2>
    <h3><a target='_blank' :href="explorer + adr">{{adr}}</a></h3>
    <div class='container'>
      <div class='center'>
        <a target='_blank' :href="explorer + adr">
          <div id="qrcodeId"></div>
        </a>
      </div>
      <hr>
      <div class='form'>
        <select class="chooseBox" id="mySelect">
          <option :value="data.address" v-for="(data, index) in merchants" :key="index">{{data.name}}</option>
        </select>
        <input id='eur' type="number" class="currency" placeholder='EUR' />
        <input id='cent' type="number" class="currency" placeholder='CENTS' />
        <a href='#' id='done' v-on:click="sendEnergy" class='btn'>Send Energy</a>
      </div>
    </div>
  </div>
</template>

<script>
import {db} from '../firebase'
var firebase = require('firebase')
var datacash = require('datacash')
var $ = require('jquery')
let BITBOXSDK = require('bitbox-sdk/lib/bitbox-sdk').default
let BITBOX = new BITBOXSDK()
// require('bootstrap')

export default {
  name: 'LoginSuccess',
  data () {
    return {
      email: firebase.auth().currentUser != null ? (firebase.auth().currentUser.email != null ? firebase.auth().currentUser.email : firebase.auth().currentUser.phoneNumber) : 'You will be redirected to the login!',
      explorer: 'https://explorer.bitcoin.com/bch/address/',
      adr: '',
      privKeyString: 'dummy',
      merchants: [
        {
          name: 'Choose Receiver',
          address: '0'
        },
        {
          name: 'Eco-Center',
          address: '1ENhH7BEt4C9Rb5DBFP8T9hyJcfvNEnySi'
        },
        {
          name: 'El Olivo Herbolario',
          address: '1PBm46XokQkQGNTtgRJm9WtVGzkAXj8QKY'
        }
      ]
    }
  },
  methods: {
    initPrivateKeyDrawQrCode () {
      if (firebase.auth().currentUser != null) {
        var pk
        var self = this
        db.ref('/users/' + firebase.auth().currentUser.uid).once('value', function (data) {
          if (data.val() != null) {
            pk = new datacash.bch.PrivateKey(data.val().wif)
          } else {
            pk = new datacash.bch.PrivateKey()
            self.persistWif(pk.toWIF())
          }
        }).then(function (kkk) {
          let adrString = pk.toAddress().toString()
          self.createQR(adrString)
          self.adr = adrString
          self.privKeyString = pk.toString()
        })
      }
    },
    persistWif (wifParam) {
      if (firebase.auth().currentUser != null) {
        db.ref('/users/' + firebase.auth().currentUser.uid).set({email: firebase.auth().currentUser.email, wif: wifParam})
      }
    },
    goToLoginIfUserIsNull () {
      if (firebase.auth().currentUser == null) {
        this.$router.replace({name: 'Login'})
      }
    },
    sendVerificationEmail () {
      let user = firebase.auth().currentUser
      if (user != null && !user.phoneNumber && !user.emailVerified) {
        var self = this
        firebase.auth().currentUser.sendEmailVerification().then(function () {
          alert('Please verify your email!')
          self.$router.replace({name: 'Login'})
        })
      }
    },
    isInputValid (receiver, eString, cString) {
      if (receiver === '0') {
        alert('Please select a Receiver')
        return false
      }
      if (eString == null || eString === '') {
        alert('Please set the amount in EUR')
        return false
      }
      if (eString.indexOf(',') !== -1 || eString.indexOf('.') !== -1) {
        alert('Please set the amount in EUR without comma or point')
        return false
      }
      if (cString.indexOf(',') !== -1 || cString.indexOf('.') !== -1) {
        alert('Please set the amount in CENT without comma or point')
        return false
      }
      return true
    },
    formatPrice (eString, cString) {
      if (cString == null || cString === '' || cString === '0') {
        cString = '00'
      }
      if (cString.length === 1) {
        cString = '0' + cString
      }
      return eString + ',' + cString + '€'
    },
    getSatCount (eString, cString, bchPrice) {
      let eur = parseInt(eString)
      let cent = parseInt(cString)
      let centsTotal = (eur * 100) + cent
      let centPrice = bchPrice * 100
      let bchCount = centsTotal / centPrice
      return parseInt(bchCount * 100000000)
    },
    sendEnergy: async function (event) {
      var self = this
      var receiver = $('#mySelect').val()
      var receiverName = $('#mySelect option:selected').text()
      var eString = $('#eur').val()
      var cString = $('#cent').val()

      if (!this.isInputValid(receiver, eString, cString)) {
        return
      }

      var priceString = this.formatPrice(eString, cString)
      alert('Price: ' + priceString)

      let currentPrice = await BITBOX.Price.current('eur')

      let satCount = this.getSatCount(eString, cString, currentPrice)

      this.sendWithDataCash(priceString, receiverName, self.privKeyString, receiver, satCount)
    },
    sendWithDataCash (priceString, receiverName, pk, receiver, satCount) {
      var config = {
        data: ['0x6d02', 'http://tarifa.cash: ' + priceString + ' send to: ' + receiverName],
        cash: {
          key: pk,
          rpc: 'https://cashexplorer.bitcoin.com',
          fee: 250,
          to: [{
            address: receiver,
            value: satCount
          }]
        }
      }
      alert('TRY! ' + priceString + ' sent to: ' + receiverName)
      datacash.send(config, function (err, res) {
        if (err) {
          console.log(err)
          alert('ERROR! Please click the send button again!')
        } else {
          alert('SUCCESS! ' + priceString + ' sent to: ' + receiverName)
        }
      })
    },
    createQR: function (addressP) {
      let qrcode = require('qrcode-generator')
      let typeNumber = 0
      let errorCorrectionLevel = 'H'
      let qr = qrcode(typeNumber, errorCorrectionLevel)
      qr.addData('bitcoincash:' + addressP)
      qr.make()
      document.getElementById('qrcodeId').innerHTML = qr.createSvgTag(8, 16)
    }
  },
  beforeMount () {
    this.goToLoginIfUserIsNull()
    this.sendVerificationEmail()
  },
  mounted () {
    this.initPrivateKeyDrawQrCode()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body {
  font-family: "Helvetica Neue", helvetica, arial;
  padding: 50px;
  font-size: 14px;
  color: rgba(0,0,0,0.8);
}
hr {
  margin: 20px 0;
  border: none;
  background: rgba(0,0,0,0.1);
  height: 1px;
}
h1 {
  color: #4772F6;
  text-align: center;
  font-weight: 900;
  font-size: 40px;
}
h1 > small {
  font-size: 12px;
  display: block;
  font-weight: 400;
}
h2 {
  background: rgba(0,0,0,0.04);
  font-size: 20px;
  color: rgba(0,0,0,0.8);
}
h1, h2 {
  padding: 10px;
  font-weight: 700;
  margin: 0;
}
.btn {
  background: #4772F6;
  color: white;
  display: block;
  text-align: center;
  padding: 10px;
}
.container {
  margin:0 auto;
  width: 400px;
  overflow-wrap: break-word;
  word-wrap: break-word;
  -ms-word-break: break-all;
  word-break: break-word;
}
input.currency {
}
.form input {
  padding: 10px;
  width: 376px;
  font-size: 14px;
}
.form {
}
.chooseBox {
  padding: 10px;
  width: 100%;
  font-size: 14px;
}
.hidden {
  display: none;
}
svg {
  width: 400px;
  height: 400px;
}
#submit {
  font-size: 12px;
  text-align: center;
}
#submit > * {
  margin: 10px;
}
.feed {
  width: 100%;
}
a.outlink {
  padding: 5px;
  text-align: right;
  display: block;
  color: #F97467;
}
.row {
  border-bottom: 1px solid rgba(0,0,0,0.1);
  padding-bottom: 10px;
}
.center {
  text-align: center;
}
</style>
