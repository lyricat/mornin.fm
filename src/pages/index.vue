<template>
  <normal-page-layout>
    <v-container class="room-page">
      <f-loading :loading="loading" :fullscreen="true" />
      <template>
        <div class="intro pa-4">
          <p class="title">{{ $t('index.headline_1') }}</p>
          <p class="body-2">{{ $t('index.headline_2') }}</p>
          <p class="py-5">
            <v-btn
              color="primary"
              rounded
              @click="showJoinDialog = true"
            >
              {{ $t('index.create_room_btn') }}
            </v-btn>
          </p>
        </div>
        <template v-if="!noRecentRooms">
          <v-subheader class="caption ml-2">{{ $t('index.recent_room_label') }}</v-subheader>
          <div class="rooms">
            <div
              v-for="room in recentRooms"
              :key="`${room.room}-${room.nickname}`"
              :style="{ 'width': cardWidth }"
              class="rooms-card-wrapper ma-2"
            >
              <room-card
                :room="room"
                @join="joinRoom"
                @delete="deleteRoom"
              >
              </room-card>
            </div>
          </div>
        </template>
      </template>
    </v-container>
    <v-dialog
      v-model="showJoinDialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="title-2">{{ $t('index.create_room_dialog_title') }}</v-card-title>
        <v-card-text class="mb-0 pb-2">
          <div class="mb-4">
            <v-text-field
              prefix="#"
              label="Room Name"
              v-model="channelName"
              :hide-details="true"
            >
              <template v-slot:append>
                <v-btn icon @click="genRandomChannelName">
                  <v-icon>
                    {{ $icons.mdiDice3 }}
                  </v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </div>
          <div class="hint">
            <p class="caption" v-html="$t('index.create_room_dialog_hint_1')"></p>
            <p class="caption" v-html="$t('index.create_room_dialog_hint_2')"></p>
          </div>
        </v-card-text>
        <v-card-actions class="px-5 pb-5">
          <v-btn
            color="primary"
            block
            rounded
            :disabled="!validated"
            @click="createOrJoin"
          >
            {{ $t('index.create_room_dialog_btn') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </normal-page-layout>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Mutation, State } from 'vuex-class'
import { uniqueNamesGenerator, Config, adjectives, countries } from 'unique-names-generator'
import PageView from '@/mixins/page'
import RoomCard from '@/components/RoomCard.vue'

const randomNameConfig: Config = {
  dictionaries: [adjectives, countries],
  separator: '-',
  length: 2
}

@Component({
  head () {
    return {
      title: this.title
    }
  },
  components: {
    RoomCard
  }
})
class IndexPage extends Mixins(PageView) {
  @State(state => state.app.profile) profile
  @State(state => state.app.chat) chat
  @Mutation('app/SET_APPBAR') setAppbar
  @Mutation('app/REMOVE_ROOM') removeRoom

  showJoinDialog = false

  loading = false

  channelName:string = ''

  get title () {
    return 'Mornin.fm'
  }

  get cardWidth () {
    const winWidth = window.innerWidth
    if (winWidth < 400) {
      return `${winWidth - 12 - 8 * 2}px`
    }
    return '200px'
  }

  get recentRooms () {
    return this.chat.rooms
  }

  get noRecentRooms () {
    return Object.values(this.recentRooms).length === 0
  }

  get validated () {
    return this.channelName.trim().length !== 0 && /[a-zA-Z0-9_\\-]+/.test(this.channelName)
  }

  mounted () {
    setTimeout(() => {
      this.reload()
    }, 100)
  }

  reload () {
    this.setAppbar({
      title: '#Mornin.fm',
      back: false
    })
  }

  genRandomChannelName () {
    const name: string = uniqueNamesGenerator(randomNameConfig)
    this.channelName = encodeURI(name.toLowerCase().replace(/ /g, '-'))
  }

  deleteRoom (room) {
    this.removeRoom({ room: room.room })
  }

  joinRoom (room) {
    this.$router.push(`/r/${room.room}`)
  }

  createOrJoin () {
    this.$router.push(`/r/${this.channelName}`)
  }
}
export default IndexPage
</script>

<style lang="scss" scoped>
.intro {
}
.hint {
  color: rgba(255, 255, 255, 0.7);
  p {
    line-height: 1.3;
    margin-bottom: 1em;
  }
}
.domain {
  color: #2196f3;
}
.rooms {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .room-card-wrapper {
  }
}
</style>
