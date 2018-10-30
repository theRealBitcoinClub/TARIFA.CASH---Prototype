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
      <div class="form">
        <div class="input-group mb-1">
          <div class="input-group-prepend">
            <label class="input-group-text" for="mySelect">Receiver:</label>
          </div>
          <select class="custom-select mb-1" id="mySelect">
            <option :value="data.address" v-for="(data, index) in merchants" :key="index">{{data.name}}</option>
          </select>
        </div>
        <b-alert dismissible :show="showReceiverAlert" variant="danger">Please choose a receiver.</b-alert>
        <div class="form-row mb-1">
          <div class="input-group mb-1 col">
            <div class="input-group-prepend">
              <span class="input-group-text">€</span>
            </div>
            <input id='eur' type="number" class="form-control">
          </div>
          <div class="input-group mb-1 col">
            <div class="input-group-prepend">
              <span class="input-group-text">Cents</span>
            </div>
            <input id='cent' type="number" class="form-control">
          </div>
        </div>
        <b-alert dismissible :show="showEurosAlert" variant="danger">Please enter the amount in Euros.</b-alert>
        <b-alert dismissible :show="showCommaEurosAlert" variant="danger">Please set the amount in EUR without comma, point or minus.</b-alert>
        <b-alert dismissible :show="showCommaCentsAlert" variant="danger">Please set the amount in Cents without comma, point or minus.</b-alert>
        <b-alert dismissible :show="showTooManyCentsAlert" variant="danger">Please set the amount in cents between 0 and 99.</b-alert>
        <b-alert dismissible :show="showSendSuccess" variant="success">You did successfully send {{amountToSend}} to {{receiverName}}!</b-alert>
        <b-alert dismissible :show="showSendFailed" variant="danger">Sending {{amountToSend}} to {{receiverName}} failed! Please try again!</b-alert>
        <b-alert dismissible :show="showAmountToSend" variant="info">If you want to send: {{amountToSend}} to {{receiverName}} click the send button otherwise change the amount and verify again!</b-alert>
        <a href='#' v-on:click="verifyInputs" class='btn-verify mb-1'>Verify Inputs</a>
        <a href='#' v-if="showAmountToSend" v-on:click="sendEnergy" class='btn-done'>Send Energy</a>
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

export default {
  name: 'LoginSuccess',
  data () {
    return {
      showReceiverAlert: false,
      showEurosAlert: false,
      showCommaEurosAlert: false,
      showCommaCentsAlert: false,
      showAmountToSend: false,
      showSendFailed: false,
      showSendSuccess: false,
      showTooManyCentsAlert: false,
      amountToSend: '',
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
        db.ref('/users/' + firebase.auth().currentUser.uid).set({email: firebase.auth().currentUser.email, phoneNumber: firebase.auth().currentUser.phoneNumber, wif: wifParam})
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
          self.$router.replace({name: 'VerifyEmail'})
        })
      }
    },
    isInputValid (receiver, eString, cString) {
      this.showCommaCentsAlert = false
      this.showReceiverAlert = false
      this.showEurosAlert = false
      this.showCommaEurosAlert = false
      this.showTooManyCentsAlert = false
      this.showSendFailed = false
      this.showSendSuccess = false
      if (receiver === '0') {
        this.showReceiverAlert = true
        return false
      }
      if (eString == null || eString === '') {
        this.showEurosAlert = true
        return false
      }
      if (eString.indexOf(',') !== -1 || eString.indexOf('.') !== -1 || eString.indexOf('-') !== -1) {
        this.showCommaEurosAlert = true
        return false
      }
      if (cString.indexOf(',') !== -1 || cString.indexOf('.') !== -1 || cString.indexOf('-') !== -1) {
        this.showCommaCentsAlert = true
        return false
      }
      if (cString.length > 2) {
        this.showTooManyCentsAlert = true
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
    verifyInputs: function (event) {
      this.showAmountToSend = false
      var receiver = $('#mySelect').val()
      this.receiverName = $('#mySelect option:selected').text()
      var eString = $('#eur').val()
      var cString = $('#cent').val()

      if (!this.isInputValid(receiver, eString, cString)) {
        return
      }

      var priceString = this.formatPrice(eString, cString)
      this.amountToSend = priceString
      this.showAmountToSend = true
    },
    sendEnergy: async function (event) {
      var receiver = $('#mySelect').val()
      this.receiverName = $('#mySelect option:selected').text()
      var eString = $('#eur').val()
      var cString = $('#cent').val()

      if (!this.isInputValid(receiver, eString, cString)) {
        return
      }

      var priceString = this.formatPrice(eString, cString)
      this.amountToSend = priceString
      this.showAmountToSend = true

      let currentPrice = await BITBOX.Price.current('eur')

      let satCount = this.getSatCount(eString, cString, currentPrice)

      this.sendWithDataCash(priceString, this.receiverName, this.privKeyString, receiver, satCount)
    },
    sendWithDataCash (priceString, receiverName, pk, receiver, satCount) {
      var self = this
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
      datacash.send(config, function (err, res) {
        if (err) {
          console.log(err)
          self.showSendSuccess = false
          self.showSendFailed = true
        } else {
          self.showAmountToSend = false
          self.showSendFailed = false
          self.showSendSuccess = true
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
  created () {
    // this.goToLoginIfUserIsNull()
    this.sendVerificationEmail()
  },
  beforeMount () {
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
.btn-done {
  background: #009688;
  font-weight: 400;
  font-size: 18px;
  color: white;
  display: block;
  text-align: center;
  padding: 10px;
}
.btn-verify {
  background: #2196F3;
  font-weight: 400;
  font-size: 18px;
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
.hidden {
  display: none;
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
.row {
  border-bottom: 1px solid rgba(0,0,0,0.1);
  padding-bottom: 10px;
}
.center {
  text-align: center;
}
</style>
