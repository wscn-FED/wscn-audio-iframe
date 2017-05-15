<template>
  <div class="ryaudio"
       :class="className">
    <div class="ryaudio-body">
      <div class="ryaudio-container">
        <audio :src="src"
               preload="auto"
               ref="audio">
          <source :src="src"
                  type="audio/mp3"></source>
          <p>we believe you need to upgrade your browser :)</p>
        </audio>
        <div class="ryaudio-controls">
          <div class="ryaudio-controls-inner">
            <div class="ryaudio-controls-play-pause">
              <a class="ryaudio-controls-play"
                 @click="onAudioPlay"
                 v-if="!isPlaying">
                <svg class="icon"
                     width="200px"
                     height="200.00px"
                     viewBox="0 0 1024 1024"
                     version="1.1"
                     xmlns="http://www.w3.org/2000/svg">
                  <path fill="#333333"
                        d="M404.48 762.368l307.2-250.368-307.2-250.368z"  />
                  <path fill="#333333"
                        d="M512 1024C229.888 1024 0 794.112 0 512S229.888 0 512 0s512 229.888 512 512-229.376 512-512 512z m0-988.16C249.344 35.84 35.84 249.344 35.84 512s213.504 476.16 476.16 476.16 476.16-213.504 476.16-476.16-213.504-476.16-476.16-476.16z"  />
                </svg>
              </a>
              <a class="ryaudio-controls-pause"
                 @click="onAudioPause"
                 v-if="isPlaying">
                <svg class="icon"
                     width="200px"
                     height="200.00px"
                     viewBox="0 0 1024 1024"
                     version="1.1"
                     xmlns="http://www.w3.org/2000/svg">
                  <path fill="#333333"
                        d="M327.68 272.896h101.888v478.72H327.68zM594.432 272.896H696.32v478.72h-101.888z"  />
                  <path fill="#333333"
                        d="M512 1024C229.888 1024 0 794.112 0 512S229.888 0 512 0s512 229.888 512 512-229.376 512-512 512z m0-988.16C249.344 35.84 35.84 249.344 35.84 512s213.504 476.16 476.16 476.16 476.16-213.504 476.16-476.16-213.504-476.16-476.16-476.16z"  />
                </svg>
              </a>
            </div>
            <div class="ryaudio-controls-content">
              <div class="ryaudio-title">{{title}}</div>
              <div class="ryaudio-controls-content-main">
                <template v-if="className === 'article'">
                  <div class="ryaudio-progress"
                       ref="progress">
                    <span class="ryaudio-progress-active"
                          @click="setBackTo"
                          :style="{width: activeProgress + '%'}"></span>
                    <input type="range"
                           class="ryaudio-progress-bar"
                           min="0"
                           :max="progressMax"
                           value="0"
                           ref="slider"
                           v-model="progressValue">
                  </div>
                  <div class="ryaudio-progress-time">
                    <span class="ryaudio-controls-currenttime">{{currentTime}}</span>
                    <span class="ryaudio-duration"> / {{duration}}</span>
                  </div>
                </template>
                <template v-else>
                  <span class="ryaudio-controls-currenttime">{{currentTime}}</span>
                  <div class="ryaudio-progress"
                       ref="progress">
                    <span class="ryaudio-progress-active"
                          @click="setBackTo"
                          :style="{width: activeProgress + '%'}"></span>
                    <input type="range"
                           class="ryaudio-progress-bar"
                           min="0"
                           :max="progressMax"
                           value="0"
                           ref="slider"
                           v-model="progressValue">
                  </div>
                  <span class="ryaudio-duration">{{duration}}</span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'RyAudio',
    props: {
      className: {
        type: String,
        default: ''
      },
      src: {
        type: String,
        default: ''
      },
      title: String,
      width: {
        type: Number,
        default: 320
      },
      onPlay: {
        type: Function
      },
      onPause: {
        type: Function
      }
    },
    data() {
      return {
        currentTime: '00:00',
        duration: '00:00',
        progressValue: 0,
        activeProgress: 0,
        isPlaying: false,
        progressMax: 0
      }
    },
    watch: {
      progressValue(val) {
        const audioEle = this.$refs.audio
        if (parseInt(val) !== parseInt(audioEle.currentTime)) {
          this.activeProgress = parseFloat(val / this.progressMax) * 100
          if (this.activeProgress > 100) {
            this.activeProgress = 100
          }
          audioEle.currentTime = val
        }
      }
    },
    mounted() {
      const audioEle = this.$refs.audio

      audioEle.addEventListener('loadeddata', () => {
        this.progressMax = parseInt(audioEle.duration)
        this.duration = this.formatTime(audioEle.duration)
      })
      audioEle.addEventListener('timeupdate', () => {
        this.currentTime = this.formatTime(audioEle.currentTime)
        this.progressValue = audioEle.currentTime
        this.activeProgress = parseFloat(this.progressValue / this.progressMax) * 100
        if (this.activeProgress > 100) {
          this.activeProgress = 100
        }
      })
      audioEle.addEventListener('play', () => {
        if (!this.isPlaying) {
          this.isPlaying = true
        }
      })
      audioEle.addEventListener('pause', () => {
        if (this.isPlaying) {
          this.isPlaying = false
        }
      })
    },
    methods: {
      onAudioPlay() {
        if (this.onPlay && typeof this.onPlay === 'function') {
          this.onPlay(this.$refs.audio)
        } else {
          this.$refs.audio.play()
          this.isPlaying = true
        }
      },
      onAudioPause() {
        if (this.onPause && typeof this.onPause === 'function') {
          this.onPause(this.$refs.audio)
        } else {
          this.$refs.audio.pause()
          this.isPlaying = false
        }
      },
      formatTime(num) {
        const temp = parseFloat(num)
        let secs = parseInt(temp % 60)
        let mins = parseInt((temp / 60) % 60)
        secs = `0${secs}`.slice(-2)
        mins = `0${mins}`.slice(-2)
        return `${mins}:${secs}`
      },
      setBackTo(e) {
        const offsetX = e.offsetX
        const progressEle = this.$refs.progress
        const audioEle = this.$refs.audio
        const rect = progressEle.getBoundingClientRect()
        audioEle.currentTime = parseFloat(offsetX / rect.width) * audioEle.duration
      }
    }
  }
