import Vue from 'vue'
import Toast from '@/components/basic/Toast.vue'
import FLoading from '@/components/basic/FLoading.vue'
import FAppBar from '@/components/basic/FAppBar.vue'
import NormalPageLayout from '@/components/layout/NormalPageLayout.vue'

import 'animate.css'

Vue.component('toast', Toast)

Vue.component('f-loading', FLoading)

Vue.component('f-app-bar', FAppBar)

Vue.component('normal-page-layout', NormalPageLayout)
