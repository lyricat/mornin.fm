<template>
  <v-app>
    <nuxt />
    <toast />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'

@Component({
  middleware: 'i18n'
})
class DefaultLayout extends Vue {
  @State(state => state.app.profile) profile

  mounted () {
    (window as any).onNuxtReady(async () => {
    })
  }

  back () {
    this.$router.back()
  }
}
export default DefaultLayout
</script>

<style lang="scss" scoped>
.v-application--is-ltr .v-toolbar__content > .v-btn.v-btn--icon:first-child + .v-toolbar__title, .v-application--is-ltr .v-toolbar__extension > .v-btn.v-btn--icon:first-child + .v-toolbar__title {
  padding-left: 8px;
}
</style>