</script>

<style lang="scss" scoped>
.ryaudio {
  height: 66px;
  display: flex;
  align-items: center;
  background-color: #f2f2f2;
  width: 100%;
}

.ryaudio-body {
  height: 60px;
  flex: 1 1;
  background-color: #fff;
}

.ryaudio-controls {
  width: 100%;
}

.ryaudio-controls-inner {
  display: flex;
  align-items: center;
  height: 60px;
  padding-left: 15px;
  padding-right: 15px;
}

.ryaudio-controls-play-pause {
  width: 40px;
  height: 40px;
  position: relative;
  z-index: 1000;
}

.ryaudio-controls-content {
  flex: 1 1;
  padding-left: 10px;
}

.ryaudio-controls-content-main {
  flex: 1 1;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.ryaudio-title {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  color: #333;
  padding-left: 10px;
  padding-top: 2px;
  display: block;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
}

.ryaudio-controls-play,
.ryaudio-controls-pause {
  display: block;
  width: 40px;
  height: 40px;
  cursor: pointer;
  outline: none;
  appearance: none;
  outline: none;
  svg {
    width: 40px;
    height: 40px;
    path {
      fill: #1478F0;
    }
  }
}

.ryaudio-controls-currenttime,
.ryaudio-duration {
  font-size: 12px;
  padding-left: 10px;
  padding-right: 10px;
  color: #aaa;
  display: block;
  width: 38px;
}

.ryaudio-progress {
  flex: 1 1;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1200;
  .ryaudio-progress-active {
    position: absolute;
    left: 0;
    z-index: 1300;
    height: 2px;
    background-color: #808080;
    cursor: pointer;
  }
  input[type=range] {
    -webkit-appearance: none;
    width: 100%;
    background: #d6d6d6;
    height: 2px;
    margin: 0;
    padding: 0;
  }

  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
  }

  input[type=range]:focus {
    outline: none;
  }

  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 15px;
    width: 15px;
    border: 2px solid #c4c4c4;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    margin-top: -7px;
    position: relative;
    z-index: 1400;
  }
  input[type=range]::-moz-range-thumb {
    height: 15px;
    width: 15px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    margin-top: -7px;
    position: relative;
    z-index: 1400;
    border: 2px solid #c4c4c4;
  }
  input[type=range]::-ms-thumb {
    height: 15px;
    width: 15px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    margin-top: -7px;
    position: relative;
    z-index: 1400;
    border: 2px solid #c4c4c4;
  }

  input[type=range]::-webkit-slider-runnable-track {
    width: 100%;
    height: 2px;
    cursor: pointer;
    background: #d6d6d6;
  }
  input[type=range]:focus::-webkit-slider-runnable-track {
    background: #d6d6d6;
  }
  input[type=range]::-moz-range-track {
    width: 100%;
    height: 2px;
    cursor: pointer;
    background: #d6d6d6;
  }
  input[type=range]::-ms-track {
    width: 100%;
    height: 2px;
    cursor: pointer;
    background: #d6d6d6;
    color: transparent;
  }
}

.ryaudio.article {
    border: 1px solid #E6E6E6;
    background-color: #fff;
    height: 80px;
    .ryaudio-controls-inner {
      padding: 0px;
      .ryaudio-controls-play-pause {
        width: 80px;
        height: 80px;
        background-color: #1478f0;
        display: flex;
        align-items: center;
        justify-content: center;
        .ryaudio-controls-play,
      .ryaudio-controls-pause {
          padding: 0px;
          margin: 0px;
          width: 38px;
          height: 38px;
          background-color: #81b8fa;
          border-radius: 50%;
          svg {
            path {
              fill: #fff;
              &:last-of-type {
                display: none;
              }
            }
          }
        }
      }
      .ryaudio-controls-content {
        padding-left: 5px;
      }
    }
    .ryaudio-title {
      padding-top: 6px;
      padding-bottom: 8px;
    }
    .ryaudio-controls-content-main {
      padding-left: 10px;
      flex-direction: column;
      align-items: flex-start;
      .ryaudio-progress {
        margin: 0px;
        width: 100%;
        flex-shrink: 0;
      }
      .ryaudio-controls-currenttime,
    .ryaudio-duration {
        padding: 0px;
      }
    }
}
</style>
