<template>
  <div class="layoutContainer">
    <Navbar v-if="!$page.frontmatter.home" />

    <main class="layoutContainer_content">
      <div class="container">
        <slot />
      </div>
    </main>

    <div class="layoutContainer_footer container">
      <span v-if="copyright" v-text="copyright" />
    </div>

  </div>
</template>

<script>
import Vue from 'vue'
import nprogress from 'nprogress'

import Navbar from '@theme/components/Navbar.vue'

export default {
  name: 'LayoutContainer',

  components: { Navbar },

  computed: {
    copyright() {
      return this.$site.themeConfig.copyright
    }
  },

  mounted () {
    nprogress.configure({ showSpinner: false })

    this.$router.beforeEach((to, from, next) => {
      if (to.path !== from.path && !Vue.component(to.name)) {
        nprogress.start()
      }
      next()
    })

    this.$router.afterEach(() => {
      nprogress.done()
    })
  },

  created() {
    // console.log('this:layoutContainer', this)
  }
}
</script>

<style src="@theme/styles/main.scss" lang="scss"></style>
