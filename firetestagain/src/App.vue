<template>
  <div id="app">
    <div id="firebaseui-auth-container"></div>
    <h1>{{mmm}}</h1>
    <img src="./assets/logo.png">
    <router-view/>
  </div>
</template>

<script>
require('./assets/firebaseui.css')
var firebase = require('firebase')
var firebaseui = require('firebaseui')

var config = {
  apiKey: 'AIzaSyCpL9e5VOkVsFoyPt_j77uMJhog4uIrjxQ',
  authDomain: 'firetestagain.firebaseapp.com',
  databaseURL: 'https://firetestagain.firebaseio.com',
  projectId: 'firetestagain',
  storageBucket: 'firetestagain.appspot.com',
  messagingSenderId: '202859484328'
}
firebase.initializeApp(config)

// FirebaseUI config.
var uiConfig = {
  signInSuccessUrl: '/signInSuccessUrl',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],
  // tosUrl and privacyPolicyUrl accept either url string or a callback
  // function.
  // Terms of service url/callback.
  tosUrl: '/termsOfService',
  // Privacy policy url/callback.
  privacyPolicyUrl: function () {
    window.location.assign('/privacyPolicyUrl')
  }
}

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth())
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig)

let BITBOXCli = require('bitbox-cli/lib/bitbox-cli').default
let BITBOX = new BITBOXCli()

export default {
  name: 'App',
  data () {
    return {
      mmm: BITBOX.Mnemonic.generate(128)
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
