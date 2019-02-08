<template>
  <header class="pagination" v-if="pagination && pagination.length">
    <router-link class="u-flex u-flex--center-center" v-if="pagination.hasPrev" v-bind:to="pagination.prevLink">
      <i class="material-icons">arrow_back</i>
      Prev
    </router-link>
    <router-link
      class="is-number"
      v-for="(item, key) of pagination._paginationPages"
      v-bind:to="item.permalink"
      v-bind:disable="pagination._currentPage.permalink === item.permalink">
      {{ key + 1 }}
    </router-link>
    <router-link class="u-flex u-flex--center-center" v-if="pagination.hasNext" v-bind:to="pagination.nextLink">
      Next
      <i class="material-icons">arrow_forward</i>
    </router-link>
  </header>
</template>

<script>
export default {
  props: {
    pagination: {
      required: true
    }
  },
  computed: {
  }
}
</script>

<style scoped lang="scss">
@import '@theme/styles/vue-import.scss';

.pagination {
  @include FR_FLEX_LAYOUT(flex-start, center, false, false, inline-flex);
  border: 1px solid COLOR('main', 'black');
  border-radius: 2px;
}

.pagination > a {
  font-weight: bold;
  padding-left: 1em;
  padding-right: 1em;
  height: 3rem;
  line-height: 3rem;
  text-align: center;
  border-left: 1px solid COLOR('main', 'black');
  text-decoration: none !important;
  .material-icons {
    font-size: 1.2em;
    margin-right: 0.25em;
    margin-left: 0.25em;
  }
  &:first-child {
    border-left: 0;
  }
  &.is-number {
    padding-left: 0;
    padding-right: 0;
    min-width: 3rem;
  }
  &[disable] {
    background-color: COLOR('main', 'green');
    color: #ffffff;
    cursor: not-allowed;
    pointer-events: none;
  }
  &:not([disable]):hover {
    background-color: COLOR('main', 'green');
    color: #ffffff;
  }
}
</style>
