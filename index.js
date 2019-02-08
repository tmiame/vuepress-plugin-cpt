const { path, datatypes: { isString } } = require('@vuepress/shared-utils')

const CPT_PAGE_TYPE = 'cpt_post'
const CPT_DEFAULT_BASE_URL = '/'
const CPT_DEFAULT_LAYOUT_PAGE = 'Page'

const CPT_DEFAULT_OPTIONS = {
  label: '',
  slug: '',
  postsDir: '_posts',
  baseUrl: '/',
  posts: {
    layout: 'Posts',
    title: `%cpt`,
    pagination: {
      perPagePosts: 10,
      paginationUrl: '/page/',
      customFirstPage: false,
      title: `%cpt - Page %paginationIndex`
    }
  },
  post: {
    layout: 'Post',
    titleBefore: '',
    titleAfter: ' | %cpt',
    permalink: '/:year/:month/:day/:slug'
  }
}

const CPT_DEFAULT_TAXONOMY_OPTIONS = {
  slug: '',
  label: '',
  terms: {
    layout: 'Taxonomy',
    title: `%taxonomy | %cpt`
    // indexPageUrl: '/custom-slug/',
  },
  term: {
    layout: 'Term',
    title: `%term - %taxonomy | %cpt`,
    pagination: {
      perPagePosts: 10,
      paginationUrl: '/page/',
      customFirstPage: false,
      title: `%term - %taxonomy - Page %paginationIndex | %cpt`
    }
  }
}

const replaceURIComponent = (str = '', toLowerCase = true) => {
  str = str.replace(/\s|&+/g, '-')
  if (toLowerCase) {
    str = str.toLowerCase()
  }
  return encodeURIComponent(str)
}

/**
 * Performs a deep merge of objects and returns new object. Does not modify
 * objects (immutable) and merges arrays via concatenation.
 * https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge/50242896#answer-48218209
 *
 * @param {...object} objects - Objects to merge
 * @returns {object} New object with merged key/values
 */
function mergeDeep(...objects) {
  const isObject = obj => obj && typeof obj === 'object'

  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach(key => {
      const pVal = prev[key]
      const oVal = obj[key]

      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = pVal.concat(...oVal)
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeDeep(pVal, oVal)
      } else {
        prev[key] = oVal
      }
    })

    return prev
  }, {})
}

/**************************************************
 * Generate Title
 *
 * @param {String} title
 * @param {Object} params
 * @return {String}
 **************************************************/
function generateTitle(title = '', params = {}) {
  if (params.cpt) title = title.replace(/%cpt/g, params.cpt)
  if (params.taxonomy) title = title.replace(/%taxonomy/g, params.taxonomy)
  if (params.term) title = title.replace(/%term/g, params.term)
  if (params.paginationIndex) title = title.replace(/%paginationIndex/g, params.paginationIndex)

  return title
}

/**************************************************
 * Generate Pagination
 *
 * @param {Object} options
 * @param {Array} postKeys
 * @param {String} slug
 * @return {Object}
 **************************************************/
