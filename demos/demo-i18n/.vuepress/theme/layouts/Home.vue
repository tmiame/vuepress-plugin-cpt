<template>
  <LayoutContainer>
    <div class="home">
      <div class="home_hero">
        <h1 class="home_hero_title">
          <span>VuePress-plugin-cpt</span>
        </h1>
      </div>

      <div class="home_container">

        <section class="cpt-group u-mb-4"
          v-if="$cpts"
          v-for="cpt of $cpts">
          <h2 class="headline_h2 u-flex u-flex--start-center u-mb-base" v-if="cpt.indexPage">
            <i class="material-icons">folder</i> {{ cpt.indexPage.label }}
          </h2>
          <ul>
            <li v-if="cpt.pagination">
              <h5 class="u-mt-0 u-mb-1">
                <router-link v-if="cpt.indexPage && cpt.indexPage.path" v-bind:to="cpt.indexPage.path">
                  <span>Archives(Pagination)</span>
                  <i class="material-icons">arrow_forward_ios</i>
                </router-link>
                <span v-else-if="cpt.indexPage && !cpt.indexPage.path">Archives</span>
              </h5>
              <ul v-if="cpt.pagination.posts">
                <li v-for="item of cpt.pagination.posts">
                  <router-link
                    v-if="item.path" v-bind:to="item.path" v-text="item.title" />
                  <span
                    v-else-if="taxonomy.indexPage && !taxonomy.indexPage.path"
                    v-text="taxonomy.indexPage.name" />
                </li>
              </ul>
              <Pagination class="u-mt-1" v-bind:pagination="cpt.pagination" />
            </li>

            <li v-if="cpt && !cpt.pagination">
              <h5 class="u-mt-0 u-mb-1">
                <router-link v-if="cpt.indexPage && cpt.indexPage.path" v-bind:to="cpt.indexPage.path">
                  <span>Archives</span>
                  <i class="material-icons">arrow_forward_ios</i>
                </router-link>
                <span v-else-if="cpt.indexPage && !cpt.indexPage.path">Archives</span>
              </h5>
              <ul v-if="cpt.posts">
                <li v-for="item of cpt.posts">
                  <router-link v-bind:to="item.path" v-text="item.title"></router-link>
                </li>
              </ul>
            </li>

            <li
              v-if="cpt.taxonomys"
              v-for="taxonomy of cpt.taxonomys">
              <h5 class="u-mt-0 u-mb-1">
                <router-link
                  v-if="taxonomy.indexPage && taxonomy.indexPage.path"
                  v-bind:to="taxonomy.indexPage.path">
                  <span>{{ taxonomy.indexPage.label }}</span>
                  <i class="material-icons">arrow_forward_ios</i>
                </router-link>
                <span
                  v-else-if="taxonomy.indexPage && !taxonomy.indexPage.path"
                  v-text="taxonomy.indexPage.label" />
              </h5>
              <ul v-if="taxonomy.list">
                <li v-for="item of taxonomy.list">
                  <router-link v-bind:to="item.path" v-text="item.name"></router-link>
                </li>
              </ul>
            </li>
          </ul>
        </section>

      </div>
    </div>
  </LayoutContainer>
</template>

<script>
import Pagination from '@theme/components/Pagination'

export default {
  name: 'Home',
  components: {
    Pagination
  }
}
</script>


<style scoped lang="scss">
@import '@theme/styles/vue-import.scss';

.home_hero {
  @include FR_FLEX_LAYOUT(center, center);
}

.home_hero_title {
  @include WEBFONT('brand', bold);
  position: relative;
  margin: 0;
  padding: 0;
  font-size: 8vw;
  line-height: 1;
  display: inline-block;
  background-color: COLOR('main', 'green');
  color: #ffffff;
  border-radius: 2px;
  font-style: italic;
  overflow: hidden;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  padding: 0.4em 1em (0.4em * 1.1);
  padding-right: (1em * 0.9);
  margin-top: calc(2em - 2rem);
  margin-bottom: 2em;
  box-shadow: 0 3px 6px rgba(#000000, 0.1), 0 25px 50px rgba(#000000, 0.05);
  @include FR_MQ_MIN(M) {
    font-size: 40px;
  }
  @include FR_MQ_ONLY(QT) {
    font-size: 5vw;
    margin-top: calc(3em - 2rem);
    margin-bottom: 3em;
  }
  @include FR_MQ_ONLY(QS) {
    font-size: 6vw;
    margin-top: calc(4em - 2rem);
    margin-bottom: 4em;
  }
  span {
    position: relative;
    z-index: 3;
  }
}

.home {
  h5 {
    > * {
      @include FR_FLEX_LAYOUT(flex-start, center);
    }
    .material-icons {
      font-size: 1em;
      margin-left: 0.25em;
      display: block;
      position: relative;
      top: 0.05em;
    }
  }
}

.cpt-group {
  > ul {
    @include FR_FLEX_LAYOUT(flex-start, flex-start);
    @include FR_MQ_ONLY(QS) {
      flex-wrap: wrap;
    }
  }
  > ul > li {
    min-width: (50% / 2);
    @include FR_MQ_ONLY(QS) {
      min-width: 50%;
    }
    &:first-child {
      min-width: 50%;
      @include FR_MQ_ONLY(QS) {
        @include SPACE('margin-bottom', L);
        min-width: 100%;
      }
    }
  }
}
</style>
