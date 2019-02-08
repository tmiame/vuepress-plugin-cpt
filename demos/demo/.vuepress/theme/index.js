const path = require('path')
const VuepressPluginCpt = require('../../../../index.js')

const registerPostTypes ={
  news: {
    label: 'News',
    postsDir: '_posts-news',
    posts: {
      layout: 'Posts',
      pagination: {
        perPagePosts: 3
      }
    },
    post: {
      layout: 'Post',
      permalink: '/:year/:month/:day/:slug'
    },
    taxonomys: {
      category: {
        label: 'Category',
        terms: {
          layout: 'Taxonomy'
        },
        term: {
          layout: 'Term',
          pagination: {
            perPagePosts: 3
          }
        }
      },
      tag: {
        label: 'Tagged',
        term: {
          layout: 'Term',
          pagination: {
            perPagePosts: 3
          }
        }
      }
    }
  },
  blog: {
    slug: 'my-blog',
    label: 'Blog',
    postsDir: '_posts-blog',
    posts: {
      pagination: false,
    },
    taxonomys: {
      category: {
        label: 'Category',
        term: {
          pagination: false
        }
      },
      tag: {
        label: 'Tagged',
        term: {
          pagination: false
        }
      }
    }
  }
}

module.exports = {
  themeName: 'cpt-demo',
  plugins: [
    '@vuepress/search',
    '@vuepress/last-updated',
    '@vuepress/active-header-links',
    '@vuepress/nprogress',
    [
      VuepressPluginCpt, registerPostTypes
    ]
  ]
}
