<template>
  <LayoutContainer>
    <h2 class="headline_h2">Term.vue</h2>

    <div class="breadcrumb u-mb-base">
      <router-link v-if="$cpt.indexPage" v-bind:to="$cpt.indexPage.path">
        <i class="material-icons">arrow_back_ios</i>
        {{ $cpt.indexPage.label }}
      </router-link>
      <a v-if="$cpt.terms.indexPage" class="is-disable">
        <i class="material-icons">arrow_back_ios</i>
        {{ $cpt.terms.indexPage.label }}
      </a>
    </div>

    <h1 class="headline_h1">{{ $frontmatter.title || $page.title }}</h1>

    <h4 class="headline_h4 u-mb-base" v-if="countPosts">Total Posts:  {{ countPosts }}</h4>

    <ul v-if="$cpt.termPosts" class="posts u-mb-base">
      <li v-for="item of $cpt.termPosts" class="post" v-if="item.path">
        <div class="post_taxonomy" v-if="item.taxonomys" v-for="taxonomy of item.taxonomys">
          <span>{{ taxonomy.indexPage.label }}:</span>
          <router-link v-for="category of taxonomy.list" v-if="category.path" v-bind:to="category.path" v-text="category.name" />
        </div>
        <router-link v-bind:to="item.path" class="post_title" v-if="item.title" v-text="item.title" />
        <router-link v-bind:to="item.path">
          <div class="post_date" v-if="item.frontmatter && item.frontmatter.date" v-text="formatDate(item.frontmatter.date)" />
          <div class="post_description" v-if="item.frontmatter && item.frontmatter.description" v-text="item.frontmatter.description" />
        </router-link>
      </li>
    </ul>

    <Pagination
      v-if="$cpt.termPostsPagination"
      v-bind:pagination="$cpt.termPostsPagination" />
  </LayoutContainer>
</template>

<script>
import Pagination from '@theme/components/Pagination'

export default {
  name: 'Term',
  components: {
    Pagination
  },
  computed: {
    countPosts() {
      return (this.$cpt.termPostsPagination) ? this.$cpt.termPostsPagination._posts.length : this.$cpt.termPosts.length
    }
  },
  methods: {
    formatDate(date = '') {
      return new Date(date).toLocaleString(this.$lang)
    }
  }
}
</script>
