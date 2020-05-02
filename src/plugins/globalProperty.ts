import Vue from 'vue'
import {
  mdiMicrophone,
  mdiMicrophoneOff,
  mdiAccountCircleOutline,
  mdiContentCopy,
  mdiClose,
  mdiRefresh,
  mdiDice3,
  mdiHome,
  mdiHeadphones,
  mdiArrowLeft
} from '@mdi/js'
import * as utils from '@/utils'
import api from '@/services/api'

Vue.prototype.$icons = {
  mdiMicrophone,
  mdiMicrophoneOff,
  mdiAccountCircleOutline,
  mdiContentCopy,
  mdiClose,
  mdiRefresh,
  mdiDice3,
  mdiHome,
  mdiHeadphones,
  mdiArrowLeft
}

Vue.prototype.$utils = utils

Vue.prototype.$api = api
