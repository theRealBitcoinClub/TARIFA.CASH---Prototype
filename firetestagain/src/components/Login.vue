<template>
  <div class="login">
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
    <div id="welcome" style="display:none">
      <b-alert variant="success" show>
        Welcome to Tarifa Cash! You can Sign-Up with Email or Phone!
      </b-alert>
    </div>
    <div id="loader">
      <b-alert show>Loading...</b-alert>
      <img src='../assets/loading.svg' />
    </div>
    <div id="firebaseui-auth-container"></div>
    <!-- div class="pwa-install-prompt__container">
      <button class="pwa-install-prompt__overlay">Close</button>
      <div class="pwa-install-prompt">
        <div class="pwa-install-prompt__icon__container">
          <img class="pwa-install-prompt__icon" src="/path/to/icon/file.png" alt="{app_name}" />
        </div>
        <div class="pwa-install-prompt__content">
          <h3 class="pwa-install-prompt__title">Install {app_name}</h3>
          <p class="pwa-install-prompt__text">Install this application on your home screen for quick and easy access when you’re on the go.</p>
          <p class="pwa-install-prompt__guide">Just tap <svg class="pwa-install-prompt__guide__icon" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>Share</title><path fill="#007AFF" d="M48.883,22.992L61.146,10.677L61.146,78.282C61.146,80.005 62.285,81.149 64,81.149C65.715,81.149 66.854,80.005 66.854,78.282L66.854,10.677L79.117,22.992C79.693,23.57 80.256,23.853 81.114,23.853C81.971,23.853 82.534,23.57 83.11,22.992C84.25,21.848 84.25,20.125 83.11,18.981L65.997,1.794C65.715,1.511 65.421,1.215 65.139,1.215C64.563,0.932 63.718,0.932 62.861,1.215C62.579,1.498 62.285,1.498 62.003,1.794L44.89,18.981C43.75,20.125 43.75,21.848 44.89,22.992C46.029,24.149 47.744,24.149 48.883,22.992ZM103.936,35.32L81.114,35.32L81.114,41.053L103.936,41.053L103.936,121.27L24.064,121.27L24.064,41.053L46.886,41.053L46.886,35.32L24.064,35.32C20.928,35.32 18.355,37.904 18.355,41.053L18.355,121.27C18.355,124.419 20.928,127.003 24.064,127.003L103.936,127.003C107.072,127.003 109.645,124.419 109.645,121.27L109.645,41.053C109.645,37.891 107.072,35.32 103.936,35.32Z" /></svg> then “Add to Home Screen”</p>
        </div>
      </div>
    </div-->
  </div>
</template>

<script>
// import pwaInstallPrompt from 'pwa-install-prompt'
require('../assets/firebaseui.css')
require('../assets/noty.css')
require('../assets/themes/sunset.css')
// var firebase = require('firebase')
const firebaseui = require('firebaseui')
// require('firebaseui')

// Firebase App is always required and must be first
const firebase = require('firebase/app')

// Add additional services that you want to use
require('firebase/auth')
require('firebase/database')
require('firebase/messaging')

// require('noty')
const Noty = require('noty')
if (Notification.permission == 'granted') {
  const n = new Noty({
    theme: 'sunset',
    text: 'Would you like to receive a notification as soon as more shops accept Tarifa Cash?',
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

/* pwaInstallPrompt('.pwa-install-prompt__container', {
  active_class: 'is-active',
  closer: '.pwa-install-prompt__overlay',
  condition: null,
  expires: 28,
  show_after: 14,
  on: {
    open: function () {
      console.log('open!')
    },
    close: function () {
      console.log('close!')
    }
  }
}) */

// FirebaseUI config.
var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none'
      document.getElementById('welcome').style.display = 'inline'
    }
  },
  signInFlow: 'redirect',
  signInSuccessUrl: '#/loginSuccess',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false
    },
    {
      provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      defaultCountry: 'ES'
    }
  ],
  // tosUrl and privacyPolicyUrl accept either url string or a callback
  // function.
  // Terms of service url/callback.
  tosUrl: '#/tos',
  // Privacy policy url/callback.
  privacyPolicyUrl: '#/privacy'
}

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth())
// Does this have any effect on NodeJS?
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
// Does this languagecode line have any effect?
firebase.auth().languageCode = 'ES'
// The start method will wait until the DOM is loaded.
// if (ui.isPendingRedirect()) this is important for single page apps
ui.start('#firebaseui-auth-container', uiConfig)

export default {
  name: 'Login',
  data () {
    return {
      emailOrPhone: false
    }
  },
  methods: {
    showNotification () {
      new Noty({
        theme: 'sunset',
        text: 'method called from vue'
      }).show()
    },
    beforeMount () {
      this.showNotification()
    }
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
