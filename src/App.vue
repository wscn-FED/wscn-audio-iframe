<template>
  <div class="wscn-page">
    <div v-if="audio">
      <wscn-audio :src="audio.uri" :title="audio.title" :width="width"></wscn-audio>
    </div>
  </div>
</template>

<script>
  import api from './api'
  import WscnAudio from './WscnAudio/Index.vue'
  export default {
    name: 'WscnPage',
    components: {
      WscnAudio
    },
    data() {
      return {
        audio: null,
        width: 0
      }
    },
    created() {
      const pathnames = location.pathname.split('/')
      if (pathnames && pathnames.length) {
        const len = pathnames.length
        const id = pathnames[len - 1]
        api.getArticle(id).then(res => {
          if (res.data) {
            if (res.data.content_args && res.data.content_args.length) {
              res.data.content_args.forEach(item => {
                if (item.type && item.type === 'audio') {
                  this.audio = item
                }
              })
            }
          }
        })
      }
    },
    mounted() {
      this.width = window.innerWidth
    }
  }
</script>
