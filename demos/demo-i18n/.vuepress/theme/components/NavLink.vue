<template>
  <router-link
    class="navbar_navLink"
    v-if="!isExternal(link)"
    v-bind:to="link"
    v-bind:exact="exact"
    v-touchfeedback
  >{{ item.text }}</router-link>
  <a
    v-else
    v-bind:href="link"
    class="navbar_navLink external"
    v-bind:target="isMailto(link) || isTel(link) ? null : '_blank'"
    v-bind:rel="isMailto(link) || isTel(link) ? null : 'noopener noreferrer'"
    v-touchfeedback
  >{{ item.text }}<i class="material-icons">open_in_new</i>
  </a>
</template>

<script>
import { isExternal, isMailto, isTel, ensureExt } from '@theme/util'

export default {
  props: {
    item: {
      required: true
    }
  },

  computed: {
    link () {
      return ensureExt(this.item.link)
    },

    exact () {
      if (this.$site.locales) {
        return Object.keys(this.$site.locales).some(rootLink => rootLink === this.link)
      }
      return this.link === '/'
    }
  },

  methods: {
    isExternal,
    isMailto,
    isTel
  }
}
</script>
