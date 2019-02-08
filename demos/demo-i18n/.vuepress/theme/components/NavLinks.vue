<template>
  <nav class="navbar_navLinks" v-if="userLinks.length">
    <div class="navbar_navItem" v-for="item in userLinks" v-bind:key="item.link">
      <NavLink v-bind:item="item" />
    </div>
  </nav>
</template>

<script>
import { resolveNavLinkItem } from '@theme/util'
import NavLink from '@theme/components/NavLink.vue'

export default {
  components: { NavLink },

  computed: {
    userNav() {
      return this.$themeLocaleConfig.nav || this.$site.themeConfig.nav || []
    },

    nav() {
      const { locales } = this.$site
      if (locales && Object.keys(locales).length > 1) {
        const currentLink = this.$page.path
        const routes = this.$router.options.routes
        const themeLocales = this.$site.themeConfig.locales || {}
        const languageDropdown = Object.keys(locales).map(path => {
          const locale = locales[path]
          const text = themeLocales[path] && themeLocales[path].label || locale.lang
          let link
          // Stay on the current page
          if (locale.lang === this.$lang) {
            link = currentLink
          } else {
            // Try to stay on the same page
            link = currentLink.replace(this.$localeConfig.path, path)
            // fallback to homepage
            if (!routes.some(route => route.path === link)) {
              link = path
            }
          }
          return { text, link }
        })
        return [...languageDropdown, ...this.userNav]
      }
      return this.userNav
    },

    userLinks () {
      return (this.nav || []).map(link => {
        return Object.assign(resolveNavLinkItem(link), {
          items: (link.items || []).map(resolveNavLinkItem)
        })
      })
    }
  }
}
</script>
