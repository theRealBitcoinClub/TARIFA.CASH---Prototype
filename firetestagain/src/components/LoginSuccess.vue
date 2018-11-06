<template>
  <div class="loginSuccess">
    <b-navbar toggleable="md" type="dark" variant="info">
      <b-navbar-brand href="#">TARIFA.CASH</b-navbar-brand>
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item v-if="!emailOrPhone" href="/">Login</b-nav-item>
          <b-nav-item v-if="emailOrPhone" href="#/loginSuccess">TCH Wallet</b-nav-item>
          <b-nav-item target="_blank" href="#/tos">Terms of Service</b-nav-item>
          <b-nav-item target="_blank" href="#/privacy">Privacy Policy</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item v-if="emailOrPhone" target="_blank" :href="explorer+adr">{{adr}}</b-nav-item>
          <b-nav-item v-if="emailOrPhone" href="#">{{emailOrPhone}}</b-nav-item>
          <b-nav-item v-if="emailOrPhone" href="https://tarifa.cash">Signout</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <div class='cont'>
      <form action>
        <div class="input-group mb-2 mt-2">
          <div class="input-group-prepend">
            <label class="input-group-text" for="mySelect">Receiver:</label>
          </div>
          <select class="custom-select" id="mySelect" @change="verifyInputs">
            <option :value="data.address" v-for="(data, index) in merchants" :key="index">{{data.name}}</option>
          </select>
        </div>
        <b-alert class="mb-2" :show="showReceiverAlert" variant="danger">Please choose a receiver.</b-alert>
        <div class="form-row mb-2">
          <div class="input-group col">
            <div class="input-group-prepend">
              <span class="input-group-text">€</span>
            </div>
            <input id='eur' type="number" min="0" class="form-control" @input="verifyInputs">
          </div>
          <div class="input-group col">
            <div class="input-group-prepend">
              <span class="input-group-text">Cents</span>
            </div>
            <input id='cent' type="number" min="0" max="99" class="form-control" @input="verifyInputs">
          </div>
        </div>
        <b-alert class="mb-2" :show="showEurosAlert" variant="danger">Please enter the amount in Euros without comma, point or minus.</b-alert>
        <b-alert class="mb-2" :show="showCommaEurosAlert" variant="danger">Please set the amount in EUR without comma, point or minus.</b-alert>
        <b-alert class="mb-2" :show="showCommaCentsAlert" variant="danger">Please set the amount in Cents without comma, point or minus.</b-alert>
        <b-alert class="mb-2" :show="showTooManyCentsAlert" variant="danger">Please set the amount in cents between 0 and 99.</b-alert>
        <b-alert class="mb-2" :show="showMinimumAmountAlert" variant="danger">Please enter an amount of more than 0,05€ in total.</b-alert>
        <b-alert class="mb-2" :show="showSendSuccess" variant="success">You did successfully send {{amountToSend}} to {{receiverName}}!</b-alert>
        <b-alert class="mb-2" :show="showSendFailed" variant="danger">Sending {{amountToSend}} to {{receiverName}} failed! Please check your funds by clicking the QR-Code!</b-alert>
        <b-alert class="mb-2" :show="showAmountToSend" variant="info">If you want to send: {{amountToSend}} to {{receiverName}} click the send button!</b-alert>
        <b-alert class="mb-2" :show="showIsSending" variant="warning">Sending {{amountToSend}} to {{receiverName}}!</b-alert>
        <a href='#' v-if="showAmountToSend" v-on:click="sendEnergy" class='btn-done mb-3'>Send Energy</a>
        <div class='center mb-2'>
          <a target="_blank" :href="explorer + adr">
            <div id="qrcodeId"></div>
          </a>
        </div>
        <input type="submit" v-on:click="sendEnergy" style="visibility:hidden;position:absolute"/>
      </form>
    </div>
  </div>
</template>

<script>
import {db} from '../firebase'
// var firebase = require('firebase')

// Firebase App is always required and must be first
const firebase = require('firebase/app')

