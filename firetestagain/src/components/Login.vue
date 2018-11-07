<template>
  <div class="login">
    <b-navbar toggleable="md" type="dark" variant="info">
      <b-navbar-brand href="#"><img width="32px" height="32px" src="/static/tarifacash_logo_white_transparent_512x512.png" alt="logo"/></b-navbar-brand>
      <b-navbar-toggle style="outline:none;font-size:26px;font-weight:400;color:#ffffff;border-color:#ffffff;" target="nav_collapse">Menu</b-navbar-toggle>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item v-if="!emailOrPhone" href="#/">Start</b-nav-item>
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
    <div id="welcome" style="display:none">
      <b-alert variant="success" show>
        Welcome to Tarifa Cash! You can Sign-Up with Email or Phone!
      </b-alert>
    </div>
    <div id="loader">
      <b-alert show>Loading...</b-alert>
      <img src='/static/loading.svg' />
    </div>
    <div id="firebaseui-auth-container"></div>
  </div>
</template>
<script>
require('../../static/firebaseui.css')
const firebaseui = require('firebaseui')

// Firebase App is always required and must be first
const firebase = require('firebase/app')

// Add additional services that you want to use
require('firebase/auth')
require('firebase/database')

export default {
  name: 'Login',
  data () {
    return {
      emailOrPhone: false
    }
  },
  mounted () {
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

    // Does this have any effect on NodeJS?
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    // Does this languagecode line have any effect?
    firebase.auth().languageCode = 'ES'

    if (firebaseui.auth.AuthUI.getInstance()) {
      const ui = firebaseui.auth.AuthUI.getInstance()
      ui.start('#firebaseui-auth-container', uiConfig)
    } else {
      const ui = new firebaseui.auth.AuthUI(firebase.auth())
      ui.start('#firebaseui-auth-container', uiConfig)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
