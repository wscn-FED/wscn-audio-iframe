<template>
  <div class="wscn-page" v-if="audio">
    <wscn-audio :src="audio.src" :title="audio.title" :width="width"></wscn-audio>
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
      this.width = window.innerWidth
      const params = this.getParams()
      if (!params.src) {
        api.getArticle(params.id).then(res => {
          if (res.data) {
            if (res.data.content_args && res.data.content_args.length) {
              res.data.content_args.forEach(item => {
                if (item.type && item.type === 'audio') {
                  this.audio = {
                    src: item.uri,
                    title: item.title || ''
                  }
                }
              })
            }
          }
        })
      } else {
        this.audio = {
          src: decodeURIComponent(params.src),
          title: decodeURIComponent(params.title) || ''
        }
      }
    },
    methods: {
      getParams() {
        const search = location.search.slice(1)
        const arr = search.split('&')
        let params = {}
        arr.forEach(item => {
          if (item) {
            const temp = item.split('=')
            params[temp[0]] = temp[1]
          }
        })
        return params
      }
    }
  }
</script>
