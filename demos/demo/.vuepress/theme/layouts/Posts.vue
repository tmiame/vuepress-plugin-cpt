<template>
  <LayoutContainer>
    <h2 class="headline_h2">Posts.vue</h2>

    <h1 class="headline_h1">{{ $frontmatter.title || $page.title }}</h1>

    <h4 class="headline_h4 u-mb-base" v-if="countPosts">Total Posts:  {{ countPosts }}</h4>

    <div v-if="$cpt.posts" class="posts u-mb-base">
      <div v-for="item of $cpt.posts" class="post">
        <div class="post_taxonomy" v-if="item.taxonomys" v-for="taxonomy of item.taxonomys" v-on:click:stop.prevent>
          <span>{{ taxonomy.indexPage.label }}:</span>
          <router-link v-for="category of taxonomy.list" v-bind:to="category.path" v-text="category.name" />
        </div>
        <router-link v-bind:to="item.path">
          <div class="post_title" v-if="item.title" v-text="item.title" />
          <div class="post_date" v-if="item.frontmatter && item.frontmatter.date" v-text="formatDate(item.frontmatter.date)" />
          <div class="post_description" v-if="item.frontmatter && item.frontmatter.description" v-text="item.frontmatter.description" />
        </router-link>
      </div>
    </div>

    <Pagination
      v-if="$cpt.postsPagination"
      v-bind:pagination="$cpt.postsPagination" />

  </LayoutContainer>
</template>

<script>
import Pagination from '@theme/components/Pagination'

export default {
  name: 'Posts',
  components: {
    Pagination
  },
  computed: {
    countPosts() {
      return (this.$cpt.postsPagination) ? this.$cpt.postsPagination._posts.length : this.$cpt.posts.length
    }
  },
  methods: {
    formatDate(date = '') {
      return new Date(date).toLocaleString(this.$lang)
    }
  }
}
</script>
