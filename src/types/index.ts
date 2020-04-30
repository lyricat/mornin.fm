
import api from '@/services/api'
import * as utils from '@/utils'

declare module 'vue/types/vue' {
  interface Vue {
    title?: string
    $errorHandler: (vue: Vue, error: { message: string, code: string | number }) => void
    $toast: (vue: Vue, data: { message: string, color: string }) => void
    $utils: typeof utils
    $api: typeof api
  }
}

export * from './enum'
