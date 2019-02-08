<template>
  <LayoutContainer>
    <h2 class="headline_h2">Post.vue</h2>

    <div class="breadcrumb u-mb-base">
      <router-link v-if="$cpt.indexPage" v-bind:to="$cpt.indexPage.path">
        <i class="material-icons">arrow_back_ios</i>
        {{ $cpt.indexPage.label }}
      </router-link>
    </div>

    <div class="post_header" v-if="$cpt.post">
      <div class="post_taxonomy" v-if="$cpt.post" v-for="taxonomy of $cpt.post" v-on:click:stop.prevent>
        <span>{{ taxonomy.indexPage.label }}:</span>
        <router-link v-for="category of taxonomy.list" v-bind:to="category.path" v-text="category.name" />
      </div>
      <h1 class="headline_h1 u-my-base" v-text="$page.title" />
      <div class="post_header_lastUpdated" v-text="`${lastUpdatedText}: ${lastUpdated}`" />
    </div>

    <div class="content u-my-4">
      <slot name="top" />

      <Content v-bind:custom="false" />

      <slot name="bottom" />
    </div>

    <div class="post_author u-my-base">
      <div class="post_author_avatar"></div>
      <div class="post_author_content">
        <div class="post_author_name">@tmiame</div>
        <div class="post_author_link">https://tmiame.com</div>
      </div>
    </div>
  </LayoutContainer>
</template>

<script>
export default {
  name: 'Post',

  computed: {
    lastUpdated () {
      if (this.$page.lastUpdated) {
        return new Date(this.$page.lastUpdated).toLocaleString(this.$lang)
      } else if (this.$page.frontmatter.date) {
        return new Date(this.$page.frontmatter.date).toLocaleString(this.$lang)
      }
    },

    lastUpdatedText () {
      if (typeof this.$themeLocaleConfig.lastUpdated === 'string') {
        return this.$themeLocaleConfig.lastUpdated
      }
      if (typeof this.$site.themeConfig.lastUpdated === 'string') {
        return this.$site.themeConfig.lastUpdated
      }
      return 'Last Updated'
    }
  }
}
</script>

<style scoped lang="scss">
@import '@theme/styles/vue-import.scss';

.post_header {
  &_inner {
    @include LAYOUT_PC;
    @include LAYOUT_MOBILE;
  }
  &_title {
    @include FONTSIZE(L);
    font-weight: bold;
    line-height: 1.3;
  }
  &_lastUpdated {
    @include FONTSIZE(S);
    @include WEBFONT(brand, 500);
    @include FR_FLEX_LAYOUT(flex-start, center);
    color: COLOR('text', 'gray');
    i {
      font-size: 1.4em;
      margin-right: 0.4em;
    }
  }
}
</style>
