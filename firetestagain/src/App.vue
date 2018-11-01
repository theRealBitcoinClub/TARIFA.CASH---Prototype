<template>
  <div id="app">
    <transition name="moveInUp">
      <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      url: 'https://tarifa.cash',
      desc: 'Tarifa Cash is a local currency backed by BCH - Bitcoin Cash',
      img: '/my-special-image.jpg',
      title: 'TRBC - Tarifa Cash'
    }
  },
  metaInfo () {
    return {
      links: [
        {rel: 'canonical', href: this.url}
      ],
      // if no subcomponents specify a metaInfo.title, this title will be used
      title: this.title,
      // all titles will be injected into this template
      titleTemplate: '%s | BCH Bitcoin',
      meta: [
        {'http-equiv': 'Content-Type', content: 'text/html; charset=utf-8'},
        {name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no'},
        {name: 'description', content: this.desc},

        // OpenGraph data (Most widely used)
        {property: 'og:title', content: this.title},
        {property: 'og:site_name', content: this.title},
        {property: 'og:type', content: 'website'},
        {property: 'og:url', content: this.url},
        {property: 'og:image', content: this.url + this.img},
        {property: 'og:description', content: this.desc},

        // Twitter card
        {name: 'twitter:card', content: this.desc},
        {name: 'twitter:site', content: this.url},
        {name: 'twitter:title', content: this.title},
        {name: 'twitter:description', content: this.desc},
        {name: 'twitter:creator', content: '@barriobitcoin'},
        {name: 'twitter:image:src', content: this.url + this.img},

        // Google / Schema.org markup:
        {itemprop: 'name', content: this.title},
        {itemprop: 'description', content: this.desc},
        {itemprop: 'image', content: this.url + this.img}
      ]
    }
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
}
</style>
