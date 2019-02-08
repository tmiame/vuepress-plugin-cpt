<template>
  <LayoutContainer>
    <div class="custom-layout" v-if="$page.frontmatter.layout && $page.frontmatter.layout !== 'Layout'">
      <component v-bind:is="$page.frontmatter.layout" />
    </div>
    <Page v-else>
      <slot name="page-top" slot="top" />
      <slot name="page-bottom" slot="bottom" />
    </Page>
  </LayoutContainer>
</template>

<script>
import Vue from 'vue'
import nprogress from 'nprogress'

import Page from '@theme/layouts/Page.vue'

export default {
  name: 'Layout',

  components: { Page }
}
</script>
