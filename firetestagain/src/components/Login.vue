<template>
  <div class="login">
    <div id="loader">Loading...</div>
    <div id="firebaseui-auth-container"></div>
  </div>
</template>

<script>
require('../assets/firebaseui.css')
var firebase = require('firebase')
var firebaseui = require('firebaseui')

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
    }
  },
  signInFlow: 'redirect',
  signInSuccessUrl: '#/loginSuccess',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
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
  privacyPolicyUrl: function () {
    window.location.assign('#/privacy')
  }
}

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth())
// Does this have any effect?
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
// Does this languagecode line have any effect?
firebase.auth().languageCode = 'ES'
// The start method will wait until the DOM is loaded.
// if (ui.isPendingRedirect()) this is important for single page apps
ui.start('#firebaseui-auth-container', uiConfig)

export default {
  name: 'Login',
  data () {
    return {
      email: firebase.auth().currentUser != null ? firebase.auth().currentUser.email : 'user is null'
    }
  },
  methods: {
    isLoggedOut () {
      return firebase.auth().currentUser == null
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
