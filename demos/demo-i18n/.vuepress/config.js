const path = require('path')

module.exports = {
  serviceWorker: false,
  dest: './public-demo-i18n',

  locales: {
    '/': {
      lang: 'en-US',
      title: 'Demo VuePress'
    },
    '/jp/': {
      lang: 'ja-JP',
      title: 'Demo VuePress Japanese'
    }
  },

  head: [
    [ 'link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Material+Icons|IBM+Plex+Mono:500i,700i'} ]
  ],

  themeConfig: {
    locales: {
      '/': {
        label: 'EN',
        nav: [
          { text: 'GitHub', link: 'https://github.com/tmiame/vuepress-plugin-cpt' }
        ]
      },
      '/jp/': {
        label: 'JP',
        nav: [
          { text: 'GitHub', link: 'https://github.com/tmiame/vuepress-plugin-cpt' }
        ]
      }
    },
    copyright: 'Copyright © 2019 @tmiame'
  },

  chainWebpack: (config, isServer) => {
    config.plugin('injections').tap(([options]) => [
      Object.assign(options, {
        IS_SERVER: JSON.stringify(isServer)
      })
    ])
    config.module
      .rule('scss')
        .oneOf('normal')
          .use()
            .loader('import-glob-loader')
    config.module
      .rule('scss')
        .oneOf('vue-modules')
          .use()
            .loader('import-glob-loader')
    config.module
      .rule('scss')
        .oneOf('normal-modules')
          .use()
            .loader('import-glob-loader')
    config.module
      .rule('scss')
        .oneOf('vue')
          .use()
            .loader('import-glob-loader')
  }
}
