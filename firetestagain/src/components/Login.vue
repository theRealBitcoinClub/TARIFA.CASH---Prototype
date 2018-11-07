<template>
  <div class="login">
    <Navigation></Navigation>
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
import Navigation from '@/components/Navigation'
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
  components: {
    'Navigation': Navigation
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
      document.getElementById('loader').style.display = 'none'
      document.getElementById('welcome').style.display = 'inline'
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