function generatePagination(postKeys = [], options = {}, frontmatter = {}) {
  const {
    baseUrl = CPT_DEFAULT_BASE_URL,
    customFirstPage = false,
    layout,
    title: indexPageTitle,
    pagination: {
      perPagePosts,
      paginationUrl,
      title: paginationTitle
    },
    postsSorter = ((prev, next) => {
      const prevTime = new Date(prev.frontmatter.date).getTime()
      const nextTime = new Date(next.frontmatter.date).getTime()
      return prevTime - nextTime < 0 ? -1 : 1
    })
  } = options

  const getIntervallers = (max, interval) => {
    const count = Math.floor(max / interval)
    const arr = [...Array(count + 1)]
    return arr.map((v, index) => {
      const start = index * interval
      const end = (index + 1) * interval - 1
      return [start, end > max ? max : end]
    })
  }

  const intervallers = getIntervallers(postKeys.length - 1, perPagePosts)

  const pagination = {
    paginationPages: intervallers.map((interval, index) => {
      const permalink = (index === 0) ? baseUrl : path.join(baseUrl, paginationUrl, `${index + 1}/`)
      return { permalink, interval }
    }),
    postsSorter: postsSorter.toString()
  }

  const paginationExtraPages = []
  pagination.paginationPages.forEach(({ permalink }, index) => {
    const title = (!customFirstPage && permalink === baseUrl) ? indexPageTitle : paginationTitle
    const replaceTitle = generateTitle(title, {
      cpt: frontmatter.cptLabel,
      taxonomy: frontmatter.taxonomySlug,
      term: frontmatter.term,
      paginationIndex: index + 1
    })
    if (customFirstPage && permalink === baseUrl) {
      return
    }
    paginationExtraPages.push({
      permalink: permalink,
      title: replaceTitle,
      frontmatter: {
        layout: layout,
        title: replaceTitle,
        cpt_name: frontmatter.cptName,
        cpt_taxonomy: frontmatter.taxonomy,
        cpt_term: frontmatter.term,
        cpt_pagination: index + 1
      }
    })
  })

  return { pagination, paginationExtraPages }
}

