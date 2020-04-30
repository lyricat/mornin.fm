import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Mutation } from 'vuex-class'
import { reloadMixinTheme } from '@/utils/helper'

@Component({
  head () {
    return {
      title: this.title,
      meta: [
        {
          hid: 'theme-color',
          name: 'theme-color',
          content: '#111'
        }
      ]
    }
  },
  beforeRouteEnter (_to, _from, next) {
    next((vm: any) => {
      vm.setLang()
      vm.setPage()
    })
  },
})
export default class PageView extends Vue {
  @Mutation('app/SET_APPBAR') setAppbar

  get title () {
    return ''
  }

  get description () {
    return ''
  }

  // get themeColor () {
  //   return '#FFFFFF'
  // }

  get appbar () {
    return {}
  }

  resetAppbar () {
    this.setAppbar({
      title: '',
      style: '',
      show: true,
      back: true,
      home: false,
      dark: true,
      color: '#111',
    })
  }

  setLang () {
    const locale = navigator.language.includes('zh') ? 'zh' : 'en'
    this.$i18n.locale = locale
    document.title = this.title
  }

  setPage () {
    this.setAppbar({
      title: this.title,
      ...this.appbar,
    })
    setTimeout(() => {
      reloadMixinTheme()
    }, 50)
  }

  beforeDestroy () {
    this.resetAppbar()
  }
}
