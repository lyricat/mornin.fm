import { Configuration } from '@nuxt/types'
import i18n from './src/i18n'
import { isProduct, GA } from './src/constants'

const config: Configuration = {
  mode: 'spa',
  router: {
    mode: 'hash'
  },
  srcDir: './src',
  head: {
    titleTemplate: '%s',
    title: '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      },
      {
        hid: 'mobile-web-app-capable',
        name: 'mobile-web-app-capable',
        content: 'yes'
      },
      {
        hid: 'apple-mobile-web-app-capable',
        name: 'apple-mobile-web-app-capable',
        content: 'yes'
      },
      {
        hid: 'application-name',
        name: 'application-name',
        content: 'Mornin'
      },
      {
        hid: 'apple-application-name',
        name: 'apple-application-name',
        content: 'Mornin'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', type: 'image/png', href: '/favicon.png' }
    ]
  },
  loading: { color: '#fff' },
  css: ['~/styles/index.scss'],
  plugins: [
    '~/plugins/vuex-persistedstate.ts',
    '~/plugins/globalComponents.ts',
    '~/plugins/globalProperty.ts'
  ],
  buildModules: [
    '@nuxtjs/eslint-module',
    [
      '@nuxt/typescript-build',
      {
        typeCheck: true,
        ignoreNotFoundWarnings: true
      }
    ],
    '@nuxtjs/vuetify'
  ],
  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/axios',
    // ['@nuxtjs/google-analytics', {
    //   id: 'UA-164787385-1'
    // }],
    '@nuxtjs/dotenv',
    [
      'nuxt-i18n',
      {
        vueI18n: i18n,
        locales: ['en', 'zh', 'zh-TW', 'ja', 'es-ES'],
        defaultLocale: 'en',
        strategy: 'no_prefix',
        detectBrowserLanguage: false,
        parsePages: false,
        seo: false
      }
    ]
  ],
  googleAnalytics: {
    id: GA,
    dev: false,
    debug: {
      enabled: !isProduct,
      sendHitTask: isProduct
    }
  },
  vuetify: {
    customVariables: ['~/styles/variables.scss'],
    defaultAssets: false,
    treeShake: true,
    optionsPath: './vuetify.options.ts'
  },
  build: {
    transpile: ['vuetify'],
    extend () {}
  },
  env: {
    TOKEN: process.env.TOKEN || '',
    APP_ENV: process.env.APP_ENV || ''
  }
}

export default config