module.exports = (options, ctx) => {
  let enhancers = []
  let cptMeta = options

  const isLayoutExists = name => ctx.layoutComponentMap[name] !== undefined
  const getLayout = (name, fallback) => isLayoutExists(name) ? name : fallback

  if (cptMeta.locales && Object.keys(cptMeta.locales).length > 0) {
    const localesMeta = {}
    Object.keys(cptMeta.locales).forEach(lang => {
      Object.keys(cptMeta.locales[lang]).forEach(cptId => {
        localesMeta[lang + cptId] = cptMeta.locales[lang][cptId]
        localesMeta[lang + cptId].lang = lang
        localesMeta[lang + cptId].name = cptId
      })
    })
    cptMeta = { ...cptMeta, ...localesMeta }
  }

  cptMeta = Object.keys(cptMeta).reduce((obj, key) => {
    if (key === 'locales') {
      return obj
    } else {
      const newKey = path.join(`/${key}/`)
      const options = mergeDeep(CPT_DEFAULT_OPTIONS, cptMeta[key])
      const { name, slug, label } = options

      obj[newKey] = options

      if (!name) {
        obj[newKey].name = key
      }
      if (!label) {
        obj[newKey].label = (slug) ? slug : key
      }

      obj[newKey].slug = (slug) ? encodeURIComponent(slug) : encodeURIComponent(key)

      return obj
    }
  }, {})

  Object.keys(cptMeta).forEach(cptKey => {
    const {
      [cptKey]: {
        name,
        slug,
        label,
        baseUrl,
        postsDir,
        post,
        taxonomys = {}
      }
    } = cptMeta

    enhancers.push({
      when: ({ regularPath }) => regularPath.startsWith(path.join(`/${postsDir}/`)),
      frontmatter: {
        layout: getLayout(post.layout, CPT_DEFAULT_LAYOUT_PAGE),
        permalink: path.join(`/${slug}/`, baseUrl, `/${post.permalink}/`),
        cpt_name: name,
        cpt_title_before: generateTitle(post.titleBefore, { cpt: label }),
        cpt_title_after: generateTitle(post.titleAfter, { cpt: label })
      },
      data: {
        type: CPT_PAGE_TYPE
      }
    })

    if (taxonomys) {
      Object.keys(taxonomys).forEach(key => {
        taxonomys[key] = mergeDeep(CPT_DEFAULT_TAXONOMY_OPTIONS, taxonomys[key])

        if (!taxonomys[key].label) {
          taxonomys[key].label = taxonomys[key].slug ? taxonomys[key].slug : key
        }

        if (!taxonomys[key].slug) {
          taxonomys[key].slug = key
        }

        taxonomys[key].slug = replaceURIComponent(taxonomys[key].slug)

        const { terms, term, slug: taxonomySlug } = taxonomys[key]

        if (terms) {
          enhancers.push({
            when: ({ regularPath }) => regularPath === path.join(`/${slug}/`, taxonomySlug),
            frontmatter: {
              layout: getLayout(terms.layout, CPT_DEFAULT_LAYOUT_PAGE)
            }
          })
        }
        if (term) {
          enhancers.push({
            when: ({ regularPath }) => regularPath.startsWith(path.join(`/${slug}/`, taxonomySlug)),
            frontmatter: {
              layout: getLayout(term.layout, CPT_DEFAULT_LAYOUT_PAGE)
            }
          })
        }
      })
    }
  })

  return {
    name: 'vuepress-plugin-cpt',

    /**
     * Modify page's metadata according to the habits of blog users.
     */
    extendPageData(pageCtx) {
      const { frontmatter: rawFrontmatter } = pageCtx

      enhancers.forEach(({
        when,
        data = {},
        frontmatter = {}
      }) => {
        if (when(pageCtx)) {
          Object.keys(frontmatter).forEach(key => {
            if (!rawFrontmatter[key]) {
              rawFrontmatter[key] = frontmatter[key]
            }
          })
          if (data.type === CPT_PAGE_TYPE && rawFrontmatter.title) {
            rawFrontmatter.title = frontmatter.cpt_title_before + rawFrontmatter.title + frontmatter.cpt_title_after
            delete rawFrontmatter.cpt_title_before
            delete rawFrontmatter.cpt_title_after
          }
          Object.assign(pageCtx, data)
        }
      })
    },

    /**
     * Create tag page and category page.
     */
    async ready() {
      const { pages } = ctx
      let maps = {}
      let extraPages = []

      Object.keys(cptMeta).forEach(cptKey => {
        const cpt = cptMeta[cptKey]

        maps[cptKey] = {
          lang: cpt.lang ? cpt.lang : false,
          name: cpt.name,
          slug: cpt.slug,
          label: cpt.label,
          basePath: path.join(cpt.lang ? `/${cpt.lang}/` : '/', `/${cpt.slug}/`, `/${cpt.baseUrl}/`),
          posts: [],
          pagination: false,
          taxonomys: {}
        }

        // Get All posts
        const filterPages = pages.filter(({ type, _localePath: localePath, frontmatter: { cpt_name } }) => {
          return type === CPT_PAGE_TYPE && cpt_name === cpt.name && localePath === (cpt.lang ? cpt.lang : '/')
        })
        const filterPagesKey = filterPages.map(post => post.key)
        maps[cptKey].posts = filterPagesKey

        if (!cpt.posts || !cpt.posts.pagination) {
          // Add Posts Page
          const replaceTitle = generateTitle(cpt.posts.title, {
            cpt: maps[cptKey].label
          })
          extraPages = [...extraPages, {
            permalink: maps[cptKey].basePath,
            title: replaceTitle,
            frontmatter: {
              title: replaceTitle,
              cpt_name: maps[cptKey].name,
              layout: cpt.posts.layout
            }
          }]
        } else {
          // Pagination for Posts
          const { pagination, paginationExtraPages } = generatePagination(
            filterPagesKey,
            {
              ...cpt.posts,
              baseUrl: maps[cptKey].basePath
            },
            {
              lang: maps[cptKey].lang,
              cptName: maps[cptKey].name,
              cptLabel: maps[cptKey].label
            }
          )
          extraPages = [...extraPages, ...paginationExtraPages]
          maps[cptKey].pagination = pagination
        }

        /**************************************************
         * Create Terms page and Term page.
         **************************************************/
        Object.keys(cpt.taxonomys).forEach(taxonomyKey => {
          const taxonomyMeta = {}
          const taxonomy = cpt.taxonomys[taxonomyKey]
          const { slug: taxonomySlug, label: taxonomyLabel } = taxonomy

          const curryHandler = (scope, map) => (key, pageKey) => {
            if (key) {
              if (!map[key]) {
                map[key] = {}
                map[key].path = path.join(maps[cptKey].basePath, `/${scope}/${replaceURIComponent(key)}/`)
                map[key].pageKeys = []
              }
              map[key].pageKeys.push(pageKey)
            }
          }
          const handleTaxonomy = curryHandler(taxonomySlug, taxonomyMeta)

          filterPages.forEach(({ key: pageKey, frontmatter }) => {
            if (frontmatter[taxonomyKey]) {
              if (isString(frontmatter[taxonomyKey])) {
                handleTaxonomy(frontmatter[taxonomyKey], pageKey)
              }
              if (Array.isArray(frontmatter[taxonomyKey])) {
                frontmatter[taxonomyKey].forEach(termKey => {
                  handleTaxonomy(termKey, pageKey)
                })
              }
            }
          })

          /**************************************************
           * Add Term Posts Page
           **************************************************/
          Object.keys(taxonomyMeta).forEach(termKey => {
            const {
              term,
              term: {
                title: termTitle,
                layout: termLayout
              }
            } = taxonomy

            if (term.pagination) {
              const { pageKeys } = taxonomyMeta[termKey]
              const { pagination, paginationExtraPages } = generatePagination(
                pageKeys,
                {
                  ...term,
                  baseUrl: path.join(maps[cptKey].basePath, taxonomySlug, `${replaceURIComponent(termKey)}/`)
                },
                {
                  cptLabel: cpt.label,
                  cptName: cpt.name,
                  taxonomy: taxonomyKey,
                  taxonomySlug: taxonomyLabel,
                  term: termKey
                }
              )
              taxonomyMeta[termKey].pagination = pagination

              extraPages = [
                ...extraPages,
                ...paginationExtraPages
              ]
            } else {
              const replaceTitle = generateTitle(termTitle, {
                cpt: cpt.label,
                taxonomy: taxonomyLabel,
                term: termKey
              })
              extraPages.push({
                permalink: taxonomyMeta[termKey].path,
                title: replaceTitle,
                frontmatter: {
                  title: replaceTitle,
                  cpt_name: cpt.name,
                  cpt_taxonomy: taxonomyKey,
                  cpt_term: termKey,
                  layout: termLayout
                }
              })
            }
          })

          /**************************************************
           * Add Terms Page
           **************************************************/
          const {
            terms,
            terms: {
              indexPageUrl: termsIndexPageUrl = taxonomySlug,
              title: termsTitle,
              layout: termsLayout
            }
          } = taxonomy

          if (terms) {
            const replaceTitle = generateTitle(termsTitle, {
              cpt: cpt.label,
              taxonomy: taxonomyLabel
            })
            extraPages.push({
              permalink: path.join(maps[cptKey].basePath, `/${termsIndexPageUrl}/`),
              title: replaceTitle,
              frontmatter: {
                title: replaceTitle,
                cpt_name: cpt.name,
                cpt_taxonomy: taxonomyKey,
                layout: termsLayout
              }
            })
          }

          /**************************************************
           * Add Taxonomys Metadata
           **************************************************/
          maps[cptKey].taxonomys[taxonomyKey] = {
            indexPage: {
              name: taxonomySlug,
              label: taxonomyLabel,
              path: terms ? path.join(maps[cptKey].basePath, `/${termsIndexPageUrl}/`) : false
            },
            list: taxonomyMeta
          }
        })
      })

      ctx.cptMaps = maps

      await Promise.all(extraPages.map(page => ctx.addPage(page)))
    },

    /**
     * Generate custom post type metadata.
     */
    async clientDynamicModules() {
      return [{
        name: 'custom-post-type.js',
        content: `export default ${JSON.stringify(ctx.cptMaps, null, 2)}`
      }]
    },

    enhanceAppFiles: path.resolve(__dirname, 'enhanceAppFile.js')
  }
}
