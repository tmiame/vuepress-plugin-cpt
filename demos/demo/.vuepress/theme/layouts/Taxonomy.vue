<template>
  <LayoutContainer>
    <h2 class="headline_h2">Taxonomy.vue</h2>

    <div class="breadcrumb u-mb-base">
      <router-link v-if="$cpt.indexPage" v-bind:to="$cpt.indexPage.path">
        <i class="material-icons">arrow_back_ios</i>
        {{ $cpt.indexPage.label }}
      </router-link>
    </div>

    <h1 class="headline_h1">{{ $frontmatter.title || $page.title }}</h1>

    <div v-if="$cpt.terms" class="posts">
      <router-link v-for="item of $cpt.terms.list" v-bind:to="item.path" class="post postTaxonomy">
        <div class="postTaxonomy_title" v-text="item.name" />
        <div class="postTaxonomy_count" v-text="item.posts.length" />
      </router-link>
    </div>

  </LayoutContainer>
</template>

<script>
export default {
  name: 'Terms'
}
</script>
