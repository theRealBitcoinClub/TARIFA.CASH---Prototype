<template>
  <div class="loginSuccess">
    <h2>{{email}}</h2>
    <h3>{{mmm}}</h3>
    <div class='center'>
      <div id="qrcode"></div>
    </div>
    <hr>
    <div class='form'>
      <select class="chooseBox" id="mySelect">
        <option :value="data.address" v-for="(data, index) in merchants" :key="index">{{data.name}}</option>
      </select>
      <input id='msg' type="number" placeholder='How much energy do you want to send?' />
      <a href='#' id='done' class='btn'>Send Energy</a>
    </div>
  </div>
</template>

<script>
var firebase = require('firebase')

/*
var $ = require('jquery')
$.getScript('../assets/qrcode.min.js', function () {
  const address = 'TESTADDRESS'
  QRCode(document.getElementById('qrcode'), {
    text: 'bitcoincash:' + address.toString(),
    width: 320,
    height: 320,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  })
})
*/

let BITBOXCli = require('bitbox-cli/lib/bitbox-cli').default
let BITBOX = new BITBOXCli()

export default {
  name: 'LoginSuccess',
  data () {
    return {
      email: firebase.auth().currentUser != null ? firebase.auth().currentUser.email : 'user is null',
      mmm: BITBOX.Mnemonic.generate(128),
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
    goToLoginIfUserIsNull () {
      if (firebase.auth().currentUser == null) {
        this.$router.replace('/')
      }
    }
  },
  beforeMount () {
    this.goToLoginIfUserIsNull()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
