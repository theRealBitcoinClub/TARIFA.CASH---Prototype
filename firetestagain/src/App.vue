<template>
  <div id="app">
    <img src="./assets/logo.png">
    <transition name="moveInUp">
      <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  metaInfo: {
    links: [
      {rel: 'canonical', href: 'https://www.my-site.com/my-special-page'}
    ],
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: 'TRBC - Tarifa Cash',
    // all titles will be injected into this template
    titleTemplate: '%s | BCH Bitcoin',
    meta: [
      {'http-equiv': 'Content-Type', content: 'text/html; charset=utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no'},
      {name: 'description', content: 'Tarifa Cash is a local currency backed by BCH - Bitcoin Cash'},
      // OpenGraph data (Most widely used)
      {property: 'og:title', content: 'My Page Title ← My Site'},
      {property: 'og:site_name', content: 'My Site'},
      // The list of types is available here: http://ogp.me/#types
      {property: 'og:type', content: 'website'},
      // Should the the same as your canonical link, see below.
      {property: 'og:url', content: 'https://www.my-site.com/my-special-page'},
      {property: 'og:image', content: 'https://www.my-site.com/my-special-image.jpg'},
      // Often the same as your meta description, but not always.
      {property: 'og:description', content: 'I have things here on my site.'},

      // Twitter card
      {name: 'twitter:card', content: 'summary'},
      {name: 'twitter:site', content: 'https://www.my-site.com/my-special-page'},
      {name: 'twitter:title', content: 'My Page Title ← My Site'},
      {name: 'twitter:description', content: 'I have things here on my site.'},
      // Your twitter handle, if you have one.
      {name: 'twitter:creator', content: '@alligatorio'},
      {name: 'twitter:image:src', content: 'https://www.my-site.com/my-special-image.jpg'},

      // Google / Schema.org markup:
      {itemprop: 'name', content: 'My Page Title My Site'},
      {itemprop: 'description', content: 'I have things here on my site.'},
      {itemprop: 'image', content: 'https://www.my-site.com/my-special-image.jpg'}
    ]
  }
}
</script>

<style>
.moveInUp-enter-active{
  animation: fadeIn 1s ease-in;
}
@keyframes fadeIn{
  0%{
    opacity: 0;
  }
  50%{
    opacity: 0.5;
  }
  100%{
    opacity: 1;
  }
}

.moveInUp-leave-active{
  animation: moveInUp .3s ease-in;
}
@keyframes moveInUp{
 0%{
  transform: translateY(0);
 }
  100%{
  transform: translateY(-400px);
 }
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}
</style>