// Add additional services that you want to use
require('firebase/auth')
require('firebase/database')

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
      showMinimumAmountAlert: false,
      showIsSending: false,
      amountToSend: '',
      receiverName: '',
      emailOrPhone: firebase.auth().currentUser != null ? (firebase.auth().currentUser.email != null ? firebase.auth().currentUser.email : firebase.auth().currentUser.phoneNumber) : 'You will be redirected to the login!',
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
      this.showMinimumAmountAlert = false
      if (receiver === '0') {
        this.showReceiverAlert = true
        return false
      }
      if (eString == null || eString === '') {
        this.showEurosAlert = true
        let inputE = document.getElementById('eur')
        inputE.focus()
        inputE.select()
        return false
      }
      if (eString.indexOf(',') !== -1 || eString.indexOf('.') !== -1 || eString.indexOf('-') !== -1) {
        this.showCommaEurosAlert = true
        let inputE = document.getElementById('eur')
        inputE.value = ''
        inputE.focus()
        inputE.select()
        return false
      }
      if (cString.indexOf(',') !== -1 || cString.indexOf('.') !== -1 || cString.indexOf('-') !== -1) {
        this.showCommaCentsAlert = true
        let inputE = document.getElementById('cent')
        inputE.value = ''
        inputE.focus()
        inputE.select()
        return false
      }
      if (cString.length > 2) {
        this.showTooManyCentsAlert = true
        let inputE = document.getElementById('cent')
        inputE.value = ''
        inputE.focus()
        inputE.select()
        return false
      }
      cString = this.setMinimumCents(cString)

      let tot = this.getCentsTotal(eString, cString)
      if (tot < 5) {
        this.showMinimumAmountAlert = true
        return false
      }
      return true
    },
    removeZero (s) {
      if (s.indexOf('0') === 0 && s.length > 1) {
        return this.removeZero(s.substr(1, s.length))
      }
      return s
    },
    setMinimumCents (c) {
      if (c == null || c === '' || c === '0') {
        c = '00'
      }
      return c
    },
    formatPrice (eString, cString) {
      cString = this.setMinimumCents(cString)
      eString = this.removeZero(eString)
      if (cString.length === 1) {
        cString = '0' + cString
      }
      return eString + ',' + cString + '€'
    },
    getCentsTotal (eString, cString) {
      cString = this.setMinimumCents(cString)
      let eur = parseInt(eString)
      let cent = parseInt(cString)
      return (eur * 100) + cent
    },
    getSatCount (centsTotal, bchPrice) {
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
      event.preventDefault()
      var receiver = $('#mySelect').val()
      this.receiverName = $('#mySelect option:selected').text()
      var eString = $('#eur').val()
      var cString = $('#cent').val()

      if (!this.isInputValid(receiver, eString, cString)) {
        return
      }

      this.showIsSending = true
      this.showAmountToSend = false

      let currentPrice = await BITBOX.Price.current('eur')
      let satCount = this.getSatCount(this.getCentsTotal(eString, cString), currentPrice)
      this.sendWithDataCash(this.formatPrice(eString, cString), this.receiverName, this.privKeyString, receiver, satCount)
    },
    sendWithDataCash (priceString, rName, pk, receiver, satCount) {
      var self = this
      var config = {
        data: ['0x6d02', 'http://tarifa.cash: ' + priceString + ' send to: ' + rName],
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
        self.showIsSending = false
        if (err) {
          console.log(err)
          self.showSendSuccess = false
          self.showSendFailed = true
        } else {
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
      // console.log(window.innerWidth)
      let svg = qr.createSvgTag(6.7, 13.4)
      let pos = svg.indexOf('white')
      let output = svg.substr(0, pos) + '#17a2b800" rx="15" ry="15" ' + svg.substr(pos + 6)
      document.getElementById('qrcodeId').innerHTML = output
    }
  },
  created () {
    this.goToLoginIfUserIsNull()
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
}
hr {
  margin: 20px 0;
  border: none;
  background: rgba(0,0,0,0.1);
  height: 1px;
}
h2 {
  font-size: 20px;
  color: rgba(256,256,256,0.75);
  padding: 10px;
  margin: 0;
  border-radius: 0.25em;
}
.btn-done {
  background: #009688;
  font-weight: 400;
  font-size: 18px;
  color: white;
  display: block;
  text-align: center;
  padding: 10px;
  border-radius: 0.25rem;
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
.cont {
  margin:0 auto;
  width: 300px;
  overflow-wrap: break-word;
  word-wrap: break-word;
  -ms-word-break: break-all;
  word-break: break-word;
}
h3 {
  font-size:20px;
}
.center {
  border-radius: 0.25rem;
  text-align: center;
}
</style>
