<template>
  <div>
    <Navigation></Navigation>
    <h3>Email verification is mandatory!</h3>
    <h4>
      <a href='https://tarifacash.firebaseapp.com'>Click here after email verification!</a>
    </h4>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation'
export default {
  name: 'VerifyEmail',
  components: {
    'Navigation': Navigation
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
