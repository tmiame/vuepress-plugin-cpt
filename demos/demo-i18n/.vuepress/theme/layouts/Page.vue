<template>
  <LayoutContainer>
    <div class="content">
      <slot name="top" />

      <h2>Page.vue</h2>

      <Content v-bind:custom="false" />

      <slot name="bottom" />
    </div>
  </LayoutContainer>
</template>

<script>
export default {
  name: 'Page'
}
</script>
