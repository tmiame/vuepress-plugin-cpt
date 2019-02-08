const path = require('path')
const VuepressPluginCpt = require('../../../../index.js')

const registerPostTypes = {
  locales: {
    '/': {
      news: {
        label: 'News',
        postsDir: '_posts-news',
        posts: {
          pagination: {
            perPagePosts: 3
          }
        },
        taxonomys: {
          category: {
            label: 'Category',
            term: {
              pagination: {
                perPagePosts: 3
              }
            }
          },
          tag: {
            label: 'Tagged',
            term: {
              pagination: {
                perPagePosts: 3
              }
            }
          }
        }
      },
      blog: {
        label: 'Blog',
        postsDir: '_posts-blog',
        posts: {
          pagination: {
            perPagePosts: 3
          }
        },
        taxonomys: {
          category: {
            label: 'Category',
            term: {
              pagination: {
                perPagePosts: 3
              }
            }
          },
          tag: {
            label: 'Tagged',
            term: {
              pagination: {
                perPagePosts: 3
              }
            }
          }
        }
      }
    },
    '/jp/': {
      news: {
        label: 'ニュース',
        postsDir: '/jp/_posts-news',
        posts: {
          title: '%cptの投稿',
          pagination: {
            perPagePosts: 3,
            title: '%cptの投稿 | %paginationIndexページ目'
          }
        },
        taxonomys: {
          category: {
            label: 'カテゴリー',
            terms: {
              title: `%taxonomy一覧`
            },
            term: {
              title: `%taxonomy - %termの投稿 | %cpt`,
              pagination: {
                perPagePosts: 3,
                title: `%taxonomy - %termの投稿 | %paginationIndexページ目 | %cpt`
              }
            }
          },
          tag: {
            label: 'タグ',
            terms: {
              title: `%taxonomy一覧`
            },
            term: {
              title: `%taxonomy - %termの投稿 | %cpt`,
              pagination: {
                perPagePosts: 3,
                title: `%taxonomy - %termの投稿 | %paginationIndexページ目 | %cpt`
              }
            }
          }
        }
      },
      blog: {
        label: 'ブログ',
        postsDir: '/jp/_posts-blog',
        posts: {
          title: '%cptの投稿',
          pagination: {
            perPagePosts: 3,
            title: '%cptの投稿 | %paginationIndexページ目'
          }
        },
        taxonomys: {
          category: {
            label: 'カテゴリー',
            terms: {
              title: `%taxonomy一覧`
            },
            term: {
              title: `%taxonomy - %termの投稿 | %cpt`,
              pagination: {
                perPagePosts: 3,
                title: `%taxonomy - %termの投稿 | %paginationIndexページ目 | %cpt`
              }
            }
          },
          tag: {
            label: 'タグ',
            terms: {
              title: `%taxonomy一覧`
            },
            term: {
              title: `%taxonomy - %termの投稿 | %cpt`,
              pagination: {
                perPagePosts: 3,
                title: `%taxonomy - %termの投稿 | %paginationIndexページ目 | %cpt`
              }
            }
          }
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
    [ VuepressPluginCpt, registerPostTypes ]
  ]
}
