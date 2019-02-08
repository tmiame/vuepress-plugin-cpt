<template>
  <header class="navbar layoutContainer_header">
    <div class="navbar_inner container">

      <div class="navbar_logo_outer">
        <router-link
          class="navbar_logo is-noHover"
          v-bind:title="$siteTitle"
          v-bind:to="$localePath"
          v-touchfeedback>
          <span>@tmiame</span>
        </router-link>
      </div>

      <div class="navbar_links_outer">
        <div class="navbar_links">
          <SearchBox v-if="$site.themeConfig.search !== false" />
          <NavLinks />
        </div>
      </div>

    </div>
  </header>
</template>

<script>
import SearchBox from '@theme/components/SearchBox.vue'
import NavLinks from '@theme/components/NavLinks.vue'

export default {
  components: {
    NavLinks,
    SearchBox
  }
}
</script>
