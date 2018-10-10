<template>
  <div id="app">
    <h1>{{mmm}}</h1>
    <img src="./assets/logo.png">
    <router-view/>
  </div>
</template>

<script>
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
