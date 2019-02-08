import { findPageByKey } from '@app/util'
import CustomPostTypeMeta from '@dynamic/custom-post-type'

const utilObjectMap = (object, fn) => {
  return Object.keys(object).reduce((result, key) => {
    result[key] = fn(object[key])
    return result
  }, {})
}

class Taxonomy {
  constructor(taxonomy, route, posts) {
    const { indexPage, list } = taxonomy
    this.indexPage = indexPage
    this.map = utilObjectMap(list, (item) => {
      const { pageKeys, pagination, path } = item
      const filterPosts = posts.filter(post => pageKeys.includes(post.key))
      return {
        posts: filterPosts,
        path: path,
        pagination: (pagination) ? new Pagination(pagination, filterPosts, route) : false
      }
    })
  }

  get list() {
    return this.toArray()
  }

  toArray() {
    return Object.keys(this.map).reduce((result, name) => {
      const { posts, path } = this.map[name]
      result.push({ name, posts, path })
      return result
    }, [])
  }
}

class Pagination {
  constructor(pagination, posts, route) {
    const { path } = route
    const { paginationPages } = pagination
    let { postsSorter } = pagination

    /* eslint-disable no-eval */
    postsSorter = eval(postsSorter)

    paginationPages.forEach((page, index) => {
      if (page.permalink === path) {
        this.paginationIndex = index
      }
    })

    if (!this.paginationIndex) {
      this.paginationIndex = 0
    }

    this._paginationPages = paginationPages
    this._currentPage = paginationPages[this.paginationIndex]
    this._posts = posts
    this._posts.sort(postsSorter)
  }

  get length() {
    return this._paginationPages.length
  }

  get posts() {
    const [start, end] = this._currentPage.interval
    return this._posts.slice(start, end + 1)
  }

  get hasPrev() {
    return this.paginationIndex !== 0
  }

  get prevLink() {
    if (this.hasPrev) {
      return this._paginationPages[this.paginationIndex - 1].permalink
    }
  }

  get hasNext() {
    return this.paginationIndex !== this.length - 1
  }

  get nextLink() {
    if (this.hasNext) {
      return this._paginationPages[this.paginationIndex + 1].permalink
    }
  }
}

export default ({ Vue }) => {
  Vue.mixin({
    computed: {
      $cpts() {
        const { pages } = this.$site

        let cpt = {}

        Object.keys(CustomPostTypeMeta).forEach(cptKey => {
          if (CustomPostTypeMeta[cptKey].lang === false || CustomPostTypeMeta[cptKey].lang === this.$localePath) {
            const {
              lang,
              slug,
              label,
              basePath,
              taxonomys,
              posts: postKeys,
              pagination
            } = CustomPostTypeMeta[cptKey]

            const formatCptKey = cptKey.startsWith(lang) ? cptKey.replace(lang, '').replace(/\//g, '') : cptKey.replace(/\//g, '')

            const posts = postKeys.map(key => {
              const post = findPageByKey(pages, key)
              const postTaxonomyMeta = Object.keys(taxonomys).reduce((result, key) => {
                if (post.frontmatter[key]) {
                  result[key] = (Array.isArray(post.frontmatter[key])) ? post.frontmatter[key] : [post.frontmatter[key]]
                }
                return result
              }, {})
              post.taxonomys = Object.keys(postTaxonomyMeta).reduce((result, key) => {
                result[key] = {
                  indexPage: taxonomys[key].indexPage,
                  list: postTaxonomyMeta[key].map(term => {
                    return {
                      name: term,
                      path: taxonomys[key].list[term].path
                    }
                  })
                }
                return result
              }, {})
              return post
            })

            cpt[formatCptKey] = {
              indexPage: {
                slug: slug,
                label: label,
                path: basePath
              },
              taxonomys: utilObjectMap(taxonomys, (taxonomy) => new Taxonomy(taxonomy, this.$route, posts)),
              posts: posts,
              pagination: (pagination) ? new Pagination(pagination, posts, this.$route) : false
            }
          }
        })

        return cpt
      },

      $cpt() {
        const { key: pageKey } = this.$page
        const { cpt_name, cpt_taxonomy, cpt_term } = this.$frontmatter

        if (!cpt_name || !this.$cpts[cpt_name]) {
          return false
        }

        const _metaMap = this.$cpts[cpt_name]

        const indexPage = _metaMap.indexPage

        const taxonomys = _metaMap.taxonomys

        const terms = (cpt_taxonomy) ? _metaMap.taxonomys[cpt_taxonomy] : false

        const termMeta = (cpt_term) ? _metaMap.taxonomys[cpt_taxonomy].map[cpt_term] : false
        const term = (termMeta) ? {
          indexPage: {
            name: cpt_term,
            path: termMeta.path
          },
          posts: termMeta.posts
        } : false

        const postsPagination = (_metaMap.pagination) ? _metaMap.pagination : false
        const posts = (postsPagination) ? postsPagination.posts
          : (_metaMap && _metaMap.posts) ? _metaMap.posts
            : false

        const termPostsPagination = (termMeta) ? termMeta.pagination
          : false
        const termPosts = (termPostsPagination) ? termPostsPagination.posts
          : (termMeta) ? termMeta.posts
            : false

        const postMeta = _metaMap.posts.find(post => post.key === pageKey)
        const post = (postMeta) ? postMeta.taxonomys : false

        return {
          indexPage,
          taxonomys,
          terms,
          term,
          postsPagination,
          posts,
          termPostsPagination,
          termPosts,
          post
        }
      }
    }
  })
}
