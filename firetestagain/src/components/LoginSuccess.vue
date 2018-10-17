<template>
  <div class="loginSuccess">
    <h2>{{email}}</h2>
    <h3>{{adr}}</h3>
    <div class='center'>
      <div id="qrcodeId" class="qrContainer"></div>
    </div>
    <hr>
    <div class='form'>
      <select class="chooseBox" id="mySelect">
        <option :value="data.address" v-for="(data, index) in merchants" :key="index">{{data.name}}</option>
      </select>
      <input id='msg' type="number" placeholder='How much energy do you want to send?' />
      <a href='#' id='done' v-on:click="sendEnergy" class='btn'>Send Energy</a>
    </div>
  </div>
</template>

<script>
import {db} from '../firebase'
var firebase = require('firebase')
var datacash = require('datacash')
var $ = require('jQuery')

if (firebase.auth().currentUser != null) {
  alert('authhff')
  var maybe
  db.ref('/users/' + firebase.auth().currentUser.uid).once('value', function (data) {
    // let pKey
    if (data.val() != null) {
      alert('wif' + data.val().wif)
      maybe = new datacash.bch.PrivateKey(data.val().wif)
    } else {
      alert('pKey')
      maybe = new datacash.bch.PrivateKey()
    }
    // return pKey
  }).then(function (kkk) {
    alert('maybe' + maybe)
    console.log(kkk)
  })

  // alert('www' + db.ref('/users/' + firebase.auth().currentUser.uid).child('wif').val())
}

var privateKey = new datacash.bch.PrivateKey()
var privKeyString = privateKey.toString()
var wifString = privateKey.toWIF()
var address = privateKey.toAddress().toString()

export default {
  name: 'LoginSuccess',
  data () {
    return {
      email: firebase.auth().currentUser != null ? firebase.auth().currentUser.email : 'user is null',
      adr: address,
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
    persistWif (wifParam) {
      if (firebase.auth().currentUser != null) {
        db.ref('/users/' + firebase.auth().currentUser.uid).set({email: firebase.auth().currentUser.email, wif: wifParam})
      }
    },
    goToLoginIfUserIsNull () {
      if (firebase.auth().currentUser == null) {
        this.$router.replace('/')
      }
    },
    sendEnergy: function (event) {
      var config = {
        data: ['0x6d02', $('#msg').val() + ' Energy beamed to: ' + $('#mySelect option:selected').text()],
        cash: {
          key: privKeyString,
          rpc: 'https://cashexplorer.bitcoin.com',
          fee: 250,
          to: [{
            address: $('#mySelect').val(),
            value: parseInt($('#msg').val())
          }]
        }
      }
      alert($('#msg').val() + ' try sent to: ' + $('#mySelect option:selected').text())
      datacash.send(config, function (err, res) {
        if (err) {
          alert('Error:' + err)
        } else {
          alert($('#msg').val() + ' funds sent to: ' + $('#mySelect option:selected').text())
        }
      })
    },
    createQR () {
      let qrcode = require('qrcode-generator')
      let typeNumber = 0
      let errorCorrectionLevel = 'H'
      let qr = qrcode(typeNumber, errorCorrectionLevel)
      qr.addData('bitcoincash:' + address)
      qr.make()
      document.getElementById('qrcodeId').innerHTML = qr.createSvgTag(8, 16)
    }
  },
  beforeMount () {
    this.goToLoginIfUserIsNull()
  },
  mounted () {
    this.createQR()
    this.persistWif(wifString)
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
  width: 320px;
  overflow-wrap: break-word;
  word-wrap: break-word;
  -ms-word-break: break-all;
  word-break: break-word;
}
.form input {
  padding: 10px;
  width: 100%;
  font-size: 14px;
}
.chooseBox {
  padding: 10px;
  width: 100%;
  font-size: 14px;
}
.hidden {
  display: none;
}
.qrContainer {
  width: 400px;
  height: 400px;
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
