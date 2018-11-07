<template>
  <div>
    <b-navbar toggleable="md" type="dark" variant="info">
      <b-navbar-brand href="#"><img width="32px" height="32px" src="/static/tarifacash_logo_white_transparent_512x512.png" alt="logo"/></b-navbar-brand>
      <b-navbar-toggle style="outline:none;font-size:26px;font-weight:400;color:#ffffff;border-color:#ffffff;" target="nav_collapse">Menu</b-navbar-toggle>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item v-if="!emailOrPhone" href="#/">Home</b-nav-item>
          <b-nav-item v-if="emailOrPhone" href="#/loginSuccess">TCH-Wallet</b-nav-item>
          <b-nav-item href="#/tos">Terms of Service</b-nav-item>
          <b-nav-item href="#/privacy">Privacy Policy</b-nav-item>
        </b-navbar-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item v-if="emailOrPhone" target="_blank" :href="explorer+adr">{{adr}}</b-nav-item>
          <b-nav-item v-if="emailOrPhone" href="#">{{emailOrPhone}}</b-nav-item>
          <b-button @click="navigateToLogin" v-if="!emailOrPhone" style="background-color:#17a2b8;border-color:#ffffff;color:#ffffff;" variant="success" class="my-2 my-sm-0">Login</b-button>
          <b-button v-if="emailOrPhone" style="background-color:#17a2b8;border-color:#ffffff;" variant="outline-success" class="my-2 my-sm-0"><b-link style="color:#ffffff" href="/">Logout</b-link></b-button>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'Navigation',
  data () {
    return {
      emailOrPhone: false
    }
  },
  methods: {
    navigateToLogin () {
      this.$router.push('login')
    }
  }
}
</script>

<style scoped>
</style>
